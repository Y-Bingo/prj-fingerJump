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
    @property
    dropSpeed: number = 100;


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

    move(): void {
        let call = cc.callFunc( this._connectBg, this );
        let dropLeft_1 = cc.targetedAction( this.left_1, cc.moveBy( 0.3, 0, -this.dropSpeed ) );
        let dropLeft_2 = cc.targetedAction( this.left_2, cc.moveBy( 0.3, 0, -this.dropSpeed ) );
        let dropRight_1 = cc.targetedAction( this.right_1, cc.moveBy( 0.3, 0, -this.dropSpeed ) );
        let dropRight_2 = cc.targetedAction( this.right_2, cc.moveBy( 0.3, 0, -this.dropSpeed ) );
        let spawn = cc.sequence( cc.spawn( dropLeft_1, dropLeft_2, dropRight_2, dropRight_1 ), call );
        this.node.runAction( spawn );
    }

    private _connectBg(): void {
        if ( this.left_1.y <= -this.left_1.height )
            this.left_1.y = this.left_1.height + this.left_2.y;

        if ( this.left_2.y <= -this.left_2.height )
            this.left_2.y = this.left_2.height + this.left_1.y;

        if ( this.right_1.y <= -this.right_1.height )
            this.right_1.y = this.right_1.height + this.right_2.y;

        if ( this.right_2.y <= -this.right_2.height )
            this.right_2.y = this.right_2.height + this.right_1.y;
    }

    update() {
        // this.left_1.y -= this._speed;
        // this.left_2.y -= this._speed;

        // this.right_1.y -= this._speed;
        // this.right_2.y -= this._speed;

        // let offY = this.left_1.height % this.dropSpeed;

    }
}
