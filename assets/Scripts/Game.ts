import Model from "./Model";
import Floor from "./ui/Floor";
import Player from "./ui/Player";
import Leaves from "./ui/Leaves";
import MenuPanel from "./ui/MenuPanel";

const { ccclass, property } = cc._decorator;

export enum EDirection {
    LEFT = -1,
    RIGHT = 1
}


@ccclass
export default class Game extends cc.Component {

    @property( Model )
    model: Model = null;

    @property( cc.Node )
    view: cc.Node = null;

    /** 景物层 */
    @property( Leaves )
    leaves: Leaves = null;
    /** 阶梯层 */
    @property( Floor )
    floor: Floor = null;
    /** 玩家 */
    @property( Player )
    player: Player = null;

    @property( MenuPanel )
    menu: MenuPanel = null;

    private _isStart: boolean = false;
    private _isInit: boolean = false;

    protected onLoad() {
        this._isInit = true;
    }

    onBtnStart(): void {
        this._onGameStart();
    }

    private _onGameStart(): void {
        if ( !this._isInit ) {
            this._isInit = true;
            this.player.onStart();
            this.floor.onStart();
            this.leaves.onStart();

            let direction = this.model.getFirstDirection();
            console.log( "jump:", direction );
            this.player.move( direction );
            this.floor.move( direction );
            // this.leaves.move( direction );
        }
        this.menu.onStart();
        this.view.on( cc.Node.EventType.TOUCH_END, this._onTouch, this );
    }

    private _onGameEnd(): void {
        this._isInit = false;

        this._stopClock();
        this.player.onEnd();
        this.floor.onEnd();

        this.model.reset();

        this.menu.onGameEnd();
        this.view.off( cc.Node.EventType.TOUCH_END, this._onTouch, this );
    }


    /** 开启计时 */
    private _startClock(): void {
        if ( !this._isStart ) {
            this._isStart = true;
            this.schedule( this._onSchedule, 0.7 );
        }
    }

    private _stopClock(): void {
        this._isStart = false;
        this.unschedule( this._onSchedule );
    }

    private _onSchedule(): void {
        this.floor.dropStair();
        if ( this.model.checkPlayerDrop() ) {
            this.player.fall();
            this._onGameEnd();
        }
    }

    /** 玩家操作 */
    private _onTouch( evt: cc.Event.EventTouch ): void {
        this._startClock();

        if ( evt.getLocationX() <= this.view.width / 2 ) {
            this._onAction( EDirection.LEFT );
        } else {
            this._onAction( EDirection.RIGHT );
        }
    }

    private _onAction( direction: EDirection ): void {
        if ( this.model.checkDirection( direction ) ) {
            this.player.move( direction );
            this.floor.move( direction );
            this.leaves.move( direction );
        } else {
            if ( !this.model.checkIsBlock() ) {
                this.player.move( direction, false, true );
                this.floor.move( direction );
                this.leaves.move( direction );
            } else {
                this.player.move( direction, true );
            }
            this._onGameEnd();
            // console.dir( "应该跳向【右】边的，却跳【左】边了" );
        }
    }

    start() {
        let direction = this.model.getFirstDirection();
        // console.log( "jump:", direction );
        this.player.move( direction );
        this.floor.move( direction );
    }
}
