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

    /**
     * 跳跃
     * @param direction 
     */
    jump( direction: number, isFall: boolean = false ): void {
        this._isFall = isFall;
        this.turnDirection( direction );
        this._jump();
    }

    private _jump(): void {
        this._animation.play( EAmType.JUMP );
    }

    onJumpCompleted(): void {
        this._animation.play( EAmType.WALK );
        // if ( this._isFall ) {
        //     this.node.zIndex = 0;
        //     this.node.runAction( cc.moveBy( 0.3, 0, -400 ) );
        // }
    }

    /** 转向 */
    turnDirection( direction: number ): void {
        if ( isNaN( direction ) ) return;
        if ( direction == this._direction ) return;
        this._direction = direction;

        this.node.scaleX = -direction;
    }
}