class win extends Phaser.Scene {
    constructor() {
        super("winScene");

        this.my = { sprite: {} };
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() { }

    create() {

        this.my.sprite.start = this.add.text(game.config.width / 2, game.config.height / 2, "YOU WIN", { fontSize: '76px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        this.my.sprite.start.setOrigin(0.5, 0.5);
        // this.scene.start("loading_1Scene")
        this.time.delayedCall(1000, this.nextScene, [], this);  // delay in ms ["loading_1Scene"]
        // Add Descriptive Text
        document.getElementById('description').innerHTML = 'Winscreen'

    }

    nextScene() {
        this.scene.start("menuScene")
    }

    update() {

    }
}