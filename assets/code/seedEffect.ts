import { _decorator, Component, Node } from "cc";
import { IFarmland } from "./interface";
import { Dialog } from "./dialog";
import { GenBag } from "./genBag";
const { ccclass } = _decorator;

@ccclass("SeedEffect")
export class SeedEffect extends Component {
  private targetNode: Node = null!; // 要监听 hover 事件的节点
  private targetData: IFarmland;

  // 通过方法设置 targetNode
  setTargetNode(node: Node, data) {
    this.targetNode = node;
    this.targetData = data;

    this.targetNode.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    this.targetNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
  }

  onTouchStart() {
    this.emitEvent();
  }

  onMouseDown() {
    this.emitEvent();
  }

  emitEvent() {
    const dialog = Dialog.getInstance();
    if (dialog) {
      const genBag = GenBag.getInstance();

      dialog.setTargetSeed(this.targetData);
      genBag.farmlandPlant();
    }
  }

  // onDestroy() {
  //   if (this.targetNode) {
  //     // 移除事件监听，防止内存泄漏
  //     this.targetNode.off(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
  //     this.targetNode.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
  //   }
  // }
}
