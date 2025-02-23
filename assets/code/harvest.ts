import {
  _decorator,
  Component,
  Node,
  find,
  instantiate,
  UITransform,
  Label,
} from "cc";
import { harvestList, i18n } from "./loadData";
import { httpRequest } from "./http";
import { IHarvestListItem, IUserInfo } from "./interface";
import { Dialog } from "./dialog";
import { GlobalData } from "./globalData";
import { DynamicLabel } from "./dynamicLabel";
import { formatToUSDInteger } from "./utils";
import { GenInfo } from "./genInfo";

const { ccclass, property } = _decorator;
@ccclass("harvest")
export class harvest extends Component {
  @property
  harvestList: IHarvestListItem[] = []; // 技能列表

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

  private currentCard: IHarvestListItem = null;

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

    this.harvestList.forEach((harvest, index) => {
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
        harvest.name + "";
      harvestSection
        .getChildByName("Addition")
        .getChildByName("Label")
        .getComponent(Label).string = `+${harvest.ratio}%`;
      harvestSection
        .getChildByName("Button")
        .getChildByName("Label")
        .getComponent(Label).string = harvest.points + "";

      harvestSection.getChildByName("Button")["cardInfo"] = harvest;
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

  setCurrentSelectHarvestCard(event) {
    const dialog = Dialog.getInstance();

    this.currentCard = event.currentTarget.cardInfo;

    dialog.showDialog(null, "BuyProps");

    dialog.buyPropsBox.getChildByName("Name").getComponent(Label).string =
      this.currentCard.name;

    dialog.buyPropsBox
      .getChildByName("Harvest")
      .getChildByName("Value")
      .getComponent(Label).string = `+${this.currentCard.ratio}%`;

    dialog.buyPropsBox
      .getChildByName("Button")
      .getChildByName("Label")
      .getComponent(Label).string = this.currentCard.points + "";
  }

  // 膨胀列表
  async requestHarvestList() {
    try {
      const response = await httpRequest("/api/v1/expansion/list", {
        method: "GET",
      });
      if (response.ok) {
        this.harvestList = response.data.data.list as IHarvestListItem[];
        this.createHarvestLayout();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 获取用户信息
  async requestUserInfo() {
    try {
      const response = await httpRequest("/api/v1/farm/u/userInfo", {
        method: "GET",
      });
      if (response.ok) {
        const globalData = GlobalData.getInstance();
        globalData.userInfo = response.data.data as IUserInfo;
        this.updateUserInfo();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 膨购买膨胀卡
  async requestBuyHarvestCard() {
    const globalData = GlobalData.getInstance();
    const dialog = Dialog.getInstance();
    try {
      const response = await httpRequest("/api/v1/expansion/buy", {
        method: "POST",
        body: {
          id: this.currentCard.id,
        },
      });
      if (response.ok) {
        this.requestUserInfo();
        globalData.setMessageLabel(i18n.buySuccess);
        dialog.closeDialog(null, "BuyProps");
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
