import { _decorator, Component, Button, EventTouch } from "cc";
import { AudioMgr } from "./audioManager"; // 引入 AudioMgr 类
import { SwitchButton } from "./switchButton";

const { ccclass, property } = _decorator;

@ccclass("AudioControl")
export class AudioControl extends SwitchButton {
  private static _instance: AudioControl;

  static getInstance(): AudioControl {
    return AudioControl._instance;
  }
  onLoad() {
    AudioControl._instance = this;
    this.isOn = !AudioMgr.inst.getPause();
    this.init();
  }
  protected start(): void {}
  toggleSwitch(event: EventTouch) {
    this.isOn = !this.isOn; // 切换状态
    this.init();

    if (this.isOn) {
      AudioMgr.inst.resume();
    } else {
      AudioMgr.inst.pause();
    }
  }
}
