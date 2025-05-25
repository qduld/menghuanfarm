import {
  _decorator,
  Component,
  Node,
  RichText,
  Graphics,
  ScrollView,
  UITransform,
  Input,
  Color,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("CustomInputBox")
export class CustomInputBox extends Component {
  @property(RichText) richText: RichText = null!;
  @property(Node) placeHolder: Node = null!;
  @property(Graphics) cursor: Graphics = null!;
  @property(ScrollView) scrollView: ScrollView = null!;

  private content: string = "";
  private maxLength: number = 1000;
  private isFocused: boolean = false;
  private cursorInterval: number = 0;
  private totalLines: number = 0;
  private inputElement: HTMLTextAreaElement | null = null;
  private isComposing: boolean = false;
  private updateTimer: number | null = null;

  onLoad() {
    this.richText.maxWidth = 570;
    this.richText.lineHeight = 36;
    this.placeHolder.active = true;
    this.cursor.node.active = false;
    this.node.on(Input.EventType.TOUCH_END, this.onFocus, this);
    this.scrollView.vertical = true;

    // 初始化光标样式 [[6]]
    this.cursor.lineWidth = 3;
    this.cursor.strokeColor = new Color("#00FF00");
  }

  onDestroy() {
    clearInterval(this.cursorInterval);
    this.removeInputElement();
    if (this.updateTimer) clearTimeout(this.updateTimer);
  }

  private onFocus() {
    if (this.isFocused) return;
    this.isFocused = true;
    this.placeHolder.active = false;
    this.createInputElement();
    this.startCursorBlink();
  }

  private onBlur() {
    this.isFocused = false;
    this.placeHolder.active = this.content.length === 0;
    this.removeInputElement();
    this.cursor.node.active = false;
  }

  private createInputElement() {
    this.inputElement = document.createElement("textarea");
    this.inputElement.style.position = "absolute";
    this.inputElement.style.opacity = "0";
    this.inputElement.style.left = "0px";
    this.inputElement.style.top = "0px";
    this.inputElement.style.width = "100%";
    this.inputElement.style.height = "100%";
    this.inputElement.style.zIndex = "-1";
    document.body.appendChild(this.inputElement);
    this.inputElement.focus();
    this.inputElement.value = this.content;

    this.inputElement.addEventListener("input", this.onInput.bind(this));
    this.inputElement.addEventListener(
      "compositionstart",
      () => (this.isComposing = true)
    );
    this.inputElement.addEventListener("compositionend", () => {
      this.isComposing = false;
      this.onInput();
    });
    this.inputElement.addEventListener("blur", this.onBlur.bind(this));
  }

  private removeInputElement() {
    if (!this.inputElement) return;
    this.inputElement.removeEventListener("input", this.onInput);
    this.inputElement.removeEventListener("compositionstart", () => {});
    this.inputElement.removeEventListener("compositionend", () => {});
    this.inputElement.removeEventListener("blur", this.onBlur);
    document.body.removeChild(this.inputElement);
    this.inputElement = null;
  }

  private onInput() {
    if (this.isComposing || !this.inputElement) return;
    this.content = this.inputElement.value;

    // 防抖更新（约60FPS）[[9]]
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => this.updateRichText(), 16);
  }

  private updateRichText() {
    const defaultColor = "#653B27";
    const validText = this.content
      .substring(0, this.maxLength)
      .replace(/\n/g, "");
    const overflowText = this.content
      .substring(this.maxLength)
      .replace(/\n/g, "");

    this.richText.string =
      `<color=${defaultColor}>${validText}</color>` +
      `<color=#ff0000>${overflowText}</color>`;

    this.calculateTotalLinesByCanvas(this.richText.string, 530);
    this.scheduleOnce(() => {
      const textHeight = 45.1 * this.totalLines;
      this.richText.node
        .getComponent(UITransform)!
        .setContentSize(570, textHeight);
      this.adjustScrollViewHeight();
      this.updateCursor();
    }, 0.1);
  }

  private calculateTotalLinesByCanvas(text: string, maxWidth: number) {
    const offscreenCanvas = document.createElement("canvas");
    const ctx = offscreenCanvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    ctx.font = `${this.richText.fontSize}px ${this.richText.fontFamily}`;
    let currentLineWidth = 0;
    this.totalLines = 1;
    const plainText = this.extractPlainText(text);

    for (const char of plainText) {
      currentLineWidth += ctx.measureText(char).width;
      if (currentLineWidth > maxWidth) {
        this.totalLines++;
        currentLineWidth = ctx.measureText(char).width;
      }
    }
  }

  private extractPlainText(richText: string): string {
    return richText.replace(/<[^>]+>/g, "");
  }

  private updateCursor() {
    const offscreenCanvas = document.createElement("canvas");
    const ctx = offscreenCanvas.getContext("2d");
    if (!ctx) return;

    ctx.font = `${this.richText.fontSize}px ${this.richText.fontFamily}`;
    const lines = this.content.split("\n");
    const lastLine = lines[lines.length - 1];
    const lastLineWidth = ctx.measureText(lastLine).width;

    this.cursor.node.setPosition(
      lastLineWidth + 5,
      -this.richText.node.getComponent(UITransform).height / 2
    );
    this.cursor.node.active = true;
  }

  private adjustScrollViewHeight() {
    if (this.totalLines > 100) return; // 性能保护 [[9]]

    const contentTransform = this.scrollView.node
      .getChildByName("view")
      ?.getChildByName("content")
      ?.getComponent(UITransform);

    if (contentTransform) {
      contentTransform.height = Math.max(
        45.1 * this.totalLines + 20,
        this.scrollView.node.getComponent(UITransform)!.height
      );
    }
  }

  private startCursorBlink() {
    clearInterval(this.cursorInterval);
    this.cursorInterval = setInterval(() => {
      this.cursor.node.active = !this.cursor.node.active;
    }, 500);
  }
}
