
/** 事件派发中心   */
export default class NotificationCenter {

    private static _ins: NotificationCenter;
    public static getIns(): NotificationCenter {
        if ( !this._ins )
            this._ins = new NotificationCenter;
        return this._ins;
    }

    private _eventTarget: cc.EventTarget = new cc.EventTarget;

    /**
     * 事件监听
     * @param eventName 事件名 
     * @param callBack  回调
     * @param target    回调对象
     */
    on( eventName: string, callBack: Function, target?: any ) {
        this._eventTarget.on( eventName, callBack, target );
    }

    /**
     * 事件派发
     * @param eventName 
     * @param arg1 
     * @param arg2 
     * @param arg3 
     * @param arg4 
     * @param arg5 
     */
    emit( eventName: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any ): void {
        this._eventTarget.emit( eventName, arg1, arg2, arg3, arg4, arg5 );
    }

    /**
     * 移除绑定的事件
     * @param eventName 事件名
     * @param callBack  回调
     * @param target    回调对象
     */
    off( eventName, callBack: Function, target?: any ): void {
        this._eventTarget.off( eventName, callBack, target );
    }


}