import { _decorator, Component, view, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AdaptiveCanvas")
export class AdaptiveCanvas extends Component {
  start() {
    this.adjustResolution();
  }

  adjustResolution() {
    // 设计分辨率
    const designResolution = view.getDesignResolutionSize();
    // 当前屏幕分辨率
    const frameSize = view.getFrameSize();

    // 获取宽高比
    const designAspectRatio = designResolution.width / designResolution.height;
    const frameAspectRatio = frameSize.width / frameSize.height;

    // 判断是否为宽屏
    if (frameAspectRatio > designAspectRatio) {
      // 当前屏幕更宽，固定宽度，调整高度
      view.setDesignResolutionSize(
        designResolution.width,
        designResolution.width / frameAspectRatio,
        2
      );
    } else {
      // 当前屏幕更高，固定高度，调整宽度
      view.setDesignResolutionSize(
        designResolution.height * frameAspectRatio,
        designResolution.height,
        2
      );
    }

    // 更新场景以应用新的设计分辨率
    director.getScene()?.update();
  }
}
