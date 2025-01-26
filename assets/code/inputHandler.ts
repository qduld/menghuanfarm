import { _decorator, Component, EditBox } from "cc";
import { httpRequest } from "./http";
const { ccclass, property } = _decorator;

@ccclass("InputHandler")
export class InputHandler extends Component {
  @property(EditBox)
  editBox: EditBox = null!; // 引用编辑框组件

  @property
  callback: Function = () => {};

  @property
  callbackThis: object = null;

  @property
  onFocusEvent: Function = () => {};

  start() {
    // 监听编辑框结束输入事件
    let debounceTimeout = null;

    this.editBox.node.on("text-changed", (event) => {
      const inputText = this.editBox.string;

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      debounceTimeout = setTimeout(() => {
        console.log("Debounced Input:", inputText);
        if(!inputText) {
          this.onFocusEvent.bind(this.callbackThis)(event, false);
          return;
        } else {
          this.onFocusEvent.bind(this.callbackThis)(event, true);
        }
        this.callback.bind(this.callbackThis)(inputText); // 在防抖完成后查询后台
      }, 500); // 设置防抖延迟时间（500ms）
    });

    // 监听 EditBox 获得焦点的事件
    this.editBox.node.on("editing-did-began", (event) => {
      this.onFocusEvent.bind(this.callbackThis)(event, true);
    });
  }

  // 编辑框结束输入时的回调
  async onTextChange() {
    const inputText = this.editBox.string;
    console.log("Editing ended, input text:", inputText);

    try {
      const response = await this.callback(inputText);
      console.log("Backend response:", response);
    } catch (error) {
      console.error("Error querying backend:", error);
    }
  }
}
