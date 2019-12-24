// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    /** 跳跃持续时间 */
    @property
    jumpDuration: number = 0;

    /** 跳跃高度 */
    @property
    jumpHeight: number = 0;

    /** 最大移动速度 */
    @property
    maxMoveSpeed: number = 0;

    /** 加速度 */
    @property
    accel: number = 0;

    /** 跳跃音效 */
    @property( { type: cc.AudioClip } )
    jumpAudio: cc.AudioClip = null;

    private _xSpeed: number = 0;
    private _accLeft: boolean = false;
    private _accRight: boolean = false;

    protected onLoad() {

        this._xSpeed = 0;
        this._accLeft = false;
        this._accRight = false;

        // 初始化跳跃动作
        this.node.runAction( this._setJumpAction() );

        this._addEvent();
    };

    protected onDestroy(): void {
        this._removeEvent();
    }

    //** 监听事件 */
    private _addEvent(): void {
        cc.systemEvent.on( cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this );
        cc.systemEvent.on( cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this );
    }

    private _removeEvent(): void {
        cc.systemEvent.off( cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this );
        cc.systemEvent.off( cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this );
    }

    private _onKeyDown( evt: cc.Event.EventKeyboard ): void {
        switch ( evt.keyCode ) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this._accLeft = true;;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this._accRight = true;
                break;
            default:
                break;
        }
    }

    private _onKeyUp( evt: cc.Event.EventKeyboard ): void {
        switch ( evt.keyCode ) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this._accLeft = false;;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this._accRight = false;
                break;
            default:
                break;
        }
    }

    private _setJumpAction(): cc.ActionInterval {
        // 上升跳跃
        var jumpUp = cc.moveBy( this.jumpDuration, cc.v2( 0, this.jumpHeight ) ).easing( cc.easeCubicActionOut() );
        // 下落
        var jumpDown = cc.moveBy( this.jumpDuration, cc.v2( 0, -this.jumpHeight ) ).easing( cc.easeCubicActionIn() );
        // 添加一个回调函数， 用于在动作结束时调用我们定义的其他方法
        let callback = cc.callFunc( this._playJumpSound, this );
        // 不断重复
        return cc.repeatForever( cc.sequence( jumpUp, jumpDown, callback ) );
    }

    private _playJumpSound(): void {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect( this.jumpAudio as any, false );
    }

    protected update( dt: number ) {
        // 更具当前的加速度方希那个每帧更新速度
        if ( this._accLeft ) {
            this._xSpeed -= this.accel * dt;
        } else if ( this._accRight ) {
            this._xSpeed += this.accel * dt;
        }

        // 限制主角的速度不能超过最大值
        if ( Math.abs( this._xSpeed ) > this.maxMoveSpeed ) {
            this._xSpeed = this.maxMoveSpeed * this._xSpeed / Math.abs( this._xSpeed );
        }

        // 根据当前熟读更新主角的位置
        this.node.x += this._xSpeed * dt;
        if ( this.node.x <= -this.node.parent.width / 2 ) {
            this.node.x = this.node.parent.width / 2;
        } else if ( this.node.x >= this.node.parent.width / 2 ) {
            this.node.x = -this.node.parent.width / 2;
        }
    }
}
