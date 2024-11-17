import {
  _decorator,
  Component,
  Node,
  find,
  Layers,
  UITransform,
  instantiate,
  EventTouch,
} from "cc";
import { blockList } from "./loadData";
import { IFarmland } from "./interface";
import { httpRequest } from "./http";
import { GenPlant } from "./genPlant";
import { Dialog } from "./dialog";
const { ccclass, property } = _decorator;

@ccclass("GenBlock")
export class GenBlock extends Component {
  @property(Node)
  blockContainer: Node = null; // 容器节点

  @property(Node)
  lockBlock: Node = null; // 容器节点

  @property(Node)
  unlockBlock: Node = null; // 容器节点

  @property(Node)
  sprite: Node = null; // 容器节点

  @property
  spacingX: number = 100; // X轴间距

  @property
  spacingY: number = 100; // Y轴间距

  @property
  blockList: IFarmland[] = []; // Y轴间距

  @property
  column: number = 3;

  @property
  row: number = 4;

  private static _instance: GenBlock;

  static getInstance(): GenBlock {
    return GenBlock._instance;
  }

  onLoad() {
    GenBlock._instance = this;
    this.spacingX = 40;
    this.spacingY = 40;
    this.blockContainer = find("MainCanvas/Block/List");
    this.lockBlock = find("MainCanvas/Block/Lock");
    this.unlockBlock = find("MainCanvas/Block/Unlock");
    this.sprite = find("MainCanvas/Block/Lock/Sprite");

    this.requestFarmLand();
  }

  createblockLayout() {
    // 获取预制体的宽度和高度
    const blockWidth = this.sprite.getComponent(UITransform).contentSize.width;
    const blockHeight =
      this.sprite.getComponent(UITransform).contentSize.height;

    // 计算起始点，以保证整个布局居中
    const startX = this.unlockBlock.position.x;
    const startY = this.unlockBlock.position.y;

    // 循环生成 4x3 的土地布局
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.column; j++) {
        // 计算每块土地的 X 和 Y 坐标
        const posX = startX + j * (blockWidth + this.spacingX);
        const posY = startY - i * (blockHeight + this.spacingY); // Y轴向下

        let newblock = null;
        // 0-不可种植1-可种植
        const blockIndex = i * this.column + j;
        if (this.blockList[blockIndex].status) {
          // addPlants
          newblock = instantiate(this.unlockBlock);
        } else {
          newblock = instantiate(this.lockBlock);
        }
        newblock.active = true;
        // 创建每块土地
        this.blockContainer.addChild(newblock);

        // 设置土地的位置
        newblock.setPosition(posX, posY);

        newblock.on(Node.EventType.TOUCH_END, (event) => {
          this.onBlockClick(event, newblock, this.blockList[blockIndex]);
        });

        newblock.on(Node.EventType.MOUSE_DOWN, (event) => {
          this.onBlockClick(event, newblock, this.blockList[blockIndex]);
        });

        const plant = new GenPlant();
        plant.updatePlantStatus(newblock, this.blockList[blockIndex]);
      }
    }
  }

  updateBlock(farmlandId) {
    // 更新单个block
    const plant = new GenPlant();
    const blockIndex = this.blockList.findIndex(
      (block) => block.id === farmlandId
    );

    plant.resetNode(this.blockContainer.children[blockIndex]);

    plant.updatePlantStatus(
      this.blockContainer.children[blockIndex],
      this.blockList[blockIndex]
    );
  }

  onBlockClick(event: EventTouch, block, blockData) {
    const dialog = Dialog.getInstance();
    if (dialog) {
      if (blockData.status === 0) {
        dialog.showDialog(event, "LockBlock");
        dialog.setTargetBlock(block, blockData);
      }
    }
  }

  // 获取农田列表
  async requestFarmLand() {
    try {
      const response = await httpRequest("/api/v1/farmland", {
        method: "GET",
      });
      if (response.ok) {
        this.blockList = response.data.data as IFarmland[];
        this.createblockLayout(); // 在加载时调用布局创建方法
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 更新农田列表
  async updateFarmLand(farmlandId) {
    try {
      const response = await httpRequest("/api/v1/farmland", {
        method: "GET",
      });
      if (response.ok) {
        this.blockList = response.data.data as IFarmland[];
        this.updateBlock(farmlandId);
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 收获
  async harvestFarmland(farmlandId) {
    try {
      const response = await httpRequest("/api/v1/farmland/harvest", {
        method: "POST",
        body: {
          farmlandId,
        },
      });
      if (response.ok) {
        this.updateFarmLand(farmlandId);
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async unLockBlock() {
    const dialog = Dialog.getInstance();
    try {
      const response = await httpRequest("/api/v1/farmland/extend", {
        method: "POST",
      });
      if (response.ok) {
        this.requestFarmLand();
        dialog.closeDialog(null, "LockBlock");
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
