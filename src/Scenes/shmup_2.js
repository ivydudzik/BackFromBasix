class shmup_2 extends Phaser.Scene {
    // Class variable definitions -- these are all "undefined" to start
    graphics;
    curve;
    path;

    constructor() {
        super("shmup_2Scene");
        this.my = { sprite: {} };  // Create an object to hold sprite bindings

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 10;
        this.bulletSpeed = 10;
        this.enemySpeed = 2.5;


        this.bulletCooldown = 15;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;


        this.hitCooldown = 120;        // Number of update() calls to wait before letting the player get hit again
        this.hitCooldownCounter = 0;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() { }

    create() {
        this.score = 0;

        let my = this.my;

        this.normalEnemyCount = 18;
        this.eliteEnemyCount = 2;

        this.enemies = this.normalEnemyCount + this.eliteEnemyCount;

        // Create Normal Enemy Group
        my.sprite.normalEnemyGroup = this.add.group({
            active: true,
            defaultKey: "enemySprite_2",
            maxSize: this.normalEnemyCount,
            runChildUpdate: true
        }
        )

        // Create Elite Enemy Group
        my.sprite.eliteEnemyGroup = this.add.group({
            active: true,
            defaultKey: "enemySpriteElite_2",
            maxSize: this.eliteEnemyCount,
            runChildUpdate: true
        }
        )

        this.spawnNormalEnemies(this.normalEnemyCount / 2);
        this.time.delayedCall(2500, this.spawnEliteEnemies, [this.eliteEnemyCount / 2], this);  // delay in ms
        this.time.delayedCall(5000, this.spawnEliteEnemies, [this.eliteEnemyCount / 2], this);  // delay in ms
        this.time.delayedCall(2500, this.spawnNormalEnemies, [this.normalEnemyCount / 2], this);  // delay in ms
        // this.spawnEliteEnemies();




        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.shoot = this.input.keyboard.addKey("W");

        // make a shield sprite
        my.sprite.shield = this.add.sprite(game.config.width / 2, game.config.height - 35, "shield_2");
        // my.sprite.shield.setScale(0.25);

        // make a score text
        my.sprite.score = this.add.text(10, 0, this.score, { fontSize: '36px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });


        // Create the main body sprite
        my.sprite.playerSprite = new Player(this, game.config.width / 2, game.config.height - 40, "playerSprite_2", null,
            this.left, this.right, 5, my.sprite.shield);
        // my.sprite.playerSprite.rotation = Math.PI / 4;
        // my.sprite.playerSprite.setScale(0.25);


        // Create enemySprite as a follower type of sprite
        // Call startFollow() on enemySprite to have it follow the curve
        // my.sprite.enemySprite = new Enemy(this, this.curve, 10, 10, "enemySprite", null, 5);



        // In this approach, we create a single "group" game object which then holds up
        // to 10 bullet sprites
        // See more configuration options here: 
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup = this.add.group({
            active: true,
            defaultKey: "bulletSprite_2",
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
            visible: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize - 1
        });
        my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);



        // Add Descriptive Text
        document.getElementById('description').innerHTML = '<h3>A: left // D: right // W: shoot</h3>'

    }

    spawnNormalEnemies(spawnCount) {
        let my = this.my;
        // Create a curve, for use with the path
        // Initial set of points are only used to ensure there is something on screen to begin with.
        // No need to save these values.
        this.normalEnemyPoints = [
            194, -50,
            194, 20,
            194, 50,
            194, 80,
            194, 110,
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
            242, 775,
            242, 850,
        ];



        this.normalEnemyCurves = []
        for (let i = spawnCount; i > 0; i--) {
            let newCurve = new Phaser.Curves.Spline(this.normalEnemyPoints);
            for (let point in newCurve.points) {
                newCurve.points[point].x += i * 100 - 200;
            }
            this.normalEnemyCurves.push(newCurve);
        }

        for (let i = spawnCount; i > 0; i--) {
            my.sprite.normalEnemyGroup.add(
                new Enemy(this, this.normalEnemyCurves[i - 1], 10, 10, my.sprite.normalEnemyGroup.defaultKey, null, this.enemySpeed, "normal", "puff_2")
            )
        }
    }

    spawnEliteEnemies(spawnCount) {
        let my = this.my;

        this.eliteEnemyPoints = [
            20, -50,
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
            800, 850,
        ]

        this.eliteEnemyCurves = []
        for (let i = spawnCount; i > 0; i--) {
            let newCurve = new Phaser.Curves.Spline(this.eliteEnemyPoints);
            for (let point in newCurve.points) {
                newCurve.points[point].x += i * 100;
            }
            this.eliteEnemyCurves.push(newCurve);
        }

        for (let i = spawnCount; i > 0; i--) {
            my.sprite.eliteEnemyGroup.add(
                new Enemy(this, this.eliteEnemyCurves[i - 1], 10, 10, my.sprite.eliteEnemyGroup.defaultKey, null, this.enemySpeed, "elite", "puff_2")
            )
        }
        my.sprite.eliteEnemyGroup.propertyValueSet("scale", 0.75);
    }

    win() {
        console.log("you win!");
        this.winSound = this.sound.add('shieldUp');
        this.winSound.setVolume(0.1);
        this.winSound.play();
        this.scene.start("shmup_3Scene");
    }

    lose() {

        console.log("you lose!");
        this.loseSound = this.sound.add('shieldDown');
        this.loseSound.setVolume(0.1);
        this.loseSound.play();
        this.scene.start("loseScene");
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
                    this.shootSound = this.sound.add('laser2');
                    this.shootSound.setVolume(0.05);
                    this.shootSound.play();
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
                    if (!enemy.isExploding) {
                        enemy.explode();
                        this.score += 10;
                        // clear out bullet -- put y offscreen, will get reaped next update
                        bullet.y = -100;
                    }
                }
            }
        }

        // Check for bullet collision with the elite enemies
        for (let bullet of my.sprite.bulletGroup.getChildren()) {
            for (let enemy of my.sprite.eliteEnemyGroup.getChildren()) {
                if (this.collides(enemy, bullet)) {
                    if (!enemy.isExploding) {
                        enemy.explode();
                        this.score += 50;
                        // clear out bullet -- put y offscreen, will get reaped next update
                        bullet.y = -100;
                    }

                }
            }
        }

        if (this.hitCooldownCounter < 0) {
            // Check for player collision with the normal enemies
            for (let enemy of my.sprite.normalEnemyGroup.getChildren()) {
                if (this.collides(enemy, my.sprite.playerSprite)) {
                    // Bug should exist where player can shoot to kill and body to kill on the same frame and double-explode an enemy?
                    enemy.explode();
                    my.sprite.playerSprite.hit(); // kill player / end game if no shield
                    this.hitCooldownCounter = this.hitCooldown;
                    break;
                }
            }

            // Check for player collision with the elite enemies
            for (let enemy of my.sprite.eliteEnemyGroup.getChildren()) {
                if (this.collides(enemy, my.sprite.playerSprite)) {
                    enemy.explode();
                    my.sprite.playerSprite.hit(); // kill player / end game if no shield
                    this.hitCooldownCounter = this.hitCooldown;
                    break;
                }
            }
        }



        // update the player avatar by by calling the player's update()
        my.sprite.playerSprite.update();

        if (this.enemies == 0) {
            this.win();
        }

        my.sprite.score.setText(this.score);
    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (a.y > 780 || b.y > 780) { return false; } // check if enemy is just below player and add grace
        if (!a.active || !b.active) { return false; }
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) return false;
        return true;
    }
}