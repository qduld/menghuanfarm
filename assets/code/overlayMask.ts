import {
  _decorator,
  Component,
  Graphics,
  Vec2,
  EventTouch,
  UITransform,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("OverlayMask")
export class OverlayMask extends Component {
  private graphics: Graphics | null = null;
  private uiTransform: UITransform;

  onLoad() {
    // this.node.setSiblingIndex(-999);
    this.graphics = this.getComponent(Graphics);
    this.drawOverlay();
  }

  private drawOverlay() {
    if (this.graphics) {
      this.uiTransform = this.node.getComponent(UITransform);
      this.graphics.clear(); // 清除之前的绘制
      this.graphics.fillColor.set(0, 0, 0, 40); // 设置填充颜色为黑色
      this.graphics.rect(
        -375,
        -667,
        this.uiTransform.contentSize.width,
        this.uiTransform.contentSize.height
      ); // 绘制矩形覆盖整个节点
      this.graphics.fill(); // 填充颜色
    }
  }
}
