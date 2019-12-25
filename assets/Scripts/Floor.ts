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

/** 障碍物距离生成概率 无, 1, 2, 3  */
const P = [ 0.5, 0.2, 0.2, 0.1 ];



@ccclass
export default class Floor extends cc.Component {

    /** 平台 */
    @property( cc.Prefab )
    pb_platForm: cc.Prefab = null;

    /** 概率 */
    private _p: number[] = [];

    onLoad() {
        this._initProportion();


    }

    /** 初始化概率 */
    private _initProportion(): void {
        let len = P.length;
        for ( let i = 0; i < len - 1; i++ ) {
            if ( i - 1 >= 0 )
                this._p[ i ] = this._p[ i - 1 ] + P[ i ];
            else
                this._p[ i ] = P[ i ];
        }
    }

    /** 添加一层 */
    addNextFloor( isBlock: boolean = false ): void {

    }

    /** 添加普通层 */
    private _addNormalFloor(): void {

    }

    /** 添加障碍层 */
    private _addBlockFloor(): void {
        let blockIndex = this._getRandomBlockIndex();

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

    start() {

    }

    update() {

    }
}
