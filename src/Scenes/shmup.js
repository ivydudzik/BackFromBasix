class shmup extends Phaser.Scene {
    constructor() {
        super("shmupScene");
        this.my = { sprite: {} };  // Create an object to hold sprite bindings
        this.my.sprite.arrows = [];

        // Create variables to hold constant values for sprite spawn locations
        this.boatX = 400;
        this.boatY = 50;

        // bool for direction
        this.facingLeft = true;
        this.arrowFacingLeft = true;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.image('boat', 'assets/ship-large.png');
        this.load.image('arrow', 'assets/arrow.png');
    }

    create() {
        // Add Descriptive Text
        document.getElementById('description').innerHTML = '<h2>1D Movement!</h2>'

        let my = this.my;

        // Create the main body sprite
        my.sprite.boat = this.add.sprite(this.boatX, this.boatY, "boat");

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Shoot
        this.input.keyboard.on('keydown-W', (event) => {
            if (my.sprite['arrow']) {
                my.sprite.arrow.destroy(true);
            }

            if (this.facingLeft) {
                this.arrowFacingLeft = true
            } else {
                this.arrowFacingLeft = false
            }

            my.sprite.arrow = this.add.sprite(my.sprite.boat.x, my.sprite.boat.y, "arrow");
        });

    }

    update() {
        let my = this.my;

        // Polling input for left-right movement
        if (this.aKey.isDown) {
            my.sprite.boat.x -= 2;
            my.sprite.boat.flipX = false;
            this.facingLeft = true;

        } else if (this.dKey.isDown) {
            my.sprite.boat.x += 2;
            my.sprite.boat.flipX = true;
            this.facingLeft = false;
        }

        if (my.sprite['arrow']) {
            if (this.arrowFacingLeft) {
                my.sprite.arrow.flipX = false;
                my.sprite.arrow.y += 7;
                my.sprite.arrow.x -= 7;
            } else {
                my.sprite.arrow.flipX = true;
                my.sprite.arrow.y += 7;
                my.sprite.arrow.x += 7;
            }

        }

    }
}