import {
  _decorator,
  Component,
  Node,
  find,
  Sprite,
  SpriteFrame,
  resources,
  Label,
  SpriteAtlas,
  AudioClip,
  AudioSource,
  Color,
} from "cc";
import { httpRequest } from "./http";
import { Dialog } from "./dialog";
import { GenInfo } from "./genInfo";
import { AudioMgr } from "./audioManager";
import { formatNumberShortDynamic, formatSecondsImprove } from "./utils";
import { GlobalData } from "./globalData";
import { i18n } from "./loadData";
import { DrawRoundedRect } from "./drawRoundedRect";

const { ccclass, property } = _decorator;
@ccclass("BuySeed")
export class BuySeed extends Component {
  @property
  USeedName: Node = null; // 种子名字

  @property
  USeedSprite: Node = null; // 种子图片

  @property
  USeedProfit: Node = null; // 种子Profit

  @property
  USeedRipeningTime: Node = null; // 种子RipeningTime

  @property
  USeedTotalCost: Node = null; // 种子TotalCost

  @property
  USeedNumber: Node = null; // 种子数量

  @property
  USeedIncrease: Node = null; // 种子增加

  @property
  USeedMinimize: Node = null; // 种子减少

  @property
  UBuySeedButton: Node = null; // 购买种子Button

  @property
  seedNumber: number = 1; // 种子减少

  private static _instance: BuySeed;

  static getInstance(): BuySeed {
    return BuySeed._instance;
  }

  protected onLoad(): void {
    BuySeed._instance = this;
    this.USeedName = find("popBox/Canvas/BuySeed/Content/Name");
    this.USeedSprite = find("popBox/Canvas/BuySeed/Content/Fruit");
    this.USeedProfit = find("popBox/Canvas/BuySeed/Content/Effect/Profit");
    this.USeedRipeningTime = find(
      "popBox/Canvas/BuySeed/Content/Effect/RipeningTime"
    );
    this.USeedTotalCost = find("popBox/Canvas/BuySeed/Content/Options/Cost");
    this.USeedNumber = find(
      "popBox/Canvas/BuySeed/Content/Options/Count/Number"
    );
    this.USeedIncrease = find(
      "popBox/Canvas/BuySeed/Content/Options/Content/Increase"
    );
    this.USeedMinimize = find(
      "popBox/Canvas/BuySeed/Content/Options/Content/Minimize"
    );
    this.UBuySeedButton = find("popBox/Canvas/BuySeed/Content/Options/Button");
  }

  updateBuySeedInfo(seed) {
    let spritePath = null;
    switch (seed.level) {
      case 1:
        spritePath = "Carrot";
        break;
      case 2:
        spritePath = "Chive";
        break;
      case 3:
        spritePath = "Tomato";
        break;
      case 4:
        spritePath = "Corn";
        break;
      case 5:
        spritePath = "Sunflower";
        break;
      case 6:
        spritePath = "Watermelon";
        break;
      case 7:
        spritePath = "BSC";
        break;
      case 8:
        spritePath = "Base";
        break;
      case 9:
        spritePath = "Solona";
        break;
      case 10:
        spritePath = "Ton";
        break;
      case 11:
        spritePath = "ETH";
        break;
      case 12:
        spritePath = "BTC";
        break;
      default:
        spritePath = "Carrot";
    }

    resources.load("seedPlant", SpriteAtlas, (err, atlas) => {
      if (err) {
        console.error("Failed to load sprite:", err);
        return;
      }

      this.USeedSprite.getChildByName("Picture").getComponent(
        Sprite
      ).spriteFrame = atlas.getSpriteFrame(spritePath);
    });

    this.USeedSprite.getChildByName("Number")
      .getChildByName("Label")
      .getComponent(Label).string = seed.level;
    this.USeedName.getComponent(Label).string = spritePath;

    this.USeedProfit.getChildByName("Value").getComponent(
      Label
    ).string = `+${formatNumberShortDynamic(seed.points)}/block`;

    this.USeedRipeningTime.getChildByName("Value").getComponent(Label).string =
      formatSecondsImprove(seed.maturity_time);

    this.USeedNumber.getChildByName("Value").getComponent(Label).string = "1";

    this.seedNumber = 1;

    this.USeedTotalCost.getChildByName("Value").getComponent(Label).string =
      formatNumberShortDynamic(seed.price * this.seedNumber);
  }

  increaseEmit() {
    const globalData = GlobalData.getInstance();
    const dialog = Dialog.getInstance();

    this.seedNumber++;
    this.USeedNumber.getChildByName("Value").getComponent(Label).string =
      this.seedNumber + "";

    const totalCost = dialog.targetBuySeedInfo.price * this.seedNumber;

    this.USeedTotalCost.getChildByName("Value").getComponent(Label).string =
      formatNumberShortDynamic(totalCost);

    if (totalCost > globalData.userInfo.points_balance) {
      this.UBuySeedButton.getChildByName("Border").getComponent(
        DrawRoundedRect
      ).fillColor = new Color(212, 213, 215);
      this.UBuySeedButton.getChildByName("Border")
        .getComponent(DrawRoundedRect)
        .reRender();

      this.UBuySeedButton.getChildByName("Label").getComponent(Label).string =
        i18n.insufficientCoins1;
    } else {
      this.UBuySeedButton.getChildByName("Border").getComponent(
        DrawRoundedRect
      ).fillColor = new Color(255, 205, 92);
      this.UBuySeedButton.getChildByName("Border")
        .getComponent(DrawRoundedRect)
        .reRender();

      this.UBuySeedButton.getChildByName("Label").getComponent(Label).string =
        "Buy";
    }
  }

  minimizeEmit() {
    if (this.seedNumber === 1) return;

    const globalData = GlobalData.getInstance();
    const dialog = Dialog.getInstance();
    this.seedNumber--;
    this.USeedNumber.getChildByName("Value").getComponent(Label).string =
      this.seedNumber + "";

    const totalCost = dialog.targetBuySeedInfo.price * this.seedNumber;

    this.USeedTotalCost.getChildByName("Value").getComponent(Label).string =
      formatNumberShortDynamic(
        dialog.targetBuySeedInfo.price * this.seedNumber
      );

    if (totalCost > globalData.userInfo.points_balance) {
      this.UBuySeedButton.getChildByName("Border").getComponent(
        DrawRoundedRect
      ).fillColor = new Color(212, 213, 215);
      this.UBuySeedButton.getChildByName("Border")
        .getComponent(DrawRoundedRect)
        .reRender();

      this.UBuySeedButton.getChildByName("Label").getComponent(Label).string =
        i18n.insufficientCoins1;
    } else {
      this.UBuySeedButton.getChildByName("Border").getComponent(
        DrawRoundedRect
      ).fillColor = new Color(255, 205, 92);
      this.UBuySeedButton.getChildByName("Border")
        .getComponent(DrawRoundedRect)
        .reRender();

      this.UBuySeedButton.getChildByName("Label").getComponent(Label).string =
        "Buy";
    }
  }

  // 购买种子
  async buySeed() {
    const globalData = GlobalData.getInstance();
    const genInfo = GenInfo.getInstance();
    const dialog = Dialog.getInstance();

    const totalCost = dialog.targetBuySeedInfo.price * this.seedNumber;
    if (totalCost > globalData.userInfo.points_balance) {
      globalData.setTipsLabel(i18n.insufficientCoins);
      return;
    }
    try {
      const response = await httpRequest("/api/v1/seed/buy", {
        method: "POST",
        body: {
          quantity: this.seedNumber,
          seed_id: dialog.targetBuySeedInfo.id,
        },
      });
      if (response.ok) {
        dialog.closeDialog(null, "BuySeed");
        AudioMgr.inst.playOneShot("sounds/goldReduce");
        genInfo.requestUserInfo(); // 买完之后更新用户信息
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
