/*******************************************************************************
 * 创建: 2024年10月18日
 * 作者: 水煮肉片饭(27185709@qq.com)
 * 描述: 页面适配器，让页面自动适配屏幕尺寸
 *      如果是多场景项目，在每个场景中需要新建一个页面根节点，所有页面内容都是该节点的子节点，将该组件挂到根节点上。
 *      如果是单场景多预制体项目，就挂到页面预制体的根节点，推荐采用该方案
 * 主要会做以下适配：
 *     1、方向适配，根据页面尺寸，自动做横竖屏翻转
 *     2、尺寸适配，根据页面尺寸，自动拉伸到全屏 或 等比缩放
 *     3、坐标适配，将页面在设备窗口居中显示
 *     4、动态适配，如果设备窗口尺寸改变，游戏窗口会根据以上3个原则动态适配
 *******************************************************************************/
import {
  _decorator,
  Node,
  Canvas,
  Camera,
  Component,
  log,
  director,
  Enum,
  tween,
  view,
  Widget,
  Size,
  screen,
  UITransform,
} from "cc";
const { ccclass, property, menu } = _decorator;
const AUTO_ROTATE = true; //是否开启自动旋转
const ROTATE_TIME = 1; //屏幕旋转时长
enum AdapterMode {
  无,
  拉伸全屏,
  等比缩放,
}
@ccclass
@menu("Gi/PageAdapter")
class PageAdapter extends Component {
  @property({ type: Enum(AdapterMode), displayName: "适配模式" })
  adapterMode: AdapterMode = AdapterMode.等比缩放;
  private rootNode: Node = null;
  private cameraNode: Node = null;
  protected onLoad(): void {
    let wgt = this.node.getComponent(Widget);
    wgt && (wgt.enabled = false);
    this.rootNode = director.getScene().getComponentInChildren(Canvas).node;
    this.cameraNode = this.rootNode.getComponentInChildren(Camera).node;
    if (!this.rootNode || !this.cameraNode) {
      log("PageAdapter添加失败！(未找到Canvas或Camera组件)");
      this.destroy();
    }
  }
  protected onEnable(): void {
    this.updateAdapter();
    view.on("canvas-resize", this.updateAdapter, this);
  }
  protected onDisable(): void {
    view.off("canvas-resize", this.updateAdapter, this);
  }
  private updateAdapter(): void {
    let winSize = new Size(
      screen.windowSize.width / view["_scaleX"],
      screen.windowSize.height / view["_scaleY"]
    );
    let ut = this.node.getComponent(UITransform);
    if (AUTO_ROTATE) {
      let designSize = view.getDesignResolutionSize();
      if (ut.width < ut.height === designSize.width < designSize.height) {
        this.cameraNode.angle !== 0 &&
          tween(this.cameraNode)
            .to(ROTATE_TIME, { angle: 0 }, { easing: "expoOut" })
            .start();
      } else {
        [winSize.width, winSize.height] = [winSize.height, winSize.width];
        this.cameraNode.angle !== -90 &&
          tween(this.cameraNode)
            .to(ROTATE_TIME, { angle: -90 }, { easing: "expoOut" })
            .start();
      }
    }
    switch (this.adapterMode) {
      case AdapterMode.拉伸全屏:
        this.rootNode.setScale(
          winSize.width / ut.width,
          winSize.height / ut.height
        );
        this.node.setPosition(
          winSize.width * ut.anchorX,
          winSize.height * ut.anchorY
        );
        break;
      case AdapterMode.等比缩放:
        let scale =
          winSize.width / winSize.height > ut.width / ut.height
            ? winSize.height / ut.height
            : winSize.width / ut.width;
        this.rootNode.setScale(scale, scale);
        this.node.setPosition(ut.width * ut.anchorX, ut.height * ut.anchorY);
        break;
    }
  }
}
declare global {
  namespace gi {
    class PageAdapter extends Component {
      static AdapterMode: typeof AdapterMode;
      adapterMode: AdapterMode;
    }
  }
}
((globalThis as any).gi ||= {}).PageAdapter ||= Object.assign(PageAdapter, {
  AdapterMode: AdapterMode,
});
