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
  director,
} from "cc";
import { httpRequest } from "./http";
import { ISeedList } from "./interface";
// import { seedList } from "./loadData";
import { formatNumberShortDynamic, formatSecondsImprove } from "./utils";
import { Dialog } from "./dialog";
import { SeedEffect } from "./seedEffect";
import { GenBlock } from "./genBlock";
import { LoadingUI } from "./loadingUI";
import { i18n } from "./loadData";

const { ccclass, property } = _decorator;
@ccclass("GenBag")
export class GenBag extends Component {
  @property
  seedList: ISeedList[] = []; // 种子列表

  @property
  USeedContainer: Node = null; // 种子容器

  @property
  USeedList: Node = null; // 种子列表

  @property
  USeedSection: Node = null; // 种子Section

  @property
  UEmptyContent: Node = null;

  @property
  UClickTipsLabel: Node = null;

  @property
  seedSpacingY: number = 20; // 种子Y间距

  @property
  seedSpacingX: number = 20; // 种子X间距

  private static _instance: GenBag;

  static getInstance(): GenBag {
    return GenBag._instance;
  }

  protected async onLoad() {
    GenBag._instance = this;

    const loadingUI = this.node.getComponent(LoadingUI);
    loadingUI.show();

    this.USeedContainer = find("popBox/Canvas/Bag/ScrollView");
    this.USeedList = find("popBox/Canvas/Bag/ScrollView/view/content");
    this.USeedSection = find(
      "popBox/Canvas/Bag/ScrollView/view/content/Section"
    );
    this.UEmptyContent = find("popBox/Canvas/Bag/Empty");
    this.UClickTipsLabel = find("popBox/Canvas/Bag/Title");

    await this.requestPackageList();
    loadingUI.hide();
  }

  // 生成推荐列表
  createPackageLayout() {
    if (this.seedList?.length === 0 || !this.seedList) {
      this.UEmptyContent.active = true;
      this.USeedContainer.active = false;
      this.UClickTipsLabel.active = false;
      return;
    }
    this.UEmptyContent.active = false;
    this.USeedContainer.active = true;
    this.UClickTipsLabel.active = true;
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

      seedSection.getChildByName("Name").getComponent(Label).string =
        i18n.seed[seed.level];

      seedSection
        .getChildByName("Fruit")
        .getChildByName("Number")
        .getChildByName("Label")
        .getComponent(Label).string = seed.quantity + "";

      seedSection
        .getChildByName("TimeGain")
        .getChildByName("Label")
        .getComponent(Label).string = `+${formatNumberShortDynamic(
        seed.points
      )}/block`;

      seedSection.getChildByName("Time").getComponent(Label).string =
        formatSecondsImprove(seed.maturity_time);

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

      resources.load("seedPlant", SpriteAtlas, (err, atlas) => {
        if (err) {
          console.error("Failed to load sprite:", err);
          return;
        }

        seedSection
          .getChildByName("Fruit")
          .getChildByName("Picture")
          .getComponent(Sprite).spriteFrame = atlas.getSpriteFrame(spritePath);

        const seedEffect = seedSection.addComponent(SeedEffect);
        seedEffect.setTargetNode(seedSection, seed);
      });
    });
  }

  async farmlandPlant() {
    const dialog = Dialog.getInstance();

    if (dialog.targetBlockInfo.id) {
      // 是点击土地进入的背包，直接播种
      await this.requestFarmLandPlant(
        dialog.targetBlockInfo.id,
        dialog.targetSeedInfo.id
      );
      dialog.closeDialog(null, "Bag");
    }
  }

  // 获取背包列表
  async requestPackageList() {
    try {
      const response = await httpRequest("/api/v1/seed/package", {
        method: "GET",
      });
      if (response.ok) {
        if (response.data.data) {
          this.seedList = response.data.data.sort(
            (a, b) => a.level - b.level
          ) as ISeedList[];
        } else {
          this.seedList = [];
        }

        this.USeedList.removeAllChildren();
        this.createPackageLayout();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // 播种
  async requestFarmLandPlant(farmland_Id, seed_id) {
    try {
      const response = await httpRequest("/api/v1/farm/farmland/plant", {
        method: "POST",
        body: {
          farmland_Id,
          seed_id,
        },
      });
      if (response.ok) {
        const genBlock = GenBlock.getInstance();
        genBlock.updateFarmLand(farmland_Id); // 重新请求farmlandList
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  routeToShop() {
    const dialog = Dialog.getInstance();

    dialog.closeDialog(null, "Bag");
    dialog.showDialog(null, "Shop");
  }
}
