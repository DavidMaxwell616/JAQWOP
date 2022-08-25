const game = new Phaser.Game(800, 600, Phaser.BOX2D, 'game', {
    preload,
    create,
    update,
    render,
  });

 function preload(){}

function create(){
  game.stage.backgroundColor = '#124184';
  game.physics.startSystem(Phaser.Physics.BOX2D);
  game.physics.box2d.debugDraw.joints = true;
  game.physics.box2d.gravity.y = 500;
  game.physics.box2d.restitution = .5;
 game.physics.box2d.setBoundsToWorld();
  var circle = game.physics.box2d.createCircle(100, 100, 32);
  var circle2 = game.physics.box2d.createCircle(300, 100, 32);
  var box = game.physics.box2d.createRectangle(100,450,150,50);
  var box2 = game.physics.box2d.createRectangle(300,450,150,50);
  var floor= game.physics.box2d.createRectangle(355,570,700,20);
  box2.m_filter.categoryBits = 0x0002;
  box2.m_filter.maskBits = 0x0004;
  floor.m_filter.categoryBits = 0x0002;
  floor.m_filter.maskBits = 0x0004;
  // circle2.m_filter.categoryBits = 0x0004;
  // circle2.m_filter.maskBits = 0x0002;
  // console.log(box2.m_filter);
  
}

function update(){

}

function render(){
    game.debug.box2dWorld();
}