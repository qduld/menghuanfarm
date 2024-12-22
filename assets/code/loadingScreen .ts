// LoadingScreen.ts
import { _decorator, Component, ProgressBar, Label, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LoadingScreen")
export class LoadingScreen extends Component {
  @property(ProgressBar)
  progressBar: ProgressBar = null;

  @property(Label)
  progressLabel: Label = null;

  // 要加载的目标场景名称
  private targetScene: string = "main";

  onLoad() {
    this.loadMainScene();
  }

  loadMainScene() {
    director.preloadScene(
      this.targetScene,
      (completedCount, totalCount) => {
        // 更新进度条和进度文本
        const progress = completedCount / totalCount;
        this.progressBar.progress = progress;
        this.progressLabel.string = `加载中... ${Math.floor(progress * 100)}%`;
      },
      (err) => {
        console.log("可用场景列表：", director.getScene());
        if (err) {
          console.error(`加载场景失败: ${this.targetScene}`, err);
          return;
        }
        // 加载完成后切换到目标场景
        director.loadScene(this.targetScene);
      }
    );
  }
}
