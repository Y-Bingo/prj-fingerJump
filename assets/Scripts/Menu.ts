import NotificationCenter from "./NotificationCenter";
import { GameEvent } from "./Constans";

const { property, ccclass } = cc._decorator;

@ccclass
export default class MenuPanel extends cc.Component {

    @property( cc.Node )
    mask: cc.Node = null;

    @property( cc.Node )
    btn_start: cc.Node = null;

    private _originY: number = 0;
    private _targetY: number = -1200;

    protected onLoad() {
        this._originY = this.node.y;
        this._targetY = this.node.parent.height - this.node.height - this.node.y;

        this._initUI();

        this.btn_start.on( 'click', this._onBtnStart, this );
        NotificationCenter.getIns().on( GameEvent.GAME_END, this._onGameEnd, this );
    }

    private _initUI(): void {
        let maskGp = this.mask.getComponent( cc.Graphics );
        maskGp.roundRect( 0, 0, this.mask.width, this.mask.height, 50 );
        maskGp.fill();

        let btnGp = this.btn_start.getComponentInChildren( cc.Graphics );
        btnGp.roundRect( 0, 0, this.btn_start.width, this.btn_start.height, this.btn_start.height / 2 );
        btnGp.stroke();
    }

    private _onBtnStart(): void {
        console.log( "点击开始游戏" );
        cc.tween( this.node )
            .to( 0.3, { y: this._targetY } )
            .call( () => {
                NotificationCenter.getIns().emit( GameEvent.GAME_START );
            } )
            .start();
    }

    private _onGameEnd(): void {
        console.log( "游戏结束" );
        cc.tween( this.node )
            .to( 0.3, { y: this._originY } )
            .start();
    }

    protected onDestroy() {
        this.btn_start.off( 'click', this._onBtnStart );
    }
}