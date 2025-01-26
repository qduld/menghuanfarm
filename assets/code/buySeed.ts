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
} from "cc";
import { httpRequest } from "./http";
import { Dialog } from "./dialog";
import { GenInfo } from "./genInfo";
import { AudioMgr } from "./audioManager";
import { formatNumberShortDynamic } from "./utils";

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
  seedNumber: number = 1; // 种子减少

  private static _instance: BuySeed;

  static getInstance(): BuySeed {
    return BuySeed._instance;
  }

  protected onLoad(): void {
    BuySeed._instance = this;
    this.USeedName = find("popBox/Canvas/BuySeed/Content/Name");
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

    resources.load("iconList", SpriteAtlas, (err, atlas) => {
      if (err) {
        console.error("Failed to load sprite:", err);
        return;
      }

      this.USeedSprite.getComponent(Sprite).spriteFrame =
        atlas.getSpriteFrame(spritePath);
    });

    this.USeedName.getComponent(Label).string = seed.name;

    this.USeedProfit.getChildByName("Value").getComponent(
      Label
    ).string = `+${formatNumberShortDynamic(seed.points)}/block`;

    this.USeedRipeningTime.getChildByName("Value").getComponent(
      Label
    ).string = `${seed.maturity_time}min`;

    this.USeedNumber.getChildByName("Value").getComponent(Label).string = "1";

    this.seedNumber = 1;

    this.USeedTotalCost.getChildByName("Value").getComponent(Label).string =
      formatNumberShortDynamic(seed.price * this.seedNumber);
  }

  increaseEmit() {
    const dialog = Dialog.getInstance();
    this.seedNumber++;
    this.USeedNumber.getChildByName("Value").getComponent(Label).string =
      this.seedNumber + "";

    this.USeedTotalCost.getChildByName("Value").getComponent(Label).string =
      formatNumberShortDynamic(dialog.targetBuySeedInfo.price * this.seedNumber);
  }

  minimizeEmit() {
    if (this.seedNumber === 1) return;
    const dialog = Dialog.getInstance();
    this.seedNumber--;
    this.USeedNumber.getChildByName("Value").getComponent(Label).string =
      this.seedNumber + "";

    this.USeedTotalCost.getChildByName("Value").getComponent(Label).string =
      formatNumberShortDynamic(dialog.targetBuySeedInfo.price * this.seedNumber);
  }

  // 购买种子
  async buySeed() {
    const genInfo = GenInfo.getInstance();
    const dialog = Dialog.getInstance();
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
