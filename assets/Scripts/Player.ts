const { ccclass, property } = cc._decorator;

/** 动画类型 */
enum EAmType {
    WALK = "player_walk",
    JUMP = "player_jump"
}

@ccclass
export default class Player extends cc.Component {

    /** 动画组件 */
    private _animation: cc.Animation = null;;
    // 当前方向
    private _direction: number = 0;

    /** 是否掉落状态 */
    private _isFall: boolean = false;

    protected onLoad() {
        this._animation = this.getComponent( cc.Animation );

        this.node.zIndex = 100;
    }

    protected start() {
        // this.node.x = this.node.parent.getComponent()
    }

    onStart(): void {
        this.node.x = 0;
        this.node.y = 0;
        this.node.zIndex = 100;

        this.jump( Math.random() > 0.5 ? 1 : -1 );
    }

    onEnd(): void {
        this._animation.stop();
    }

    /**
     * 跳跃
     * @param direction 
     */
    jump( direction: number, isFall: boolean = false ): void {
        this._isFall = isFall;
        this.turnDirection( direction );
        this._jump();
    }

    fall(): void {
        this.node.zIndex = 0;
        this.node.runAction( cc.moveBy( 0.3, 0, -700 ) );
    }

    private _jump(): void {
        this._animation.play( EAmType.JUMP );

    }

    onJumpCompleted(): void {
        if ( this._isFall ) {
            this.fall();
        } else {
            this._animation.play( EAmType.WALK );
        }
    }

    /** 转向 */
    turnDirection( direction: number ): void {
        if ( isNaN( direction ) ) return;
        if ( direction == this._direction ) return;
        this._direction = direction;

        this.node.scaleX = -direction;
    }
}