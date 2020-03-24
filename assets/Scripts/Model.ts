import Stair, { EStairType } from "./ui/Stair";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Model extends cc.Component {
    /** 最大平台数 */
    @property
    maxStairNum: number = 10;

    /** 下落时间 */
    @property
    dropTime: number = 1;

    /** 下落速度 */
    @property
    dropSpeed: number = 40;

    @property
    moveSpeed: number = 100;

    /** 平台 */
    @property( cc.Prefab )
    stairPrefab: cc.Prefab = null;

    /** 概率 */
    /** 障碍物距离生成概率 无, 1, 2, 3  */
    private _p: number[] = [];
    @property( [ cc.Float ] )
    blockProportion: number[] = [];

    private _initProportion(): void {
        let P = this.blockProportion;
        let len = P.length;
        let p = [];
        for ( let i = 0; i < len; i++ )
            for ( let k = Math.floor( P[ i ] * 10 ); k > 0; k-- )
                p.push( i );
        this._p = p;

        this._pool = new cc.NodePool( Stair );
        // for( let i = 0 ; i < 30; i++ ) {
        //     this._pool.put( cc.instantiate( this.stairPrefab ) );
        // }
    }

    getStepX(): number {
        return this.stairPrefab.data.width / 2;
    }

    getStepY(): number {
        return this.stairPrefab.data.height - 26;
    }

    private _pool: cc.NodePool;
    /** 创建 */
    createStair( isBlock: boolean = false ): cc.Node {
        if ( !this._pool )
            this._pool = new cc.NodePool( Stair );

        let blockType: EStairType = EStairType.NONE;
        if ( isBlock )
            blockType = this.getRandomBlockType();

        let stair = this._pool.get();
        if ( !stair )
            stair = cc.instantiate( this.stairPrefab );

        stair.getComponent( Stair ).stairType = blockType;

        // console.log( `创建【${ this._pool.size() }】` );
        return stair;
    }

    /** 回收 */
    recycleStair( stair: cc.Node ): void {
        stair.getComponent( Stair ).stairType = EStairType.NONE;
        this._pool.put( stair );
        // console.log( `回收【${ this._pool.size() }】:`, stair );
    }

    // 落梯管理
    private _dArr: number[] = [];        // 方向管理
    private _bArr: number[] = [];        // 障碍管理
    getFirstDirection(): number {
        return this._dArr.length && this._dArr[ 0 ];
    }

    getFirstBlockDirection(): number {
        return this._bArr.length && this._bArr[ 0 ];
    }

    getLastBlockDirection(): number {
        return this._bArr.length && this._bArr[ this._bArr.length - 1 ];
    }

    addNext(): number {
        let nextD = Math.random() < 0.5 ? -1 : 1;
        this._dArr.push( nextD );
        this._bArr.push( this._getRandomBlockIndex() );

        // console.log( "dArr:", this._dArr.join( "," ) );
        // console.log( "bArr:", this._bArr.join( "," ) );
        return nextD;
    }

    removeFirst(): void {
        if ( this._dArr.length )
            this._dArr.shift();
        if ( this._bArr.length )
            this._bArr.shift();
    }

    /** 获取随机障碍物距离 */
    private _getRandomBlockIndex(): number {
        if ( !this._p.length ) this._initProportion();
        let r = Math.floor( Math.random() * this._p.length );
        return this._p[ r ];
    }

    /** 获取障碍类型 */
    getRandomBlockType(): EStairType {
        return Math.ceil( Math.random() * 5 );
    }

    /** 检查是否为正确方向 */
    checkDirection( nextDirection: number ): boolean {
        return this._dArr.length && this._dArr[ 0 ] == nextDirection;
    }

    /** 检查是否被阻挡 */
    checkIsBlock(): boolean {
        return this._bArr.length && this._bArr[ 0 ] == 1;
    }

    checkPlayerDrop(): boolean {
        return this._dArr.length < this.maxStairNum;
    }

    /**重置数据 */
    reset(): void {
        this._dArr.length = 0;
        this._bArr.length = 0;
    }
}