import {
  _decorator,
  Component,
  Node,
  find,
  Layers,
  UITransform,
  instantiate,
} from "cc";
import { blockList } from "./loadData";
import { IFarmland } from "./interface";
import { httpRequest } from "./http";
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

  onLoad() {
    this.spacingX = 40;
    this.spacingY = 40;
    this.blockContainer = find("MainCanvas/Block/List");
    this.lockBlock = find("MainCanvas/Block/Lock");
    this.unlockBlock = find("MainCanvas/Block/Unlock");
    this.sprite = find("MainCanvas/Block/Lock/Sprite");

    this.requestFarmLand();
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

  createblockLayout() {
    // 获取预制体的宽度和高度
    const blockWidth = this.sprite.getComponent(UITransform).contentSize.width;
    const blockHeight =
      this.sprite.getComponent(UITransform).contentSize.height;

    // 计算起始点，以保证整个布局居中
    const startX = this.unlockBlock.position.x;
    const startY = this.unlockBlock.position.y;

    // 循环生成 4x3 的土地布局
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        // 计算每块土地的 X 和 Y 坐标
        const posX = startX + j * (blockWidth + this.spacingX);
        const posY = startY - i * (blockHeight + this.spacingY); // Y轴向下

        let newblock = null;
        // 0-不可种植1-可种植
        if (this.blockList[i * 3 + j].status) {
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
      }
    }
  }
}
