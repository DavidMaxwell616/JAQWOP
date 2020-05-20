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

  var bkgd = game.add.image(0, -100, 'background');
  bkgd.width = game.width;
  bkgd.height = game.height*1.25;
  
  leftLeg = game.add.sprite(100, 400, 'leg');
  game.physics.box2d.enable(leftLeg);
  leftLeg.scale.setTo(.35);
  leftLeg.body.setRectangle(leftLeg.width,leftLeg.height);;
  leftThigh = game.add.sprite(90, 300, 'thigh');
  game.physics.box2d.enable(leftThigh);
  leftThigh.scale.setTo(.35);
  leftThigh.body.setRectangle(leftThigh.width,leftThigh.height);; 
  leftArm = game.add.sprite(0, 0, 'leftArm');
  game.physics.box2d.enable(leftArm);
  leftArm.scale.setTo(.35);
  leftArm.body.setRectangle(leftArm.width,leftArm.height);;
  head = game.add.sprite(100, 300, 'head');
  game.physics.box2d.enable(head);
  head.scale.setTo(.3); 
  head.body.setRectangle(head.width,head.height);;
  rightLeg = game.add.sprite(100, 400, 'leg');
  game.physics.box2d.enable(rightLeg);
  rightLeg.scale.setTo(.35);
  rightLeg.body.setRectangle(rightLeg.width,rightLeg.height);;
  rightThigh = game.add.sprite(90, 300, 'thigh');
  game.physics.box2d.enable(rightThigh);
  rightThigh.scale.setTo(.35);
  rightThigh.body.setRectangle(rightThigh.width,rightThigh.height);;
  rightThigh.anchor.setTo(.5);
  body = game.add.sprite(90, 200, 'body');
  game.physics.box2d.enable(body);
  body.scale.setTo(.3);
  body.body.setRectangle(body.width,body.height*.8);
  rightArm = game.add.sprite(0, 0, 'rightArm');
  game.physics.box2d.enable(rightArm);
  rightArm.scale.setTo(.35);
  rightArm.body.setRectangle(rightArm.width,rightArm.height);;
  
  
  //bodyA, bodyB, ax, ay, bx, by, motorSpeed, motorTorque, motorEnabled, lowerLimit, upperLimit, limitEnabled
  leftKneeJoint = game.physics.box2d.revoluteJoint(leftThigh, leftLeg, 0,10,-10,-50, 0, 0, false, -10, 0, true);
  rightKneeJoint = game.physics.box2d.revoluteJoint(rightThigh, rightLeg, 0,10,-10,-50, 0, 0, false, -10, 0, true);
  rightShoulderJoint = game.physics.box2d.revoluteJoint(rightArm, body, 0,-50,0,-45, 0, 0, false, -10, 0, false);
  leftShoulderJoint = game.physics.box2d.revoluteJoint(leftArm, body, 0,-50,0,-45, 0, 0, false, -10, 0, false);

  rightHipJoint = game.physics.box2d.revoluteJoint(rightThigh, body, 0, -40, 0, 40, 0, 0, false, -10, 10, true);
  rightHipJoint = game.physics.box2d.revoluteJoint(leftThigh, body, 0, -40, 0, 40, 0, 0, false, -10, 10, true);
  leftHipJoint = game.physics.box2d.revoluteJoint(leftThigh, body, 0, -40, 0, 40, 0, 0, false, -10, 10, true);
  neckJoint = game.physics.box2d.weldJoint(head, body, 0,47,0,-47);
     // Prevent arms, legs from colliding with each other
    //  setFilterGroup([leftArm,rightArm,floor],-1);
    //  setFilterGroup([body,leftThigh,rightThigh,leftLeg,rightLeg],-2);
  leftArm.body.setCollisionMask(1);
  rightArm.body.setCollisionMask(2);
  leftLeg.body.setCollisionMask(1);
  rightLeg.body.setCollisionMask(2);
  leftThigh.body.setCollisionMask(1);
  rightThigh.body.setCollisionMask(2);

  var vertices = [];
 vertices.push( 0);
 vertices.push( game.height);
 vertices.push( game.width);
 vertices.push( game.height);
 vertices.push( game.width);
 vertices.push(game.height*.73);
 vertices.push(0);
 vertices.push(game.height*.76);
 var floor = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
 floor.static = true;
 floor.setPolygon( vertices );

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

  keystateText2 = game.add.text(498,18, 'Keystate: '+keyState, {
    fill: 'white',
    font: '20pt Calibri',
  });

}

function lockRevoluteJoint(joint,torque) {
  torque = torque==undefined ? Infinity : torque;
  joint.SetMaxMotorTorque(torque);
  joint.SetMotorSpeed(0);
  joint.EnableMotor(true);
}

function update() {
  if (QKey.isDown) {
  console.log('q pressed')
  keyState = 'Q';
  }
  if (WKey.isDown) {
    console.log('w pressed')
    keyState = 'W';
    }
  if (OKey.isDown) {
    console.log('o pressed')
    keyState = 'O';
    }
  if (PKey.isDown) {
    console.log('p pressed')
    keyState = 'P';
    }
    updateStats();
  
  }
  function updateStats() {
    bestDistanceText1.setText('Best Distance: ' + Math.floor(farthestDistTraveled) + ' m');
    bestDistanceText2.setText('Best Distance: ' + Math.floor(farthestDistTraveled) + ' m');
    totalDistanceText1.setText('Total Distance: ' + Math.floor(totalDistTraveled) + ' m');
    totalDistanceText2.setText('Total Distance: ' + Math.floor(totalDistTraveled) + ' m');
    keystateText1.setText('Keystate: '+ keyState);
    keystateText2.setText('Keystate: '+ keyState);
  }
function render() {
  //  if (level4bkgd1 != null)
  //   game.debug.body(level4bkgd1);
 // game.debug.box2dWorld();
  // if (hunter != null)
  //   game.debug.body(hunter);
}