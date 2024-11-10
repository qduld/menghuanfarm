import {
  _decorator,
  Component,
  Node,
  tween,
  CCInteger,
  Vec3,
  CCFloat,
  find,
  EventTouch,
  instantiate,
  Layers,
  resources,
  Sprite,
  SpriteFrame,
  UITransform,
  Label,
  director,
  Scene,
  sys,
  assetManager,
  AudioClip,
  AudioSource,
} from "cc";
import { Login } from "./login";
import { GenBlock } from "./genBlock";

const { ccclass, property } = _decorator;
@ccclass("Dialog")
export class Dialog extends Component {
  @property(Node)
  bagBox: Node = null; // bag

  @property(Node)
  shopBox: Node = null; // shop

  @property(Node)
  lockBlockBox: Node = null; // lockBlock

  @property(Node)
  overlayMask: Node = null; // overlayMask

  private static _instance: Dialog;

  static getInstance(): Dialog {
    return Dialog._instance;
  }

  protected onLoad(): void {
    Dialog._instance = this;

    this.bagBox = find("popBox/Canvas/Bag");
    this.shopBox = find("popBox/Canvas/Shop");
    this.lockBlockBox = find("popBox/Canvas/LockBlock");
    this.overlayMask = find("popBox/Canvas/OverlayMask");

    this.bagBox.active = false;
    this.shopBox.active = false;
    this.lockBlockBox.active = false;
    this.overlayMask.active = false;
  }
  showDialog(event: EventTouch, customData) {
    switch (customData) {
      case "Bag":
        this.bagBox.active = true;
        break;
      case "Shop":
        this.shopBox.active = true;
        break;
      case "LockBlock":
        this.lockBlockBox.active = true;
        break;
    }
    this.overlayMask.active = true;
  }
  closeDialog(event: EventTouch, customData) {
    switch (customData) {
      case "Bag":
        this.bagBox.active = false;
        break;
      case "Shop":
        this.shopBox.active = false;
        break;
      case "LockBlock":
        this.lockBlockBox.active = false;
        break;
    }
    this.overlayMask.active = false;
  }
}
