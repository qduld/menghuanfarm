import { _decorator, Component, Graphics, Color } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DashedRectangle")
export class DashedRectangle extends Component {
  @property
  rectWidth: number = 200; // 矩形宽度

  @property
  rectHeight: number = 150; // 矩形高度

  @property
  dashLength: number = 10; // 虚线段的长度

  @property
  gapLength: number = 5; // 虚线段之间的间隔

  @property
  lineColor: Color = new Color(0, 0, 0, 255); // 虚线的颜色

  private graphics: Graphics = null!;

  start() {
    this.graphics = this.node.getComponent(Graphics);
    if (!this.graphics) {
      console.error("Graphics component not found!");
      return;
    }

    this.graphics.strokeColor = this.lineColor; // 设置线条颜色
    this.graphics.lineWidth = 2; // 设置线条宽度
    this.drawDashedRectangle();
  }

  drawDashedRectangle() {
    const g = this.graphics;

    // 起始点
    let x = -this.rectWidth / 2;
    let y = -this.rectHeight / 2;

    // 绘制矩形四边的虚线
    g.clear();
    this.drawDashedLine(x, y, x + this.rectWidth, y); // 上边
    this.drawDashedLine(
      x + this.rectWidth,
      y,
      x + this.rectWidth,
      y + this.rectHeight
    ); // 右边
    this.drawDashedLine(
      x + this.rectWidth,
      y + this.rectHeight,
      x,
      y + this.rectHeight
    ); // 下边
    this.drawDashedLine(x, y + this.rectHeight, x, y); // 左边
    g.stroke();
  }

  drawDashedLine(x1: number, y1: number, x2: number, y2: number) {
    const g = this.graphics;

    // 计算总长度和方向
    const totalLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const dx = (x2 - x1) / totalLength; // 单位向量x
    const dy = (y2 - y1) / totalLength; // 单位向量y

    let drawnLength = 0; // 已绘制的长度
    while (drawnLength < totalLength) {
      // 当前虚线段的起点
      const startX = x1 + dx * drawnLength;
      const startY = y1 + dy * drawnLength;

      // 当前虚线段的终点
      const segmentLength = Math.min(
        this.dashLength,
        totalLength - drawnLength
      );
      const endX = startX + dx * segmentLength;
      const endY = startY + dy * segmentLength;

      // 绘制虚线段
      g.moveTo(startX, startY);
      g.lineTo(endX, endY);

      // 更新已绘制长度（加上虚线段长度和间隔）
      drawnLength += this.dashLength + this.gapLength;
    }
  }
}
