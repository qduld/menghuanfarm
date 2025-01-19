import { _decorator, Component, Button, EventTouch } from "cc";
import { AudioMgr } from "./audioManager"; // 引入 AudioMgr 类
import { SwitchButton } from "./switchButton";
import { GlobalData } from "./globalData";

const { ccclass, property } = _decorator;

@ccclass("SoundControl")
export class SoundControl extends SwitchButton {
  private static _instance: SoundControl;

  static getInstance(): SoundControl {
    return SoundControl._instance;
  }
  onLoad() {
    const globalData = GlobalData.getInstance();
    SoundControl._instance = this;
    this.isOn = globalData.soundIsEnable;
    this.init();
  }
  protected start(): void {}
  toggleSwitch(event: EventTouch) {
    const globalData = GlobalData.getInstance();
    globalData.soundIsEnable = !globalData.soundIsEnable;
    this.isOn = !this.isOn; // 切换状态
    this.init();

    AudioMgr.inst.soundEnabled = !AudioMgr.inst.soundEnabled;
  }
}
