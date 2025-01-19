import { Node, AudioSource, AudioClip, resources, director } from "cc";
import { AudioControl } from "./audioControl";

/**
 * @en
 * this is a singleton class for audio play, can be easily called from anywhere in your project.
 * @zh
 * 这是一个用于播放音频的单件类，可以很方便地在项目的任何地方调用。
 */
export class AudioMgr {
  private static _inst: AudioMgr;
  private _audioSource: AudioSource;
  private _isPaused: boolean = false; // 保存暂停状态
  private _currentClip: AudioClip | null = null; // 当前播放的音频
  private _soundEnabled: boolean = true; // 控制音效是否启用
  private _musicEnabled: boolean = true; // 控制背景音乐是否启用

  public static get inst(): AudioMgr {
    if (this._inst == null) {
      this._inst = new AudioMgr();
    }
    return this._inst;
  }

  constructor() {
    //@en create a node as audioMgr
    //@zh 创建一个节点作为 audioMgr
    let audioMgr = new Node();
    audioMgr.name = "__audioMgr__";

    //@en add to the scene.
    //@zh 添加节点到场景
    director.getScene().addChild(audioMgr);

    //@en make it as a persistent node, so it won't be destroyed when scene changes.
    //@zh 标记为常驻节点，这样场景切换的时候就不会被销毁了
    director.addPersistRootNode(audioMgr);

    //@en add AudioSource component to play audios.
    //@zh 添加 AudioSource 组件，用于播放音频。
    this._audioSource = audioMgr.addComponent(AudioSource);
  }

  onSceneChange() {
    // 保存当前的暂停状态
    if (!AudioControl.getInstance().isOn) {
      if (this._audioSource.playing) {
        this._isPaused = false;
        this._currentClip = this._audioSource.clip;
        this._audioSource.stop();
      } else {
        this._isPaused = true;
      }
    }
  }

  public get audioSource() {
    return this._audioSource;
  }

  /**
   * @en
   * play short audio, such as strikes, explosions
   * @zh
   * 播放短音频,比如打击音效，爆炸音效等
   * @param sound clip or url for the audio
   * @param volume
   */
  playOneShot(sound: AudioClip | string, volume: number = 1.0) {
    if (this._soundEnabled) {
      if (sound instanceof AudioClip) {
        this._audioSource.playOneShot(sound, volume);
      } else {
        resources.load(sound, (err, clip: AudioClip) => {
          if (err) {
            console.log(err);
          } else {
            this._audioSource.playOneShot(clip, volume);
          }
        });
      }
    }
  }

  /**
   * @en
   * play long audio, such as the bg music
   * @zh
   * 播放长音频，比如背景音乐
   * @param sound clip or url for the sound
   * @param volume
   */
  play(sound: AudioClip | string, volume: number = 1.0, loop: boolean = true) {
    if (this._musicEnabled) {
      if (sound instanceof AudioClip) {
        this._audioSource.stop();
        this._audioSource.clip = sound;
        this._audioSource.play();
        this._audioSource.loop = true;
        this._audioSource.volume = volume;
      } else {
        this._isPaused = false;
        resources.load(sound, (err, clip: AudioClip) => {
          if (err) {
            console.log(err);
          } else {
            this._audioSource.stop();
            this._audioSource.clip = clip;
            this._currentClip = clip;
            this._audioSource.loop = loop;
            this._audioSource.play();
            this._audioSource.volume = volume;
          }
        });
      }
    }
  }

  /**
   * stop the audio play
   */
  stop() {
    this._audioSource.stop();
    this._isPaused = false;
    this._currentClip = null; // 清除当前音频记录
  }

  /**
   * pause the audio play
   */
  pause() {
    this._audioSource.pause();
    this._isPaused = true;
  }

  /**
   * resume the audio play
   */
  resume() {
    if (this._currentClip) {
      this._audioSource.clip = this._currentClip;
      this._audioSource.play();
      this._audioSource.loop = true;
      this._audioSource.volume = 1.0; // 默认音量为 1.0
      this._isPaused = false;
    }
  }

  getPause() {
    return this._isPaused;
  }

  // 设置音效开关
  set soundEnabled(enabled: boolean) {
    this._soundEnabled = enabled;
    // if (!enabled) {
    //   this._audioSource.stop(); // 停止当前音效
    // }
  }

  // 设置背景音乐开关
  set musicEnabled(enabled: boolean) {
    this._musicEnabled = enabled;
    if (!enabled) {
      this._audioSource.stop(); // 停止背景音乐
    } else if (this._currentClip) {
      this.play(
        this._currentClip,
        this._audioSource.volume,
        this._audioSource.loop
      );
    }
  }

  // 获取音效状态
  get soundEnabled() {
    return this._soundEnabled;
  }

  // 获取背景音乐状态
  get musicEnabled() {
    return this._musicEnabled;
  }
}
