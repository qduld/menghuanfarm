import {
  _decorator,
  Component,
  Node,
  EventTouch,
  Vec3,
  Color,
  Label,
} from "cc";
import { DrawRoundedRect } from "./drawRoundedRect";
import { boolean } from "@telegram-apps/sdk";
const { ccclass, property } = _decorator;

@ccclass("SwitchButton")
export class SwitchButton extends Component {
  @property(Node)
  slider: Node = null; // 滑块节点

  @property(Node)
  background: Node = null; // 背景节点

  @property
  isOn: boolean = false; // 当前开关状态

  onLoad() {
    this.node.on(Node.EventType.TOUCH_END, this.toggleSwitch, this);
    this.init();
  }

  toggleSwitch(event: EventTouch) {
    this.isOn = !this.isOn; // 切换状态
    this.init();
  }

  init() {
    const drawRoundedRect = this.background.getComponent(
      "DrawRoundedRect"
    ) as DrawRoundedRect;

    if (this.isOn) {
      // 开启状态
      this.slider.setPosition(new Vec3(13, 3, 0)); // 滑块移到右侧
      drawRoundedRect.fillColor = new Color(159, 180, 106);
      this.slider.getChildByName("Label").getComponent(Label).string = "ON";
    } else {
      // 关闭状态
      this.slider.setPosition(new Vec3(-54, 3, 0)); // 滑块移到左侧
      drawRoundedRect.fillColor = new Color(221, 221, 221);
      this.slider.getChildByName("Label").getComponent(Label).string = "OFF";
    }
    drawRoundedRect.onLoad();
  }
}
