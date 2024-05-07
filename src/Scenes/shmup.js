class shmup extends Phaser.Scene {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve;
    path;

    constructor() {
        super("shmupScene");
        this.my = { sprite: {} };  // Create an object to hold sprite bindings

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 10;
        this.bulletSpeed = 10;
        this.enemySpeed = 10;

        this.bulletCooldown = 5;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");                        // Set load path
        this.load.image("x-mark", "numeralX.png");
        this.load.image('playerSprite', 'pointer_scifi_b.png');
        this.load.image('bulletSprite', 'line_vertical.png');
        this.load.image("enemySprite", "navigation_s.png");

        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");
    }

    create() {
        let my = this.my;

        // Create a curve, for use with the path
        // Initial set of points are only used to ensure there is something on screen to begin with.
        // No need to save these values.
        this.points = [
            20, 20,
            120, 40,
            220, 80,
            320, 160,
            420, 320,
            520, 400,
            620, 440,
            720, 460
        ];
        this.curve = new Phaser.Curves.Spline(this.points);

        // Create enemySprite as a follower type of sprite
        // Call startFollow() on enemySprite to have it follow the curve
        my.sprite.enemySprite = new Enemy(this, this.curve, 10, 10, "enemySprite", null, 5);

        if (this.curve.points[0]) {
            my.sprite.enemySprite.x = this.curve.points[0].x;
            my.sprite.enemySprite.y = this.curve.points[0].y;
        }
        //   - call startFollow on enemySprite with the following configuration
        my.sprite.enemySprite.startFollow({
            from: 0,
            to: 1,
            delay: 0,
            duration: 20000 / this.enemySpeed,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true,
            rotateToPath: true,
            rotationOffset: -90
        })

        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 12,
            repeat: 0,
            hideOnComplete: true
        });


        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.shoot = this.input.keyboard.addKey("W");

        // Create the main body sprite
        my.sprite.playerSprite = new Player(this, game.config.width / 2, game.config.height - 40, "playerSprite", null,
            this.left, this.right, 5);
        my.sprite.playerSprite.rotation = Math.PI / 4;
        // my.sprite.playerSprite.setScale(0.25);

        // In this approach, we create a single "group" game object which then holds up
        // to 10 bullet sprites
        // See more configuration options here: 
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "bulletSprite",
            maxSize: 25,
            runChildUpdate: true
        }
        )

        // Create all of the bullets at once, and set them to inactive
        // See more configuration options here:
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup.createMultiple({
            classType: Bullet,
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize - 1
        });
        my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);

        // Add Descriptive Text
        document.getElementById('description').innerHTML = '<h3>A: left // D: right // shoot: fire/emit // S: Next Scene</h3>'

    }

    update() {
        let my = this.my;
        this.bulletCooldownCounter--;

        // Check for bullet being fired
        if (this.shoot.isDown) {
            if (this.bulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let bullet = my.sprite.bulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (bullet != null) {
                    this.bulletCooldownCounter = this.bulletCooldown;
                    bullet.makeActive();
                    bullet.x = my.sprite.playerSprite.x;
                    bullet.y = my.sprite.playerSprite.y - (my.sprite.playerSprite.displayHeight / 2);
                }
            }
        }

        // Check for collision with the enemySprite
        for (let bullet of my.sprite.bulletGroup.getChildren()) {
            if (this.collides(my.sprite.enemySprite, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.enemySprite.x, my.sprite.enemySprite.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.enemySprite.stopFollow()
                my.sprite.enemySprite.visible = false;
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.enemySprite.visible = true;
                    my.sprite.enemySprite.x = this.curve.points[0].x;
                    my.sprite.enemySprite.y = this.curve.points[0].y;
                    my.sprite.enemySprite.startFollow({
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
        }

        // update the player avatar by by calling the player's update()
        my.sprite.playerSprite.update();

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("shmup");
        }
    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (!a.active || !b.active) { return false; }
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) return false;
        return true;
    }
}