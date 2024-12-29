import { _decorator, Component, EditBox, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("HideScrollbar")
export class HideScrollbar extends Component {
  @property(EditBox)
  editBox: EditBox = null;

  start() {
    // 监听 EditBox 的 focus 事件
    this.editBox.node.on("editing-did-began", this.onFocusIn, this);
  }

  onFocusIn() {
    let element = window.document.getElementsByTagName("textarea");

    element[0].style["overflow-y"] = "hidden";
  }
}
