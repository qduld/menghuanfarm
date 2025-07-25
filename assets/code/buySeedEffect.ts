import { _decorator, Component, Node } from "cc";
import { IFarmland } from "./interface";
import { Dialog } from "./dialog";
import { BuySeed } from "./buySeed";
import { GlobalData } from "./globalData";
import { i18n } from "./loadData";
const { ccclass } = _decorator;

@ccclass("BuySeedEffect")
export class BuySeedEffect extends Component {
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
    const globalData = GlobalData.getInstance();
    const dialog = Dialog.getInstance();
    const buySeed = BuySeed.getInstance();
    if (dialog) {
      if (this.targetData.unlocked === 0) {
        globalData.setTipsLabel(
          `Unlock seed on ${this.targetData.id}th land unlock`
        );
        return;
      }

      if (this.targetData.price > globalData.userInfo.points_balance) {
        globalData.setTipsLabel(i18n.insufficientCoins);
        return;
      }

      dialog.showDialog(null, "BuySeed");
      dialog.setTargetBuySeed(this.targetData);
      buySeed.updateBuySeedInfo(this.targetData);
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
