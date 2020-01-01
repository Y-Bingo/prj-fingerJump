import Player from "./Player";
import Floor from "./Floor";
import Leaves from "./Leaves";

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
        if ( this.layer_floor.getComponent( Floor ).checkRightDirection( -1 ) ) {
            this.layer_floor.getComponent( Floor ).move( -1 );
            this.layer_leaves.getComponent( Leaves ).move( -1 );
            this.player.getComponent( Player ).jump( -1 );
        } else {
            if ( this.layer_floor.getComponent( Floor ).checkIsBlock() ) {
            } else {
                // this.layer_floor.getComponent( Floor ).move( -1 );
                // this.layer_leaves.getComponent( Leaves ).move();
                // this.player.getComponent( Player ).jump( -1, true );
            }
            console.dir( "应该跳向【右】边的，却跳【左】边了" );
        }
    }
    private _onRight(): void {
        if ( this.layer_floor.getComponent( Floor ).checkRightDirection( 1 ) ) {
            this.layer_floor.getComponent( Floor ).move( 1 );
            this.layer_leaves.getComponent( Leaves ).move( 1 );
            this.player.getComponent( Player ).jump( 1 );
        } else {
            if ( this.layer_floor.getComponent( Floor ).checkIsBlock() ) {

            } else {
                // this.layer_floor.getComponent( Floor ).move( 1 );
                // this.layer_leaves.getComponent( Leaves ).move();
                // this.player.getComponent( Player ).jump( 1, true );
            }
            console.dir( "应该跳向【左】边的，却跳【右】边了" );
        }
    }

    start() {
        this.player.getComponent( Player ).jump( 1 );
    }

    update( dt ) {

    }
}
