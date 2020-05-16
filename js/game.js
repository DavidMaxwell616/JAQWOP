const game = new Phaser.Game(1024, 600, Phaser.BOX2D, 'game', {
  preload,
  create,
  update,
  render,
});

var width = this.width;
var height= this.height;
function create() {
  game.physics.startSystem(Phaser.Physics.BOX2D);
  game.physics.box2d.gravity.y = 500;
  game.physics.box2d.setBoundsToWorld();
  game.physics.box2d.friction = 1;
  game.physics.box2d.restitution = 0.1;
  game.physics.box2d.debugDraw.joints = true;

  var bkgd = game.add.image(0, 0, 'background');
  bkgd.width = game.width;
  bkgd.height = game.height;
  
  head = game.add.sprite(0, 0, 'head');
  game.physics.box2d.enable(head);
  head.scale.setTo(.35);
  rightArm = game.add.sprite(0, 0, 'rightArm');
  game.physics.box2d.enable(rightArm);
  rightArm.scale.setTo(.35);
  leftArm = game.add.sprite(0, 0, 'leftArm');
  game.physics.box2d.enable(leftArm);
  leftArm.scale.setTo(.35);
  body = game.add.sprite(0, 0, 'body');
  game.physics.box2d.enable(body);
  body.scale.setTo(.35);
  thigh = game.add.sprite(0, 0, 'thigh');
  game.physics.box2d.enable(thigh);
  thigh.scale.setTo(.35);
  leg = game.add.sprite(0, 0, 'leg');
  game.physics.box2d.enable(leg);
  leg.scale.setTo(.35);
  neckJoint = game.physics.box2d.revoluteJoint(head, body,0,
    12,
    0,
    -10,);
  armJoint = game.physics.box2d.revoluteJoint(rightArm, body);
  armJoint = game.physics.box2d.revoluteJoint(leftArm, body);
  legJoint = game.physics.box2d.revoluteJoint(thigh, body);
  kneeJoint = game.physics.box2d.revoluteJoint(leg, thigh);

  QKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
  WKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  OKey = game.input.keyboard.addKey(Phaser.Keyboard.O);
  PKey = game.input.keyboard.addKey(Phaser.Keyboard.P);


  bestDistanceText1 = game.add.text(20,20, 'Best Distance: ' + Math.floor(farthestDistTraveled) + ' m', {
    fill: 'black',
    font: '20pt Calibri',
  });

  totalDistanceText1 = game.add.text(250,20, 'Total Distance: ' + Math.floor(totalDistTraveled) + ' m', {
    fill: 'black',
    font: '20pt Calibri',
  });

  keystateText1 = game.add.text(500,20, 'Keystate: ', {
    fill: 'black',
    font: '20pt Calibri',
  });

  bestDistanceText2 = game.add.text(18,18, 'Best Distance: ' + Math.floor(farthestDistTraveled) + ' m', {
    fill: 'white',
    font: '20pt Calibri',
  });

  totalDistanceText2 = game.add.text(248,18, 'Total Distance: ' + Math.floor(totalDistTraveled) + ' m', {
    fill: 'white',
    font: '20pt Calibri',
  });

  keystateText2 = game.add.text(498,18, 'Keystate: ', {
    fill: 'white',
    font: '20pt Calibri',
  });

}

function update() {
  if (QKey.isDown) {
  console.log('q pressed')
  }
}


function render() {
  //  if (level4bkgd1 != null)
  //   game.debug.body(level4bkgd1);
  //game.debug.box2dWorld();
  // if (hunter != null)
  //   game.debug.body(hunter);
  // for (let index = 0; index < amountCrocs; index += 1) {
  //   var rect = new Phaser.Rectangle(crocs[index].x - (crocs[index].width / 2), crocs[index].y - (crocs[index].height / 2), crocs[index].width, crocs[index].height);
  //   game.debug.geom(rect, 'rgba(255,0,0,.5)');
  // }
}