import { _decorator, Component, Node, EventTouch, Input } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Popup")
export class Popup extends Component {
  onLoad() {
    // 阻止弹窗节点的触摸事件冒泡
    this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  private onTouchStart(event: EventTouch) {
    event.propagationStopped = true; // 阻止事件冒泡
  }

  private onTouchEnd(event: EventTouch) {
    event.propagationStopped = true; // 阻止事件冒泡
  }
}
