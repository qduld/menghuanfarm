// GenericObjectPool.ts
import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  director,
  find,
} from "cc";
const { ccclass, property } = _decorator;

export interface IPoolable {
  /** 对象被从池中取出时调用 */
  onSpawn?(args?: any): void;
  /** 对象被回收到池中时调用 */
  onRecycle?(): void;
  /** 重置对象状态到初始值 */
  reset?(): void;
}

interface PoolConfig {
  prefab: Node;
  initialSize?: number;
  maxSize?: number;
  autoPrewarm?: boolean;
}

interface PoolInfo {
  prefab: Node;
  maxSize: number;
  inactiveObjects: Node[];
  activeObjects: Set<Node>;
  poolContainer: Node;
}

@ccclass("GenericObjectPool")
export class GenericObjectPool extends Component {
  private static _instance: GenericObjectPool = null;
  public static get instance(): GenericObjectPool {
    return this._instance;
  }

  private _pools: Map<string, PoolInfo> = new Map();
  private _poolContainers: Map<string, Node> = new Map();

  onLoad() {
    if (GenericObjectPool._instance && GenericObjectPool._instance !== this) {
      this.destroy();
      return;
    }
    GenericObjectPool._instance = this;
    // 会导致无法更新场景
    // director.addPersistRootNode(this.node);
  }

  /**
   * 注册一个对象池
   * @param poolName 对象池名称
   * @param config 池配置
   */
  registerPool(poolName: string, config: PoolConfig): void {
    if (this._pools?.has(poolName)) {
      console.warn(`对象池 ${poolName} 已存在`);
      return;
    }

    const {
      prefab,
      initialSize = 10,
      maxSize = 50,
      autoPrewarm = true,
    } = config;

    // 创建池容器
    const poolContainer = new Node(`${poolName}_PoolContainer`);
    if (!this.node) {
      this.node = find("Canvas");
    }
    this.node.addChild(poolContainer);
    this._poolContainers.set(poolName, poolContainer);

    const poolInfo: PoolInfo = {
      prefab,
      maxSize,
      inactiveObjects: [],
      activeObjects: new Set<Node>(),
      poolContainer,
    };

    this._pools?.set(poolName, poolInfo);

    if (autoPrewarm) {
      this.prewarm(poolName, initialSize);
    }
  }

  /**
   * 预热对象池
   * @param poolName 对象池名称
   * @param count 预创建数量
   */
  prewarm(poolName: string, count: number): void {
    const poolInfo = this._pools?.get(poolName);
    if (!poolInfo) {
      console.warn(`对象池 ${poolName} 未注册`);
      return;
    }

    for (let i = 0; i < count; i++) {
      if (this.getTotalCount(poolName) >= poolInfo.maxSize) {
        break;
      }
      this.createNewObject(poolName);
    }
  }

  /**
   * 从对象池获取对象
   * @param poolName 对象池名称
   * @param args 传递给onSpawn的参数
   */
  get<T extends Node = Node>(poolName: string, args?: any): T | null {
    const poolInfo = this._pools?.get(poolName);
    if (!poolInfo) {
      console.warn(`对象池 ${poolName} 未注册`);
      return null;
    }

    let obj: Node | null = null;

    // 先从闲置池中取
    if (poolInfo.inactiveObjects.length > 0) {
      obj = poolInfo.inactiveObjects.pop() || null;
    }
    // 如果池空了且没有达到大小限制，就创建新对象
    else if (this.getTotalCount(poolName) < poolInfo.maxSize) {
      obj = this.createNewObject(poolName);
    }
    // 如果达到最大限制，就复用最早的对象
    else {
      const oldestObj = Array.from(poolInfo.activeObjects)[0];
      if (oldestObj) {
        this.put(poolName, oldestObj);
        obj = poolInfo.inactiveObjects.pop() || null;
      }
    }

    if (obj) {
      obj.active = true;
      obj.removeFromParent(); // 从池容器移除

      // 调用对象的onSpawn方法
      const poolable = obj.getComponent("IPoolable") as any;
      if (poolable && poolable.onSpawn) {
        poolable.onSpawn(args);
      }

      poolInfo.activeObjects.add(obj);
    }

    return obj as T;
  }

  /**
   * 批量获取对象
   * @param poolName 对象池名称
   * @param count 获取数量
   * @param args 传递给onSpawn的参数
   */
  getMultiple<T extends Node = Node>(
    poolName: string,
    count: number,
    args?: any
  ): T[] {
    const objects: T[] = [];
    for (let i = 0; i < count; i++) {
      const obj = this.get<T>(poolName, args);
      if (obj) {
        objects.push(obj);
      }
    }
    return objects;
  }

  /**
   * 回收对象到对象池
   * @param poolName 对象池名称
   * @param obj 要回收的对象
   */
  put(poolName: string, obj: Node | null): boolean {
    if (!obj) {
      return false;
    }

    const poolInfo = this._pools?.get(poolName);
    if (!poolInfo) {
      console.warn(`对象池 ${poolName} 未注册`);
      return false;
    }

    if (poolInfo.inactiveObjects.indexOf(obj) !== -1) {
      return false;
    }

    // 调用对象的onRecycle方法
    const poolable = obj.getComponent("IPoolable") as any;
    if (poolable && poolable.onRecycle) {
      poolable.onRecycle();
    }

    obj.active = false;
    if (obj.parent) {
      obj.removeFromParent();
    }
    obj.parent = poolInfo.poolContainer;
    obj.setPosition(0, 0, 0);

    // 重置对象状态
    if (poolable && poolable.reset) {
      poolable.reset();
    }

    poolInfo.activeObjects.delete(obj);
    poolInfo.inactiveObjects.push(obj);
    return true;
  }

  /**
   * 批量回收对象
   * @param poolName 对象池名称
   * @param objects 要回收的对象数组
   */
  putMultiple(poolName: string, objects: Node[]): void {
    objects.forEach((obj) => this.put(poolName, obj));
  }

  /**
   * 清空特定对象池
   * @param poolName 对象池名称
   */
  clearPool(poolName: string): void {
    const poolInfo = this._pools?.get(poolName);
    if (poolInfo) {
      poolInfo.inactiveObjects.forEach((obj) => obj.destroy());
      poolInfo.activeObjects.forEach((obj) => obj.destroy());
      poolInfo.inactiveObjects = [];
      poolInfo.activeObjects.clear();

      const container = this._poolContainers.get(poolName);
      if (container) {
        container.destroy();
      }

      this._pools?.delete(poolName);
      this._poolContainers.delete(poolName);
    }
  }

  /**
   * 清空所有对象池
   */
  clearAll(): void {
    const poolNames = Array.from(this._pools?.keys());
    poolNames.forEach((poolName) => this.clearPool(poolName));
  }

  /**
   * 获取对象池信息
   * @param poolName 对象池名称
   */
  getPoolInfo(poolName: string): {
    total: number;
    active: number;
    inactive: number;
    maxSize: number;
  } {
    const poolInfo = this._pools?.get(poolName);
    if (!poolInfo) {
      return { total: 0, active: 0, inactive: 0, maxSize: 0 };
    }

    return {
      total: poolInfo.activeObjects.size + poolInfo.inactiveObjects.length,
      active: poolInfo.activeObjects.size,
      inactive: poolInfo.inactiveObjects.length,
      maxSize: poolInfo.maxSize,
    };
  }

  /**
   * 获取所有对象池的信息
   */
  getAllPoolsInfo(): Map<
    string,
    { total: number; active: number; inactive: number; maxSize: number }
  > {
    const infoMap = new Map<
      string,
      { total: number; active: number; inactive: number; maxSize: number }
    >();
    this._pools?.forEach((_, poolName) => {
      infoMap.set(poolName, this.getPoolInfo(poolName));
    });
    return infoMap;
  }

  /**
   * 检查对象池是否存在
   * @param poolName 对象池名称
   */
  hasPool(poolName: string): boolean {
    return this._pools?.has(poolName);
  }

  /**
   * 调整对象池大小
   * @param poolName 对象池名称
   * @param newMaxSize 新的最大大小
   */
  resizePool(poolName: string, newMaxSize: number): void {
    const poolInfo = this._pools?.get(poolName);
    if (poolInfo) {
      poolInfo.maxSize = newMaxSize;
      // 如果新的最大大小小于当前总数，需要回收一些对象
      if (newMaxSize < this.getTotalCount(poolName)) {
        const excess = this.getTotalCount(poolName) - newMaxSize;
        for (let i = 0; i < excess; i++) {
          if (poolInfo.inactiveObjects.length > 0) {
            const obj = poolInfo.inactiveObjects.pop();
            if (obj) {
              obj.destroy();
            }
          }
        }
      }
    }
  }

  private createNewObject(poolName: string): Node | null {
    const poolInfo = this._pools?.get(poolName);
    if (!poolInfo) return null;

    const obj = instantiate(poolInfo.prefab);
    obj.active = false;
    obj.parent = poolInfo.poolContainer;
    poolInfo.inactiveObjects.push(obj);

    return obj;
  }

  private getTotalCount(poolName: string): number {
    const poolInfo = this._pools?.get(poolName);
    if (!poolInfo) return 0;
    return poolInfo.activeObjects.size + poolInfo.inactiveObjects.length;
  }

  onDestroy() {
    this.clearAll();
  }

  reInit() {
    this.node = null;
    this._poolContainers = new Map();
    this._pools = new Map();
  }
}
