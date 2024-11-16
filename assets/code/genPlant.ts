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
  Widget,
} from "cc";
import { formatSeconds } from "./utils";
import { HoverEffect } from "./hoverEffect";

const { ccclass, property } = _decorator;
@ccclass("GenPlant")
export class GenPlant extends Component {
  private plantSprite: Node | null = null;
  private plantSpritePath: string | null = null;
  private plantLevel: number | null = null;
  private countdownLabel: Node | null = null;

  updatePlantStatus(block, data) {
    if (data.status === 0) return; // 不可种植未解锁

    this.plantSprite = block.getChildByName("Plant");
    this.plantSprite.active = true;
    if (data.farmStatus === 0) {
      // 未种植
      this.plantSpritePath = "awaitingSowing";
      this.plantLevel = 0;
      block.getChildByName("Countdown").active = false;
      block.getChildByName("Plant").getChildByName("Receivehand").active =
        false;
    } else {
      const currentTime = new Date().getTime();
      block.getChildByName("Countdown").active = true; // 临时放这里

      if (
        data.seed.maturityTime - currentTime > 0 &&
        currentTime - data.seed.ttlSeconds < 0
      ) {
        if (
          data.seed.maturityTime - currentTime >
          currentTime - data.seed.ttlSeconds
        ) {
          // 如果播种时间没有过半
          this.plantLevel = 1;
        }
        if (
          data.seed.maturityTime - currentTime <
          currentTime - data.seed.ttlSeconds
        ) {
          // 如果播种时间过半
          this.plantLevel = 2;
        }

        this.countdownLabel = block
          .getChildByName("Countdown")
          .getChildByName("Time");
        this.countdownLabel.getComponent(Label).string = formatSeconds(
          (data.seed.maturityTime - currentTime) / 1000
        );
      }

      if (data.seed.maturityTime - currentTime <= 0) {
        // 如果超过成熟时间
        this.plantLevel = 3;
      }

      if (this.plantLevel === 1) {
        this.plantSpritePath = "sprout";
      }
      if (this.plantLevel === 2) {
        // 后续不同作物不同二阶段
        this.plantSpritePath = "carrotLevel2";
      }
      if (this.plantLevel === 3) {
        switch (data.seed.name) {
          case "玉米":
            this.plantSpritePath = "eggplantLevel3";
            break;
          case "茄子":
            this.plantSpritePath = "eggplantLevel3";
            break;
          case "萝卜":
            this.plantSpritePath = "carrotLevel3";
            break;
          case "西红柿":
            this.plantSpritePath = "tomatoLevel3";
            break;
        }
      }
    }

    resources.load(
      this.plantSpritePath + "/spriteFrame",
      SpriteFrame,
      (err, spriteFrame) => {
        if (err) {
          console.error("Failed to load sprite:", err);
          return;
        }

        this.plantSprite.getComponent(Sprite).spriteFrame = spriteFrame;

        if (this.plantLevel === 0) {
          this.plantSprite.getComponent(UITransform).width = 60;
          this.plantSprite.getComponent(UITransform).height = 70;
          this.plantSprite.setPosition(0, 36, 0);
        }
        if (this.plantLevel === 3) {
          this.plantSprite.getComponent(UITransform).width = 160;
          this.plantSprite.getComponent(UITransform).height = 156;
          this.plantSprite.setPosition(0, 80, 0);
        }
        const hoverEffect = this.plantSprite.addComponent(HoverEffect);
        hoverEffect.setTargetNode(this.plantSprite, data, this.plantLevel);
      }
    );
  }
}
