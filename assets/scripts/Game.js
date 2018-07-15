// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Util = require("Util");

let Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        score: 0,
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        leafPrefab: {
            default: null,
            type: cc.Prefab
        },
        leavesGroup: [],
        usedGroup: [],

        // 荷叶容器，用于处理动态加载节点的层级顺序
        leaves: {
            type: cc.Node,
            default: null
        },
        player: {
            default: null,
            type: cc.Node
        }
    },
    spawnLeaf(i = 0) {
        let leaf = cc.instantiate(this.leafPrefab);
        this.leaves.addChild(leaf);
        leaf.setPosition(this.getNewLeafPosition(i));

        this.leavesGroup.push(leaf);

        leaf.getComponent("Leaf").init(this);
    },
    getNewLeafPosition(i) {
        let worldWidth = this.node.width / 2,
            leafWidth = this.leafPrefab.data.width;

        let jumpDistance = this.player.getComponent("Player").jumpDistance;

        let randX;
        if (i === 0) {
            randX = this.player.x;
        } else {
            randX = Util.randomMinus1to1() * (worldWidth - leafWidth / 2);
        }

        let randY = -320 + jumpDistance * i;

        return cc.p(randX, randY);
    },

    getNextLeaves() {
        let leaf = this.leavesGroup.shift();
        this.usedGroup.push(leaf);
        return leaf;
    },

    newStep(score = 1) {
        this.addScore(score);

        if (!this.leavesGroup.length) {
            this.moveMap();
        }
    },
    moveMap() {
        let length = this.usedGroup.length;

        let self = this;
        this.usedGroup.forEach((item, index) => {
            let Leaf = item.getComponent("Leaf");

            Leaf.isDrop = true;
            Leaf.dropCallback = function() {
                if (index !== length - 1) {
                    item.destroy();
                } else {
                    Leaf.isDrop = false;
                    self.usedGroup = [];
                    self.resetMap();
                }
            };
        });
    },
    resetMap() {
        for (let i = 0; i < 4; ++i) {
            this.spawnLeaf(i);
        }

        // 取出第一个元素
        let leaf = this.getNextLeaves();
        let Player = this.player.getComponent("Player");

        Player.init(this, leaf);
    },
    addScore(score) {
        this.score += score;
        this.scoreDisplay.string = `得分：${this.score}`;
    },
    gameOver() {
        this.isOver = true; 
        Global.score = this.score
        cc.director.loadScene("gameover");
    },

    setInputControl() {
        let self = this;
        let player = this.player.getComponent("Player");

        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
            if(self.leavesGroup.length){
                player.jump();
            }
        });
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.resetMap();

        this.setInputControl();
    }

    // update (dt) {},
});
