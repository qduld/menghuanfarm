import {
  _decorator,
  Component,
  Node,
  Vec3,
  view,
  UITransform,
  find,
  instantiate,
} from "cc";
import { Button, Label } from "cc";

const { ccclass, property } = _decorator;

@ccclass("LoadingUI")
export class LoadingUI extends Component {
  @property(Node)
  loadingNode: Node = null; // 引用 Loading 节点

  @property(Label)
  errorLabel: Label = null; // 引用错误提示文本

  @property(Button)
  retryButton: Button = null; // 引用重试按钮

  @property(Node)
  spinnerNode: Node = null; // 引用旋转的 Loading 图标

  private _retryCallback: () => void = null; // 重试回调函数
  private _isRotating: boolean = false; // 是否正在旋转

  /**
   * 加载预制体并初始化组件
   */
  protected onLoad(): void {
    if (!this.loadingNode) return;

    // // 初始化错误提示和重试按钮
    // this.errorLabel = this.loadingNode
    //   .getChildByName("ErrorLabel") // 假设预制体中有一个名为 "ErrorLabel" 的子节点
    //   ?.getComponent(Label);
    // this.retryButton = this.loadingNode
    //   .getChildByName("RetryButton") // 假设预制体中有一个名为 "RetryButton" 的子节点
    //   ?.getComponent(Button);

    if (this.retryButton) {
      this.retryButton.node.active = false; // 默认隐藏重试按钮
      this.retryButton.node.on("click", this._onRetryClick, this); // 绑定点击事件
    }

    // 初始化旋转图标
    this.spinnerNode = this.loadingNode.getChildByName("Spinner"); // 假设预制体中有一个名为 "Spinner" 的子节点
  }

  /**
   * 显示 Loading UI 并居中对齐
   * @param parentNode 可选的父节点（窗口）
   * @param retryCallback 可选的重试回调函数
   */
  public show(retryCallback?: () => void) {
    if (!this.node.getChildByName("LoadingUI")) {
      this.loadingNode = instantiate(this.loadingNode);
      this.node.addChild(this.loadingNode);
      this.spinnerNode = this.loadingNode.getChildByName("Spinner");
    }

    if (!this.loadingNode) return;

    // 居中对齐
    this._centerLoadingNode();

    // 显示 Loading 节点
    this.loadingNode.active = true;

    // 保存重试回调
    this._retryCallback = retryCallback;

    // 隐藏错误提示和重试按钮
    if (this.errorLabel) this.errorLabel.node.active = false;
    if (this.retryButton) this.retryButton.node.active = false;

    // 启动旋转动画
    this._startRotation();
  }

  private _centerLoadingNode() {
    const uiTransform = this.loadingNode.getComponent(UITransform);
    if (!uiTransform) return;

    let referenceSize: Vec3; // 参考尺寸（屏幕或父节点）
    let referencePosition: Vec3; // 参考位置（屏幕或父节点）

    const parentUITransform = this.node.getComponent(UITransform);
    if (!parentUITransform) return;

    referenceSize = new Vec3(
      parentUITransform.width,
      parentUITransform.height,
      0
    );
    referencePosition = new Vec3(0, 0, 0);

    const nodeSize = uiTransform.contentSize; // 获取 Loading 节点的大小

    // 设置 Loading 节点的位置到参考中心
    this.loadingNode.setPosition(
      new Vec3(referencePosition.x, referencePosition.y, 0)
    );
  }

  /**
   * 启动旋转动画
   */
  private _startRotation() {
    if (!this.spinnerNode || this._isRotating) return;

    this._isRotating = true;
    this.schedule(this._updateRotation, 0.016); // 每帧更新旋转角度
  }

  /**
   * 更新旋转角度
   */
  private _updateRotation() {
    if (!this.spinnerNode) return;

    const currentRotation = this.spinnerNode.angle; // 当前旋转角度
    this.spinnerNode.angle = currentRotation - 5; // 每帧增加 5 度
  }

  /**
   * 停止旋转动画
   */
  private _stopRotation() {
    if (!this._isRotating) return;

    this._isRotating = false;
    this.unschedule(this._updateRotation); // 停止更新旋转角度
  }

  /**
   * 显示错误提示
   * @param errorMessage 错误信息
   */
  public showError(errorMessage: string) {
    if (!this.loadingNode) return;

    // 显示错误提示文本
    if (this.errorLabel) {
      this.errorLabel.string = errorMessage;
      this.errorLabel.node.active = true;
    }

    // 显示重试按钮
    if (this.retryButton) {
      this.retryButton.node.active = true;
    }

    // 停止旋转动画
    this._stopRotation();
  }

  /**
   * 处理重试按钮点击事件
   */
  private _onRetryClick() {
    if (this._retryCallback) {
      this._retryCallback(); // 调用重试回调
    }
  }

  /**
   * 隐藏 Loading UI
   */
  public hide() {
    if (this.loadingNode) {
      this.loadingNode.active = false;

      // 隐藏错误提示和重试按钮
      if (this.errorLabel) this.errorLabel.node.active = false;
      if (this.retryButton) this.retryButton.node.active = false;

      // 停止旋转动画
      this._stopRotation();
    }
  }
}
