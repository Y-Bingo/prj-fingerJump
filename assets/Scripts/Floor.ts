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

    private _lastVc: cc.Vec2;

    onLoad() {
        this._lastVc = new cc.Vec2( 0, 0 );
        this._initProportion();
        this._initPlatProm();
        // let a = cc.instantiate( this.pb_platForm );
        // this.node.addChild( a );
        // a.x = 100;
        // a.y = 100;
    }

    /** 初始化概率 */
    private _initProportion(): void {
        let len = P.length;
        for ( let i = 0;i < len;i++ ) {
            if ( i - 1 >= 0 )
                this._p[ i ] = ( this._p[ i - 1 ] * 10 + P[ i ] * 10 ) / 10;
            else
                this._p[ i ] = P[ i ];
        }
        console.log( P, this._p );
    }

    /** 初始化平台 */
    private _initPlatProm(): void {
        let d = [ 1, -1, 1, -1, 1, -1, 1, -1, -1, 1 ];
        for ( let i = 0;i < this.maxPlatForm;i++ ) {
            let direction: number = Math.random() < 0.5 ? -1 : 1;
            this._addBlockPlatForm( -d[ i ], i );
            this._lastVc = this._addNextPlatForm( d[ i ], i );
        }
    }

    /** 添加一层 */
    addNextFloor( isBlock: boolean = false ): void {

    }

    /** 添加普通层 */
    private _addNextPlatForm( direction: number, index?: number ): cc.Vec2 {
        let platform = cc.instantiate( this.pb_platForm );
        platform.x = this._lastVc.x + direction * platform.width / 2;
        platform.y = this._lastVc.y + ( platform.height - 26 );
        platform.zIndex = 0;
        this.node.addChild( platform );

        console.log( "floor:", direction, platform.zIndex );
        return platform.getPosition();
    }

    /** 添加障碍层 */
    private _addBlockPlatForm( direction: number, index?: number ): void {
        let blockIndex = this._getRandomBlockIndex();
        if ( blockIndex != EFloorType.NONE ) {
            let blockType = this._getRandomBlockType();
            let platform = cc.instantiate( this.pb_platForm );

            platform.getComponent( PlatForm ).floorType = blockType;
            platform.x = this._lastVc.x + direction * platform.width / 2 * blockIndex;
            platform.y = this._lastVc.y + ( platform.height - 26 ) * blockIndex;
            platform.zIndex = blockIndex * this.maxPlatForm - index;
            this.node.addChild( platform );
            console.log( "block:", direction, platform.zIndex );
        }

    }

    removePlatForm(): void {

    }

    /** 获取随机障碍物距离 */
    private _getRandomBlockIndex(): number {
        let r = Math.random();
        for ( let i = 0;i < this._p.length;i++ ) {
            if ( r < this._p[ i ] )
                return i;
        }
        return 0;
    }

    private _getRandomBlockType(): EFloorType {
        return Math.ceil( Math.random() * 5 );
    }

    start() {

    }

    update() {

    }
}
