import { _decorator, Component, Node, find, Layers, UITransform, Sprite, SpriteFrame, resources, Button, EventTouch, Scheduler, instantiate, tween, Label } from 'cc';
import { main } from './main';
import { timer } from './timer';
const { ccclass, property } = _decorator;

@ccclass('genPlant')
export class genPlant extends Component {
    public static _genPlant: genPlant = new genPlant();
    //当前植物种类。播种的时候修改这个属性，6块地种植一样类型的作物
    public addPlants(plantType) {
        const shouhuoQiPao = find("MainCanvas/qipao/time");
        const maps = find("MainCanvas/map").children;
        let shouhuoCount = 0;
        maps.forEach((m, index) => {
            let plants = find("MainCanvas/plant");
            let clone_item = new Node();
            clone_item.layer = Layers.Enum.UI_2D;
            clone_item.setParent(m);
            clone_item.name = plantType.name;
            clone_item.addComponent(UITransform).addComponent(Sprite).addComponent(Button);
            clone_item.getComponent(Button).transition = Button.Transition.SCALE;
            clone_item.setPosition(m.position.x - 10, m.position.y + 112 / 2 - 10, 0);
            clone_item.getComponent(UITransform).setContentSize(89, 112);
            resources.load(plantType.img + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                clone_item.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
                clone_item.getComponent(Sprite).spriteFrame = spriteFrame;
            });
            let shouhuo = new Node();
            shouhuo = instantiate(shouhuoQiPao);
            shouhuo.layer = Layers.Enum.UI_2D;
            shouhuo.setParent(m);
            shouhuo.active = true;
            shouhuo.addComponent(UITransform).addComponent(Button);
            shouhuo.getComponent(UITransform).setContentSize(50, 50);
            shouhuo.setPosition(clone_item.position.x - 70, clone_item.position.y, 0);
            genPlant._genPlant.schedule(() => {
                if (timer.time <= 0) {
                    resources.load(plantType.chengshuImg + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                        clone_item.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
                        clone_item.getComponent(Sprite).spriteFrame = spriteFrame;
                    });
                    shouhuo.getChildByName("txt").getComponent(Label).string = "收获";
                } else {
                    shouhuo.getChildByName("txt").getComponent(Label).string = timer.time + "秒";
                }
            }, 1);

            //收获果实 进背包
            shouhuo.on(Node.EventType.TOUCH_END, () => {
                if (timer.time < 0) {
                    const mySaleBoxItems = find("MainCanvas/popBox/mysalepack/items");
                    if (mySaleBoxItems.children.length > 4) {
                        this.showMsg("果实尚未出售完毕！");
                        return;
                    }
                    //收获6块地的果实只允许入包一次
                    if (clone_item.name === "fanqie") {
                        //场景中默认有4个Node所以从第5个开始属于背包items
                        //并且6个收获按钮都点击后才可以入包
                        if (main.addSalePackCount === 4) {
                            this.showMsg("果实背包已满！");
                            return;
                        }
                        main.addSalePack(10);
                        //收获后需要修改初始化计时器
                        timer.isStart = false;
                    } if (clone_item.name === "pingguo") {
                        if (main.addSalePackCount === 4) {
                            this.showMsg("果实背包已满！");
                            return;
                        }
                        main.addSalePack(11);
                        //收获后需要修改初始化计时器
                        timer.isStart = false;
                    } if (clone_item.name === "qiezi") {
                        if (main.addSalePackCount === 4) {
                            this.showMsg("果实背包已满！");
                            return;
                        }
                        main.addSalePack(12);
                        //收获后需要修改初始化计时器
                        timer.isStart = false;
                    } if (clone_item.name === "huluobo") {
                        if (main.addSalePackCount === 4) {
                            this.showMsg("果实背包已满！");
                            return;
                        }
                        main.addSalePack(13);
                        //收获后需要修改初始化计时器
                        timer.isStart = false;
                    }
                    main.saleBox.active = false;
                    shouhuo.active = false;
                    //收获后 地块移除所有的克隆果实
                    plants.removeChild(clone_item);
                }
            }, this);
            plants.addChild(shouhuo);
            plants.addChild(clone_item);
        });

    }
    //弹消息
    showMsg(msg: string) {
        const msgBox = find("MainCanvas/popBox/msgBox");
        const mg = msgBox.getChildByName("msgTxt").getComponent(Label);
        mg.string = msg;
        msgBox.active = true;
        this.scheduleOnce(function callback() {
            msgBox.active = false;
        }, 1);
    }
}

