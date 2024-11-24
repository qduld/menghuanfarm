import {
  _decorator,
  Component,
  Node,
  find,
  Sprite,
  SpriteFrame,
  resources,
  Label,
} from "cc";
import { httpRequest } from "./http";
import { Dialog } from "./dialog";

const { ccclass, property } = _decorator;
@ccclass("BuySeed")
export class BuySeed extends Component {
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
  seedNumber: number = 0; // 种子减少

  private static _instance: BuySeed;

  static getInstance(): BuySeed {
    return BuySeed._instance;
  }

  protected onLoad(): void {
    BuySeed._instance = this;
    this.USeedSprite = find("popBox/Canvas/BuySeed/Content/Fruit/Picture");
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
  }

  updateBuySeedInfo(seed) {
    let spritePath = null;
    switch (seed.name) {
      case "西红柿":
        spritePath = "tomato";
        break;
      case "萝卜":
        spritePath = "carrot";
        break;
      case "茄子":
        spritePath = "eggplant";
        break;
      default:
        spritePath = "carrot";
    }

    resources.load(
      spritePath + "/spriteFrame",
      SpriteFrame,
      (err, spriteFrame) => {
        if (err) {
          console.error("Failed to load sprite:", err);
          return;
        }

        this.USeedSprite.getComponent(Sprite).spriteFrame = spriteFrame;
      }
    );

    this.USeedProfit.getChildByName("Value").getComponent(
      Label
    ).string = `+${seed.points}/block`;

    this.USeedRipeningTime.getChildByName("Value").getComponent(
      Label
    ).string = `${seed.maturityTime}min`;

    this.USeedTotalCost.getChildByName("Value").getComponent(Label).string =
      "0k";

    this.USeedNumber.getChildByName("Value").getComponent(Label).string = "0";

    this.seedNumber = 0;
  }

  increaseEmit() {
    const dialog = Dialog.getInstance();
    this.seedNumber++;
    this.USeedNumber.getChildByName("Value").getComponent(Label).string =
      this.seedNumber + "";

    this.USeedTotalCost.getChildByName("Value").getComponent(Label).string =
      dialog.targetBuySeedInfo.price * this.seedNumber + "k";
  }

  minimizeEmit() {
    if (this.seedNumber === 0) return;
    const dialog = Dialog.getInstance();
    this.seedNumber--;
    this.USeedNumber.getChildByName("Value").getComponent(Label).string =
      this.seedNumber + "";

    this.USeedTotalCost.getChildByName("Value").getComponent(Label).string =
      dialog.targetBuySeedInfo.price * this.seedNumber + "k";
  }

  // 购买种子
  async buySeed() {
    const dialog = Dialog.getInstance();
    try {
      const response = await httpRequest("/api/v1/seed/buy", {
        method: "POST",
        body: {
          quantity: this.seedNumber,
          seedId: dialog.targetBuySeedInfo.id,
        },
      });
      if (response.ok) {
        dialog.closeDialog(null, "BuySeed");
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}