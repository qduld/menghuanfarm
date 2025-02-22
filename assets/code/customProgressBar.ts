import { _decorator, Component, ProgressBar, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CustomProgressBar")
export class CustomProgressBar extends Component {
  @property(ProgressBar)
  progressBar: ProgressBar = null; // 进度条组件

  @property(Label)
  progressLabel: Label = null; // 显示数字的 Label

  private currentProgress: number = 1; // 当前进度
  private maxProgress: number = 10; // 最大进度

  start() {
    this.updateProgress();
  }

  /**
   * 更新进度条和文本
   */
  updateProgress() {
    if (this.progressBar && this.progressLabel) {
      // 设置进度条的进度值
      this.progressBar.progress = this.currentProgress / this.maxProgress;

      // 更新文本内容
      this.progressLabel.string = `${this.currentProgress}/${this.maxProgress}`;
    }
  }

  /**
   * 增加进度
   */
  increaseProgress(amount: number = 1) {
    this.currentProgress = Math.min(
      this.currentProgress + amount,
      this.maxProgress
    );
    this.updateProgress();
  }

  /**
   * 减少进度
   */
  decreaseProgress(amount: number = 1) {
    this.currentProgress = Math.max(this.currentProgress - amount, 0);
    this.updateProgress();
  }
}
