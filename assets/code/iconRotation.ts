import { _decorator, Component, Node, Button, tween, v3, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("IconRotation")
export class IconRotation extends Component {
  @property(Node)
  icon: Node = null; // 图标节点

  @property(Button)
  button: Button = null; // 按钮节点

  start() {
    // 为按钮添加点击事件监听
    this.button.node.on("click", this.onButtonClick, this);
  }

  onButtonClick() {
    // 获取当前图标的旋转角度
    const currentRotation = this.icon.eulerAngles.z;

    // 使用 tween 动画进行旋转，从当前角度开始旋转 360 度
    tween(this.icon)
      .to(1, { eulerAngles: new Vec3(0, 0, currentRotation + 360) }) // 从当前角度开始旋转 360 度
      .start();
  }
}
