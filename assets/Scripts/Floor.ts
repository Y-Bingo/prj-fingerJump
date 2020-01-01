const { ccclass, property } = cc._decorator;

import PlatForm, { EFloorType } from "./PlatForm";

/** 障碍物距离生成概率 无, 1, 2, 3  */
const P = [ 0.2, 0.4, 0.2, 0.2 ];

@ccclass
export default class Floor extends cc.Component {

    /** 平台 */
    @property( cc.Prefab )
    pb_platForm: cc.Prefab = null;

    /** 最大平台数 */
    @property
    maxPlatForm: number = 10;

    @property
    dropTime: number = 1;

    /** 概率 */
    private _p: number[] = [];

    /** 楼梯 */
    private _stairsQue: cc.Node[];
    /** 障碍 */
    private _blockQue: cc.Node[];

    private _startX: number;    // 开始下落点 X
    private _startY: number;    // 开始下落点 Y
    lastX: number;     // 上一个落梯点 x
    lastY: number;     // 上一个落梯点 y

    private _stepX: number;
    private _stepY: number;

    private _dArr: number[];        // 方向管理
    private _bArr: number[];        // 障碍管理

    protected onLoad() {

        this._stepX = this.pb_platForm.data.width / 2;
        this._stepY = this.pb_platForm.data.height - 26;

        this._startX = 0;
        this._startY = this.pb_platForm.data.height + this.node.height;

        this.lastY = 0;
        this.lastX = 0;

        this._dArr = [];
        this._bArr = [];
        this._blockQue = [];
        this._stairsQue = [];

        this._initProportion();
        this._initPlatProm();
    }

    /** 检查是否为正确方向 */
    checkRightDirection( nextDirection: number ): boolean {
        return this._dArr[ 0 ] == nextDirection;
    }

    /** 检查是否被阻挡 */
    checkIsBlock(): boolean {
        return this._bArr[ 0 ] == 1;
    }


    /** 初始化概率 */
    private _initProportion(): void {
        let len = P.length;
        for ( let i = 0; i < len; i++ ) {
            if ( i - 1 >= 0 )
                this._p[ i ] = ( this._p[ i - 1 ] * 10 + P[ i ] * 10 ) / 10;
            else
                this._p[ i ] = P[ i ];
        }
    }

    /** 初始化平台 */
    private _initPlatProm(): void {
        // let d = [ 1, -1, 1, -1, 1, -1, 1, -1, -1, 1 ];
        let direction: number;
        for ( let i = 0; i < this.maxPlatForm; i++ ) {
            direction = Math.random() < 0.5 ? -1 : 1;
            // this._dArr.push( direction );
            this._addBlockPlatForm( -direction );
            this._addNextPlatForm( direction );
        }

        this.move( this._dArr[ 0 ] || 1 );
        this._sortPlatform();
    }

    /** 添加一层 */
    private _addNextFloor(): void {

        let direction: number = Math.random() < 0.5 ? -1 : 1;

        this._addBlockPlatForm( -direction, true );
        this._addNextPlatForm( direction, true );

        this._sortPlatform();
    }

    /** 添加普通层 */
    private _addNextPlatForm( direction: number, isAm: boolean = false ): void {
        this._dArr.push( direction );

        let platform = cc.instantiate( this.pb_platForm );
        this.node.addChild( platform );
        this._stairsQue.push( platform );

        this.lastX = Math.round( this.lastX + direction * this._stepX );
        this.lastY = Math.round( this.lastY + this._stepY );

        if ( !isAm ) {
            platform.x = this.lastX;
            platform.y = this.lastY;
        } else {
            platform.x = this.lastX;
            platform.y = this._startY;
            platform.getComponent( PlatForm ).drop( this.lastX, this.lastY );
        }
    }

    /** 添加障碍层 */
    private _addBlockPlatForm( direction: number, isAm: boolean = false ): void {
        let blockIndex = this._getRandomBlockIndex();
        this._bArr.push( blockIndex );
        if ( blockIndex == 0 ) return;

        let blockType = this._getRandomBlockType();
        let platform = cc.instantiate( this.pb_platForm );

        let fixedX = Math.round( this.lastX + direction * this._stepX * blockIndex );
        let fixedY = Math.round( this.lastY + this._stepY * blockIndex );

        platform.getComponent( PlatForm ).floorType = blockType;
        this.node.addChild( platform );
        this._blockQue.push( platform );

        if ( !isAm ) {
            platform.x = fixedX;
            platform.y = fixedY;
        } else {
            platform.x = fixedX;
            platform.y = this._startY;
            platform.getComponent( PlatForm ).drop( fixedX, fixedY );
        }
        // console.log( "block:", direction, blockIndex );
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
        let offX = -direction * this._stepX;
        let offY = -this._stepY;

        this._dArr.shift();
        this._bArr.shift();

        this.lastX = Math.round( this.lastX + offX );
        this.lastY = Math.round( this.lastY + offY );

        let actionArr = [];
        let stairsQue = this._stairsQue;
        for ( let i = stairsQue.length - 1; i >= 0; i-- ) {
            let moveAc = cc.moveBy( 0.35, cc.v2( offX, offY ) );
            actionArr.push( cc.targetedAction( stairsQue[ i ], moveAc ) );
        }

        let blockQue = this._blockQue;
        for ( let i = blockQue.length - 1; i >= 0; i-- ) {
            let moveAc = cc.moveBy( 0.35, cc.v2( offX, offY ) );
            actionArr.push( cc.targetedAction( blockQue[ i ], moveAc ) );
        }

        this.node.runAction( cc.sequence(
            cc.spawn( actionArr ),
            cc.callFunc( this._removePlatForm, this ),
            cc.callFunc( this._addNextFloor, this )
        ) );
    }

    private _removePlatForm(): void {

        let minHeight = -this._stepY * 1.5;

        // 移除楼梯
        while ( this._stairsQue.length ) {
            if ( this._stairsQue[ 0 ].y <= minHeight ) {
                this._stairsQue
                    .shift()
                    .getComponent( PlatForm )
                    .fall();
            } else {
                break;
            }
        }

        // 移除障碍
        while ( this._blockQue.length ) {
            if ( this._blockQue[ 0 ].y <= minHeight ) {
                this._blockQue
                    .shift()
                    .getComponent( PlatForm )
                    .fall();
            } else {
                break;
            }
        }
    }

    /** 获取随机障碍物距离 */
    private _getRandomBlockIndex(): number {
        let r = Math.random();
        for ( let i = 0; i < this._p.length; i++ ) {
            if ( r < this._p[ i ] )
                return i;
        }
        return 0;
    }

    /** 获取障碍类型 */
    private _getRandomBlockType(): EFloorType {
        return Math.ceil( Math.random() * 5 );
    }

    update() {

    }
}
