import { _decorator, Component, Graphics, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("RoundedRect")
export class RoundedRect extends Component {
  @property
  cornerRadius: number = 15; // 圆角半径

  start() {
    this.drawRoundedRect();
  }

  drawRoundedRect() {
    const graphics = this.getComponent(Graphics);
    if (!graphics) return;

    const width = this.node.getComponent(UITransform).contentSize.width;
    const height = this.node.getComponent(UITransform).contentSize.height;
    const radius = this.cornerRadius;

    graphics.clear();
    graphics.roundRect(0, 0, width, height, radius);
    graphics.fill();
  }
}
