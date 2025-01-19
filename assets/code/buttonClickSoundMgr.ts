import { _decorator, Component, Button, AudioClip } from "cc";
import { AudioMgr } from "./audioManager";

const { ccclass, property } = _decorator;

@ccclass("ButtonClickSoundMgr")
export class ButtonClickSoundMgr extends Component {
  @property(AudioClip)
  clickSound: AudioClip = null;

  onLoad(): void {
    this.node.on("click", this.onButtonClick, this);
  }

  // 统一处理点击音效
  onButtonClick(event) {
    // 如果有配置点击音效，则播放，否则播放默认音效
    if (this.clickSound) {
      AudioMgr.inst.playOneShot(this.clickSound, 1);
    } else {
      AudioMgr.inst.playOneShot("sounds/nomalClick", 1); // 默认点击音效
    }
  }
}
