class Enemy extends Phaser.GameObjects.PathFollower {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // leftKey - key for moving left
    // rightKey - key for moving right
    constructor(scene, curve, x, y, texture, frame, enemySpeed, starting_point = 0) {
        super(scene, curve, x, y, texture, frame);

        this.enemySpeed = enemySpeed;
        this.curve = curve;

        scene.add.existing(this);

        console.log("creating")

        if (curve.points[0]) {
            this.x = curve.points[0].x;
            this.y = curve.points[0].y;
        }
        //   - call startFollow on enemySprite with the following configuration
        this.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 20000 / this.enemySpeed * (starting_point / 10),
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true,
            rotateToPath: true,
            rotationOffset: -90
        })

        return this;
    }

    explode() {
        this.puff = this.scene.add.sprite(this.x, this.y, "whitePuff03").setScale(0.25);
        this.puff.play("puff")

        this.stopFollow()
        this.visible = false;
        this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.visible = true;
            this.x = this.curve.points[0].x;
            this.y = this.curve.points[0].y;
            this.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: 2000,
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: true,
                rotateToPath: true,
                rotationOffset: -90
            })
        }, this);

    }

    update() {
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