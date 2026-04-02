import GameScene from "./GameScene.js";
const W = 800, H = 600;

new Phaser.Game({
    type: Phaser.WEBGL,
    backgroundColor: '#679DDB',
    width: W,
    height: H,
    scene: [GameScene],
    fps: { target: 60, forceSetTimeOut: true }
});