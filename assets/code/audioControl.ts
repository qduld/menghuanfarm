import { _decorator, Component, Button, EventTouch } from "cc";
import { AudioMgr } from "./audioManager"; // 引入 AudioMgr 类
import { SwitchButton } from "./switchButton";
import { GlobalData } from "./globalData";

const { ccclass, property } = _decorator;

@ccclass("AudioControl")
export class AudioControl extends SwitchButton {
  private static _instance: AudioControl;

  static getInstance(): AudioControl {
    return AudioControl._instance;
  }
  onLoad() {
    const globalData = GlobalData.getInstance();
    AudioControl._instance = this;
    this.isOn = globalData.bgmIsOn;
    this.init();
  }
  protected start(): void {}
  toggleSwitch(event: EventTouch) {
    const globalData = GlobalData.getInstance();
    globalData.bgmIsOn = !globalData.bgmIsOn;
    this.isOn = !this.isOn; // 切换状态
    this.init();

    AudioMgr.inst.musicEnabled = !AudioMgr.inst.musicEnabled;

    if (this.isOn) {
      AudioMgr.inst.resume();
    } else {
      AudioMgr.inst.pause();
    }
  }
}
