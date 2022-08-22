const game = new Phaser.Game(800, 600, Phaser.BOX2D, 'game', {
    preload,
    create,
    update,
    render,
  });
 

function create(){
  game.stage.backgroundColor = '#124184';
  game.physics.startSystem(Phaser.Physics.BOX2D);
  game.physics.box2d.debugDraw.joints = true;
  game.physics.box2d.gravity.y = 500;
  game.physics.box2d.setBoundsToWorld();
  Head = game.add.sprite(startX, startY, 'head');
  game.physics.box2d.enable(Head);
  Head.linearDamping = 4; // makes the Body fall slower (heavy air resistance)
  Head.body.setCircle(Head.width/4.5);
  Head.mass = .1;
  Head.scale.setTo(.5,.5);
  Body = game.add.sprite(startX, startY, 'body');
  Body.mass = 1;
  game.physics.box2d.enable(Body);
  Body.body.setPolygon(BodyVertices);
  Body.scale.setTo(.5,.5);
  //bodyA, bodyB, ax, ay, bx, by, motorSpeed, motorTorque, motorEnabled, lowerLimit, upperLimit, limitEnabled
  Neck = game.physics.box2d.revoluteJoint(Body, Head, 50, -150, 0,Head.width/4.5);
  Neck.m_localAnchorA.SetXY(0,2);
  Neck.m_localAnchorB.SetXY(0,-1);
  Neck.m_enableLimit = true;
  //game.m_loweAngle=5;
  RThigh = game.add.sprite(startX, startY, 'thigh');
  RThigh.mass = 1;
  game.physics.box2d.enable(RThigh);
  RThigh.scale.setTo(.75,.65);
  RThigh.body.setRectangle(90,100);
  RHip = game.physics.box2d.revoluteJoint(Body, RThigh, 0, 100, 0,-50);
  RHip.m_enableLimit = true;
  RCalf = game.add.sprite(startX, startY, 'leg');
  RCalf.mass = 1;
  game.physics.box2d.enable(RCalf);
  RCalf.scale.setTo(.65,.65);
  RCalf.body.setRectangle(50,100);
  RKnee = game.physics.box2d.revoluteJoint(RThigh, RCalf, 0, 50, 0,-50);
  RKnee.m_enableLimit = true;
  RFoot = game.add.sprite(startX, startY, 'foot');
  RFoot.mass = 1;
  game.physics.box2d.enable(RFoot);
  RFoot.scale.setTo(.65,.65);
  RFoot.body.setRectangle(100,40);
  RAnkle = game.physics.box2d.revoluteJoint(RCalf, RFoot, 0, 80, -25,20);
  RAnkle.m_enableLimit = true;
  // RUpperArm = game.add.sprite(startX, startY, 'upperArm');
  // RUpperArm.mass = 1;
  // game.physics.box2d.enable(RUpperArm);
  // RFoot.scale.setTo(.65,.65);
  // RFoot.body.setRectangle(100,100);
  // RShoulder = game.physics.box2d.revoluteJoint(RCalf, RFoot, 0, 100, 0,-50);

//   console.log(game);
}

function update(){

}

function render(){
    game.debug.box2dWorld();
}