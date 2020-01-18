const { property, ccclass } = cc._decorator;

@ccclass
export default class MenuPanel extends cc.Component {
    /** 菜单面板 */
    @property( cc.Node )
    view: cc.Node = null;

    @property( cc.Node )
    mask: cc.Node = null;

    @property( cc.Node )
    btn_start: cc.Node = null;

    private _originY: number = 0;
    private _targetY: number = -1200;

    protected onLoad() {
        this._originY = this.view.y;

        this._initUI();
    }

    private _initUI(): void {
        let maskGp = this.mask.getComponent( cc.Graphics );
        maskGp.roundRect( 0, 0, this.mask.width, this.mask.height, 50 );
        maskGp.fill();

        let btnGp = this.btn_start.getComponentInChildren( cc.Graphics );
        btnGp.roundRect( 0, 0, this.btn_start.width, this.btn_start.height, this.btn_start.height / 2 );
        btnGp.stroke();
    }

    onStart(): void {
        console.log( "点击开始游戏" );
        cc.tween( this.view )
            .by( 0.3, { y: 1000 } )
            .start();
    }

    onGameEnd(): void {
        console.log( "游戏结束" );
        cc.tween( this.view )
            .to( 0.3, { y: this._originY } )
            .start();
    }
}