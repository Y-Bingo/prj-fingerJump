import Player from "./Player";
import Floor from "./Floor";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    /** 景物层 */
    @property( cc.Node )
    layer_leaves: cc.Node = null;

    /** 阶梯层 */
    @property( cc.Node )
    layer_floor: cc.Node = null;

    @property( cc.Button )
    leftButton: cc.Button = null;
    @property( cc.Button )
    rightButton: cc.Button = null;

    @property( cc.Node )
    player: cc.Node = null;

    onLoad() {
        this.leftButton.node.on( "click", this._onLeft, this );
        this.rightButton.node.on( "click", this._onRight, this );
    }

    private _onLeft(): void {
        this.player.getComponent( Player ).jump( -1 );
        this.layer_floor.getComponent( Floor ).move( -1 );
    }
    private _onRight(): void {
        this.player.getComponent( Player ).jump( 1 );
        this.layer_floor.getComponent( Floor ).move( 1 );
    }

    start() {

    }

    update( dt ) {

    }
}
