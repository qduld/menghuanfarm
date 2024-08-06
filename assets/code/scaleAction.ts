import { _decorator, Component, Node, tween, CCInteger, Vec3, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('scaleAction')
export class scaleAction extends Component {
    //节点组
    @property(Node)
    nodes;
    //速度
    @property(CCInteger)
    sleep;
    //放大
    @property(CCFloat)
    scaleMax;
    //缩小
    @property(CCFloat)
    scaleMin;
    @property(Boolean)
    isChild = false;
    start() {
        if (this.isChild) {
            this.nodes.children.forEach(node => {
                let action = tween().target(node)
                    .to(this.sleep, { scale: new Vec3(this.scaleMax, this.scaleMax, 0), position: node.position }, {
                        easing: "smooth"
                    })
                    .to(this.sleep, { scale: new Vec3(this.scaleMin, this.scaleMin, 0), position: node.position }, {
                        easing: "smooth"
                    })
                    ;
                tween().target(node).repeatForever(action).start();
            });
        } else {
            let action = tween().target(this.node)
                .to(this.sleep, { scale: new Vec3(this.scaleMax, this.scaleMax, 0), position: this.node.position }, {
                    easing: "smooth"
                })
                .to(this.sleep, { scale: new Vec3(this.scaleMin, this.scaleMin, 0), position: this.node.position }, {
                    easing: "smooth"
                })
                ;
            tween().target(this.node).repeatForever(action).start();
        }

    }

    update(deltaTime: number) {

    }
}

