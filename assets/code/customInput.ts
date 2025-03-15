import {
  _decorator,
  Component,
  Label,
  RichText,
  Node,
  input,
  Input,
  director,
  Sprite,
  UITransform,
  Graphics,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("CustomInput")
export class CustomInput extends Component {
  @property(Graphics) bgSprite: Graphics = null;
  @property(Label) labelInput: Label = null; // 普通文本
  @property(RichText) richTextInput: RichText = null; // 超出部分变红
  @property(Node) inputArea: Node = null; // 输入框点击区域

  private _text: string = ""; // 存储输入内容
  private _isFocused: boolean = false; // 是否激活输入
  private _inputElement: HTMLTextAreaElement = null; // HTML 输入框
  private _cursorVisible: boolean = true; // 光标是否可见
  private _cursorTimer: number = null; // 光标闪烁定时器
  private _cursorIndex: number = 0; // 光标位置

  onLoad() {
    this.createInputField();
    this.setLabelSize();
    this.inputArea.on(Node.EventType.TOUCH_END, this.onTouch, this);
    this.startCursorBlink(); // 开始光标闪烁
  }

  onDestroy() {
    this.inputArea.off(Node.EventType.TOUCH_END, this.onTouch, this);
    if (this._inputElement && document.body.contains(this._inputElement)) {
      document.body.removeChild(this._inputElement);
    }
    clearInterval(this._cursorTimer);
  }

  setLabelSize() {
    const bgTransform = this.bgSprite.getComponent(UITransform);
    const labelTransform = this.labelInput.node.getComponent(UITransform);
    const richTextTransform = this.richTextInput.node.getComponent(UITransform);

    if (bgTransform && labelTransform && richTextTransform) {
      labelTransform.width = bgTransform.width;
      labelTransform.height = bgTransform.height;

      richTextTransform.width = bgTransform.width;
      richTextTransform.height = bgTransform.height;
    }
  }

  // 创建 HTML 隐藏输入框
  createInputField() {
    this._inputElement = document.createElement("textarea"); // 使用 textarea 适配换行
    const bgTransform = this.bgSprite.getComponent(UITransform);

    if (bgTransform) {
      this._inputElement.style.position = "absolute"; // 绝对定位
      this._inputElement.style.left = "0";
      this._inputElement.style.top = "0";
      this._inputElement.style.width = `${bgTransform.width}px`;
      this._inputElement.style.height = `${bgTransform.height}px`;
    }

    this._inputElement.style.zIndex = "999"; // 确保在最前面
    this._inputElement.style.background = "transparent"; // 透明背景
    this._inputElement.style.border = "none"; // 无边框
    this._inputElement.style.outline = "none"; // 取消焦点高亮
    this._inputElement.style.fontSize = "16px"; // 避免 iOS 缩放
    this._inputElement.style.resize = "none"; // 禁止拉伸
    this._inputElement.style.overflow = "hidden"; // 超出隐藏
    this._inputElement.style.whiteSpace = "pre-wrap"; // 自动换行
    document.body.appendChild(this._inputElement);

    this._inputElement.addEventListener("input", this.onInputChange.bind(this));
    this._inputElement.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  // 点击输入框激活输入
  onTouch() {
    this._isFocused = true;
    this._inputElement.value = this._text; // 同步已有内容
    this._inputElement.focus(); // 让 HTML 输入框获得焦点
  }

  // 监听输入框变化
  onInputChange() {
    const maxLength = 1000; // 最大字符数
    if (this._inputElement.value.length > maxLength) {
      this._text = this._inputElement.value.slice(0, maxLength); // 截断内容
      this._inputElement.value = this._text; // 同步回 textarea
    } else {
      this._text = this._inputElement.value;
    }
    this._cursorIndex = this._text.length; // 光标始终在文本末尾
    this.updateText();
  }

  // 监听键盘事件
  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Backspace") {
      if (this._text.length > 0) {
        this._text = this._text.slice(0, -1);
        this._cursorIndex = this._text.length;
        this.updateText();
      }
    } else if (event.key === "Enter") {
      this._text += "\n"; // 添加换行
      this._cursorIndex = this._text.length;
      this.updateText();
    }
  }

  // 更新显示文本
  updateText() {
    let normalText = this._text.slice(0, 1000);
    let exceededText = this._text.slice(1000);

    // 光标处理
    let cursorChar = this._cursorVisible ? "_" : " ";
    let textWithCursor = normalText + cursorChar;

    this.labelInput.string = normalText;
    this.richTextInput.string =
      textWithCursor + `<color=#FF0000>${exceededText}</color>`;

    // 滚动到光标位置
    setTimeout(() => {
      this._inputElement.scrollLeft = this._inputElement.scrollWidth;
    }, 0);
  }

  // 光标闪烁逻辑
  startCursorBlink() {
    this._cursorTimer = setInterval(() => {
      if (this._isFocused) {
        this._cursorVisible = !this._cursorVisible;
        this.updateText();
      }
    }, 500); // 500ms 闪烁一次
  }
}
