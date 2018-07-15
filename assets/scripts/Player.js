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
        jumpDistance: 200,
        jumpDuration: 0.3,
        pickRadius: 50,
        isJump: false
    },

    init(game, currentLeaf){
        this.game = game
        this.currentLeaf = currentLeaf;
    },



    getJumpAction() {
        let jump = cc
            .moveBy(this.jumpDuration, cc.p(0, this.jumpDistance))
            .easing(cc.easeCubicActionOut());

        return jump;
    },

    jump() {
        let anim = this.getComponent("cc.Animation");
        anim.play("jump");
        this.isJump = true;

        let jumpAction = this.getJumpAction(),
            finished = cc.callFunc(function() {
                this.onJumped();
            }, this);

        this.node.runAction(cc.sequence(jumpAction, finished));
    },

    getPlayerDistance() {
        let nextLeaves = this.game.getNextLeaves();
        let leafPositon = nextLeaves.getPosition();

        this.currentLeaf = nextLeaves;
        let dist = cc.pDistance(this.node.position, leafPositon);

        return dist;
    },

    onJumped() {
        this.isJump = false
        let dist = this.getPlayerDistance();

        if (dist < this.pickRadius) {
            this.game.newStep()
        }else {
            this.game.gameOver()
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },

    update(dt) {
        if (this.currentLeaf && !this.isJump) {
            this.node.x = this.currentLeaf.x;
            this.node.y = this.currentLeaf.y;
        }
    }
});
