import {
  _decorator,
  Component,
  Node,
  tween,
  CCInteger,
  Vec3,
  CCFloat,
  find,
  EventTouch,
  instantiate,
  Layers,
  resources,
  Sprite,
  SpriteFrame,
  UITransform,
  Label,
  director,
  Scene,
  sys,
  assetManager,
  AudioClip,
  AudioSource,
} from "cc";
import { paiHang, param, wechatAd, tokenMock } from "./loadData";
import { httpRequest } from "./http";
import { ISeedList } from "./interface";
import { seedList } from "./loadData";
import { formatSeconds } from "./utils";

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

  protected onLoad(): void {
    this.requestPackageList();
    this.USeedList = find("popBox/Canvas/Bag/List");
    this.USeedSection = find("popBox/Canvas/Bag/Section");
  }

  // 生成推荐列表
  createPackageLayout() {
    // 获取预制体的宽度和高度
    debugger;
    const sectionHeight =
      this.USeedSection.getChildByName("Bg").getComponent(UITransform)
        .contentSize.height;
    const sectionWidth =
      this.USeedSection.getChildByName("Bg").getComponent(UITransform)
        .contentSize.width;

    // 计算起始点，以保证整个布局居中
    const startX = this.USeedSection.position.x - 376;
    const startY = this.USeedSection.position.y - 667;

    seedList.forEach((seed, index) => {
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
        .getComponent(Label).string = `+${seed.quantity}/m²`;

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

      resources.load(
        spritePath + "/spriteFrame",
        SpriteFrame,
        (err, spriteFrame) => {
          if (err) {
            console.error("Failed to load sprite:", err);
            return;
          }

          seedSection
            .getChildByName("Fruit")
            .getChildByName("Picture")
            .getComponent(Sprite).spriteFrame = spriteFrame;
        }
      );
    });
  }

  // 获取背包列表
  async requestPackageList() {
    try {
      const response = await httpRequest("/api/v1/seed/package", {
        method: "GET",
      });
      if (response.ok) {
        this.seedList = response.data.data as ISeedList[];
        this.createPackageLayout();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
