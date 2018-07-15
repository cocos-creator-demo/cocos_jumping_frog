// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 移动速度
        speed: 150,
        speedY: 500,
        score: 1,
        isDrop: false,
        game: {
            default: null,
            serializable: false
        },
        frog: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(game){
        this.game = game
    },


    start () {

    },
    
    moveX(dt){
        this.node.x += this.speed * dt;

        let right = this.game.node.width / 2 - this.node.width / 2,
            left = -right;

        if (this.node.x > right || this.node.x < left) {
            this.speed = -this.speed;
        }
    },

    moveY(dt){
        this.node.y -= this.speedY * dt;

        if (this.node.y <= -320){
            this.node.destroy()
            if (typeof this.dropCallback === 'function'){
                this.dropCallback()
            }
        }
    },

    update (dt) {
        if (this.game.isOver){
            return
        }
        if(this.isDrop){
            this.moveY.call(this, dt)
        }else {
            this.moveX.call(this, dt)
        }
    },
});
