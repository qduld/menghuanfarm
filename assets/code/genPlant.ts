import {
  _decorator,
  Component,
  Node,
  resources,
  Sprite,
  SpriteFrame,
  UITransform,
  Label,
} from "cc";
import { formatSeconds } from "./utils";
import { GenBlock } from "./genBlock";
import { HoverEffect } from "./hoverEffect";
import { GlobalData } from "./globalData";

const { ccclass, property } = _decorator;
@ccclass("GenPlant")
export class GenPlant extends Component {
  private plantSprite: Node | null = null;
  private plantMarkingSprite: Node | null = null;
  private plantSpritePath: string | null = null;
  private plantMarkingsPath: string | null = null;
  private plantLevel: number | null = null;

  updatePlantStatus(block, data) {
    if (block.children === null || data.status === 0) return; // 不可种植未解锁

    this.plantSprite = block.getChildByName("Plant");
    this.plantSprite.active = true;
    // 倒计时标记改为植物标记
    this.plantMarkingSprite = block
      .getChildByName("Countdown")
      .getChildByName("Icon");
    this.plantMarkingsPath = "";
    if (data.farmStatus === 0) {
      // 未种植
      this.plantSpritePath = "awaitingSowing";
      this.plantLevel = 0;
      block.getChildByName("Countdown").active = false;
      block.getChildByName("Plant").getChildByName("Receivehand").active =
        false;
    } else {
      const currentTime = new Date().getTime();
      const maturityTime = data.seed.plantAt + data.seed.maturityTime * 1000;
      const plantTime = data.seed.plantAt;
      block.getChildByName("Countdown").active = true; // 临时放这里
      const countdownLabel = block.getChildByName("Countdown");

      if (maturityTime - currentTime > 0 && currentTime - plantTime >= 0) {
        this.startCountdownForLand(
          block,
          countdownLabel,
          maturityTime - currentTime,
          data
        );
        if (maturityTime - currentTime > currentTime - plantTime) {
          // 如果播种时间没有过半
          this.plantLevel = 1;
        }
        if (maturityTime - currentTime < currentTime - plantTime) {
          // 如果播种时间过半
          this.plantLevel = 2;
        }
        switch (data.seed.name) {
          case "玉米":
            this.plantMarkingsPath = "tomatoMarkings";
            break;
          case "茄子":
            this.plantMarkingsPath = "tomatoMarkings";
            break;
          case "萝卜":
            this.plantMarkingsPath = "carrotMarkings";
            break;
          case "西红柿":
            this.plantMarkingsPath = "tomatoMarkings";
            break;
          default:
            this.plantMarkingsPath = "carrotMarkings";
        }
      } else {
        countdownLabel["hasSchedule"] = false;
      }

      if (maturityTime - currentTime <= 0) {
        // 如果超过成熟时间
        this.plantLevel = 3;
        countdownLabel.active = false;
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
          default:
            this.plantSpritePath = "carrotLevel3";
        }
      }
    }

    if (this.plantMarkingsPath) {
      resources.load(
        this.plantMarkingsPath + "/spriteFrame",
        SpriteFrame,
        (err, spriteFrame) => {
          if (err) {
            console.error("Failed to load sprite:", err);
            return;
          }

          this.plantMarkingSprite.getComponent(Sprite).spriteFrame =
            spriteFrame;
        }
      );
    }

    const globalData = GlobalData.getInstance();
    if (
      globalData.isStolen &&
      this.plantLevel === 3 &&
      data.stealAvailable === 1
    ) {
      block.getChildByName("Receivehand").active;
    }

    if (!this.plantSpritePath) {
      const genBlock = GenBlock.getInstance();
      genBlock.updateFarmLand(data.id); // 重新请求farmlandList
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
        if (this.plantLevel === 1) {
          this.plantSprite.getComponent(UITransform).width = 60;
          this.plantSprite.getComponent(UITransform).height = 48;
          this.plantSprite.setPosition(0, 30, 0);
        }
        if (this.plantLevel === 2) {
          this.plantSprite.getComponent(UITransform).width = 90;
          this.plantSprite.getComponent(UITransform).height = 100;
          this.plantSprite.setPosition(0, 60, 0);
        }
        if (this.plantLevel === 3) {
          if (this.plantSpritePath === "carrotLevel3") {
            this.plantSprite.getComponent(UITransform).width = 90;
            this.plantSprite.getComponent(UITransform).height = 120;
            this.plantSprite.setPosition(0, 60, 0);
          } else {
            this.plantSprite.getComponent(UITransform).width = 160;
            this.plantSprite.getComponent(UITransform).height = 156;
            this.plantSprite.setPosition(0, 80, 0);
          }
        }

        const hoverEffect = this.plantSprite.addComponent(HoverEffect);
        hoverEffect.setTargetNode(this.plantSprite, data, this.plantLevel);
      }
    );
  }

  startCountdownForLand(block: Node, landNode: Node, time: number, data) {
    // 保存剩余时间
    let remainingTime = time;
    let label = landNode.getChildByName("Content").getComponent(Label);
    landNode.active = true;

    if (!label["hasSchedule"]) {
      // 定时器
      this.schedule(() => {
        label["hasSchedule"] = true;
        if (remainingTime > 0) {
          // 设置标志位，防止重复创建定时器
          remainingTime = remainingTime - 1000;
          label.string = formatSeconds(Math.ceil(remainingTime / 1000));
        } else {
          label.string = "";
          // 停止定时器
          this.unschedule(this.updateCountdown(landNode));
        }
        this.updatePlantStatus(block, data);
      }, 1);
    }
  }

  updateCountdown(landNode: Node) {
    landNode.active = false;
    landNode["hasSchedule"] = false;
  }

  resetNode(block) {
    block.getChildByName("Countdown")["hasSchedule"] = false;
  }
}
