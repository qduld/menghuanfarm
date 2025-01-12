import {
  _decorator,
  Component,
  Node,
  find,
  instantiate,
  UITransform,
  Label,
} from "cc";
import { harvestList } from "./loadData";
import { httpRequest } from "./http";
import { ISkillList } from "./interface";
import { Dialog } from "./dialog";
import { GlobalData } from "./globalData";
import { DynamicLabel } from "./dynamicLabel";
import { formatToUSDInteger } from "./utils";

const { ccclass, property } = _decorator;
@ccclass("harvest")
export class harvest extends Component {
  @property
  harvestList: ISkillList[] = []; // 技能列表

  @property
  UHarvestList: Node = null; // 推荐列表

  @property
  UHarvestSection: Node = null; // 推荐列表

  @property
  harvestSpacingX: number = 20; // 推荐间距

  @property
  harvestSpacingY: number = 40; // 推荐间距

  @property(Node)
  UMoney: Node = null; // 推荐列表

  @property(Node)
  UAddition: Node = null; // 推荐列表

  @property
  column: number = 3;
  protected onLoad(): void {
    this.requestHarvestList();
    this.harvestSpacingY = 40;
    this.UHarvestList = find("Canvas/Content/List");
    this.UHarvestSection = find("Canvas/Content/Section");
    this.UMoney = find("Canvas/Top/Money");
    this.UAddition = find("Canvas/Top/Addition");
    this.updateUserInfo();
  }

  // 生成推荐列表
  createHarvestLayout() {
    // 获取预制体的宽度和高度
    const sectionWidth =
      this.UHarvestSection.getComponent(UITransform).contentSize.width;

    const sectionHeight =
      this.UHarvestSection.getComponent(UITransform).contentSize.height;

    // 计算起始点，以保证整个布局居中
    const startX = this.UHarvestSection.position.x;
    const startY = this.UHarvestSection.position.y;

    harvestList.forEach((harvest, index) => {
      const xCoordinate = Math.floor(index / this.column);
      const yCoordinate = index % this.column;

      const posX = startX + yCoordinate * (sectionWidth + this.harvestSpacingX);
      const posY =
        startY - xCoordinate * (sectionHeight + this.harvestSpacingY);

      let harvestSection = instantiate(this.UHarvestSection);
      this.UHarvestList.addChild(harvestSection);

      harvestSection.active = true;
      harvestSection.setPosition(posX, posY);
      harvestSection.getChildByName("Name").getComponent(Label).string =
        harvest.skillType + "";
      harvestSection
        .getChildByName("Addition")
        .getChildByName("Label")
        .getComponent(Label).string = `+${harvest.ratio}%`;
      harvestSection
        .getChildByName("Button")
        .getChildByName("Label")
        .getComponent(Label).string = harvest.cost + "";
    });
  }

  updateUserInfo() {
    const globalData = GlobalData.getInstance();
    this.UMoney.getComponent(DynamicLabel).setText(
      formatToUSDInteger(globalData.userInfo.points_balance) + ""
    );

    this.scheduleOnce(() => {
      this.UAddition.setPosition(
        this.UMoney.position.x +
          this.UMoney.getComponent(DynamicLabel).roundedRect.rectWidth +
          30,
        this.UMoney.position.y
      );
      this.UAddition.getComponent(DynamicLabel).setText(
        `+${globalData.userInfo.radio}%`
      );
    }, 0);
  }

  // 膨胀列表
  async requestHarvestList() {
    try {
      const response = await httpRequest("/api/v1/skill/list", {
        method: "GET",
      });
      if (response.ok) {
        this.harvestList = response.data.data as ISkillList[];
        this.createHarvestLayout();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
