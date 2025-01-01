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
// import { seedList } from "./loadData";
import { formatSeconds } from "./utils";
import { Dialog } from "./dialog";
import { SeedEffect } from "./seedEffect";
import { GenBlock } from "./genBlock";

const { ccclass, property } = _decorator;
@ccclass("GenBag")
export class GenBag extends Component {
  @property
  seedList: ISeedList[] = []; // 种子列表

  @property
  USeedList: Node = null; // 种子列表

  @property
  USeedSection: Node = null; // 种子Section

  @property
  seedSpacingY: number = 20; // 种子Y间距

  @property
  seedSpacingX: number = 20; // 种子X间距

  private static _instance: GenBag;

  static getInstance(): GenBag {
    return GenBag._instance;
  }

  protected onLoad(): void {
    GenBag._instance = this;
    this.requestPackageList();
    this.USeedList = find("popBox/Canvas/Bag/List");
    this.USeedSection = find("popBox/Canvas/Bag/Section");
  }

  // 生成推荐列表
  createPackageLayout() {
    if (this.seedList.length === 0) return;
    // 获取预制体的宽度和高度
    const sectionHeight =
      this.USeedSection.getChildByName("Bg").getComponent(UITransform)
        .contentSize.height;
    const sectionWidth =
      this.USeedSection.getChildByName("Bg").getComponent(UITransform)
        .contentSize.width;

    // 计算起始点，以保证整个布局居中
    const startX = this.USeedSection.position.x - 376;
    const startY = this.USeedSection.position.y - 667;

    this.seedList.forEach((seed, index) => {
      const posY =
        startY - Math.floor(index / 3) * (sectionHeight + this.seedSpacingY);
      const posX = startX + (index % 3) * (sectionWidth + this.seedSpacingX);

      let seedSection = instantiate(this.USeedSection);
      this.USeedList.addChild(seedSection);

      seedSection.active = true;
      seedSection.setPosition(posX, posY);

      seedSection
        .getChildByName("Fruit")
        .getChildByName("Number")
        .getChildByName("Label")
        .getComponent(Label).string = seed.quantity + "";

      seedSection
        .getChildByName("TimeGain")
        .getChildByName("Label")
        .getComponent(Label).string = `+${seed.quantity}/block`;

      seedSection.getChildByName("Time").getComponent(Label).string =
        formatSeconds(seed.maturityTime);

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
        this.seedList = response.data.data as ISeedList[];
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
  async requestFarmLandPlant(farmlandId, seedId) {
    try {
      const response = await httpRequest("/api/v1/farm/farmland/plant", {
        method: "POST",
        body: {
          farmlandId,
          seedId,
        },
      });
      if (response.ok) {
        const genBlock = GenBlock.getInstance();
        genBlock.updateFarmLand(farmlandId); // 重新请求farmlandList
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
