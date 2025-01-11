import { _decorator, Component, Graphics, Color, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DrawRoundedRect")
export class DrawRoundedRect extends Component {
  private graphics: Graphics | null = null;

  @property
  rectWidth: number = 0;

  @property
  rectHeight: number = 0;

  @property
  borderRadius: number = 0;

  @property
  borderWidth: number = 0;

  @property({ type: Color })
  fillColor: Color = new Color(255, 255, 255, 255); // 默认填充颜色为白色

  @property({ type: Color })
  strokeColor: Color = new Color(165, 42, 42, 255); // 默认边框颜色为棕色

  @property
  startX: number = 0;

  @property
  startY: number = 0;

  @property
  offsetX: number = 0;

  @property
  offsetY: number = 0;

  @property
  padding: number = 0;

  @property
  alignLeft: boolean = false;

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

    if (!this.alignLeft) {
      this.startX = -this.rectWidth / 2 - this.borderWidth + this.offsetX;
      this.startY = -this.rectHeight / 2 - this.borderWidth + this.offsetY;
    } else {
      this.startX = 0;
      this.startY =
        this.node.position.y - this.rectHeight / 2 + this.borderWidth;
    }

    // 设置填充颜色为白色
    this.graphics.fillColor = this.fillColor;

    // 绘制白色矩形内部
    this.graphics.roundRect(
      this.startX,
      this.startY,
      this.rectWidth,
      this.rectHeight,
      this.borderRadius
    );
    this.graphics.fillColor = this.fillColor; // 设置填充颜色
    this.graphics.fill();

    // 设置边框颜色
    this.graphics.strokeColor = this.strokeColor;
    this.graphics.lineWidth = this.borderWidth; // 设置边框的宽度

    // 绘制边框
    this.graphics.roundRect(
      this.startX - 0.5,
      this.startY - 0.5,
      this.rectWidth,
      this.rectHeight,
      this.borderRadius
    );
    this.graphics.stroke();
  }

  reRender(width) {
    this.rectWidth = width + 2 * this.offsetX + 2 * this.borderWidth;

    if (this.graphics) {
      this.graphics.clear();
      // 调用自定义方法来绘制图形
      this.drawRoundedRect();
    }
  }
}
