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

/** 楼梯/障碍物类型 */
enum EFloorType {
    NONE = 0,
    MOCK = 1,
    BOMB = 2,
    DIAMOND = 3,
    MUSHROOM = 4,
    STONE = 5,
}

@ccclass
export default class PlatForm extends cc.Component {

    /** 障碍物 */
    @property( cc.Node )
    block: cc.Node = null;

    /** 平台类型 */
    @property
    private _floorType: EFloorType = EFloorType.NONE;

    @property
    get floorType() { return this._floorType; }

    set floorType( value: EFloorType ) {
        if ( isNaN( value ) ) return;
        if ( this._floorType == value ) return;
        value = Math.max( Math.min( value, EFloorType.NONE ), EFloorType.STONE );

        this._floorType = value;
        this._changeType();
    }

    private _changeType(): void {
        let sprite = this.block.getComponent( "Sprite" ) as cc.Sprite;
        // sprite.spriteFrame = sprite.
    }
}
