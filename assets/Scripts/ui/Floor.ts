const { ccclass, property } = cc._decorator;

import Stair, { EStairType } from "./Stair";
import Model from "../Model";


@ccclass
export default class Floor extends cc.Component {

    @property( cc.Node )
    view: cc.Node = null;

    @property( cc.Node )
    player: cc.Node = null;

    /** 楼梯盒子 */
    @property( cc.Node )
    stairBox: cc.Node = null;

    /** 楼梯 */
    private _stairsQue: cc.Node[];
    /** 障碍 */
    private _blockQue: cc.Node[];

    private _originX: number;    // 开始下落点 X
    private _originY: number;    // 开始下落点 Y
    lastX: number;     // 上一个落梯点 x
    lastY: number;     // 上一个落梯点 y

    private _stepX: number;
    private _stepY: number;

    // private _curIndex: number;       // 当前玩家的阶梯
    private _isLoad: boolean = false;// 是否已经加载了 

    // private _p: number[];
    private _model: Model;

    protected onLoad() {
        this._model = cc.find( 'Game/Model' ).getComponent( 'Model' );

        this._stepX = this._model.getStepX();
        this._stepY = this._model.getStepY();

        this._originX = this.view.x;
        this._originY = this.view.y;

        this.lastX = 0;
        this.lastY = 0;

        this._blockQue = [];
        this._stairsQue = [];

        this._initPlatProm();
    }

    /** 游戏开始 */
    onStart(): void {
        if ( this._isLoad ) return;
        this._removeAllPlatform();

        this.lastY = 0;
        this.lastX = 0;

        this._blockQue.length = 0;
        this._stairsQue.length = 0;

        this.view.x = 0;
        this.view.y = -318;

        this._initPlatProm();
    }

    onEnd(): void {
        this._isLoad = false;
        this.view.stopAllActions();
    }

    /** 初始化平台 */
    private _initPlatProm(): void {
        let direction: number;
        for ( let i = 0; i < this._model.maxStairNum; i++ ) {
            direction = this._model.addNext();
            this._addBlockPlatForm( -direction );
            this._addNextPlatForm( direction );
        }
        this._sortPlatform();
        this._isLoad = true;
    }

    /** 添加一层 */
    private _addNextFloor( sort: boolean = true ): void {

        let direction = this._model.addNext();
        this._addBlockPlatForm( -direction, true );
        this._addNextPlatForm( direction, true );

        this._sortPlatform();
    }

    /** 添加普通层 */
    private _addNextPlatForm( direction: number, isAm: boolean = false ): void {

        let platform = this._model.createStair();
        platform.zIndex = 0;
        this.stairBox.addChild( platform );
        this._stairsQue.push( platform );

        this.lastX = Math.round( this.lastX + direction * this._stepX );
        this.lastY = Math.round( this.lastY + this._stepY );

        if ( !isAm ) {
            platform.x = this.lastX;
            platform.y = this.lastY;
        } else {
            platform.x = this.lastX;
            platform.y = this.view.height - this.view.y;
            platform.getComponent( Stair ).drop( this.lastX, this.lastY );
            // platform.getComponent( Stair ).drop( this.lastX, this.lastY, () => { this._stairsQue.push( platform ); } );
        }
    }

    /** 添加障碍层 */
    private _addBlockPlatForm( direction: number, isAm: boolean = false ): void {
        let blockIndex = this._model.getLastBlockDirection();
        if ( blockIndex == 0 ) return;

        let platform = this._model.createStair( true );
        platform.zIndex = 0;
        this.stairBox.addChild( platform );

        this._blockQue.push( platform );

        let fixedX = Math.round( this.lastX + direction * this._stepX * blockIndex );
        let fixedY = Math.round( this.lastY + this._stepY * blockIndex );

        if ( !isAm ) {
            platform.x = fixedX;
            platform.y = fixedY;
        } else {
            platform.x = fixedX;
            platform.y = this.view.height - this.view.y;
            platform.getComponent( Stair ).drop( fixedX, fixedY );
        }
    }

    /** 排序 */
    private _sortPlatform(): void {
        let stairsLen = this._stairsQue.length;
        let blockLen = this._blockQue.length;

        for ( let i = 0; i < stairsLen - 1; i++ )
            this._stairsQue[ i ].zIndex = stairsLen - i;

        for ( let j = 0; j < blockLen - 1; j++ )
            this._blockQue[ j ].zIndex = stairsLen + blockLen - j;
    }

    /** 移动 */
    move( direction: number ): void {
        this._model.removeFirst();

        let offX = -direction * this._stepX;
        let offY = -this._stepY;
        this.view.runAction( cc.moveBy( 0.6, cc.v2( offX, offY ) ) );
        this._addNextFloor();
    }

    /** 掉落楼梯 */
    dropStair() {

        let minHeight = -this._stepY * 0.5;
        // 超出临界值 移除楼梯
        let count = 0;
        while ( this._stairsQue.length ) {
            if ( this._stairsQue[ 0 ].y + this.view.y < this._originY + minHeight ) {
                let stair = this._stairsQue.shift();
                stair.getComponent( Stair ).fall( this._model.recycleStair.bind( this._model, stair ) );
                count++;
            } else {
                break;
            }
        }

        // 超出临界值 移除障碍
        while ( this._blockQue.length ) {
            if ( this._blockQue[ 0 ].y + this.view.y < this._originY + minHeight ) {
                let block = this._blockQue.shift();
                block.getComponent( Stair ).fall( this._model.recycleStair.bind( this._model, block ) );
            } else {
                break;
            }
        }

        if ( count <= 0 ) {
            console.log( "超时移除" );
            this._model.removeFirst();
            if ( this._stairsQue.length ) {
                let stair = this._stairsQue.shift();
                stair.getComponent( Stair ).fall( this._model.recycleStair.bind( this._model, stair ) );

                while ( this._blockQue.length ) {
                    if ( this._blockQue[ 0 ].y <= stair.y + 10 ) {
                        let block = this._blockQue.shift();
                        block.getComponent( Stair ).fall( this._model.recycleStair.bind( this._model, block ) );
                    } else {
                        break;
                    }
                }
            }
        }
    }

    /** 移除所有的平台 */
    private _removeAllPlatform(): void {
        /** 移除所有的楼梯 */
        while ( this.stairBox.childrenCount ) {
            this._model.recycleStair( this.stairBox.children[ 0 ] );
        }
        this._stairsQue.length = 0;
        this._blockQue.length = 0;
    }
}



