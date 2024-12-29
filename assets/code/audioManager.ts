import { _decorator, Component, AudioSource, director, log } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioManager")
export class AudioManager extends Component {
  private static _instance: AudioManager | null = null;

  @property({ type: AudioSource })
  bgmAudioSource: AudioSource = null!;

  @property
  isMuted: boolean = true;

  onLoad() {
    if (AudioManager._instance) {
      // 如果实例已存在，则销毁新节点，保留旧实例
      this.destroy();
      return;
    }

    AudioManager._instance = this;
    director.addPersistRootNode(this.node); // 设置为常驻节点

    this.bgmAudioSource.play(); // 播放背景音乐
    this.bgmAudioSource.loop = true; // 循环播放
    this.bgmAudioSource.volume = 2; // 设置音量
    log("AudioManager is initialized and playing music.");
  }

  public static getInstance(): AudioManager {
    return AudioManager._instance!;
  }

  // 切换背景音乐
  public playBackgroundMusic(newAudioClip) {
    this.bgmAudioSource.stop();
    this.bgmAudioSource.clip = newAudioClip;
    this.bgmAudioSource.play();
  }

  setMute() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.bgmAudioSource.volume = 0;
    } else {
      this.bgmAudioSource.volume = 2;
    }
  }
}
