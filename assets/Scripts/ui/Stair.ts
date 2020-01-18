const { ccclass, property } = cc._decorator;

/** 楼梯/障碍物类型 */
export enum EStairType {
    NONE = 0,
    MOCK = 1,
    BOMB = 2,
    DIAMOND = 3,
    MUSHROOM = 4,
    STONE = 5,
}

@ccclass
export default class Stair extends cc.Component {

    /** 障碍物 */
    @property( cc.Node )
    block: cc.Node = null;

    /** 平台类型 */
    @property
    private _floorType: EStairType = -1;

    @property
    get stairType() { return this._floorType; }

    set stairType( value: EStairType ) {
        if ( isNaN( value ) ) return;
        if ( this._floorType == value ) return;
        value = Math.max( Math.min( value, EStairType.STONE ), EStairType.NONE );

        this._floorType = value;
        this._changeType();
    }

    private _changeType(): void {
        let sprite = this.block.getComponent( cc.Sprite );
        sprite.spriteFrame = this.blockFrameList[ this._floorType ];
    }

    /** 图片类型 */
    @property( [ cc.SpriteFrame ] )
    blockFrameList: cc.SpriteFrame[] = [];

    /** 下落 */
    drop( x: number, y: number, callback?: Function ): void {
        let drop = cc.moveTo( 0.3, x, y );
        let call = cc.callFunc( callback || ( () => { } ) );
        this.node.runAction( cc.sequence( drop, call ) );
    }

    /** 坠落 */
    fall( callback?: Function ): void {
        let drop = cc.moveBy( 0.3, 0, -400 );
        let call = cc.callFunc( callback || ( () => { } ) );
        this.node.runAction( cc.sequence( drop, call ) );
    }
}
