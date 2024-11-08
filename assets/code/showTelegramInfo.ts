import { _decorator, Component, find, Label, Node } from "cc";

const { ccclass, property } = _decorator;

@ccclass("ShowTelegramInfo")
export class ShowTelegramInfo extends Component {
  @property(Label)
  label: Node = null; // 将 Label 组件拖拽到这个属性中

  start() {
    // 获取 window.Telegram 对象
    // const telegramInfo = JSON.stringify(
    //   window.Telegram.WebApp.initDataUnsafe,
    //   null,
    //   2
    // ); // 格式化显示对象内容
    // this.label = find("MainCanvas/TelgramInfo");
    // // 将 `window.Telegram` 的内容显示到 Label 上
    // this.label.getComponent(Label).string = `Telegram Info:\n${telegramInfo}`;
  }
}
