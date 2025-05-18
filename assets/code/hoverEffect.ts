import {
  _decorator,
  Component,
  find,
  instantiate,
  Label,
  Node,
  sys,
  tween,
  UITransform,
  v3,
  Vec3,
} from "cc";
import { IFarmland } from "./interface";
import { Dialog } from "./dialog";
import { GenBlock } from "./genBlock";
import { GlobalData } from "./globalData";
import { AudioMgr } from "./audioManager";

const { ccclass, property } = _decorator;

@ccclass("HoverEffect")
export class HoverEffect extends Component {
  private targetNode: Node = null!; // 要监听 hover 事件的节点
  private targetData: IFarmland;
  private targetLevel: number;

  @property
  hasPlayed: Boolean = false;

  @property(Vec3)
  leftPosition: Vec3 = new Vec3(0, 25.625, 0); // 关闭位置

  @property(Vec3)
  rightPosition: Vec3 = new Vec3(60.297, 25.625, 0); // 打开位置

  @property
  animating: boolean = false;

  private canTriggerMouseDown: boolean = true; // 防抖标志位（onMouseDown）
  private canTriggerTouchStart: boolean = true; // 防抖标志位（onTouchStart）

  // 设置目标节点
  setTargetNode(node: Node, data, level) {
    this.targetNode = node;
    this.targetData = data;
    this.targetLevel = level;

    if (sys.isMobile) {
      this.targetNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
      this.targetNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    } else {
      this.targetNode.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
      this.targetNode.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
      this.targetNode.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }
  }

  onMouseEnter() {
    const globalData = GlobalData.getInstance();
    if (globalData.isStolen) return;
    if (this.targetLevel === 3) {
      this.targetNode.getChildByName("Receivehand").active = true;
      if (globalData.userInfo?.expansion_card) {
        if (globalData.isStolen) return;
        this.targetNode.getChildByName("Expand").active = true;
        this.targetNode
          .getChildByName("Expand")
          .getChildByName("Percent")
          .getComponent(
            Label
          ).string = `+${globalData.userInfo.expansion_card.ratio}%`;
      }
    } else {
      this.targetNode.getChildByName("Receivehand").active = false;
      this.targetNode.getChildByName("Expand").active = false;
    }
  }

  onMouseLeave() {
    const globalData = GlobalData.getInstance();
    if (globalData.isStolen) return;
    if (!this.animating) {
      this.targetNode.getChildByName("Receivehand").active = false;
      this.targetNode.getChildByName("Expand").active = false;
    }
  }

  onMouseDown() {
    if (!this.canTriggerMouseDown || this.animating) return; // 如果不允许触发或正在动画中，则直接返回

    this.canTriggerMouseDown = false; // 设置为不可触发
    setTimeout(() => {
      this.canTriggerMouseDown = true; // 在冷却时间后恢复触发能力
    }, 500); // 冷却时间为 500 毫秒

    const globalData = GlobalData.getInstance();
    const genBlock = GenBlock.getInstance();
    const dialog = Dialog.getInstance();

    if (this.targetLevel === 3) {
      this.receiveHandAnimation(); // 动画开始
      this.playVoice();
      if (globalData.isStolen) {
        this.goldStolenMoveAnimation();
        genBlock.stealFarmland(this.targetData.id, this.targetData.plantId);
      } else {
        this.goldMoveAnimation();
        genBlock.harvestFarmland(this.targetData.id);
      }
    }

    if (dialog) {
      if (this.targetLevel === 0) {
        dialog.showDialog(null, "Bag");
        dialog.setTargetBlock(this.targetNode.parent, this.targetData);
      }
    }
  }

  onTouchStart() {
    if (!this.canTriggerTouchStart || this.animating) return; // 如果不允许触发或正在动画中，则直接返回

    this.canTriggerTouchStart = false; // 设置为不可触发
    setTimeout(() => {
      this.canTriggerTouchStart = true; // 在冷却时间后恢复触发能力
    }, 500); // 冷却时间为 500 毫秒

    const globalData = GlobalData.getInstance();
    const genBlock = GenBlock.getInstance();
    const dialog = Dialog.getInstance();

    if (this.targetLevel === 3) {
      this.targetNode.getChildByName("Receivehand").active = true;
      if (globalData.userInfo?.expansion_card) {
        if (globalData.isStolen) return;
        this.targetNode.getChildByName("Expand").active = true;
        this.targetNode
          .getChildByName("Expand")
          .getChildByName("Percent")
          .getComponent(
            Label
          ).string = `+${globalData.userInfo.expansion_card.ratio}%`;
      }
      this.receiveHandAnimation(); // 动画开始
      this.playVoice();
      if (globalData.isStolen) {
        this.goldStolenMoveAnimation();
        genBlock.stealFarmland(this.targetData.id, this.targetData.plantId);
      } else {
        this.goldMoveAnimation();
        genBlock.harvestFarmland(this.targetData.id);
      }
    }

    if (dialog) {
      if (this.targetLevel === 0) {
        dialog.showDialog(null, "Bag");
        dialog.setTargetBlock(this.targetNode.parent, this.targetData);
      }
    }
  }

  onTouchEnd() {
    const globalData = GlobalData.getInstance();
    if (globalData.isStolen) return;
    if (!this.animating) {
      this.targetNode.getChildByName("Receivehand").active = false;
      this.targetNode.getChildByName("Expand").active = false;
    }
  }

  receiveHandAnimation() {
    if (this.animating) return; // 如果动画正在进行，则直接返回

    this.animating = true; // 设置为动画中
    tween(this.targetNode.getChildByName("Receivehand"))
      .to(0.8, { position: this.leftPosition }, { easing: "cubicOut" })
      .to(0.8, { position: this.rightPosition }, { easing: "cubicOut" })
      .call(() => {
        this.targetNode.getChildByName("Receivehand").active = false;
        this.targetNode.getChildByName("Expand").active = false;
        this.animating = false; // 动画完成，恢复状态
      })
      .start();
  }

  goldMoveAnimation() {
    const goldEnd = find("Canvas/TopContent/Person/Money/Gold");
    const gold = instantiate(goldEnd);
    gold.active = true;
    gold.setSiblingIndex(this.node.children.length - 1); // 移动到最上层
    this.node.addChild(gold);

    // 2. 起点（点击土地的位置）
    const startPosition = this.node
      .getComponent(UITransform)!
      .convertToWorldSpaceAR(Vec3.ZERO);
    const localStartPosition = this.node
      .getComponent(UITransform)!
      .convertToNodeSpaceAR(startPosition);

    gold.setPosition(startPosition);

    // 3. 终点（金币袋子的位置）
    const endPosition = goldEnd
      .getComponent(UITransform)!
      .convertToWorldSpaceAR(Vec3.ZERO);
    const localEndPosition = this.node
      .getComponent(UITransform)!
      .convertToNodeSpaceAR(endPosition);

    // 4. 中间控制点（贝塞尔曲线的顶点）
    const controlPoint = v3(
      (localStartPosition.x + localEndPosition.x) / 2, // X 坐标为起点和终点的中间
      localStartPosition.y + 150, // Y 坐标略高，形成弧线
      0
    );

    // 5. 贝塞尔曲线动画
    tween({ t: 0 }) // 使用一个变量 t（0 到 1）表示动画进度
      .to(
        1,
        { t: 1 }, // t 从 0 变为 1
        {
          onUpdate: (target) => {
            const t = target.t;
            // 贝塞尔曲线公式
            const x =
              (1 - t) * (1 - t) * localStartPosition.x +
              2 * (1 - t) * t * controlPoint.x +
              t * t * localEndPosition.x;
            const y =
              (1 - t) * (1 - t) * localStartPosition.y +
              2 * (1 - t) * t * controlPoint.y +
              t * t * localEndPosition.y;

            gold.setPosition(x, y, 0); // 更新金币位置
          },
        }
      )
      .call(() => {
        // 动画结束后销毁金币
        gold.destroy();
      })
      .start();
  }

  goldStolenMoveAnimation() {
    const goldEnd = find("Canvas/TopContent/Person/Money/Gold");
    const gold = instantiate(goldEnd);
    gold.active = true;
    gold.setSiblingIndex(this.node.children.length - 1); // 移动到最上层
    this.node.addChild(gold);

    const jumpHeight = 200; // 向上跳跃的高度
    const duration = 1; // 每段动画的持续时间

    // 获取初始位置
    const startPos = new Vec3(0, 0, 0);
    gold.setPosition(startPos);

    // 向上弹起动画
    const jumpUp = tween().to(
      duration,
      {
        position: new Vec3(startPos.x, startPos.y + jumpHeight, startPos.z),
      },
      { easing: "sineOut" }
    );

    // 向下落下动画
    const fallDown = tween().to(
      duration,
      { position: new Vec3(startPos.x, startPos.y, startPos.z) },
      { easing: "sineIn" }
    );

    // 组合动画：向上 -> 向下
    tween(gold).sequence(jumpUp, fallDown).start();

    setTimeout(() => {
      gold.active = false;
    }, duration * 2000);
  }

  playVoice() {
    AudioMgr.inst.playOneShot("sounds/reap", 1);
  }

  onDestroy() {
    this.animating = false;
    // if (this.targetNode) {
    //   this.targetNode.off(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    //   this.targetNode.off(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    //   this.targetNode.off(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    //   this.targetNode.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
    //   this.targetNode.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    // }
  }
}
