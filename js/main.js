import GameScene from "./GameScene.js";
const W = 800, H = 600;
//background dimensions = 1920x1440

new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: '#124184',
    width: W,
    height: H,
    scene: [GameScene],
    fps: { target: 60, forceSetTimeOut: true }
});