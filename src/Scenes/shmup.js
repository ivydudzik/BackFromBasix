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
        this.enemySpeed = 2.5;

        this.bulletCooldown = 5;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;

        this.hitCooldown = 120;        // Number of update() calls to wait before making a new bullet
        this.hitCooldownCounter = 0;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");                        // Set load path
        this.load.image("x-mark", "numeralX.png");
        this.load.image('playerSprite', 'pointer_scifi_b.png');
        this.load.image('bulletSprite', 'line_vertical.png');
        this.load.image("enemySprite", "navigation_s.png");
        this.load.image("enemySpriteElite", "pointer_b.png");
        this.load.image("shield", "busy_circle.png");

        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");
    }

    create() {
        let my = this.my;

        this.normalEnemyCount = 6;
        this.eliteEnemyCount = 2;

        // Create a curve, for use with the path
        // Initial set of points are only used to ensure there is something on screen to begin with.
        // No need to save these values.
        this.normalEnemyPoints = [
            194, 52,
            197, 153,
            308, 156,
            313, 212,
            211, 212,
            115, 214,
            118, 295,
            216, 294,
            316, 286,
            322, 347,
            223, 354,
            226, 416,
            131, 431,
            138, 506,
            241, 502,
            339, 498,
            344, 570,
            258, 573,
            256, 627,
            342, 634,
            341, 711,
            245, 716,
            242, 775
        ];

        this.eliteEnemyPoints = [
            44, 27,
            259, 45,
            649, 88,
            867, 155,
            693, 321,
            273, 371,
            116, 424,
            194, 546,
            393, 594,
            672, 621,
            790, 763,
        ]

        this.normalEnemyCurves = []
        for (let i = this.normalEnemyCount; i > 0; i--) {
            let newCurve = new Phaser.Curves.Spline(this.normalEnemyPoints);
            for (let point in newCurve.points) {
                newCurve.points[point].x += i * 100;
            }
            this.normalEnemyCurves.push(newCurve);
        }

        this.eliteEnemyCurves = []
        for (let i = this.eliteEnemyCount; i > 0; i--) {
            let newCurve = new Phaser.Curves.Spline(this.eliteEnemyPoints);
            for (let point in newCurve.points) {
                newCurve.points[point].x += i * 100;
            }
            this.eliteEnemyCurves.push(newCurve);
        }

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

        my.sprite.shield = this.add.sprite(game.config.width / 2, game.config.height - 40, "shield");
        // my.sprite.shield.setScale(0.25);

        // Create the main body sprite
        my.sprite.playerSprite = new Player(this, game.config.width / 2, game.config.height - 40, "playerSprite", null,
            this.left, this.right, 5, my.sprite.shield);
        my.sprite.playerSprite.rotation = Math.PI / 4;
        // my.sprite.playerSprite.setScale(0.25);

        // Create Normal Enemy Group
        my.sprite.normalEnemyGroup = this.add.group({
            active: true,
            defaultKey: "enemySprite",
            maxSize: this.normalEnemyCount,
            runChildUpdate: true
        }
        )

        for (let i = this.normalEnemyCount; i > 0; i--) {
            my.sprite.normalEnemyGroup.add(
                new Enemy(this, this.normalEnemyCurves[i - 1], 10, 10, my.sprite.normalEnemyGroup.defaultKey, null, this.enemySpeed)
            )
        }

        // Create Elite Enemy Group
        my.sprite.eliteEnemyGroup = this.add.group({
            active: true,
            defaultKey: "enemySpriteElite",
            maxSize: this.eliteEnemyCount,
            runChildUpdate: true
        }
        )

        for (let i = this.eliteEnemyCount; i > 0; i--) {
            my.sprite.eliteEnemyGroup.add(
                new Enemy(this, this.eliteEnemyCurves[i - 1], 10, 10, my.sprite.eliteEnemyGroup.defaultKey, null, this.enemySpeed)
            )
        }
        my.sprite.eliteEnemyGroup.propertyValueSet("scale", 0.75);

        // Create enemySprite as a follower type of sprite
        // Call startFollow() on enemySprite to have it follow the curve
        // my.sprite.enemySprite = new Enemy(this, this.curve, 10, 10, "enemySprite", null, 5);



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

    lose() {
        console.log('you lose!')
    }

    update() {
        let my = this.my;
        this.bulletCooldownCounter--;
        this.hitCooldownCounter--;



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

        // Check for bullet collision with the normal enemies
        for (let bullet of my.sprite.bulletGroup.getChildren()) {
            for (let enemy of my.sprite.normalEnemyGroup.getChildren()) {
                if (this.collides(enemy, bullet)) {
                    enemy.explode();
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                }
            }
        }

        // Check for bullet collision with the elite enemies
        for (let bullet of my.sprite.bulletGroup.getChildren()) {
            for (let enemy of my.sprite.eliteEnemyGroup.getChildren()) {
                if (this.collides(enemy, bullet)) {
                    enemy.explode();
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                }
            }
        }

        if (this.hitCooldownCounter < 0) {
            // Check for player collision with the normal enemies
            for (let enemy of my.sprite.normalEnemyGroup.getChildren()) {
                if (this.collides(enemy, my.sprite.playerSprite)) {
                    enemy.explode();
                    my.sprite.playerSprite.hit(); // kill player / end game if no shield
                    this.hitCooldownCounter = this.hitCooldown;
                }
            }

            // Check for player collision with the elite enemies
            for (let enemy of my.sprite.eliteEnemyGroup.getChildren()) {
                if (this.collides(enemy, my.sprite.playerSprite)) {
                    enemy.explode();
                    my.sprite.playerSprite.hit(); // kill player / end game if no shield
                    this.hitCooldownCounter = this.hitCooldown;
                }
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