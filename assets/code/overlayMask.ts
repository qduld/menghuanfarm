import { _decorator, Component, Graphics, Vec2, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("OverlayMask")
export class OverlayMask extends Component {
  private graphics: Graphics | null = null;
  private uiTransform: UITransform;

  onLoad() {
    this.graphics = this.getComponent(Graphics);
    this.drawOverlay();
    // 确保 Mask 节点能阻止事件传播
    this.node.on(Node.EventType.TOUCH_START, this.propagationStopped, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.propagationStopped, this);
    this.node.on(Node.EventType.TOUCH_END, this.propagationStopped, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.propagationStopped, this);
    this.node.on(Node.EventType.MOUSE_DOWN, this.propagationStopped, this);
    this.node.on(Node.EventType.MOUSE_ENTER, this.propagationStopped, this);
    this.node.on(Node.EventType.MOUSE_LEAVE, this.propagationStopped, this);
  }

  propagationStopped(event) {
    // 通过调用 stopPropagation() 阻止事件穿透
    event.propagationStopped = true;
  }

  private drawOverlay() {
    if (this.graphics) {
      this.uiTransform = this.node.getComponent(UITransform);
      this.graphics.clear(); // 清除之前的绘制
      this.graphics.fillColor.set(0, 0, 0, 200); // 设置填充颜色为黑色
      this.graphics.rect(
        -388,
        -724,
        this.uiTransform.contentSize.width + 12,
        this.uiTransform.contentSize.height
      ); // 绘制矩形覆盖整个节点
      this.graphics.fill(); // 填充颜色
    }
  }
}
