const game = new Phaser.Game(800, 480, Phaser.BOX2D, 'game', {
  preload,
  create,
  update,
  render,
});
var l_hip_rotate_speed = 3;
var r_hip_rotate_speed = 3;
var head;
var body;
var rightLowerArm;
var rightUpperArm;
var leftArm;
var rightThigh;
var leftThigh;
var rightLeg;
var leftLeg;
var leftFoot;
var rightFoot;
var QKey;
var WKey;
var OKey;
var PKey;
var leftAnkleJoint;
var leftKneeJoint;
var rightKneeJoint;
var rightShoulderJoint;
var leftShoulderJoint;
var rightHipJoint;
var rightHipJoint;
var leftHipJoint;
var neckJoint;
var rightElbowJoint;

var width = this.width;
var height= this.height;

var headStartY = 200;
var headStartX = 250;

var hipLimits = [-10,10];
var kneeLimits = [-0.25,1];
var ankleLimits = [-0.25,1];
var elbowLimits = [-0.25,1];
var motorTorque = 100;  

function preload() {
  game.load.image('rightUpperArm', '../assets/images/upperarm.png');
  game.load.image('rightLowerArm', '../assets/images/lowerarm.png');
  game.load.image('body', '../assets/images/jackbody.png');
  game.load.image('head', '../assets/images/jackhead.png');
  game.load.image('leftUpperArm', '../assets/images/upperarm.png');
  game.load.image('leftLowerArm', '../assets/images/lowerarm.png');
  game.load.image('leg', '../assets/images/jackleg.png');
  game.load.image('thigh', '../assets/images/jackthigh.png');
  game.load.image('foot', '../assets/images/jackfoot.png');

}

function create() {
  game.physics.startSystem(Phaser.Physics.BOX2D);
  game.stage.backgroundColor = '#4F8ADA';
  game.physics.box2d.gravity.y = 500;
  game.physics.box2d.setBoundsToWorld();
  game.physics.box2d.friction = 1;
  game.physics.box2d.restitution = 0.1;
  game.physics.box2d.debugDraw.joints = true;
  
  var vertices = [];
  vertices.push( 0);
  vertices.push( game.height);
  vertices.push( game.width);
  vertices.push( game.height);
  vertices.push( game.width);
  vertices.push(game.height*.93);
  vertices.push(0);
  vertices.push(game.height*.96);
  var floor = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
  floor.static = true;
  floor.setPolygon( vertices );
  floor.setCollisionMask(3);
  // leftFoot = game.add.sprite(headStartX,headStartY+150, 'foot');
  // game.physics.box2d.enable(leftFoot);
  // leftFoot.scale.setTo(.35);
  // leftFoot.body.setRectangle(leftFoot.width,leftFoot.height);
  // leftLeg = game.add.sprite(headStartX,headStartY+100, 'leg');
  // game.physics.box2d.enable(leftLeg);
  // leftLeg.scale.setTo(.35);
  // leftLeg.body.setRectangle(leftLeg.width,leftLeg.height);
  // leftThigh = game.add.sprite(headStartX-10, headStartY+100, 'thigh');
  // game.physics.box2d.enable(leftThigh);
  // leftThigh.scale.setTo(.35);
  // leftThigh.body.setRectangle(leftThigh.width,leftThigh.height);; 
  // leftUpperArm = game.add.sprite(headStartX,headStartY+50, 'leftUpperArm');
  // game.physics.box2d.enable(leftUpperArm);
  // leftUpperArm.scale.setTo(.35);
  // leftUpperArm.body.setRectangle(leftUpperArm.width,leftUpperArm.height);;
  // leftLowerArm = game.add.sprite(headStartX,headStartY+50, 'leftLowerArm');
  // game.physics.box2d.enable(leftLowerArm);
  // leftLowerArm.scale.setTo(.35);
  // leftLowerArm.body.setRectangle(leftLowerArm.width,leftLowerArm.height);;
  // head = game.add.sprite(headStartX,headStartY, 'head');
  // game.physics.box2d.enable(head);
  // head.scale.setTo(.3); 
  // head.body.setRectangle(head.width,head.height);;
  // rightFoot = game.add.sprite(headStartX,headStartY+150, 'foot');
  // game.physics.box2d.enable(rightFoot);
  // rightFoot.scale.setTo(.35);
  // rightFoot.body.setRectangle(rightFoot.width,rightFoot.height);
   rightLeg = game.add.sprite(headStartX,headStartY+100, 'leg');
  game.physics.box2d.enable(rightLeg);
  rightLeg.scale.setTo(.35);
  rightLeg.body.setRectangle(rightLeg.width,rightLeg.height);;
  rightThigh = game.add.sprite(headStartX-10,headStartY, 'thigh');
  game.physics.box2d.enable(rightThigh);
  rightThigh.scale.setTo(.35);
  rightThigh.body.setRectangle(rightThigh.width,rightThigh.height);;
  body = game.add.sprite(headStartX-10,headStartY+50, 'body');
  game.physics.box2d.enable(body);
  body.scale.setTo(.3);
  body.body.setRectangle(body.width,body.height*.8);
rightThigh.visible = false;
  body.visible = false;
 //leftFoot.visible = false;
// leftLeg.visible = false;
// leftThigh.visible = false;
rightLeg.visible = false;
//rightFoot.visible = false;
body.body.static = true;
  // rightArm = game.add.sprite(headStartX,headStartY+50, 'rightArm');
  // game.physics.box2d.enable(rightArm);
  // rightArm.scale.setTo(.35);
  // rightArm.body.setRectangle(rightArm.width,rightArm.height);;
  //bodyA, bodyB, ax, ay, bx, by, motorSpeed, motorTorque, motorEnabled, lowerLimit, upperLimit, limitEnabled
   rightHipJoint = game.physics.box2d.revoluteJoint(rightThigh, body, 0, -40, 0, 30, 0, 10, true, hipLimits[0], hipLimits[1], true);
   
   rightKneeJoint = game.physics.box2d.revoluteJoint(rightThigh, rightLeg, 0,10,-10,-50, 100,motorTorque, true, kneeLimits[0], kneeLimits[1], true);
 // leftAnkleJoint = game.physics.box2d.revoluteJoint(leftFoot, leftLeg, -5,-10,5,20, 100, motorTorque, true, ankleLimits[0], ankleLimits[1], true);
//  rightAnkleJoint = game.physics.box2d.revoluteJoint(rightFoot, rightLeg, -5,-10,5,20, 100, motorTorque, true, ankleLimits[0], ankleLimits[1], true);
//  leftKneeJoint = game.physics.box2d.revoluteJoint(leftThigh, leftLeg, -10,10,-10,-40, 100, motorTorque, true, kneeLimits[0], kneeLimits[1], true);
//  leftHipJoint = game.physics.box2d.revoluteJoint(leftThigh, body, 0, 0, 0, 0, 360, 100, true);
 // neckJoint = game.physics.box2d.weldJoint(head, body, 0,47,0,-47);
 // leftShoulderJoint = game.physics.box2d.revoluteJoint(leftUpperArm, body, 0,-50,0,-45, 0, 0, true, -10, 0, true);
 // leftElbowJoint = game.physics.box2d.revoluteJoint(leftLowerArm, leftUpperArm, 0,-50,0,-45, 0, 0, true, -10, 0, true);
//  leftUpperArm.body.setCollisionMask(1);
//  rightUpperArm.body.setCollisionMask(2);
//  leftLowerArm.body.setCollisionMask(1);
//  rightLowerArm.body.setCollisionMask(2);
// leftLeg.body.setCollisionMask(1);
 rightLeg.body.setCollisionMask(2);
 //leftThigh.body.setCollisionMask(1);
 rightThigh.body.setCollisionMask(2);
 //leftFoot.body.setCollisionMask(1);
 //rightFoot.body.setCollisionMask(2);
 QKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
}

function update() {
  if (QKey.isDown) {
  console.log('qpressed');
  //leftHipJoint.SetMotorSpeed(1000);
  rightHipJoint.SetMotorSpeed(-1000);
  keyState = 'Q';
  QPressed = true;
  }
}

function render() {
game.debug.box2dWorld();
}