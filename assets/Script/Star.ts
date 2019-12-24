// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Game from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Star extends cc.Component {

    /** 碰撞半径 */
    @property
    pickRadius: number = 0;

    /** 游戏对象的引用 */
    private _game: Game = null;

    private _getPlayerDistance(): number {
        // 获取player的位置
        let playerPos = this._game.player.getPosition();

        // 计算两个点的距离
        let dist = this.node.position.sub( playerPos ).mag();

        console.log( dist );
        return dist;
    }

    /** 被捡到了 */
    private _onPick(): void {
        // 当星星被收集时，调用Game脚本中的接口，生成一个新的星星
        this._game.spanNewStar();

        // 积分
        this._game.gainScore();

        // 销毁自身
        this.node.destroy();
    }

    /** 若隐若现 */
    private _flash(): void {
        let alpha: number = 1 - this._game.timer / this._game.starDuration;
        let minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor( alpha * ( 255 - minOpacity ) );
    }

    init( value: Game ): void {
        this._game = value;
    }

    update( dt ) {
        if ( this._getPlayerDistance() < this.pickRadius ) {
            this._onPick();
            return;
        }
        this._flash();
    }
}
