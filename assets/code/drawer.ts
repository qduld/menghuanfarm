import {
  _decorator,
  Component,
  Node,
  tween,
  Vec3,
  find,
  Sprite,
  resources,
  SpriteFrame,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("Drawer")
export class Drawer extends Component {
  @property(Node)
  drawer: Node = null!; // 抽屉节点

  @property
  isOpen: boolean = true; // 抽屉状态

  @property(Vec3)
  closedPosition: Vec3 = new Vec3(-300, 0, 0); // 关闭位置

  @property(Vec3)
  openPosition: Vec3 = new Vec3(0, 0, 0); // 打开位置

  toggleDrawer() {
    const drawerBtn = find("MainCanvas/TopContent/Income/Drawer");
    this.isOpen = !this.isOpen;
    const targetPosition = this.isOpen
      ? this.closedPosition
      : this.openPosition;

    if (this.isOpen) {
      resources.load(
        "drawerclose/spriteFrame",
        SpriteFrame,
        (err, spriteFrame) => {
          if (err) {
            console.error("Failed to load sprite:", err);
            return;
          }

          drawerBtn.getChildByName("Sprite").getComponent(Sprite).spriteFrame =
            spriteFrame;
        }
      );
    } else {
      resources.load(
        "drawerexpand/spriteFrame",
        SpriteFrame,
        (err, spriteFrame) => {
          if (err) {
            console.error("Failed to load sprite:", err);
            return;
          }

          drawerBtn.getChildByName("Sprite").getComponent(Sprite).spriteFrame =
            spriteFrame;
        }
      );
    }
    // 使用 tween 实现位置移动
    tween(this.drawer)
      .to(0.3, { position: targetPosition }, { easing: "cubicOut" })
      .start();
  }
}
