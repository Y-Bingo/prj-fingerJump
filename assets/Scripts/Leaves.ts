// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Leaves extends cc.Component {

    /** 左边叶子  1 */
    @property( cc.Node )
    left_1: cc.Node = null;

    /** 左边叶子  2 */
    @property( cc.Node )
    left_2: cc.Node = null;

    /** 右边叶子 1 */
    @property( cc.Node )
    right_1: cc.Node = null;

    /** 右边叶子 2 */
    @property( cc.Node )
    right_2: cc.Node = null;

    /** 下落速度 */
    private _speed: number = 10;

    onLoad() {
        this._setPos();
    }

    /** 初始化位置 */
    private _setPos(): void {
        this.left_1.y = 0;
        this.left_2.y = this.left_2.height;

        this.right_1.y = 0;
        this.right_2.y = this.right_2.height;

    }

    start() {

    }

    update() {
        // this.left_1.y -= this._speed;
        // this.left_2.y -= this._speed;

        // this.right_1.y -= this._speed;
        // this.right_2.y -= this._speed;

        // let offY = this.left_1.height % this._speed;
        // if ( this.left_1.y <= -this.left_1.height )
        //     this.left_1.y = this.left_1.height + this.left_2.y;

        // if ( this.left_2.y <= -this.left_2.height )
        //     this.left_2.y = this.left_2.height + this.left_1.y;

        // if ( this.right_1.y <= -this.right_1.height )
        //     this.right_1.y = this.right_1.height + this.right_2.y;

        // if ( this.right_2.y <= -this.right_2.height )
        //     this.right_2.y = this.right_2.height + this.right_1.y;

    }
}
