import { _decorator, Component, director } from "cc";
import { GenBlock } from "./genBlock";
import { GlobalData } from "./globalData";
const { ccclass, property } = _decorator;

@ccclass("SceneSwitcher")
export class SceneSwitcher extends Component {
  @property({ type: String })
  sceneName: string = ""; // 切换到的场景名称

  @property({ type: Boolean })
  isStolen: boolean = false; // 是否是偷取场景

  // 切换场景的方法
  public switchScene() {
    const globalData = GlobalData.getInstance();

    if (this.sceneName) {
      if (this.sceneName !== "main") {
        const genBlock = GenBlock.getInstance();
        genBlock.resetAllSchedule();
        globalData.isStolen = false;
      }
      if (this.sceneName === "main") {
        globalData.isStolen = this.isStolen;
        if (globalData.isStolen) {
          globalData.stolenId = this.node["userId"];
        }
      }
      director.loadScene(this.sceneName, (err) => {
        if (err) {
          console.error("Failed to load scene:", this.sceneName, err);
        } else {
          console.log("Scene loaded:", this.sceneName);
          if (this.isStolen) {
            globalData.isStolenUISwitch();
          }
          if (!this.isStolen && this.sceneName === "main") {
            globalData.isNotStolenUISwitch();
          }
        }
      });
    } else {
      console.warn("Scene name is empty!");
    }
  }
}
