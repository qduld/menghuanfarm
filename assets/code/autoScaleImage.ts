import { _decorator, Component, Node, UITransform, view } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AutoScaleImages")
export class AutoScaleImages extends Component {
  start() {
    this.resizeAllImages(this.node);
  }

  resizeAllImages(parentNode: Node) {
    // 获取屏幕尺寸和设计分辨率的比例
    const designResolution = view.getDesignResolutionSize();
    const frameSize = view.getFrameSize();
    const scaleRatio = Math.min(
      frameSize.width / designResolution.width,
      frameSize.height / designResolution.height
    );

    // 遍历父节点的所有子节点
    parentNode.children.forEach((child) => {
      // 获取子节点的 UITransform 组件
      const uiTransform = child.getComponent(UITransform);
      if (uiTransform) {
        // 调整子节点的大小
        uiTransform.width *= scaleRatio;
        uiTransform.height *= scaleRatio;
      }
      // 如果子节点有子元素，递归调用调整大小
      if (child.children.length > 0) {
        this.resizeAllImages(child);
      }
    });
  }
}
