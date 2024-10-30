import { _decorator, Component, Graphics, Color } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DrawRoundedRect")
export class DrawRoundedRect extends Component {
  private graphics: Graphics | null = null;

  onLoad() {
    // 获取当前节点的 Graphics 组件
    this.graphics = this.getComponent(Graphics);

    if (this.graphics) {
      // 调用自定义方法来绘制图形
      this.drawRoundedRect();
    }
  }

  drawRoundedRect() {
    if (!this.graphics) return;

    const rectWidth = 200; // 矩形的宽度
    const rectHeight = 100; // 矩形的高度
    const borderRadius = 20; // 圆角半径
    const borderWidth = 5; // 边框宽度

    // 设置填充颜色为白色
    this.graphics.fillColor = Color.WHITE;

    // 绘制白色矩形内部
    this.graphics.roundRect(
      borderWidth,
      borderWidth,
      rectWidth - 2 * borderWidth,
      rectHeight - 2 * borderWidth,
      borderRadius
    );
    this.graphics.fill();

    // 设置边框颜色为棕色
    this.graphics.strokeColor = new Color(139, 69, 19); // 棕色 RGB 值

    // 绘制棕色边框
    this.graphics.lineWidth = borderWidth; // 边框的宽度
    this.graphics.roundRect(0, 0, rectWidth, rectHeight, borderRadius);
    this.graphics.stroke();
  }
}
