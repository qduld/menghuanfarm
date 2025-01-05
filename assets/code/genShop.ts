import {
  _decorator,
  Component,
  Node,
  find,
  instantiate,
  resources,
  Sprite,
  SpriteFrame,
  UITransform,
  Label,
  SpriteAtlas,
} from "cc";
import { httpRequest } from "./http";
import { ISeedList } from "./interface";
import { BuySeedEffect } from "./buySeedEffect";
import { formatSeconds } from "./utils";
import { GenInfo } from "./genInfo";

const { ccclass, property } = _decorator;
@ccclass("GenShop")
export class GenShop extends Component {
  @property
  seedList: ISeedList[] = []; // 种子列表

  @property
  USeedList: Node = null; // 种子列表

  @property
  USeedSection: Node = null; // 种子Section

  @property
  seedSpacingY: number = 80; // 种子Y间距

  @property
  seedSpacingX: number = 20; // 种子X间距

  private static _instance: GenShop;

  static getInstance(): GenShop {
    return GenShop._instance;
  }

  protected onLoad(): void {
    GenShop._instance = this;
    this.requestShopList();
    this.USeedList = find("popBox/Canvas/Shop/ScrollView/view/content");
    this.USeedSection = find(
      "popBox/Canvas/Shop/ScrollView/view/content/Section"
    );
  }

  // 生成推荐列表
  createShopLayout() {
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.USeedSection.getChildByName("Bg").getComponent(UITransform)
        .contentSize.height;
    const sectionWidth =
      this.USeedSection.getChildByName("Bg").getComponent(UITransform)
        .contentSize.width;

    // 计算起始点，以保证整个布局居中
    const startX = this.USeedSection.position.x;
    const startY = this.USeedSection.position.y;

    this.seedList.forEach((seed, index) => {
      const posY =
        startY - Math.floor(index / 3) * (sectionHeight + this.seedSpacingY);
      const posX = startX + (index % 3) * (sectionWidth + this.seedSpacingX);

      let seedSection = instantiate(this.USeedSection);
      this.USeedList.addChild(seedSection);

      seedSection.active = true;
      seedSection.setPosition(posX, posY);

      // seedSection
      //   .getChildByName("Fruit")
      //   .getChildByName("Number")
      //   .getChildByName("Label")
      //   .getComponent(Label).string = seed.quantity + "";

      seedSection
        .getChildByName("TimeGain")
        .getChildByName("Label")
        .getComponent(Label).string = `+${seed.points}/block`;

      seedSection.getChildByName("Time").getComponent(Label).string =
        formatSeconds(seed.maturity_time);

      let spritePath = "";
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

        seedSection
          .getChildByName("Fruit")
          .getChildByName("Picture")
          .getComponent(Sprite).spriteFrame = atlas.getSpriteFrame(spritePath);
      });

      const buySeedEffect = seedSection.addComponent(BuySeedEffect);
      buySeedEffect.setTargetNode(seedSection.getChildByName("Button"), seed);
    });
  }

  // 获取背包列表
  async requestShopList() {
    try {
      const response = await httpRequest(
        "/api/v1/seed/list?beginId=1&pageSize=10",
        {
          method: "GET",
        }
      );
      if (response.ok) {
        this.seedList = response.data.data as ISeedList[];
        this.USeedList.removeAllChildren();
        this.createShopLayout();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 购买种子
  // async buySeed(seed_id, quantity) {
  //   try {
  //     const response = await httpRequest("/api/v1/seed/buy", {
  //       method: "POST",
  //       body: {
  //         quantity,
  //         seed_id,
  //       },
  //     });
  //     if (response.ok) {
  //       const genInfo = GenInfo.getInstance();
  //       genInfo.requestUserInfo(); // 买完之后更新用户信息
  //     } else {
  //       console.error("Request failed with status:", response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }
}
