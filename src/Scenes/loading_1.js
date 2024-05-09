class loading_1 extends Phaser.Scene {
    constructor() {
        super("loading_1Scene");
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/level_1");                        // Set load path
        this.load.image('playerSprite', 'pointer_scifi_b.png');
        this.load.image('bulletSprite', 'line_vertical.png');
        this.load.image("enemySprite", "navigation_s.png");
        this.load.image("enemySpriteElite", "pointer_b.png");
        this.load.image("shield", "busy_circle.png");

        this.load.image("explode00", "explode_anim/resize_a_cross.png");
        this.load.image("explode01", "explode_anim/resize_b_cross.png");
        this.load.image("explode02", "explode_anim/resize_d_cross.png");
        this.load.image("explode03", "explode_anim/target_a.png");
        this.load.image("explode04", "explode_anim/target_b.png");

        this.load.setPath("./assets/level_2");                        // Set load path
        this.load.image('playerSprite_2', 'ship_J.png');
        this.load.image('bulletSprite_2', 'ship_B.png');
        this.load.image("enemySprite_2", "enemy_E.png");
        this.load.image("enemySpriteElite_2", "enemy_A.png");
        this.load.image("shield_2", "ship_C.png");

        this.load.image("explode00_2", "explode_anim/star_tiny.png");
        this.load.image("explode01_2", "explode_anim/star_small.png");
        this.load.image("explode02_2", "explode_anim/star_large.png");
        this.load.image("explode03_2", "explode_anim/star_medium.png");
        this.load.image("explode04_2", "explode_anim/star_small.png");
    }

    create() {
        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "explode00" },
                { key: "explode01" },
                { key: "explode02" },
                { key: "explode03" },
                { key: "explode04" },
            ],
            frameRate: 12,
            repeat: 0,
            hideOnComplete: true
        });

        // Create white puff animation
        this.anims.create({
            key: "puff_2",
            frames: [
                { key: "explode00_2" },
                { key: "explode01_2" },
                { key: "explode02_2" },
                { key: "explode03_2" },
                { key: "explode04_2" },
            ],
            frameRate: 12,
            repeat: 0,
            hideOnComplete: true
        });
    }

    update() {

        this.scene.start("shmup_1Scene");

    }
}