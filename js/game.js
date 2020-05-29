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
  
  leftFoot = game.add.sprite(headStartX,headStartY+150, 'foot');
  game.physics.box2d.enable(leftFoot);
  leftFoot.scale.setTo(.35);
  leftFoot.body.setRectangle(leftFoot.width,leftFoot.height);
  leftLeg = game.add.sprite(headStartX,headStartY+100, 'leg');
  game.physics.box2d.enable(leftLeg);
  leftLeg.scale.setTo(.35);
  leftLeg.body.setRectangle(leftLeg.width,leftLeg.height);
  leftThigh = game.add.sprite(headStartX-10, headStartY+100, 'thigh');
  game.physics.box2d.enable(leftThigh);
  leftThigh.scale.setTo(.35);
  leftThigh.body.setRectangle(leftThigh.width,leftThigh.height);; 
  leftUpperArm = game.add.sprite(headStartX,headStartY+50, 'leftUpperArm');
  game.physics.box2d.enable(leftUpperArm);
  leftUpperArm.scale.setTo(.35);
  leftUpperArm.body.setRectangle(leftUpperArm.width,leftUpperArm.height);;
  leftLowerArm = game.add.sprite(headStartX,headStartY+50, 'leftLowerArm');
  game.physics.box2d.enable(leftLowerArm);
  leftLowerArm.scale.setTo(.35);
  leftLowerArm.body.setRectangle(leftLowerArm.width,leftLowerArm.height);;
  head = game.add.sprite(headStartX,headStartY, 'head');
  game.physics.box2d.enable(head);
  head.scale.setTo(.3); 
  head.body.setRectangle(head.width,head.height);;
  rightFoot = game.add.sprite(headStartX,headStartY+150, 'foot');
  game.physics.box2d.enable(rightFoot);
  rightFoot.scale.setTo(.35);
  rightFoot.body.setRectangle(rightFoot.width,rightFoot.height);
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
  rightLowerArm = game.add.sprite(headStartX,headStartY+50, 'rightLowerArm');
  game.physics.box2d.enable(rightLowerArm);
  rightLowerArm.scale.setTo(.35);
  rightLowerArm.body.setRectangle(rightLowerArm.width,rightLowerArm.height);;
  rightUpperArm = game.add.sprite(headStartX,headStartY+50, 'rightUpperArm');
  game.physics.box2d.enable(rightUpperArm);
  rightUpperArm.scale.setTo(.35);
  rightUpperArm.body.setRectangle(rightUpperArm.width,rightUpperArm.height);;

  //bodyA, bodyB, ax, ay, bx, by, motorSpeed, motorTorque, motorEnabled, lowerLimit, upperLimit, limitEnabled
  leftAnkleJoint = game.physics.box2d.revoluteJoint(leftFoot, leftLeg, -9,-10,5,20, 100, 10, true, ankleLimits[0], ankleLimits[1], true);
  rightAnkleJoint = game.physics.box2d.revoluteJoint(rightFoot, rightLeg, -9,-10,5,20, 100, 10, true, ankleLimits[0], ankleLimits[1], true);
  leftKneeJoint = game.physics.box2d.revoluteJoint(leftThigh, leftLeg, 0,10,-8,-40, 0, 0, true, kneeLimits[0], kneeLimits[1], true);
  rightKneeJoint = game.physics.box2d.revoluteJoint(rightThigh, rightLeg, 0,10,-8,-40, 0,0, true, kneeLimits[0], kneeLimits[1], true);
  rightShoulderJoint = game.physics.box2d.revoluteJoint(rightUpperArm, body, 4,10,-4,-15, 0, 0, true, shoulderLimits[0], shoulderLimits[1], true);
  leftShoulderJoint = game.physics.box2d.revoluteJoint(leftUpperArm, body,  0,10,0,-10, 0, 0, true, shoulderLimits[0], shoulderLimits[1], true);
  leftElbowJoint = game.physics.box2d.revoluteJoint(leftLowerArm, leftUpperArm, -15,-35,0,25, 0, 0, true, elbowLimits[0], elbowLimits[1], true);
  rightElbowJoint = game.physics.box2d.revoluteJoint(rightLowerArm, rightUpperArm, -15,-35,0,25, 0, 0, true, elbowLimits[0], elbowLimits[1], true);

  rightHipJoint = game.physics.box2d.revoluteJoint(rightThigh, body, 0, -40, 0, 40, 0, 10, true, hipLimits[0], hipLimits[1], true);
  leftHipJoint = game.physics.box2d.revoluteJoint(leftThigh, body, 0, -40, 0, 40, 0, 0, true, hipLimits[0], hipLimits[1], true);
  neckJoint = game.physics.box2d.weldJoint(head, body, 0,47,0,-47);
  // body.visible = false;
  // rightUpperArm.visible = false;
  // rightLowerArm.visible = false;
  leftFoot.body.setCollisionMask(1);
  leftUpperArm.body.setCollisionMask(2);
  leftLowerArm.body.setCollisionMask(2);
  leftLeg.body.setCollisionMask(1);
  leftThigh.body.setCollisionMask(1);
  rightFoot.body.setCollisionMask(2);
  rightUpperArm.body.setCollisionMask(2);
  rightLowerArm.body.setCollisionMask(2);
  rightLeg.body.setCollisionMask(2);
  rightThigh.body.setCollisionMask(2);
  // lockRevoluteJoint(leftKneeJoint);
  // lockRevoluteJoint(rightKneeJoint);
  // lockRevoluteJoint(leftHipJoint);
  // lockRevoluteJoint(rightHipJoint);
  // lockRevoluteJoint(leftShoulderJoint,8000);
  // lockRevoluteJoint(rightShoulderJoint,8000);
  curX = getHipBaseX();
  head.body.static = true;

  rightKneeJoint.angle = r_kneeAngle;
  leftKneeJoint.angle = l_kneeAngle;
  rightThigh.body.angle -=.5;
  rightLeg.body.angle+=.5;
  leftThigh.body.angle-=.5;
  leftLeg.body.angle+=.5;
  rightUpperArm.body.angle *=-1;
  leftUpperArm.body.angle*=-1;

  //Draw Ground
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
 floor.setCollisionMask(3);

  QKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
  WKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  OKey = game.input.keyboard.addKey(Phaser.Keyboard.O);
  PKey = game.input.keyboard.addKey(Phaser.Keyboard.P);


  bestDistanceText1 = game.add.text(20,20, '', {
    fill: 'black',
    font: '20pt Calibri',
  });

  totalDistanceText1 = game.add.text(250,20, '', {
    fill: 'black',
    font: '20pt Calibri',
  });

  keystateText1 = game.add.text(500,20, '', {
    fill: 'black',
    font: '20pt Calibri',
  });

  bestDistanceText2 = game.add.text(18,18, '', {
    fill: 'white',
    font: '20pt Calibri',
  });

  totalDistanceText2 = game.add.text(248,18, '', {
    fill: 'white',
    font: '20pt Calibri',
  });

  keystateText2 = game.add.text(498,18, ''+keyState, {
    fill: 'white',
    font: '20pt Calibri',
  });

}
/**
  Return 1 if near upper limit, -1 if near lower limit,
  and 0 if not near a limit.
*/
function kneeAtLimit(kneeJoint) {
  if (kneeJoint.GetJointAngle() < kneeLimits[0]+0.2) {
      return -1;
  } else if (kneeJoint.GetJointAngle() > kneeLimits[1]-0.2) {
      return 1;
  } else {
     return 0;
  }
}

/**
Return 1 if near upper limit, -1 if near lower limit,
and 0 if not near a limit.
*/
function hipAtLimit(hipJoint) {
  if (hipJoint.GetJointAngle() < hipLimits[0]+0.3) {
      return -1;
  } else if (hipJoint.GetJointAngle() > hipLimits[1]-0.3) {
      return 1;
  } else {
     return 0;
  }
}
function getHipBaseX() {
  var theta = body.body.angle;
  var x = body.body.x;
  return x - 35*Math.sin(theta);
}
function lockRevoluteJoint(joint,torque) {
  torque = torque==undefined ? Infinity : torque;
  joint.SetMaxMotorTorque(torque);
  joint.SetMotorSpeed(0);
  joint.EnableMotor(true);
}

function update() {
    handleInput();
    updateStats();

    if (maintainLeftHipStability) {
      var r = leftHipJoint.m_upperAngle;
      leftHipJoint.SetMotorSpeed(2*(l_hipAngle - r));
  }
  if (maintainRightHipStability) {
      r = rightHipJoint.m_upperAngle;
      rightHipJoint.SetMotorSpeed(2*(r_hipAngle - r));
  }
  if (maintainLeftKneeStability) {
      var r = leftKneeJoint.m_upperAngle;
      leftKneeJoint.SetMotorSpeed(2*(l_kneeAngle - r));
  }
  if (maintainRightKneeStability) {
      r = rightKneeJoint.m_upperAngle;
      rightKneeJoint.SetMotorSpeed(2*(r_kneeAngle - r));
  }

  curX = getHipBaseX();
var newX = getHipBaseX();
var dx = (newX - curX)/25
totalDistTraveled += dx;
farthestDistTraveled = Math.max(farthestDistTraveled,totalDistTraveled);
curX = newX;
prevVelX = curVelX;
curVelX = dx/freq;
prevHipJointAngle = hipJointAngle;
hipJointAngle = rightHipJoint.m_upperAngle - leftHipJoint.m_upperAngle;

if (!step_phase[0]) {
  if (hipJointAngle < -1.5 && hasContact(rightLeg,floor)) {
      // right foot backwards
      lastStepX = getHipBaseX();
      stepBeginAngle = hipJointAngle;
      stepBackLeg = rightLeg;
      stepBackJoint = rightKneeJoint;
      stepForwardLeg = leftLeg;
      step_phase[0] = true;
      if (aimode) {
          notifyStepBegun();
      }
      if (recordingSteps) {
          startRecording();
          console.log('(+) WALK INITIATED');
      }
  } else if (hipJointAngle > 1.5 && hasContact(leftLeg,floor)) {
      // left foot backwards
      lastStepX = getHipBaseX();
      stepBeginAngle = hipJointAngle;
      stepBackLeg = leftLeg;
      stepBackJoint = leftKneeJoint;
      stepForwardLeg = rightLeg;
      step_phase[0] = true;
      if (aimode) {
          notifyStepBegun();
      }
      if (recordingSteps) {
          startRecording();
          console.log('(+) WALK INITIATED');
      }
  }
}

if (step_phase[0] && !step_phase[1] && hipJointAngle*prevHipJointAngle < 0) {
  step_phase[1] = true;
  if (aimode) {
      notifyHalfStep();
  }
  if (recordingSteps) {
      console.log('(+) HALF STEP DETECTED');
  }
}

if (step_phase[0] && step_phase[1]) {
  if (hipJointAngle*stepBeginAngle < -2.5 &&
  getFootY(stepBackLeg) < 20 &&
  Math.abs(body.body.angle()+0.25) < 0.4) {

      var cBaseHipX = getHipBaseX();
      var dist = cBaseHipX - lastStepX;

      if (recordingSteps) {
          endRecording((dist>0),dist);
      }

      // back foot is now forwards
      totalStepsTraveled++;
      stepBeginAngle = hipJointAngle;
      stepBackLeg = (stepBackLeg == leftLeg ? rightLeg : leftLeg);
      stepBackJoint = (stepBackLeg == leftKneeJoint ? rightKneeJoint : leftKneeJoint);
      step_phase[0] = true;
      step_phase[1] = false;
      if (aimode) {
          notifyStepComplete(dist);
      }

      if (recordingSteps) {
          console.log('(+) STEP DETECTED: DISTANCE OF ' + dist);
          startRecording();
      }

      stepDistances.push(dist);
      lastStepX = cBaseHipX % 500;
  }
}


}
function handleInput(){
  if (QKey.isDown) {
    if (maintainLeftHipStability) {
      maintainLeftHipStability = false;
  }
  leftHipJoint.SetMotorSpeed(l_hip_rotate_speed);
  rightHipJoint.SetMotorSpeed(-r_hip_rotate_speed);
  keyState = 'Q';
  QPressed = true;
  }
  if (WKey.isDown) {
    if (maintainRightHipStability) {
      maintainRightHipStability = false;
  }
  leftHipJoint.SetMotorSpeed(-l_hip_rotate_speed);
  rightHipJoint.SetMotorSpeed(r_hip_rotate_speed);
    keyState = 'W';
    WPressed = true;
    }
  if (OKey.isDown) {
    if (maintainLeftKneeStability || maintainRightKneeStability) {
      maintainLeftKneeStability = false;
      maintainRightKneeStability = false;
  }
  leftKneeJoint.SetMotorSpeed(l_knee_rotate_speed);
  rightKneeJoint.SetMotorSpeed(-r_knee_rotate_speed);
   keyState = 'O';
   OPressed = true;
    }
  if (PKey.isDown) {
    if (maintainRightKneeStability || maintainLeftKneeStability) {
      maintainLeftKneeStability = false;
      maintainRightKneeStability = false;
    }
  rightKneeJoint.SetMotorSpeed(r_knee_rotate_speed);
  leftKneeJoint.SetMotorSpeed(-l_knee_rotate_speed);
    keyState = 'P';
    PPressed = true;
    }

    if (QPressed && QKey.isUp) {
      maintainLeftHipStability = true;
      leftHipJoint.SetMotorSpeed(0);
      rightHipJoint.SetMotorSpeed(0);
      l_hipAngle = leftHipJoint.m_upperAngle;
      r_hipAngle = rightHipJoint.m_upperAngle;
      QPressed = false;
    }

  if (WPressed && WKey.isUp) {
      maintainRightHipStability = true;
      rightHipJoint.SetMotorSpeed(0);
      leftHipJoint.SetMotorSpeed(0);
      r_hipAngle = rightHipJoint.m_upperAngle;
      l_hipAngle = leftHipJoint.m_upperAngle;
      WPressed = false;
  }
  
  if (OPressed && OKey.isUp) {
    maintainLeftKneeStability = true;
      maintainRightKvneeStability = true;
      leftKneeJoint.SetMotorSpeed(0);
      rightKneeJoint.SetMotorSpeed(0);
      l_kneeAngle = leftKneeJoint.m_upperAngle;
      r_kneeAngle = rightKneeJoint.m_upperAngle;
      OPressed = false;
  }
  
  if (PPressed && PKey.isUp) {
    maintainLeftKneeStability = true;
      maintainRightKneeStability = true;
      rightKneeJoint.SetMotorSpeed(0);
      leftKneeJoint.SetMotorSpeed(0);
      l_kneeAngle = leftKneeJoint.m_upperAngle;
      r_kneeAngle = rightKneeJoint.m_upperAngle;
      PPressed = false;
  }
}


  function updateStats() {
    bestDistanceText1.setText('Best Distance: ' + Math.floor(farthestDistTraveled) + ' m');
    bestDistanceText2.setText('Best Distance: ' + Math.floor(farthestDistTraveled) + ' m');
    totalDistanceText1.setText('Total Distance: ' + Math.floor(totalDistTraveled) + ' m');
    totalDistanceText2.setText('Total Distance: ' + Math.floor(totalDistTraveled) + ' m');
    keystateText1.setText('Keystate: '+ keyState);
    keystateText2.setText('Keystate: '+ keyState);
}

function getFootY(foot) {
  return (foot.GetUserData()=='ll_leg' ? getLeftFootY() : getRightFootY());
}

function getLeftFootY(bd) {
  bd = (bd==undefined) ? body : bd;
  return bd.ll_leg.GetPosition().y - (20 * cos(bd.ll_leg.GetAngle()));
}

function getRightFootY(bd) {
  bd = (bd==undefined) ? body : bd;
  return bd.lr_leg.GetPosition().y - (20 * cos(bd.lr_leg.GetAngle()));
}

function getFootX(foot) {
  return (foot.GetUserData()=='ll_leg' ? getLeftFootX() : getRightFootX());
}

function getLeftFootX(bd) {
  bd = (bd==undefined) ? body : bd;
  return bd.ll_leg.GetPosition().x + (20 * sin(bd.ll_leg.GetAngle()));
}

function getRightFootX(bd) {
  bd = (bd==undefined) ? body : bd;
  return bd.lr_leg.GetPosition().x + (20 * sin(bd.lr_leg.GetAngle()));
}

function render() {
  //  if (level4bkgd1 != null)
  //   game.debug.body(level4bkgd1);
 // game.debug.box2dWorld();
  // if (hunter != null)
  //   game.debug.body(hunter);
}