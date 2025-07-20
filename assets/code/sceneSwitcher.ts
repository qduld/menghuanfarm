import { _decorator, Component, director } from "cc";
import { GenBlock } from "./genBlock";
import { GlobalData } from "./globalData";
import { GenInfo } from "./genInfo";
import { AudioMgr } from "./audioManager";
import { i18n } from "./loadData";
const { ccclass, property } = _decorator;

@ccclass("SceneSwitcher")
export class SceneSwitcher extends Component {
  @property
  sceneName: string = ""; // 切换到的场景名称

  @property
  isStolen: boolean = false; // 是否是偷取场景

  private static _instance: SceneSwitcher;

  static getInstance(): SceneSwitcher {
    return SceneSwitcher._instance;
  }

  onLoad() {
    SceneSwitcher._instance = this;
  }

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
      if (this.sceneName === "airdrop") {
        globalData.setMessageLabel(i18n.stayTuned);
        return;
      }
      director.loadScene(this.sceneName, (err) => {
        if (err) {
          console.error("Failed to load scene:", this.sceneName, err);
        } else {
          console.log("Scene loaded:", this.sceneName);
          AudioMgr.inst.onSceneChange();
          if (this.isStolen) {
            const genInfo = GenInfo.getInstance();
            globalData.isStolenUISwitch();

            genInfo.requestFriendInfo();
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
