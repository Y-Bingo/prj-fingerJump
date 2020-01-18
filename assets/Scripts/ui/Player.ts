import Model from "../Model";

const { ccclass, property } = cc._decorator;

/** 动画类型 */
enum EAmType {
    WALK = "player_walk",
    JUMP = "player_jump"
}

@ccclass
export default class Player extends cc.Component {

    @property( cc.Node )
    view: cc.Node = null;

    /** 动画组件 */
    private _animation: cc.Animation = null;;
    // 当前方向
    private _direction: number = 0;
    /** 是否掉落状态 */
    private _isFall: boolean = false;

    private _stepX: number;
    private _stepY: number;

    private _model: Model;

    protected onLoad() {
        this._model = cc.find( 'Game/Model' ).getComponent( 'Model' );

        this._stepX = this._model.getStepX();
        this._stepY = this._model.getStepY();
        this.view.zIndex = 100;

        this._animation = this.view.getComponent( cc.Animation );
        this._animation.on( "finished", this._onJumpCompleted, this );
    }

    onStart(): void {
        this.view.x = 0;
        this.view.y = 0;
        this.view.zIndex = 100;
    }

    onEnd(): void {
        this._animation.getAnimationState( EAmType.WALK ).stop();
    }

    /**
     * 跳跃
     * @param direction 
     */
    move( direction: number, isBlock: boolean = false, isFall: boolean = false ): void {
        this._isFall = isFall;

        this._turnDirection( direction );
        this._jump();

        if ( !isBlock )
            this.view.runAction( cc.moveBy( 0.2, this._stepX * direction, this._stepY ) );
    }

    private _jump(): void {
        this._animation.play( EAmType.JUMP );
    }

    fall(): void {
        this.view.runAction( cc.moveBy( 0.4, 0, -700 ) );
    }

    private _onJumpCompleted( amName: string, amState?: cc.AnimationState ): void {
        // console.log( amName, amState );
        if ( amState.name !== EAmType.JUMP ) return;
        if ( this._isFall ) {
            this.fall();
        } else {
            this._animation.play( EAmType.WALK );
        }
    }

    /** 转向 */
    private _turnDirection( direction: number ): void {
        if ( isNaN( direction ) ) return;
        if ( direction == this._direction ) return;
        this._direction = direction;

        this.view.scaleX = -direction;
    }
}