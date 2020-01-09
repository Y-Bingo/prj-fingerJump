
const { property, ccclass } = cc._decorator;

@ccclass
export default class MenuPanel extends cc.Component {

    @property( cc.Node )
    mask: cc.Node = null;

    protected onLoad() {

        let ctx = this.mask.getComponent( cc.Graphics );
        ctx.roundRect( 0, 0, 250, 200, 50 );
        ctx.fill();
        // this.mask.x = this.node.width / 2 - this.mask.width / 2;
        // this.mask.y = this.node.height / 2 - this.mask.height / 2;
        // graphics.strokeColor = cc.color( 233, 186, 18 );


    }

}