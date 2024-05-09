class loading extends Phaser.Scene {
    constructor() {
        super("loadingScene");
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

        this.load.image("explode00", "explode_anim/resize_a_cross.png");
        this.load.image("explode01", "explode_anim/resize_b_cross.png");
        this.load.image("explode02", "explode_anim/resize_d_cross.png");
        this.load.image("explode03", "explode_anim/target_a.png");
        this.load.image("explode04", "explode_anim/target_b.png");
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
    }

    update() {

        this.scene.start("shmupScene");

    }
}