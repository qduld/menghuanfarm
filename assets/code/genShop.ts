import {
  _decorator,
  Component,
  Node,
  find,
  instantiate,
  resources,
  Sprite,
  UITransform,
  Label,
  SpriteAtlas,
  Color,
  director,
} from "cc";
import { httpRequest } from "./http";
import { ISeedList } from "./interface";
import { BuySeedEffect } from "./buySeedEffect";
import { formatNumberShortDynamic, formatSecondsImprove } from "./utils";
import { DrawRoundedRect } from "./drawRoundedRect";
import { i18n } from "./loadData";
import { Dialog } from "./dialog";
import { GlobalData } from "./globalData";
import { LoadingUI } from "./loadingUI";

import { GenericObjectPool } from "./genericObjectPool";

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
  private seedAtlas: SpriteAtlas = null;

  static getInstance(): GenShop {
    return GenShop._instance;
  }

  protected async onLoad() {
    GenShop._instance = this;

    const loadingUI = this.node.getComponent(LoadingUI);
    loadingUI.show();

    this.USeedList = find("popBox/Canvas/Shop/ScrollView/view/content");
    this.USeedSection = find(
      "popBox/Canvas/Shop/ScrollView/view/content/Section"
    );

    // 预加载图集
    await new Promise<void>((resolve) => {
      resources.load("seedPlant", SpriteAtlas, (err, atlas) => {
        if (!err) {
          this.seedAtlas = atlas;
        }
        resolve();
      });
    });

    // 注册对象池 // <pool_3>
    if (!GenericObjectPool.instance.hasPool("shopItem")) {
      GenericObjectPool.instance.registerPool("shopItem", {
        prefab: this.USeedSection,
        initialSize: 6,
        maxSize: 30,
      });
    }
    
    // 隐藏模板节点，防止其参与布局或被错误回收
    if (this.USeedSection) {
        this.USeedSection.active = false;
    }

    await this.requestShopList();
    loadingUI.hide();
  }

  // 生成推荐列表
  createShopLayout() {
    const globalData = GlobalData.getInstance();

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

      // let seedSection = instantiate(this.USeedSection); // <pool_3>
      let seedSection = GenericObjectPool.instance.get("shopItem"); // <pool_3>
      this.USeedList.addChild(seedSection);

      seedSection.active = true;
      seedSection.setPosition(posX, posY);

      // seedSection
      //   .getChildByName("Fruit")
      //   .getChildByName("Number")
      //   .getChildByName("Label")
      //   .getComponent(Label).string = seed.quantity + "";

      seedSection.getChildByName("Name").getComponent(Label).string =
        i18n.seed[seed.level];

      seedSection
        .getChildByName("Fruit")
        .getChildByName("Number")
        .getChildByName("Label")
        .getComponent(Label).string = seed.level + "";

      seedSection
        .getChildByName("TimeGain")
        .getChildByName("Label")
        .getComponent(Label).string = `+${formatNumberShortDynamic(
        seed.points
      )}/block`;

      seedSection.getChildByName("Time").getComponent(Label).string =
        formatSecondsImprove(seed.maturity_time);

      seedSection
        .getChildByName("Button")
        .getChildByName("Label")
        .getComponent(Label).string = formatNumberShortDynamic(seed.price) + "";

      let spritePath = "";
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

      if (this.seedAtlas) {
        seedSection
          .getChildByName("Fruit")
          .getChildByName("Picture")
          .getComponent(Sprite).spriteFrame = this.seedAtlas.getSpriteFrame(spritePath);
      }

      const button = seedSection.getChildByName("Button");

      if (seed.unlocked === 0) {
        button
          .getChildByName("Border")
          .getComponent(DrawRoundedRect).fillColor = new Color(212, 213, 215);
        button
          .getChildByName("Border")
          .getComponent(DrawRoundedRect)
          .reRender();
        seedSection
          .getChildByName("Button")
          .getChildByName("Label")
          .getComponent(Label).string = i18n.notUnlocked;

        button.getChildByName("Icon").active = false;
      } else if (seed.price > globalData.userInfo.points_balance) {
        button
          .getChildByName("Border")
          .getComponent(DrawRoundedRect).fillColor = new Color(212, 213, 215);
        button
          .getChildByName("Border")
          .getComponent(DrawRoundedRect)
          .reRender();
        // seedSection
        //   .getChildByName("Button")
        //   .getChildByName("Label")
        //   .getComponent(Label).string = i18n.insufficientCoins1;

        button.getChildByName("Icon").active = false;
      } else {
        button
          .getChildByName("Border")
          .getComponent(DrawRoundedRect).fillColor = new Color(255, 205, 92);
        button
          .getChildByName("Border")
          .getComponent(DrawRoundedRect)
          .reRender();
        button.getChildByName("Icon").active = true;
      }

      const buySeedEffect = seedSection.addComponent(BuySeedEffect);
      buySeedEffect.setTargetNode(seedSection.getChildByName("Button"), seed);
    });
  }

  // 获取背包列表
  async requestShopList() {
    try {
      const response = await httpRequest(
        "/api/v1/seed/list?beginId=1&pageSize=20",
        {
          method: "GET",
        }
      );
      if (response.ok) {
        this.seedList = response.data.data as ISeedList[];
        // this.USeedList.removeAllChildren(); // <pool_3>
        const children = [...this.USeedList.children];
        children.forEach((child) => {
            // 不要回收模板节点
            if (child !== this.USeedSection) {
                GenericObjectPool.instance.put("shopItem", child);
            }
        });
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
