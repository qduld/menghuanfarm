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

    const globalData = GlobalData.getInstance();

    this.plantSprite = block.getChildByName("Plant");
    this.plantSprite.active = true;
    // 倒计时标记改为植物标记
    this.plantMarkingSprite = block
      .getChildByName("Countdown")
      .getChildByName("Icon");

    block.getChildByName("Plant").getChildByName("Receivehand").active = false;

    if (data.farm_status === 0) {
      // 未种植
      this.plantSpritePath = "awaitingSowing";
      this.plantLevel = 0;
      block.getChildByName("Countdown").active = false;
      block.getChildByName("Plant").getChildByName("Expand").active = false;
    } else {
      const currentTime = new Date().getTime();
      const maturity_time = data.seed.plant_at + data.seed.maturity_time * 1000;
      const plantTime = data.seed.plant_at;
      block.getChildByName("Countdown").active = true; // 临时放这里
      const countdownLabel = block.getChildByName("Countdown");

      switch (data.seed.level) {
        case 1:
          this.plantMarkingsPath = "Carrot";
          break;
        case 2:
          this.plantMarkingsPath = "Chive";
          break;
        case 3:
          this.plantMarkingsPath = "Tomato";
          break;
        case 4:
          this.plantMarkingsPath = "Corn";
          break;
        case 5:
          this.plantMarkingsPath = "Sunflower";
          break;
        case 6:
          this.plantMarkingsPath = "Watermelon";
          break;
        case 7:
          this.plantMarkingsPath = "BSC";
          break;
        case 8:
          this.plantMarkingsPath = "Base";
          break;
        case 9:
          this.plantMarkingsPath = "Solona";
          break;
        case 10:
          this.plantMarkingsPath = "Ton";
          break;
        case 11:
          this.plantMarkingsPath = "ETH";
          break;
        case 12:
          this.plantMarkingsPath = "BTC";
          break;
        default:
          this.plantMarkingsPath = "Carrot";
      }

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
          switch (data.seed.level) {
            case 1:
              this.plantSpritePath = "胡萝卜1";
              break;
            case 2:
              this.plantSpritePath = "韭菜1";
              break;
            case 3:
              this.plantSpritePath = "番茄1";
              break;
            case 4:
              this.plantSpritePath = "玉米1";
              break;
            case 5:
              this.plantSpritePath = "向日葵1";
              break;
            case 6:
              this.plantSpritePath = "西瓜1";
              break;
            case 7:
              this.plantSpritePath = "BSC1";
              break;
            case 8:
              this.plantSpritePath = "Base1";
              break;
            case 9:
              this.plantSpritePath = "Solona1";
              break;
            case 10:
              this.plantSpritePath = "TON1";
              break;
            case 11:
              this.plantSpritePath = "ETH1";
              break;
            case 12:
              this.plantSpritePath = "BTC1";
              break;
            default:
              this.plantSpritePath = "胡萝卜1";
          }
        }
        if (maturity_time - currentTime < currentTime - plantTime) {
          // 如果播种时间过半
          this.plantLevel = 2;
          switch (data.seed.level) {
            case 1:
              this.plantSpritePath = "胡萝卜2";
              break;
            case 2:
              this.plantSpritePath = "韭菜2";
              break;
            case 3:
              this.plantSpritePath = "番茄2";
              break;
            case 4:
              this.plantSpritePath = "玉米2";
              break;
            case 5:
              this.plantSpritePath = "向日葵2";
              break;
            case 6:
              this.plantSpritePath = "西瓜2";
              break;
            case 7:
              this.plantSpritePath = "BSC2";
              break;
            case 8:
              this.plantSpritePath = "Base2";
              break;
            case 9:
              this.plantSpritePath = "Solona2";
              break;
            case 10:
              this.plantSpritePath = "TON2";
              break;
            case 11:
              this.plantSpritePath = "ETH2";
              break;
            case 12:
              this.plantSpritePath = "BTC2";
              break;
            default:
              this.plantSpritePath = "胡萝卜2";
          }
        }
      } else {
        countdownLabel["hasSchedule"] = false;
      }

      if (maturity_time - currentTime <= 0) {
        // 如果超过成熟时间
        this.plantLevel = 3;
        countdownLabel.active = false;
      }

      // if (this.plantLevel === 1) {
      //   this.plantSpritePath = "sprout";
      // }
      // if (this.plantLevel === 2) {
      //   // 后续不同作物不同二阶段
      //   this.plantSpritePath = "carrotLevel2";
      // }
      if (this.plantLevel === 3) {
        switch (data.seed.level) {
          case 1:
            this.plantSpritePath = "胡萝卜3";
            break;
          case 2:
            this.plantSpritePath = "韭菜3";
            break;
          case 3:
            this.plantSpritePath = "番茄3";
            break;
          case 4:
            this.plantSpritePath = "玉米3";
            break;
          case 5:
            this.plantSpritePath = "向日葵3";
            break;
          case 6:
            this.plantSpritePath = "西瓜3";
            break;
          case 7:
            this.plantSpritePath = "BSC3";
            break;
          case 8:
            this.plantSpritePath = "Base3";
            break;
          case 9:
            this.plantSpritePath = "Solona3";
            break;
          case 10:
            this.plantSpritePath = "TON3";
            break;
          case 11:
            this.plantSpritePath = "ETH3";
            break;
          case 12:
            this.plantSpritePath = "BTC3";
            break;
          default:
            this.plantSpritePath = "胡萝卜3";
        }

        if (!globalData.isStolen) {
          block.getChildByName("Plant").getChildByName("Receivehand").active =
            true;
        }
      }
    }

    if (this.plantMarkingsPath) {
      resources.load("seedPlant", SpriteAtlas, (err, atlas) => {
        if (err) {
          console.error("Failed to load sprite:", err);
          return;
        }

        this.plantMarkingSprite.getComponent(Sprite).spriteFrame =
          atlas.getSpriteFrame(this.plantMarkingsPath);
      });
    }

    // 偷取时作物成熟且可偷取
    if (
      globalData.isStolen &&
      this.plantLevel === 3 &&
      data.steal_available === 1
    ) {
      block.getChildByName("Plant").getChildByName("Receivehand").active = true;
    }

    // 偷取时不可偷取
    if (globalData.isStolen && data.steal_available === 0) {
      block.getChildByName("Plant").getChildByName("Receivehand").active =
        false;
    }

    // // 自己的作物成熟时有膨胀卡
    // if (
    //   !globalData.isStolen &&
    //   this.plantLevel === 3 &&
    //   globalData.userInfo?.expansion_card
    // ) {
    //   block.getChildByName("Plant").getChildByName("Expand").active = true;
    // }

    if (!this.plantSpritePath) {
      const genBlock = GenBlock.getInstance();
      genBlock.updateFarmLand(data.id); // 重新请求farmlandList
    }

    block.getChildByName("Plant")["plantLevel"] = this.plantLevel;

    if (this.plantLevel === 0) {
      resources.load("iconList", SpriteAtlas, (err, atlas) => {
        if (err) {
          console.error("Failed to load sprite:", err);
          return;
        }

        this.plantSprite.getComponent(Sprite).spriteFrame =
          atlas.getSpriteFrame(this.plantSpritePath);

        this.plantSprite.getComponent(UITransform).width = 90;
        this.plantSprite.getComponent(UITransform).height = 105;
        this.plantSprite.setPosition(0, 36, 0);

        if (!this.plantSprite.getComponent(HoverEffect)) {
          const hoverEffect = this.plantSprite.addComponent(HoverEffect);
          hoverEffect.setTargetNode(this.plantSprite, data, this.plantLevel);
        } else {
          this.plantSprite.getComponent(HoverEffect).animating = false;
          this.plantSprite
            .getComponent(HoverEffect)
            .setTargetNode(this.plantSprite, data, this.plantLevel);
        }
      });
    } else {
      resources.load("seedPlant", SpriteAtlas, (err, atlas) => {
        if (err) {
          console.error("Failed to load sprite:", err);
          return;
        }

        this.plantSprite.getComponent(Sprite).spriteFrame =
          atlas.getSpriteFrame(this.plantSpritePath);
        if (this.plantLevel === 1) {
          if (data.seed.level >= 11) {
            this.plantSprite.getComponent(UITransform).width = 120;
            this.plantSprite.getComponent(UITransform).height = 140;
          } else {
            this.plantSprite.getComponent(UITransform).width = 140;
            this.plantSprite.getComponent(UITransform).height = 100;
          }

          this.plantSprite.setPosition(0, 30, 0);
        }
        if (this.plantLevel === 2) {
          if (data.seed.level >= 9 && data.seed.level <= 10) {
            this.plantSprite.getComponent(UITransform).width = 160;
            this.plantSprite.getComponent(UITransform).height = 140;
          } else if (data.seed.level >= 11) {
            this.plantSprite.getComponent(UITransform).width = 140;
            this.plantSprite.getComponent(UITransform).height = 160;
          } else {
            this.plantSprite.getComponent(UITransform).width = 180;
            this.plantSprite.getComponent(UITransform).height = 120;
          }

          this.plantSprite.setPosition(0, 30, 0);
        }
        if (this.plantLevel === 3) {
          if (data.seed.level >= 7 && data.seed.level <= 10) {
            this.plantSprite.getComponent(UITransform).width = 180;
            this.plantSprite.getComponent(UITransform).height = 140;
          } else if (data.seed.level >= 11) {
            this.plantSprite.getComponent(UITransform).width = 160;
            this.plantSprite.getComponent(UITransform).height = 180;
          } else {
            this.plantSprite.getComponent(UITransform).width = 180;
            this.plantSprite.getComponent(UITransform).height = 160;
          }

          this.plantSprite.setPosition(0, 18, 0);
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
