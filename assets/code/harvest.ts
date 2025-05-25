import {
  _decorator,
  Component,
  Node,
  find,
  instantiate,
  UITransform,
  Label,
  resources,
  SpriteAtlas,
  Sprite,
} from "cc";
import { harvestList, i18n } from "./loadData";
import { httpRequest } from "./http";
import { IHarvestListItem, IUserInfo } from "./interface";
import { Dialog } from "./dialog";
import { GlobalData } from "./globalData";
import { DynamicLabel } from "./dynamicLabel";
import { formatToUSDInteger } from "./utils";
import { GenInfo } from "./genInfo";
import { LoadingUI } from "./loadingUI";

const { ccclass, property } = _decorator;

const harvestMap = {
  1: "RaiseSeedlings",
  2: "Tilling",
  3: "Irrigate",
  4: "Fertilize",
  5: "BugSpray",
  6: "Weeding",
};
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

  @property(Node)
  UExpand: Node = null; // 膨胀

  @property
  column: number = 3;

  private currentCard: IHarvestListItem = null;

  protected async onLoad() {
    const loadingUI = this.node.getComponent(LoadingUI);
    loadingUI.show();

    this.harvestSpacingY = 40;
    this.UHarvestList = find("Canvas/Content/ScrollView/view/content");
    this.UHarvestSection = find(
      "Canvas/Content/ScrollView/view/content/Section"
    );
    this.UMoney = find("Canvas/Top/Money");
    this.UAddition = find("Canvas/Top/Addition");
    this.UExpand = find("Canvas/Top/Addition/Expand");
    this.updateUserInfo();

    await this.requestHarvestList();
    loadingUI.hide();
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
        i18n.harvest[harvest.id];
      harvestSection
        .getChildByName("Addition")
        .getChildByName("Label")
        .getComponent(Label).string = `+${harvest.ratio}%`;
      harvestSection
        .getChildByName("Button")
        .getChildByName("Label")
        .getComponent(Label).string = harvest.points + "";

      harvestSection.getChildByName("Button")["cardInfo"] = harvest;

      resources.load("iconList", SpriteAtlas, (err, atlas) => {
        if (err) {
          console.error("Failed to load sprite:", err);
          return;
        }

        harvestSection
          .getChildByName("Picture")
          .getChildByName("Sprite")
          .getComponent(Sprite).spriteFrame = atlas.getSpriteFrame(
          harvestMap[harvest.id]
        );
      });
    });
  }

  updateUserInfo() {
    const globalData = GlobalData.getInstance();
    this.UMoney.getComponent(DynamicLabel).setText(
      formatToUSDInteger(globalData.userInfo.points_balance) + ""
    );

    if (globalData.userInfo.expansion_card) {
      this.UAddition.getComponent(DynamicLabel).hasExpand = true;
      this.UExpand.active = true;
      this.UExpand.getChildByName("Prefix").active = true;
      this.UExpand.getChildByName("Used").active = true;
      this.UExpand.getChildByName("Suffix").active = true;
      this.UExpand.getChildByName("Used").getComponent(Label).string =
        globalData.userInfo.expansion_card.total_count -
        globalData.userInfo.expansion_card.used_count +
        "";
      this.UExpand.getChildByName("Suffix").getComponent(
        Label
      ).string = `/${globalData.userInfo.expansion_card.total_count})`;
    } else {
      this.UAddition.getComponent(DynamicLabel).hasExpand = false;
      this.UExpand.active = false;
      this.UExpand.getChildByName("Prefix").active = false;
      this.UExpand.getChildByName("Used").active = false;
      this.UExpand.getChildByName("Suffix").active = false;
    }

    this.scheduleOnce(() => {
      this.UAddition.getComponent(DynamicLabel).setText(
        `+${
          globalData.userInfo.expansion_card?.ratio
            ? globalData.userInfo.expansion_card?.ratio
            : globalData.userInfo.radio
        }%`
      );
    }, 0);

    this.scheduleOnce(() => {
      this.UAddition.setPosition(
        this.UMoney.position.x +
          this.UMoney.getComponent(DynamicLabel).roundedRect.rectWidth +
          30,
        this.UMoney.position.y
      );
    }, 0);
  }

  setCurrentSelectHarvestCard(event) {
    const globalData = GlobalData.getInstance();
    if (globalData.userInfo.expansion_card) {
      globalData.setMessageLabel(i18n.expansionCardAvailable);
      return;
    }
    const dialog = Dialog.getInstance();

    this.currentCard = event.currentTarget.cardInfo;

    dialog.showDialog(null, "BuyProps");

    dialog.buyPropsBox.getChildByName("Name").getComponent(Label).string =
      i18n.harvest[this.currentCard.id];

    dialog.buyPropsBox
      .getChildByName("Harvest")
      .getChildByName("Value")
      .getComponent(Label).string = `+${this.currentCard.ratio}%`;

    dialog.buyPropsBox
      .getChildByName("Button")
      .getChildByName("Label")
      .getComponent(Label).string = this.currentCard.points + "";

    resources.load("iconList", SpriteAtlas, (err, atlas) => {
      if (err) {
        console.error("Failed to load sprite:", err);
        return;
      }

      const harvestSprite = dialog.buyPropsBox
        .getChildByName("Picture")
        .getChildByName("Sprite");

      harvestSprite.getComponent(Sprite).spriteFrame = atlas.getSpriteFrame(
        harvestMap[this.currentCard.id]
      );

      harvestSprite.getComponent(UITransform).width = 160;
      harvestSprite.getComponent(UITransform).height = 160;
      harvestSprite.setPosition(-10, -20, 0);
    });
  }

  setBuySucceededShow() {
    const dialog = Dialog.getInstance();

    dialog.showDialog(null, "BuySucceeded");

    dialog.buySucceededBox
      .getChildByName("Card")
      .getChildByName("Name")
      .getComponent(Label).string = this.currentCard.name;

    dialog.buySucceededBox
      .getChildByName("Button")
      .getChildByName("Label")
      .getComponent(Label).string = `+ ${this.currentCard.ratio}%`;

    setTimeout(() => {
      dialog.closeDialog(null, "BuySucceeded");
    }, 3000);
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
        // globalData.setMessageLabel(i18n.buySuccess);
        dialog.closeDialog(null, "BuyProps");
        this.setBuySucceededShow();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
