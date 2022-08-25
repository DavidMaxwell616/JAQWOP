var game = new Phaser.Game(800, 500, Phaser.BOX2D, 'phaser-example', 
{ create: create, 
  update: update, 
  render: render });



function create() {
 
  game.stage.backgroundColor = '#124184';

    // Enable Box2D physics
    game.physics.startSystem(Phaser.Physics.BOX2D);
    
    game.physics.box2d.gravity.y = 500;
    game.physics.box2d.friction = 1;
    game.physics.box2d.restitution = 0.1;
    game.physics.box2d.debugDraw.joints = true;
    game.physics.box2d.setBoundsToWorld();
    
    //  Create a static rectangle body for the ground. This gives us something solid to attach our crank to
    ground = new Phaser.Physics.Box2D.Body(this.game, null, game.world.centerX, 490, 0);
    ground.setRectangle(800, 20, 0, 0, 0);
    ground.friction=1;

    createBodiesAndJoints();
    var font= "20pt Calibri";
    var color = "#ffffff";
  
  keyState = ''; 
  bestDistText = drawText('Best Distance: ' + Math.floor(farthestDistTraveled) + ' m',50,30,font,color);
  timeText = drawText('Time Elapsed: ' + Math.round(elapsedTime*10)/10 + ' s',300,30,font, color);
  totalDistText = drawText('Total Distance: ' + Math.floor(totalDistTraveled) + ' m',50,60,font, color);
  velocityText = drawText('Velocity: ' + Math.round(10*curVelX)/10 + ' m/s',300,60,font, color);
  KeyStateText = drawText('Keystate: ' + keyState,50,90,font,color);
  
   
  QKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
  QKey.onDown.add(function(event) {
    handleQPressed(); }, this);  
  QKey.onUp.add(function(event) {
      handleQReleased(); }, this);  
  WKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  WKey.onDown.add(function(event) {
  handleWPressed();}, this);  
  WKey.onUp.add(function(event) {
    handleWReleased(); }, this);  
  OKey = game.input.keyboard.addKey(Phaser.Keyboard.O);
  OKey.onDown.add(function(event) {
    handleOPressed();}, this);  
  OKey.onUp.add(function(event) {
      handleOReleased(); }, this);  
  PKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
  PKey.onDown.add(function(event) {
    handlePPressed();}, this);  
  PKey.onUp.add(function(event) {
      handlePReleased(); }, this);  
  SpaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACE);
  SpaceKey.onDown.add(function(event) {
    handleSpacePressed();}, this);  
  
}

function drawText(text, x, y, font, color) {
 var text = game.add.text(x, y, text, {
    fill: color,
    font: font,
  });
  text.setShadow(-5, 5, 'rgba(0,0,0,0.5)', 0);
  return text;
}

function handleQPressed(){
  rightHip.SetMotorSpeed(walkSpeed);
  leftHip.SetMotorSpeed(-walkSpeed);
  keyState = 'Q';
}

function handleQReleased(){
  rightHip.SetMotorSpeed(0);
  leftHip.SetMotorSpeed(0);
  keyState = '';
}  

function handleOPressed(){
  leftKnee.SetMotorSpeed(walkSpeed);
  rightKnee.SetMotorSpeed(-walkSpeed);
  keyState = 'O';
}

function handleOReleased(){
  leftKnee.SetMotorSpeed(0);
  rightKnee.SetMotorSpeed(0);
  keyState = '';
}  

function handleWPressed(){
  leftHip.SetMotorSpeed(-walkSpeed);
  rightHip.SetMotorSpeed(walkSpeed);
  keyState = 'W';
}

function handleWReleased(){
  leftHip.SetMotorSpeed(0);
  rightHip.SetMotorSpeed(0);
  keyState = '';
}  

function handlePPressed(){
  rightKnee.SetMotorSpeed(walkSpeed);
  leftKnee.SetMotorSpeed(-walkSpeed);
  keyState = 'P';
}

function handlePReleased(){
  rightKnee.SetMotorSpeed(0);
  leftKnee.SetMotorSpeed(0);
  keyState = '';
}  

function createBodiesAndJoints(){
  //Revolute Joint Parameters:
 //bodyA, 
 //bodyB, 
 //ax, 
 //ay, 
 //bx, 
 //by, 
 //motorSpeed, 
 //motorTorque, 
 //motorEnabled, 
 //lowerLimit, 
 //upperLimit, 
 //limitEnabled

 rightThigh = new Phaser.Physics.Box2D.Body(this.game, null, originX, originY+150, 2);
 rightThigh.setRectangle(15, 80, 0, 0, 0);

 rightLeg = new Phaser.Physics.Box2D.Body(this.game, null, originX, originY+160, 2);
 rightLeg.setRectangle(15, 80, 0, 0, 0);
 rightKnee = game.physics.box2d.revoluteJoint(rightThigh, rightLeg, 0, 30, 0, -40,0,motorTorque,true,kneeLimits[0],kneeLimits[1],true);

 rightFoot = new Phaser.Physics.Box2D.Body(this.game, null, originX,originY+200, 2);
 rightFoot.setRectangle(50, 15, 0, 0, 0);
 rightAnkle = game.physics.box2d.revoluteJoint(rightLeg, rightFoot, 0, 40, -10, 0,0,motorTorque,true,ankleLimits[0], ankleLimits[1], true);

 upperRightArm = new Phaser.Physics.Box2D.Body(this.game, null, originX, originY, 2);
 upperRightArm.setRectangle(15, 80, 0, 0, 0);

 lowerRightArm = new Phaser.Physics.Box2D.Body(this.game, null, originX, originY, 2);
 lowerRightArm.setRectangle(15, 80, 0, 0, 0);
 rightElbow = game.physics.box2d.revoluteJoint(upperRightArm,lowerRightArm,  0, 40, 0, -30,0,motorTorque,false,elbowLimits[0],elbowLimits[1],true);

 body = new Phaser.Physics.Box2D.Body(this.game, null, originX,originY, 2);
 body.setRectangle(40, 120, 0, 0, 0);
 head = new Phaser.Physics.Box2D.Body(this.game, null, originX, originY-50, 2);
 head.setCircle(25, 25, 0, 0, 0);
 var neck = game.physics.box2d.weldJoint(head, body, 20,50,0,-45);
 //body.static = true;

 rightHip = game.physics.box2d.revoluteJoint(body, rightThigh, 0, 40, 0, -50,0,motorTorque,true,hipLimits[0], hipLimits[1], true);
 rightShoulder = game.physics.box2d.revoluteJoint(upperRightArm, body, 0, -50, 0, -60,0,motorTorque,true,shoulderLimits[0],shoulderLimits[1],true);
 //prismatic joint between the piston and the ground, this joints purpose is just to restrict the piston from moving on the x axis
 //game.physics.box2d.prismaticJoint(ground, body, 0, 1, 0, 0, 0, 0);

 leftThigh = new Phaser.Physics.Box2D.Body(this.game, null, originX, originY+150, 2);
 leftThigh.setRectangle(15, 80, 0, 0, 0);

 leftLeg = new Phaser.Physics.Box2D.Body(this.game, null, originX, originY+160, 2);
 leftLeg.setRectangle(15, 80, 0, 0, 0);
 leftKnee = game.physics.box2d.revoluteJoint(leftThigh, leftLeg, 0, 30, 0, -40,0,motorTorque,true,kneeLimits[0],kneeLimits[1],true);
 leftHip = game.physics.box2d.revoluteJoint(body, leftThigh, 0, 40, 0, -50,0,motorTorque,true,hipLimits[0], hipLimits[1], true);

 leftFoot = new Phaser.Physics.Box2D.Body(this.game, null, originX,originY+200, 2);
 leftFoot.setRectangle(50, 15, 0, 0, 0);
 leftAnkle = game.physics.box2d.revoluteJoint(leftLeg, leftFoot, 0, 40, -10, 0,0,motorTorque,true,ankleLimits[0], ankleLimits[1], true);

 upperLeftArm = new Phaser.Physics.Box2D.Body(this.game, null, originX, originY, 2);
 upperLeftArm.setRectangle(15, 80, 0, 0, 0);
 leftShoulder = game.physics.box2d.revoluteJoint(upperLeftArm, body, 0, -50, 0, -60,0,motorTorque,true,shoulderLimits[0],shoulderLimits[1],true);

 lowerLeftArm = new Phaser.Physics.Box2D.Body(this.game, null, originX, originY, 2);
 lowerLeftArm.setRectangle(15, 80, 0, 0, 0);
 leftElbow = game.physics.box2d.revoluteJoint(upperLeftArm,lowerLeftArm,  0, 40, 0, -30,0,motorTorque,false,elbowLimits[0],elbowLimits[1],true);

 //setup collision categories
 leftFoot.setCollisionCategory(CATEGORY_BODYPARTS);
 upperLeftArm.setCollisionCategory(CATEGORY_BODYPARTS);
 lowerLeftArm.setCollisionCategory(CATEGORY_BODYPARTS);
 leftLeg.setCollisionCategory(CATEGORY_BODYPARTS);
 leftThigh.setCollisionCategory(CATEGORY_BODYPARTS);

 rightFoot.setCollisionCategory(CATEGORY_BODYPARTS);
 upperRightArm.setCollisionCategory(CATEGORY_BODYPARTS);
 lowerRightArm.setCollisionCategory(CATEGORY_BODYPARTS);
 rightLeg.setCollisionCategory(CATEGORY_BODYPARTS);
 rightThigh.setCollisionCategory(CATEGORY_BODYPARTS);

 body.setCollisionCategory(CATEGORY_BODYPARTS);
 head.setCollisionCategory(CATEGORY_BODYPARTS);
 ground.setCollisionCategory(CATEGORY_GROUND);

 leftFoot.setCollisionMask(MASK_BODYPARTS);
 upperLeftArm.setCollisionMask(MASK_BODYPARTS);
 lowerLeftArm.setCollisionMask(MASK_BODYPARTS);
 leftLeg.setCollisionMask(MASK_BODYPARTS);
 leftThigh.setCollisionMask(MASK_BODYPARTS);

 rightFoot.setCollisionMask(MASK_BODYPARTS);
 upperRightArm.setCollisionMask(MASK_BODYPARTS);
 lowerRightArm.setCollisionMask(MASK_BODYPARTS);
 rightLeg.setCollisionMask(MASK_BODYPARTS);
 rightThigh.setCollisionMask(MASK_BODYPARTS);

 body.setCollisionMask(MASK_BODYPARTS);
 head.setCollisionMask(MASK_BODYPARTS);
 ground.setCollisionMask(MASK_GROUND);
}

function update(){
  updateText();
  if(head.y>ground.y-60)
    ResetBody()
}

function ResetBody(){
 SetPosition(head,originX,originY-50);
 SetPosition(rightThigh.x,originX,originY+150);
 SetPosition(rightLeg,originX, originY+160);
 SetPosition(rightFoot, originX,originY+200);
 SetPosition(body,originX,originY);
 SetPosition(upperRightArm,originX, originY);
 SetPosition(lowerRightArm,originX, originY);
 SetPosition(leftThigh,originX, originY+150);
 SetPosition(leftLeg,originX, originY+160);
 SetPosition(leftFoot,originX,originY+200);
 SetPosition(upperLeftArm,originX, originY);
 SetPosition(lowerLeftArm,originX, originY);
 leftHip.SetMotorSpeed(0);
 rightHip.SetMotorSpeed(0);
 leftKnee.SetMotorSpeed(0);
 rightKnee.SetMotorSpeed(0);
 leftAnkle.SetMotorSpeed(0);
 rightAnkle.SetMotorSpeed(0);
 leftShoulder.SetMotorSpeed(0);
 rightShoulder.SetMotorSpeed(0);
 leftElbow.SetMotorSpeed(0);
 rightElbow.SetMotorSpeed(0);
}

function SetPosition(object,x,y){
  object.x = x;
  object.y = y;
  object.angle =0;
}

function updateText(){
  bestDistText.setText('Best Distance: ' + Math.floor(farthestDistTraveled) + ' m');
  timeText.setText('Time Elapsed: ' + Math.round(elapsedTime*10)/10 + ' s');
  totalDistText.setText('Total Distance: ' + Math.floor(totalDistTraveled) + ' m');
  velocityText.setText('Velocity: ' + Math.round(10*curVelX)/10 + ' m/s');
  KeyStateText.setText('Keystate: ' + keyState);
}

function render() {
  game.debug.box2dWorld();
}
