import { _decorator, Component, Node } from "cc";
import { IFarmland } from "./interface";
import { Dialog } from "./dialog";
import { GenBlock } from "./genBlock";
const { ccclass } = _decorator;

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
    this.targetNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
    // this.targetNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.targetNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onMouseEnter() {
    if (this.targetLevel === 3) {
      this.targetNode.getChildByName("Receivehand").active = true;
    } else {
      this.targetNode.getChildByName("Receivehand").active = false;
    }
  }

  onMouseLeave() {
    this.targetNode.getChildByName("Receivehand").active = false;
  }

  onMouseDown() {
    const genBlock = GenBlock.getInstance();
    const dialog = Dialog.getInstance();
    if (this.targetLevel === 3) {
      genBlock.harvestFarmland(this.targetData.id);
    }
    if (dialog) {
      if (this.targetLevel === 0) {
        dialog.showDialog(null, "Bag");
        dialog.setTargetBlock(this.targetNode.parent, this.targetData);
      }
    }
  }

  // onTouchMove() {
  //   if (this.targetLevel === 3) {
  //     this.targetNode.getChildByName("Receivehand").active = true;
  //   }
  // }

  onTouchStart() {
    const genBlock = GenBlock.getInstance();
    const dialog = Dialog.getInstance();
    if (this.targetLevel === 3) {
      this.targetNode.getChildByName("Receivehand").active = true;
      genBlock.harvestFarmland(this.targetData.id);
    }
    if (dialog) {
      if (this.targetLevel === 0) {
        dialog.showDialog(null, "Bag");
        dialog.setTargetBlock(this.targetNode.parent, this.targetData);
      }
    }
  }

  onTouchEnd() {
    this.targetNode.getChildByName("Receivehand").active = false;
  }

  // onDestroy() {
  //   if (this.targetNode) {
  //     // 移除事件监听，防止内存泄漏
  //     this.targetNode.off(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
  //     this.targetNode.off(Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
  //     this.targetNode.off(Node.EventType.MOUSE_LEAVE, this.onMouseLeave, this);
  //     this.targetNode.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
  //     // this.targetNode.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
  //     this.targetNode.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
  //   }
  // }
}
