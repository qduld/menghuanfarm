import { _decorator, Component, director } from "cc";
import { GenBlock } from "./genBlock";
const { ccclass, property } = _decorator;

@ccclass("SceneSwitcher")
export class SceneSwitcher extends Component {
  @property({ type: String })
  sceneName: string = ""; // 切换到的场景名称

  // 切换场景的方法
  public switchScene() {
    if (this.sceneName) {
      if (this.sceneName !== "main") {
        const genBlock = GenBlock.getInstance();
        genBlock.resetAllSchedule();
      }
      director.loadScene(this.sceneName, (err) => {
        if (err) {
          console.error("Failed to load scene:", this.sceneName, err);
        } else {
          console.log("Scene loaded:", this.sceneName);
        }
      });
    } else {
      console.warn("Scene name is empty!");
    }
  }
}
