// 创建一个Mask组件来实现圆角效果
import {
  _decorator,
  Component,
  Node,
  Sprite,
  Mask,
  Graphics,
  Vec2,
  UITransform,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("RoundedSprite")
export class RoundedSprite extends Component {
  @property(Sprite)
  sprite: Sprite = null;

  @property
  radius: number = 20;

  start() {
    this.createRoundedMask();
    this.node.on(Node.EventType.SIZE_CHANGED, this.onSizeChanged, this);
  }

  onSizeChanged() {
    let maskNode = this.node.getChildByName("RoundedMask");
    if (maskNode) {
      let graphics = maskNode.getComponent(Graphics);
      this.drawRoundedRect(graphics);
    }
  }

  createRoundedMask() {
    let maskNode = new Node("RoundedMask");
    maskNode.setParent(this.node);
    maskNode.setSiblingIndex(0);

    let mask = maskNode.addComponent(Mask);
    mask.type = Mask.Type.GRAPHICS_RECT;

    let graphics = maskNode.addComponent(Graphics);
    this.drawRoundedRect(graphics);

    // 调整sprite节点位置
    this.sprite.node.setParent(maskNode);
  }

  drawRoundedRect(graphics: Graphics) {
    graphics.clear(); // 清空之前的绘制内容
    const uiTransform = this.node.getComponent(UITransform);
    const width = uiTransform.width;
    const height = uiTransform.height;

    graphics.roundRect(-width / 2, -height / 2, width, height, this.radius);
    graphics.fill();
  }

  onDestroy() {
    this.node.off(Node.EventType.SIZE_CHANGED, this.onSizeChanged, this);
  }
}
