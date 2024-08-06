System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Label, param, _dec, _class, _class2, _crd, ccclass, property, timer;

  function _reportPossibleCrUseOfparam(extras) {
    _reporterNs.report("param", "./loadData", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Label = _cc.Label;
    }, function (_unresolved_2) {
      param = _unresolved_2.param;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1cceaumaSlMwZyKP7yKNFvI", "timer", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'find']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("timer", timer = (_dec = ccclass('timer'), _dec(_class = (_class2 = class timer extends Component {
        // 3 * 60;//默认三分钟生长周期
        start() {
          if (timer.isStart) {
            this.schedule(function callback() {
              if (timer.time <= 0) {
                this.node.getComponent(Label).string = "";
                this.node.parent.active = false;
              } else {
                if (timer.time > 0) {
                  this.node.getComponent(Label).string = "倒计时：" + timer.time + "秒";
                }
              }

              timer.time--;
            }, 1);
          }
        }

        update(deltaTime) {}

      }, _class2.time = (_crd && param === void 0 ? (_reportPossibleCrUseOfparam({
        error: Error()
      }), param) : param).levelTime, _class2.isStart = false, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=57aa3a73746d22d6e6fea20d4c04eb5fca3e2f83.js.map