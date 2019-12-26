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


    protected onLoad() {
        this._animation = this.getComponent( cc.Animation );
    }

    /**
     * 跳跃
     * @param direction 
     */
    jump( direction: number ): void {
        this.turnDirection( direction );
        this._jump();
    }

    private _jump(): void {
        this._animation.play( EAmType.JUMP );
    }

    onJumpCompleted(): void {
        this._animation.play( EAmType.WALK );
    }

    /** 转向 */
    turnDirection( direction: number ): void {
        if ( isNaN( direction ) ) return;
        if ( direction == this._direction ) return;
        this._direction = direction;

        this.node.scaleX = -direction;
    }
}