class Player extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // leftKey - key for moving left
    // rightKey - key for moving right
    constructor(scene, x, y, texture, frame, leftKey, rightKey, playerSpeed, shield) {
        super(scene, x, y, texture, frame);

        this.left = leftKey;
        this.right = rightKey;
        this.playerSpeed = playerSpeed;
        this.shieldUp = true;
        this.shield = shield

        scene.add.existing(this);

        return this;
    }

    hit() {
        if (this.shieldUp) {
            this.shieldUp = false;
            this.shield.visible = false;
        }
        else {
            this.setScale(0.125)
            this.scene.lose();
        }
    }

    update() {
        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (this.x > (this.displayWidth / 2)) {
                this.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (this.x < (game.config.width - (this.displayWidth / 2))) {
                this.x += this.playerSpeed;
            }
        }
        this.shield.setPosition(this.x, this.y - 35);

    }

}