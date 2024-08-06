System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, tween, CCInteger, Vec3, CCFloat, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, scaleAction;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      tween = _cc.tween;
      CCInteger = _cc.CCInteger;
      Vec3 = _cc.Vec3;
      CCFloat = _cc.CCFloat;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "08626Hd659EUqUjf1nWCufi", "scaleAction", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'tween', 'CCInteger', 'Vec3', 'CCFloat']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("scaleAction", scaleAction = (_dec = ccclass('scaleAction'), _dec2 = property(Node), _dec3 = property(CCInteger), _dec4 = property(CCFloat), _dec5 = property(CCFloat), _dec6 = property(Boolean), _dec(_class = (_class2 = class scaleAction extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "nodes", _descriptor, this);

          _initializerDefineProperty(this, "sleep", _descriptor2, this);

          _initializerDefineProperty(this, "scaleMax", _descriptor3, this);

          _initializerDefineProperty(this, "scaleMin", _descriptor4, this);

          _initializerDefineProperty(this, "isChild", _descriptor5, this);
        }

        start() {
          if (this.isChild) {
            this.nodes.children.forEach(node => {
              let action = tween().target(node).to(this.sleep, {
                scale: new Vec3(this.scaleMax, this.scaleMax, 0),
                position: node.position
              }, {
                easing: "smooth"
              }).to(this.sleep, {
                scale: new Vec3(this.scaleMin, this.scaleMin, 0),
                position: node.position
              }, {
                easing: "smooth"
              });
              tween().target(node).repeatForever(action).start();
            });
          } else {
            let action = tween().target(this.node).to(this.sleep, {
              scale: new Vec3(this.scaleMax, this.scaleMax, 0),
              position: this.node.position
            }, {
              easing: "smooth"
            }).to(this.sleep, {
              scale: new Vec3(this.scaleMin, this.scaleMin, 0),
              position: this.node.position
            }, {
              easing: "smooth"
            });
            tween().target(this.node).repeatForever(action).start();
          }
        }

        update(deltaTime) {}

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "nodes", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "sleep", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scaleMax", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "scaleMin", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "isChild", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=0d5541f1fd3a71e0d0240c5e19547531a0a3f398.js.map