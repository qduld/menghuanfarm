import { _decorator, Component, Node, Label, find } from 'cc';
const { ccclass, property } = _decorator;
import {
    param
} from './loadData';
@ccclass('timer')
export class timer extends Component {
    public static time: number = param.levelTime;// 3 * 60;//默认三分钟生长周期
    public static isStart: boolean = false;
    start() {
        if (timer.isStart) {
            this.schedule(function callback() {
                if (timer.time <= 0) {
                    this.node.getComponent(Label).string = ""
                    this.node.parent.active = false;
                }
                else {
                    if (timer.time > 0) {
                        this.node.getComponent(Label).string = "倒计时：" + timer.time + "秒"
                    }
                }
                timer.time--;
            }, 1);
        }
    }
    update(deltaTime: number) {

    }
}

