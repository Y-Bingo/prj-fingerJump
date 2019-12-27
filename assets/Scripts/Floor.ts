const { ccclass, property } = cc._decorator;

import PlatForm, { EFloorType } from "./PlatForm";

/** 障碍物距离生成概率 无, 1, 2, 3  */
const P = [ 0.2, 0.3, 0.3, 0.2 ];

@ccclass
export default class Floor extends cc.Component {

    /** 平台 */
    @property( cc.Prefab )
    pb_platForm: cc.Prefab = null;

    /** 最大平台数 */
    @property
    maxPlatForm: number = 10;


    /** 概率 */
    private _p: number[] = [];

    /** 楼梯 */
    private _stairsQue: cc.Node[];
    /** 障碍 */
    private _blockQue: cc.Node[];

    private _startX: number;    // 开始下落点 X
    private _startY: number;    // 开始下落点 Y
    // private _lastX: number;     // 上一个落梯点 x
    // private _lastY: number;     // 上一个落梯点 y

    protected onLoad() {
        // this._lastX = 0;
        // this._lastY = 0;
        this._startX = 0;
        this._startY = this.pb_platForm.data.height + this.node.height;
        this._blockQue = [];
        this._stairsQue = [];

        this._initProportion();
        this._initPlatProm();
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
        // console.log( P, this._p );
    }

    /** 初始化平台 */
    private _initPlatProm(): void {
        let d = [ 1, -1, 1, -1, 1, -1, 1, -1, -1, 1 ];
        for ( let i = 0; i < this.maxPlatForm; i++ ) {
            this._addBlockPlatForm( d[ i ] );
            this._addNextPlatForm( -d[ i ] );
        }
    }

    /** 添加一层 */
    addNextFloor(): void {
        let direction: number = Math.random() < 0.5 ? -1 : 1;
        this._addBlockPlatForm( direction );
        this._addNextPlatForm( -direction );

        let vc = this._stairsQue[ this._stairsQue.length - 1 ] || cc.v2( 0, 0 );
        console.log( vc.x, vc.y );
    }

    /** 添加普通层 */
    private _addNextPlatForm( direction: number, isAm: boolean = false ): void {
        let platform = cc.instantiate( this.pb_platForm );
        let lastVc = this._stairsQue[ this._stairsQue.length - 1 ] || cc.v2( 0, 0 );
        let fixedX = lastVc.x + direction * platform.width / 2;
        let fixedY = lastVc.y + ( platform.height - 26 );

        platform.zIndex = 0;
        this.node.addChild( platform );
        this._stairsQue.push( platform );

        // this._lastX = fixedX;
        // this._lastY = fixedY;

        if ( !isAm ) {
            platform.x = fixedX;
            platform.y = fixedY;
        } else {
            platform.x = fixedX;
            platform.y = this._startY;
            platform.getComponent( PlatForm ).drop( fixedY );
        }
        // console.log( "floor:", direction, platform.zIndex );
    }

    /** 添加障碍层 */
    private _addBlockPlatForm( direction: number, isAm: boolean = false ): void {
        let blockIndex = this._getRandomBlockIndex();
        if ( blockIndex == EFloorType.NONE ) return;

        let blockType = this._getRandomBlockType();
        let platform = cc.instantiate( this.pb_platForm );
        let lastVc = this._stairsQue[ this._stairsQue.length - 1 ] || cc.v2( 0, 0 );
        let fixedX = lastVc.x + direction * platform.width / 2 * blockIndex;
        let fixedY = lastVc.y + ( platform.height - 26 ) * blockIndex;

        platform.getComponent( PlatForm ).floorType = blockType;
        platform.zIndex = blockIndex * this.maxPlatForm - this._blockQue.length;
        this.node.addChild( platform );
        this._blockQue.push( platform );

        if ( !isAm ) {
            platform.x = fixedX;
            platform.y = fixedY;
        } else {
            platform.x = fixedX;
            platform.y = this._startY;
            platform.getComponent( PlatForm ).drop( fixedY );
        }
        // console.log( "block:", direction, platform.zIndex );
    }

    /** 移动 */
    move( direction: number ): void {
        let numStairs = this._stairsQue.length;
        let actionArr = [];
        for ( let i = numStairs - 1; i >= 0; i-- ) {
            actionArr.push( this._stairsQue[ i ].getComponent( PlatForm ).move( direction ) );
        }

        let numBlock = this._blockQue.length;
        for ( let i = numBlock - 1; i >= 0; i-- ) {
            actionArr.push( this._blockQue[ i ].getComponent( PlatForm ).move( direction ) );
        }

        let finished = cc.callFunc( this.addNextFloor, this );
        this.node.runAction( cc.sequence( cc.spawn( actionArr ), finished ) );
    }

    removePlatForm(): void {

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
