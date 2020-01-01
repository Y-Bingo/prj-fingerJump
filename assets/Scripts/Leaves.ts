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
    dropSpeed: number = 40;

    @property
    moveSpeed: number = 5;

    private _minLeftX: number;
    private _maxLeftX: number;
    private _minRightX: number;
    private _maxRightX: number;

    onLoad() {
        this._setPos();

        this._minLeftX = Math.round( this.left_1.x - this.left_1.width / 3 );
        this._maxLeftX = this.left_1.x;
        this._minRightX = this.right_1.x;
        this._maxRightX = Math.round( this.right_1.x + this.right_1.width / 2 );
    }

    /** 初始化位置 */
    private _setPos(): void {
        this.left_1.y = 0;
        this.left_2.y = this.left_2.height;

        this.right_1.y = 0;
        this.right_2.y = this.right_2.height;
    }

    move( direction: number = 1 ): void {
        this.node.stopAllActions();

        let offY = -this.dropSpeed;
        let offX = direction * this.moveSpeed;
        let leftOffX = offX;
        let rightOffX = offX;
        if ( this.left_1.x + leftOffX >= this._maxLeftX )
            leftOffX = this._maxLeftX - this.left_1.x;
        else if ( this.left_1.x + leftOffX <= this._minLeftX )
            leftOffX = this._minLeftX - this.left_1.x;

        if ( this.right_1.x + rightOffX >= this._maxRightX )
            rightOffX = this._maxRightX - this.right_1.x;
        else if ( this.right_1.x + rightOffX <= this._minRightX )
            rightOffX = this._minRightX - this.right_1.x;

        let call = cc.callFunc( this._connectBg, this );
        let dropLeft_1 = cc.targetedAction( this.left_1, cc.moveBy( 0.5, leftOffX, offY ) );
        let dropLeft_2 = cc.targetedAction( this.left_2, cc.moveBy( 0.5, leftOffX, offY ) );
        let dropRight_1 = cc.targetedAction( this.right_1, cc.moveBy( 0.5, rightOffX, offY ) );
        let dropRight_2 = cc.targetedAction( this.right_2, cc.moveBy( 0.5, rightOffX, offY ) );
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
