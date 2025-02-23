import {
  _decorator,
  Component,
  Node,
  resources,
  Sprite,
  SpriteFrame,
  UITransform,
  Label,
  SpriteAtlas,
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
    if (data.farm_status === 0) {
      // 未种植
      this.plantSpritePath = "awaitingSowing";
      this.plantLevel = 0;
      block.getChildByName("Countdown").active = false;
      block.getChildByName("Plant").getChildByName("Receivehand").active =
        false;
      block.getChildByName("Plant").getChildByName("Expand").active = false;
    } else {
      const currentTime = new Date().getTime();
      const maturity_time = data.seed.plant_at + data.seed.maturity_time * 1000;
      const plantTime = data.seed.plant_at;
      block.getChildByName("Countdown").active = true; // 临时放这里
      const countdownLabel = block.getChildByName("Countdown");

      if (maturity_time - currentTime > 0 && currentTime - plantTime >= 0) {
        this.startCountdownForLand(
          block,
          countdownLabel,
          maturity_time - currentTime,
          data
        );
        if (maturity_time - currentTime > currentTime - plantTime) {
          // 如果播种时间没有过半
          this.plantLevel = 1;
        }
        if (maturity_time - currentTime < currentTime - plantTime) {
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

      if (maturity_time - currentTime <= 0) {
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
      resources.load("iconList", SpriteAtlas, (err, atlas) => {
        if (err) {
          console.error("Failed to load sprite:", err);
          return;
        }

        this.plantMarkingSprite.getComponent(Sprite).spriteFrame =
          atlas.getSpriteFrame(this.plantMarkingsPath);
      });
    }

    const globalData = GlobalData.getInstance();
    if (
      globalData.isStolen &&
      this.plantLevel === 3 &&
      data.steal_available === 1
    ) {
      block.getChildByName("Plant").getChildByName("Receivehand").active = true;
      if (globalData.userInfo.expansion_card) {
        block.getChildByName("Plant").getChildByName("Expand").active = true;
      }
    }

    if (globalData.isStolen && data.steal_available === 0) {
      block.getChildByName("Plant").getChildByName("Receivehand").active =
        false;
      if (globalData.userInfo.expansion_card) {
        block.getChildByName("Plant").getChildByName("Expand").active = true;
      }
    }
    if (!this.plantSpritePath) {
      const genBlock = GenBlock.getInstance();
      genBlock.updateFarmLand(data.id); // 重新请求farmlandList
    }

    block.getChildByName("Plant")["plantLevel"] = this.plantLevel;

    resources.load("iconList", SpriteAtlas, (err, atlas) => {
      if (err) {
        console.error("Failed to load sprite:", err);
        return;
      }

      this.plantSprite.getComponent(Sprite).spriteFrame = atlas.getSpriteFrame(
        this.plantSpritePath
      );

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

      if (!this.plantSprite.getComponent(HoverEffect)) {
        const hoverEffect = this.plantSprite.addComponent(HoverEffect);
        hoverEffect.setTargetNode(this.plantSprite, data, this.plantLevel);
      } else {
        this.plantSprite
          .getComponent(HoverEffect)
          .setTargetNode(this.plantSprite, data, this.plantLevel);
      }
    });
  }

  startCountdownForLand(block: Node, landNode: Node, time: number, data) {
    // 保存剩余时间
    let remainingTime = time;
    let label = landNode.getChildByName("Content").getComponent(Label);
    landNode.active = true;

    if (!landNode["hasSchedule"]) {
      // 定时器
      const timeCallBack = () => {
        landNode["hasSchedule"] = true;
        if (remainingTime > 0) {
          // 设置标志位，防止重复创建定时器
          remainingTime = remainingTime - 1000;
          label.string = formatSeconds(Math.ceil(remainingTime / 1000));
        } else {
          label.string = "";
          // 停止定时器
          this.unschedule(timeCallBack);
          this.updateCountdown(landNode);
        }
        this.updatePlantStatus(block, data);
      };
      this.schedule(timeCallBack, 1);
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
