class Enemy extends Phaser.GameObjects.PathFollower {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // leftKey - key for moving left
    // rightKey - key for moving right
    constructor(scene, curve, x, y, texture, frame, enemySpeed, enemyType, puffName) {
        super(scene, curve, x, y, texture, frame);

        this.didPause = false;

        this.enemySpeed = enemySpeed;
        this.curve = curve;
        this.enemyType = enemyType;
        this.puffName = puffName;

        scene.add.existing(this);

        if (this.curve.points[0]) {
            this.x = this.curve.points[0].x;
            this.y = this.curve.points[0].y;
        }
        //   - call startFollow on enemySprite with the following configuration
        this.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 20000 / this.enemySpeed,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: false,
            rotateToPath: true,
            rotationOffset: -90
        })

        // this.selfDestructTimer = this.scene.time.delayedCall(2500, this.explode, null, this);  // delay in ms

        return this;
    }

    explode() {
        this.isExploding = true;
        this.puff = this.scene.add.sprite(this.x, this.y, "explode_anim/explode00");
        this.puff.play(this.puffName);

        this.stopFollow();
        this.visible = false;
        this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {

            this.x = this.curve.points[0].x;
            this.y = this.curve.points[0].y;

            // No Respawn:
            this.active = false;
            this.scene.enemies -= 1;

            // Respawn:
            // this.visible = true;
            // this.startFollow({
            //     from: 0,
            //     to: 1,
            //     delay: 0,
            //     duration: 20000 / this.enemySpeed,
            //     ease: 'Sine.easeInOut',
            //     repeat: -1,
            //     yoyo: true,
            //     rotateToPath: true,
            //     rotationOffset: -90
            // })
        }, this);


    }

    update() {

        // console.log("pathVector:", this.pathVector);
        // console.log("point 4:", this.curve.points[4]);
        if (this.enemyType == "normal") {
            if (this.pathVector.distance(this.curve.points[4]) < 5 && this.didPause == false) {
                this.didPause = true;
                this.pauseTime = 120
                this.pauseFollow();
            }

            if (this.pauseTime > 0) {
                this.pauseTime -= 1;
            }

            if (this.pauseTime == 0) {
                this.resumeFollow();
                this.pauseTime = -1;
            }
        }


        // // Moving left
        // if (this.left.isDown) {
        //     // Check to make sure the sprite can actually move left
        //     if (this.x > (this.displayWidth / 2)) {
        //         this.x -= this.playerSpeed;
        //     }
        // }

        // // Moving right
        // if (this.right.isDown) {
        //     // Check to make sure the sprite can actually move right
        //     if (this.x < (game.config.width - (this.displayWidth / 2))) {
        //         this.x += this.playerSpeed;
        //     }
        // }
    }

}