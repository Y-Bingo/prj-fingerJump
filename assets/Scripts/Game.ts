import Player from "./Player";
import Floor from "./Floor";
import Leaves from "./Leaves";
import NotificationCenter from "./NotificationCenter";
import { GameEvent } from "./Constans";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    /** 景物层 */
    @property( cc.Node )
    layer_leaves: cc.Node = null;

    /** 阶梯层 */
    @property( cc.Node )
    layer_floor: cc.Node = null;

    @property( cc.Node )
    player: cc.Node = null;

    private _isStart: boolean = false;
    private _isInit: boolean = false;

    protected onLoad() {
        this._isInit = true;
        NotificationCenter.getIns().on( GameEvent.GAME_START, this._onGameStart, this );
    }

    protected onDestroy() {
        NotificationCenter.getIns().off( GameEvent.GAME_START, this._onGameStart, this );
    }

    private _onGameStart(): void {
        if ( !this._isInit ) {
            this.player.getComponent( Player ).onStart();
            this.layer_floor.getComponent( Floor ).onStart();
            this.layer_leaves.getComponent( Leaves ).onStart();
        }
        this.node.on( cc.Node.EventType.TOUCH_END, this._onTouch, this );
    }

    private _onGameEnd(): void {
        this._isInit = false;
        this._isStart = false;
        // this.player.getComponent( Player ).onEnd();
        this.unschedule( this._onSchedule );
        this.layer_floor.getComponent( Floor ).onEnd();
        this.node.off( cc.Node.EventType.TOUCH_END, this._onTouch, this );
        NotificationCenter.getIns().emit( GameEvent.GAME_END );
    }


    /** 开启计时 */
    private _startClock(): void {
        if ( !this._isStart ) {
            this._isStart = true;
            this.schedule( this._onSchedule, 1 );
        }
    }

    private _onSchedule(): void {
        if ( !this.layer_floor.getComponent( Floor ).removePlatForm() ) {
            this.player.getComponent( Player ).fall();
            this._onGameEnd();
        }
    }


    /** 玩家操作 */
    private _onTouch( evt: cc.Event.EventTouch ): void {
        this._startClock();

        if ( evt.getLocationX() <= this.node.width / 2 ) {
            this._onLeft();
        } else {
            this._onRight();
        }
        // console.log( evt.getLocation(), evt.getLocationInView(), evt.getLocationX(), evt.getLocationY() );
    }

    private _onLeft(): void {
        if ( this.layer_floor.getComponent( Floor ).checkDirection( -1 ) ) {
            this.layer_floor.getComponent( Floor ).move( -1 );
            this.layer_leaves.getComponent( Leaves ).move( -1 );
            this.player.getComponent( Player ).jump( -1 );
        } else {
            if ( !this.layer_floor.getComponent( Floor ).checkIsBlock() ) {
                this.layer_floor.getComponent( Floor ).move( -1 );
                this.layer_leaves.getComponent( Leaves ).move( -1 );
                this.player.getComponent( Player ).jump( -1, true );
            } else {
                this.player.getComponent( Player ).jump( -1, false );

            }
            this._onGameEnd();
            console.dir( "应该跳向【右】边的，却跳【左】边了" );
        }
    }
    private _onRight(): void {
        if ( this.layer_floor.getComponent( Floor ).checkDirection( 1 ) ) {
            this.layer_floor.getComponent( Floor ).move( 1 );
            this.layer_leaves.getComponent( Leaves ).move( 1 );
            this.player.getComponent( Player ).jump( 1 );
        } else {
            if ( !this.layer_floor.getComponent( Floor ).checkIsBlock() ) {
                this.layer_floor.getComponent( Floor ).move( 1 );
                this.layer_leaves.getComponent( Leaves ).move( 1 );
                this.player.getComponent( Player ).jump( 1, true );
            } else {
                this.player.getComponent( Player ).jump( 1, false );
            }
            this._onGameEnd();
            console.dir( "应该跳向【左】边的，却跳【右】边了" );
        }
    }

    start() {
        this.player.getComponent( Player ).jump( 1 );
    }

    update( dt ) {

    }
}
