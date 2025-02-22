import { _decorator, Component, Node, Sprite, Label, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ProgressBar")
export class ProgressBar extends Component {
  @property(Sprite)
  fill: Sprite = null; // 进度条的填充部分

  @property(Label)
  label: Label = null; // 显示数字的标签

  private _currentValue: number = 0; // 当前进度
  private _maxValue: number = 10; // 最大值

  start() {
    this.updateProgressBar();
  }

  // 更新进度条
  updateProgressBar() {
    if (this.fill && this.label) {
      // 计算填充比例
      const fillAmount = this._currentValue / this._maxValue;
      this.fill.node
        .getComponent(UITransform)
        .setContentSize(
          this.node.getComponent(UITransform).contentSize.width * fillAmount,
          this.fill.node.getComponent(UITransform).contentSize.height
        );

      // 更新标签显示
      this.label.string = `${this._currentValue}/${this._maxValue}`;
    }
  }

  // 设置当前进度
  setProgress(currentValue: number) {
    this._currentValue = Math.min(currentValue, this._maxValue); // 确保不超过最大值
    this.updateProgressBar();
  }

  // 设置最大值
  setMaxValue(maxValue: number) {
    this._maxValue = maxValue;
    this.updateProgressBar();
  }
}
