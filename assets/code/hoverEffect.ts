import { _decorator, Component, Node } from "cc";
import { IFarmland } from "./interface";
import { Dialog } from "./dialog";
const { ccclass, property } = _decorator;

@ccclass("HoverEffect")
export class HoverEffect extends Component {
  private targetNode: Node = null!; // 要监听 hover 事件的节点
  private targetData: IFarmland;
  private targetLevel: number;

  // 通过方法设置 targetNode
  setTargetNode(node: Node, data, level) {
    this.targetNode = node;
    this.targetData = data;
    this.targetLevel = level;

    // 设置监听事件
    this.targetNode.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    // 设置监听事件
    this.targetNode.on(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
    this.targetNode.on(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
  }

  onMouseEnter() {
    if (this.targetLevel === 3) {
      this.targetNode.getChildByName("Receivehand").active = true;
    }
  }

  onMouseLeave() {
    if (this.targetLevel === 3) {
      this.targetNode.getChildByName("Receivehand").active = false;
    }
  }

  onMouseDown() {
    const dialog = Dialog.getInstance();
    if (dialog) {
      if (this.targetLevel === 0) {
        dialog.showDialog(null, "Bag");
      }
    }
  }

  onDestroy() {
    if (this.targetNode) {
      // 移除事件监听，防止内存泄漏
      this.targetNode.off(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
      this.targetNode.off(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
      this.targetNode.off(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
    }
  }
}
