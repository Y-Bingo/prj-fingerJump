window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Floor: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "241fdWVvBlPl7ZPQSgSbZZE", "Floor");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Stair_1 = require("./Stair");
    var Floor = function(_super) {
      __extends(Floor, _super);
      function Floor() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.view = null;
        _this.player = null;
        _this.stairBox = null;
        _this._isLoad = false;
        return _this;
      }
      Floor.prototype.onLoad = function() {
        this._model = cc.find("Game/Model").getComponent("Model");
        this._stepX = this._model.getStepX();
        this._stepY = this._model.getStepY();
        this._originX = this.view.x;
        this._originY = this.view.y;
        this.lastX = 0;
        this.lastY = 0;
        this._blockQue = [];
        this._stairsQue = [];
        this._initPlatProm();
      };
      Floor.prototype.onStart = function() {
        if (this._isLoad) return;
        this._removeAllPlatform();
        this.lastY = 0;
        this.lastX = 0;
        this._blockQue.length = 0;
        this._stairsQue.length = 0;
        this.view.x = 0;
        this.view.y = -318;
        this._initPlatProm();
      };
      Floor.prototype.onEnd = function() {
        this._isLoad = false;
        this.view.stopAllActions();
      };
      Floor.prototype._initPlatProm = function() {
        var direction;
        for (var i = 0; i < this._model.maxStairNum; i++) {
          direction = this._model.addNext();
          this._addBlockPlatForm(-direction);
          this._addNextPlatForm(direction);
        }
        this._sortPlatform();
        this._isLoad = true;
      };
      Floor.prototype._addNextFloor = function(sort) {
        void 0 === sort && (sort = true);
        var direction = this._model.addNext();
        this._addBlockPlatForm(-direction, true);
        this._addNextPlatForm(direction, true);
        this._sortPlatform();
      };
      Floor.prototype._addNextPlatForm = function(direction, isAm) {
        void 0 === isAm && (isAm = false);
        var platform = this._model.createStair();
        platform.zIndex = 0;
        this.stairBox.addChild(platform);
        this._stairsQue.push(platform);
        this.lastX = Math.round(this.lastX + direction * this._stepX);
        this.lastY = Math.round(this.lastY + this._stepY);
        if (isAm) {
          platform.x = this.lastX;
          platform.y = this.view.height - this.view.y;
          platform.getComponent(Stair_1.default).drop(this.lastX, this.lastY);
        } else {
          platform.x = this.lastX;
          platform.y = this.lastY;
        }
      };
      Floor.prototype._addBlockPlatForm = function(direction, isAm) {
        void 0 === isAm && (isAm = false);
        var blockIndex = this._model.getLastBlockDirection();
        if (0 == blockIndex) return;
        var platform = this._model.createStair(true);
        platform.zIndex = 0;
        this.stairBox.addChild(platform);
        this._blockQue.push(platform);
        var fixedX = Math.round(this.lastX + direction * this._stepX * blockIndex);
        var fixedY = Math.round(this.lastY + this._stepY * blockIndex);
        if (isAm) {
          platform.x = fixedX;
          platform.y = this.view.height - this.view.y;
          platform.getComponent(Stair_1.default).drop(fixedX, fixedY);
        } else {
          platform.x = fixedX;
          platform.y = fixedY;
        }
      };
      Floor.prototype._sortPlatform = function() {
        var stairsLen = this._stairsQue.length;
        var blockLen = this._blockQue.length;
        for (var i = 0; i < stairsLen - 1; i++) this._stairsQue[i].zIndex = stairsLen - i;
        for (var j = 0; j < blockLen - 1; j++) this._blockQue[j].zIndex = stairsLen + blockLen - j;
      };
      Floor.prototype.move = function(direction) {
        this._model.removeFirst();
        var offX = -direction * this._stepX;
        var offY = -this._stepY;
        this.view.runAction(cc.moveBy(.6, cc.v2(offX, offY)));
        this._addNextFloor();
      };
      Floor.prototype.dropStair = function() {
        var minHeight = .5 * -this._stepY;
        var count = 0;
        while (this._stairsQue.length) {
          if (!(this._stairsQue[0].y + this.view.y < this._originY + minHeight)) break;
          var stair = this._stairsQue.shift();
          stair.getComponent(Stair_1.default).fall(this._model.recycleStair.bind(this._model, stair));
          count++;
        }
        while (this._blockQue.length) {
          if (!(this._blockQue[0].y + this.view.y < this._originY + minHeight)) break;
          var block = this._blockQue.shift();
          block.getComponent(Stair_1.default).fall(this._model.recycleStair.bind(this._model, block));
        }
        if (count <= 0) {
          console.log("\u8d85\u65f6\u79fb\u9664");
          this._model.removeFirst();
          if (this._stairsQue.length) {
            var stair = this._stairsQue.shift();
            stair.getComponent(Stair_1.default).fall(this._model.recycleStair.bind(this._model, stair));
            while (this._blockQue.length) {
              if (!(this._blockQue[0].y <= stair.y + 10)) break;
              var block = this._blockQue.shift();
              block.getComponent(Stair_1.default).fall(this._model.recycleStair.bind(this._model, block));
            }
          }
        }
      };
      Floor.prototype._removeAllPlatform = function() {
        while (this.stairBox.childrenCount) this._model.recycleStair(this.stairBox.children[0]);
        this._stairsQue.length = 0;
        this._blockQue.length = 0;
      };
      __decorate([ property(cc.Node) ], Floor.prototype, "view", void 0);
      __decorate([ property(cc.Node) ], Floor.prototype, "player", void 0);
      __decorate([ property(cc.Node) ], Floor.prototype, "stairBox", void 0);
      Floor = __decorate([ ccclass ], Floor);
      return Floor;
    }(cc.Component);
    exports.default = Floor;
    cc._RF.pop();
  }, {
    "./Stair": "Stair"
  } ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c6c09JQeH1EvpxMY8s/+t6F", "Game");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Model_1 = require("./Model");
    var Floor_1 = require("./ui/Floor");
    var Player_1 = require("./ui/Player");
    var Leaves_1 = require("./ui/Leaves");
    var MenuPanel_1 = require("./ui/MenuPanel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var EDirection;
    (function(EDirection) {
      EDirection[EDirection["LEFT"] = -1] = "LEFT";
      EDirection[EDirection["RIGHT"] = 1] = "RIGHT";
    })(EDirection = exports.EDirection || (exports.EDirection = {}));
    var Game = function(_super) {
      __extends(Game, _super);
      function Game() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.model = null;
        _this.view = null;
        _this.leaves = null;
        _this.floor = null;
        _this.player = null;
        _this.menu = null;
        _this._isStart = false;
        _this._isInit = false;
        return _this;
      }
      Game.prototype.onLoad = function() {
        this._isInit = true;
      };
      Game.prototype.onBtnStart = function() {
        this._onGameStart();
      };
      Game.prototype._onGameStart = function() {
        if (!this._isInit) {
          this._isInit = true;
          this.player.onStart();
          this.floor.onStart();
          this.leaves.onStart();
          var direction = this.model.getFirstDirection();
          console.log("jump:", direction);
          this.player.move(direction);
          this.floor.move(direction);
        }
        this.menu.onStart();
        this.view.on(cc.Node.EventType.TOUCH_END, this._onTouch, this);
      };
      Game.prototype._onGameEnd = function() {
        this._isInit = false;
        this._stopClock();
        this.player.onEnd();
        this.floor.onEnd();
        this.model.reset();
        this.menu.onGameEnd();
        this.view.off(cc.Node.EventType.TOUCH_END, this._onTouch, this);
      };
      Game.prototype._startClock = function() {
        if (!this._isStart) {
          this._isStart = true;
          this.schedule(this._onSchedule, .7);
        }
      };
      Game.prototype._stopClock = function() {
        this._isStart = false;
        this.unschedule(this._onSchedule);
      };
      Game.prototype._onSchedule = function() {
        this.floor.dropStair();
        if (this.model.checkPlayerDrop()) {
          this.player.fall();
          this._onGameEnd();
        }
      };
      Game.prototype._onTouch = function(evt) {
        this._startClock();
        evt.getLocationX() <= this.view.width / 2 ? this._onAction(EDirection.LEFT) : this._onAction(EDirection.RIGHT);
      };
      Game.prototype._onAction = function(direction) {
        if (this.model.checkDirection(direction)) {
          this.player.move(direction);
          this.floor.move(direction);
          this.leaves.move(direction);
        } else {
          if (this.model.checkIsBlock()) this.player.move(direction, true); else {
            this.player.move(direction, false, true);
            this.floor.move(direction);
            this.leaves.move(direction);
          }
          this._onGameEnd();
        }
      };
      Game.prototype.start = function() {
        var direction = this.model.getFirstDirection();
        this.player.move(direction);
        this.floor.move(direction);
      };
      __decorate([ property(Model_1.default) ], Game.prototype, "model", void 0);
      __decorate([ property(cc.Node) ], Game.prototype, "view", void 0);
      __decorate([ property(Leaves_1.default) ], Game.prototype, "leaves", void 0);
      __decorate([ property(Floor_1.default) ], Game.prototype, "floor", void 0);
      __decorate([ property(Player_1.default) ], Game.prototype, "player", void 0);
      __decorate([ property(MenuPanel_1.default) ], Game.prototype, "menu", void 0);
      Game = __decorate([ ccclass ], Game);
      return Game;
    }(cc.Component);
    exports.default = Game;
    cc._RF.pop();
  }, {
    "./Model": "Model",
    "./ui/Floor": "Floor",
    "./ui/Leaves": "Leaves",
    "./ui/MenuPanel": "MenuPanel",
    "./ui/Player": "Player"
  } ],
  Leaves: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fd037O1pNRIdrsmPEl84QmC", "Leaves");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Model_1 = require("../Model");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Leaves = function(_super) {
      __extends(Leaves, _super);
      function Leaves() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.left_1 = null;
        _this.left_2 = null;
        _this.right_1 = null;
        _this.right_2 = null;
        return _this;
      }
      Leaves.prototype.onLoad = function() {
        this._setPos();
        this._model = cc.find("Game/Model").getComponent(Model_1.default);
        this._minLeftX = Math.round(this.left_1.x - this.left_1.width / 3);
        this._maxLeftX = this.left_1.x;
        this._minRightX = this.right_1.x;
        this._maxRightX = Math.round(this.right_1.x + this.right_1.width / 2);
      };
      Leaves.prototype.onStart = function() {};
      Leaves.prototype._setPos = function() {
        this.left_1.y = 0;
        this.left_2.y = this.left_2.height;
        this.right_1.y = 0;
        this.right_2.y = this.right_2.height;
      };
      Leaves.prototype.move = function(direction) {
        void 0 === direction && (direction = 1);
        this.node.stopAllActions();
        var offY = -this._model.dropSpeed;
        var offX = direction * this._model.moveSpeed;
        var leftOffX = offX;
        var rightOffX = offX;
        this.left_1.x + leftOffX >= this._maxLeftX ? leftOffX = this._maxLeftX - this.left_1.x : this.left_1.x + leftOffX <= this._minLeftX && (leftOffX = this._minLeftX - this.left_1.x);
        this.right_1.x + rightOffX >= this._maxRightX ? rightOffX = this._maxRightX - this.right_1.x : this.right_1.x + rightOffX <= this._minRightX && (rightOffX = this._minRightX - this.right_1.x);
        var call = cc.callFunc(this._connectBg, this);
        var dropLeft_1 = cc.targetedAction(this.left_1, cc.moveBy(.7, leftOffX, offY));
        var dropLeft_2 = cc.targetedAction(this.left_2, cc.moveBy(.7, leftOffX, offY));
        var dropRight_1 = cc.targetedAction(this.right_1, cc.moveBy(.7, rightOffX, offY));
        var dropRight_2 = cc.targetedAction(this.right_2, cc.moveBy(.7, rightOffX, offY));
        var spawn = cc.sequence(cc.spawn(dropLeft_1, dropLeft_2, dropRight_2, dropRight_1), call);
        this.node.runAction(spawn);
      };
      Leaves.prototype._connectBg = function() {
        this.left_1.y <= 300 - this.left_1.height && (this.left_1.y = this.left_1.height + this.left_2.y);
        this.left_2.y <= 300 - this.left_2.height && (this.left_2.y = this.left_2.height + this.left_1.y);
        this.right_1.y <= 300 - this.right_1.height && (this.right_1.y = this.right_1.height + this.right_2.y);
        this.right_2.y <= 200 - this.right_2.height && (this.right_2.y = this.right_2.height + this.right_1.y);
      };
      Leaves.prototype.update = function() {};
      __decorate([ property(cc.Node) ], Leaves.prototype, "left_1", void 0);
      __decorate([ property(cc.Node) ], Leaves.prototype, "left_2", void 0);
      __decorate([ property(cc.Node) ], Leaves.prototype, "right_1", void 0);
      __decorate([ property(cc.Node) ], Leaves.prototype, "right_2", void 0);
      Leaves = __decorate([ ccclass ], Leaves);
      return Leaves;
    }(cc.Component);
    exports.default = Leaves;
    cc._RF.pop();
  }, {
    "../Model": "Model"
  } ],
  MenuPanel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ea37aUXWXJNyKCEtAt/pXg1", "MenuPanel");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, property = _a.property, ccclass = _a.ccclass;
    var MenuPanel = function(_super) {
      __extends(MenuPanel, _super);
      function MenuPanel() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.view = null;
        _this.mask = null;
        _this.btn_start = null;
        _this._originY = 0;
        _this._targetY = -1200;
        return _this;
      }
      MenuPanel.prototype.onLoad = function() {
        this._originY = this.view.y;
        this._initUI();
      };
      MenuPanel.prototype._initUI = function() {
        var maskGp = this.mask.getComponent(cc.Graphics);
        maskGp.roundRect(0, 0, this.mask.width, this.mask.height, 50);
        maskGp.fill();
        var btnGp = this.btn_start.getComponentInChildren(cc.Graphics);
        btnGp.roundRect(0, 0, this.btn_start.width, this.btn_start.height, this.btn_start.height / 2);
        btnGp.stroke();
        this._parent = this.view.parent;
      };
      MenuPanel.prototype.onStart = function() {
        console.log("\u70b9\u51fb\u5f00\u59cb\u6e38\u620f");
        cc.tween(this.view).by(.3, {
          y: 1e3
        }).hide().start();
      };
      MenuPanel.prototype.onGameEnd = function() {
        console.log("\u6e38\u620f\u7ed3\u675f");
        cc.tween(this.view).show().to(.3, {
          y: this._originY
        }).start();
      };
      __decorate([ property(cc.Node) ], MenuPanel.prototype, "view", void 0);
      __decorate([ property(cc.Node) ], MenuPanel.prototype, "mask", void 0);
      __decorate([ property(cc.Node) ], MenuPanel.prototype, "btn_start", void 0);
      MenuPanel = __decorate([ ccclass ], MenuPanel);
      return MenuPanel;
    }(cc.Component);
    exports.default = MenuPanel;
    cc._RF.pop();
  }, {} ],
  Model: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "267d5q+y41J8bdVduqVSiPZ", "Model");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Stair_1 = require("./ui/Stair");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Model = function(_super) {
      __extends(Model, _super);
      function Model() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.maxStairNum = 10;
        _this.dropTime = 1;
        _this.dropSpeed = 40;
        _this.moveSpeed = 100;
        _this.stairPrefab = null;
        _this._p = [];
        _this.blockProportion = [];
        _this._dArr = [];
        _this._bArr = [];
        return _this;
      }
      Model.prototype._initProportion = function() {
        var P = this.blockProportion;
        var len = P.length;
        var p = [];
        for (var i = 0; i < len; i++) for (var k = Math.floor(10 * P[i]); k > 0; k--) p.push(i);
        this._p = p;
        this._pool = new cc.NodePool(Stair_1.default);
      };
      Model.prototype.getStepX = function() {
        return this.stairPrefab.data.width / 2;
      };
      Model.prototype.getStepY = function() {
        return this.stairPrefab.data.height - 26;
      };
      Model.prototype.createStair = function(isBlock) {
        void 0 === isBlock && (isBlock = false);
        this._pool || (this._pool = new cc.NodePool(Stair_1.default));
        var blockType = Stair_1.EStairType.NONE;
        isBlock && (blockType = this.getRandomBlockType());
        var stair = this._pool.get();
        stair || (stair = cc.instantiate(this.stairPrefab));
        stair.getComponent(Stair_1.default).stairType = blockType;
        return stair;
      };
      Model.prototype.recycleStair = function(stair) {
        stair.getComponent(Stair_1.default).stairType = Stair_1.EStairType.NONE;
        this._pool.put(stair);
      };
      Model.prototype.getFirstDirection = function() {
        return this._dArr.length && this._dArr[0];
      };
      Model.prototype.getFirstBlockDirection = function() {
        return this._bArr.length && this._bArr[0];
      };
      Model.prototype.getLastBlockDirection = function() {
        return this._bArr.length && this._bArr[this._bArr.length - 1];
      };
      Model.prototype.addNext = function() {
        var nextD = Math.random() < .5 ? -1 : 1;
        this._dArr.push(nextD);
        this._bArr.push(this._getRandomBlockIndex());
        return nextD;
      };
      Model.prototype.removeFirst = function() {
        this._dArr.length && this._dArr.shift();
        this._bArr.length && this._bArr.shift();
      };
      Model.prototype._getRandomBlockIndex = function() {
        this._p.length || this._initProportion();
        var r = Math.floor(Math.random() * this._p.length);
        return this._p[r];
      };
      Model.prototype.getRandomBlockType = function() {
        return Math.ceil(5 * Math.random());
      };
      Model.prototype.checkDirection = function(nextDirection) {
        return this._dArr.length && this._dArr[0] == nextDirection;
      };
      Model.prototype.checkIsBlock = function() {
        return this._bArr.length && 1 == this._bArr[0];
      };
      Model.prototype.checkPlayerDrop = function() {
        return this._dArr.length < this.maxStairNum;
      };
      Model.prototype.reset = function() {
        this._dArr.length = 0;
        this._bArr.length = 0;
      };
      __decorate([ property ], Model.prototype, "maxStairNum", void 0);
      __decorate([ property ], Model.prototype, "dropTime", void 0);
      __decorate([ property ], Model.prototype, "dropSpeed", void 0);
      __decorate([ property ], Model.prototype, "moveSpeed", void 0);
      __decorate([ property(cc.Prefab) ], Model.prototype, "stairPrefab", void 0);
      __decorate([ property([ cc.Float ]) ], Model.prototype, "blockProportion", void 0);
      Model = __decorate([ ccclass ], Model);
      return Model;
    }(cc.Component);
    exports.default = Model;
    cc._RF.pop();
  }, {
    "./ui/Stair": "Stair"
  } ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "db2f6Boz7NLUp6xPrVQPSjX", "Player");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var EAmType;
    (function(EAmType) {
      EAmType["WALK"] = "player_walk";
      EAmType["JUMP"] = "player_jump";
    })(EAmType || (EAmType = {}));
    var Player = function(_super) {
      __extends(Player, _super);
      function Player() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.view = null;
        _this._animation = null;
        _this._direction = 0;
        _this._isFall = false;
        return _this;
      }
      Player.prototype.onLoad = function() {
        this._model = cc.find("Game/Model").getComponent("Model");
        this._stepX = this._model.getStepX();
        this._stepY = this._model.getStepY();
        this.view.zIndex = 100;
        this._animation = this.view.getComponent(cc.Animation);
        this._animation.on("finished", this._onJumpCompleted, this);
      };
      Player.prototype.onStart = function() {
        this.view.x = 0;
        this.view.y = 0;
        this.view.zIndex = 100;
      };
      Player.prototype.onEnd = function() {
        this._animation.getAnimationState(EAmType.WALK).stop();
      };
      Player.prototype.move = function(direction, isBlock, isFall) {
        void 0 === isBlock && (isBlock = false);
        void 0 === isFall && (isFall = false);
        this._isFall = isFall;
        this._turnDirection(direction);
        this._jump();
        isBlock || this.view.runAction(cc.moveBy(.2, this._stepX * direction, this._stepY));
      };
      Player.prototype._jump = function() {
        this._animation.play(EAmType.JUMP);
      };
      Player.prototype.fall = function() {
        this.view.runAction(cc.moveBy(.4, 0, -700));
      };
      Player.prototype._onJumpCompleted = function(amName, amState) {
        if (amState.name !== EAmType.JUMP) return;
        this._isFall ? this.fall() : this._animation.play(EAmType.WALK);
      };
      Player.prototype._turnDirection = function(direction) {
        if (isNaN(direction)) return;
        if (direction == this._direction) return;
        this._direction = direction;
        this.view.scaleX = -direction;
      };
      __decorate([ property(cc.Node) ], Player.prototype, "view", void 0);
      Player = __decorate([ ccclass ], Player);
      return Player;
    }(cc.Component);
    exports.default = Player;
    cc._RF.pop();
  }, {} ],
  Stair: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "26eb7WtYyJNBJp9hZE+pkNt", "Stair");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var EStairType;
    (function(EStairType) {
      EStairType[EStairType["NONE"] = 0] = "NONE";
      EStairType[EStairType["MOCK"] = 1] = "MOCK";
      EStairType[EStairType["BOMB"] = 2] = "BOMB";
      EStairType[EStairType["DIAMOND"] = 3] = "DIAMOND";
      EStairType[EStairType["MUSHROOM"] = 4] = "MUSHROOM";
      EStairType[EStairType["STONE"] = 5] = "STONE";
    })(EStairType = exports.EStairType || (exports.EStairType = {}));
    var Stair = function(_super) {
      __extends(Stair, _super);
      function Stair() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.block = null;
        _this._floorType = -1;
        _this.blockFrameList = [];
        return _this;
      }
      Object.defineProperty(Stair.prototype, "stairType", {
        get: function() {
          return this._floorType;
        },
        set: function(value) {
          if (isNaN(value)) return;
          if (this._floorType == value) return;
          value = Math.max(Math.min(value, EStairType.STONE), EStairType.NONE);
          this._floorType = value;
          this._changeType();
        },
        enumerable: true,
        configurable: true
      });
      Stair.prototype._changeType = function() {
        var sprite = this.block.getComponent(cc.Sprite);
        sprite.spriteFrame = this.blockFrameList[this._floorType];
      };
      Stair.prototype.drop = function(x, y, callback) {
        var drop = cc.moveTo(.3, x, y);
        var call = cc.callFunc(callback || function() {});
        this.node.runAction(cc.sequence(drop, call));
      };
      Stair.prototype.fall = function(callback) {
        var drop = cc.moveBy(.3, 0, -400);
        var call = cc.callFunc(callback || function() {});
        this.node.runAction(cc.sequence(drop, call));
      };
      __decorate([ property(cc.Node) ], Stair.prototype, "block", void 0);
      __decorate([ property ], Stair.prototype, "_floorType", void 0);
      __decorate([ property ], Stair.prototype, "stairType", null);
      __decorate([ property([ cc.SpriteFrame ]) ], Stair.prototype, "blockFrameList", void 0);
      Stair = __decorate([ ccclass ], Stair);
      return Stair;
    }(cc.Component);
    exports.default = Stair;
    cc._RF.pop();
  }, {} ]
}, {}, [ "Game", "Model", "Floor", "Leaves", "MenuPanel", "Player", "Stair" ]);