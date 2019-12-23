// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    /** 星星预制体 */
    @property( cc.Prefab )
    starPrefab: cc.Prefab = null;

    /** 背景  */
    @property( cc.Node )
    background: cc.Node = null;

    /** 地面 */
    @property( cc.Node )
    ground: cc.Node = null;

    /**分数显示 */
    @property( cc.Label )
    scoreDisplay: cc.Label = null;

    /** 音效 */
    @property( { type: cc.AudioClip } )
    scoreAudio: cc.AudioClip = null;

    /** 主角 */
    @property( cc.Node )
    player: cc.Node = null;

    /** 星星产生的最大随机范围 */
    @property( cc.Integer )
    maxStarDuration: number = 0;
    /** 星星产生的最小随机范围 */
    @property( cc.Integer )
    minStarDuration: number = 0;

    private _groundY: number = 0;      // 地面高度
    private _score: number = 0;        // 分数
    timer: number = 0;        // 计时器
    starDuration: number = 0; // 星星持续时间

    protected onLoad() {
        this._groundY = this.ground.y + this.ground.height / 2;

        this._score = 0;
        this.timer = 0;
        this.starDuration = 0;

        // 生成一个新的星星
        this.spanNewStar();
    }

    spanNewStar(): void {
        // 使用给定的模版在场景中生成一个新的节点
        let newStar = cc.instantiate( this.starPrefab );
        // 将增的节点添加到Canvas节点下面
        this.node.addChild( newStar );

        // 设置一个随机位置
        newStar.setPosition( this._getNewStarPos() );
        newStar.getComponent( "Star" ).init( this );

        this.starDuration = this.minStarDuration + Math.random() * ( this.maxStarDuration - this.minStarDuration );
        this.timer = 0;
    }

    /** 获取随机星星位置 */
    private _getNewStarPos(): cc.Vec2 {
        let randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的y坐标
        let randY = this._groundY + Math.random() * this.player.getComponent( "Player" ).jumpHeight + 45;
        let maxX = this.node.width / 2;
        randX = ( Math.random() - 0.5 ) * 2 * maxX;

        return cc.v2( randX, randY );
    }

    protected update( dt: number ) {
        if ( this.timer > this.starDuration ) {
            this._gameOver();
            return;
        }
        this.timer += dt;
    }

    private _gameOver(): void {
        this.player.stopAllActions();
        cc.director.loadScene( 'Game' );
    }

    gainScore(): void {
        this._score++;
        this.scoreDisplay.string = "Score: " + this._score;

        // 播放音效
        cc.audioEngine.play( this.scoreAudio as any, false, 1 );
    }
}
