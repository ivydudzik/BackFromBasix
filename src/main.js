// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: false  // prevent pixel art from getting blurred when scaled
    },
    width: 1000,
    height: 800,
    scene: [loading_1, shmup_1, shmup_2],
    fps: { forceSetTimeOut: true, target: 60 },
    backgroundColor: '#000000'
}

const game = new Phaser.Game(config);