class Enemy extends Phaser.GameObjects.PathFollower {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // leftKey - key for moving left
    // rightKey - key for moving right
    constructor(scene, curve, x, y, texture, frame, enemySpeed) {
        super(curve, x, y, texture);

        this.enemySpeed = enemySpeed;

        scene.add.existing(this);

        return this;
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