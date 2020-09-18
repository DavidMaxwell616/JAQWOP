
var game = new Phaser.Game(CANVAS_WIDTH, 500, Phaser.AUTO, 'phaser-example', 
{preload: preload, create: create, update: update});


function create() {
  background = game.add.image(0, 0, 'background');
  background.anchor.setTo(0, 0);
  background.width = CANVAS_WIDTH*1.25;
  background.height = CANVAS_HEIGHT*1.25;
  
  leftArm = game.add.sprite(0, 0, 'leftArm');
  rightArm = game.add.sprite(0, 0, 'rightArm');
  bodyImage = game.add.sprite(0, 0, 'bodyImage');
  thigh = game.add.sprite(0, 0, 'thigh');
  leg = game.add.sprite(0, 0, 'leg');
  head = game.add.sprite(0, 0, 'head');
  leftArm.visible = false;
  rightArm.visible = false;
  bodyImage.visible = false;
  thigh.visible = false;
  leg.visible = false;
  head.visible = false;

  var font= "20pt Calibri";
  var color = "#000000";

bestDistText.push(drawText('Best Distance: ' + Math.floor(farthestDistTraveled) + ' m',50,30,font,color));
timeText.push(drawText('Time Elapsed: ' + Math.round(elapsedTime*10)/10 + ' s',300,30,font, color));
totalDistText.push(drawText('Total Distance: ' + Math.floor(totalDistTraveled) + ' m',50,60,font, color));
velocityText.push(drawText('Velocity: ' + Math.round(10*curVelX)/10 + ' m/s',300,60,font, color));
KeyStateText.push(drawText('Keystate: ' + keyState,50,90,font,color));
 
var color = "#ffffff";

bestDistText.push(drawText('Best Distance: ' + Math.floor(farthestDistTraveled) + ' m',48,28,font,color));
timeText.push(drawText('Time Elapsed: ' + Math.round(elapsedTime*10)/10 + ' s',298,28,font, color));
totalDistText.push(drawText('Total Distance: ' + Math.floor(totalDistTraveled) + ' m',48,58,font, color));
velocityText.push(drawText('Velocity: ' + Math.round(10*curVelX)/10 + ' m/s',298,58,font, color));
KeyStateText.push(drawText('Keystate: ' + keyState,48,88,font,color));

if (aimode && showAIDetails) {
   iterationsText = drawText('Iterations: ' + iterations,100,200,font,"#000000");
    ACTIONS.forEach(function(a,i) {
       qText = drawText('Q(s,'+a+') = '+Math.round(qscores[a]*100)/100,125,250+25*i);
    });
}

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

  // //ctx.fillText('PctErr: ' + Math.round(100*pctErr)/100,100,200);
environment = initWalls(world,worldWidth,worldHeight,24);
graphics = game.add.graphics(0,0);

resetJack();
}

function drawText(text, x, y, font, color) {
  return game.add.text(x, y, text, {
    fill: color,
    font: font,
  });
}

function updateStats(){
for (let index = 0; index < 2; index++) {
  bestDistText[index].setText('Best Distance: ' + Math.floor(farthestDistTraveled) + ' m');
  timeText[index].setText('Time Elapsed: ' + Math.round(elapsedTime*10)/10 + ' s');
  totalDistText[index].setText('Total Distance: ' + Math.floor(totalDistTraveled) + ' m');
  velocityText[index].setText('Velocity: ' + Math.round(10*curVelX)/10 + ' m/s');
  KeyStateText[index].setText('Keystate: ' + keyState);
 }
 if (aimode && showAIDetails) {
  iterationsText = drawText('Iterations: ' + iterations,100,200,font,"#000000");
   ACTIONS.forEach(function(a,i) {
      qText = drawText('Q(s,'+a+') = '+Math.round(qscores[a]*100)/100,125,250+25*i);
   });
 }
} 

function createBall(world, x, y, radius, fixed, density) {

   // radius = 20;

    var bodyDef = new b2BodyDef;
    var fixDef = new b2FixtureDef;

    fixDef.density = density==undefined ? 1 : density;
    fixDef.friction = 5;
    fixDef.restitution = 0.5;

    bodyDef.type = fixed ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

    fixDef.shape = new b2CircleShape(radius);

    bodyDef.position.x = x;
    bodyDef.position.y = y;

    world.CreateBody(bodyDef).CreateFixture(fixDef);
    return world.GetBodyList();
}

function createPolygon(world, x, y, points, fixed, density) {
  
    var bodyDef = new b2BodyDef;
    var fixDef = new b2FixtureDef;

    fixDef.density = density==undefined ? 1 : density;
    fixDef.friction = 15;
    fixDef.restitution = 1;

    bodyDef.type = fixed ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
  
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsArray(
      points.map( function (point) {
        return new b2Vec2(point.x, point.y);
        })
    );

    bodyDef.position.x = x;
    bodyDef.position.y = y;
  
    world.CreateBody(bodyDef).CreateFixture(fixDef);
     return world.GetBodyList();
}

function createBox(world, x, y, width, height, r, fixed, density) {
    if (r == 0 || r == undefined) {
        vtx = [ {'x':-width/2, 'y':-height/2},
            {'x':width/2, 'y':-height/2},
            {'x':width/2, 'y':height/2},
            {'x':-width/2, 'y':height/2}];
             return createPolygon(world, x+(width/2),y+(height/2), vtx, fixed,density);
    } else {
        var cosr = Math.cos(r);
        var sinr = Math.sin(r);
        var dx = width/2, dy = height/2;
        vtx = [ {'x':-dx*cosr+dy*sinr, 'y':-dx*sinr-dy*cosr},
            {'x':dx*cosr+dy*sinr, 'y':dx*sinr-dy*cosr},
            {'x':dx*cosr-dy*sinr, 'y':dx*sinr+dy*cosr},
            {'x':-dx*cosr-dy*sinr, 'y':-dx*sinr+dy*cosr}];
            return createPolygon(world, x+(width/2),y+(height/2), vtx, fixed,density);
    }
}

function initWalls(world, w,h,t) {
    // Create the floor
    var floor = createBox(world, 0,-t/2,w,t,0,true);
    floor.SetUserData('floor');
    // Create the left wall
    var l_wall = createBox(world, -t,-t/2,t,h,0,true);
    l_wall.SetUserData('l_wall');
    // Create the right wall
    var r_wall = createBox(world, w-t/2,0,t,h,0,true);
    r_wall.SetUserData('r_wall');
    return {'floor':floor, 'l_wall':l_wall, 'r_wall':r_wall};
}

function translateBody(dx, dy) {
    (Object.keys(body)).forEach(function(elem) {
        var pos = body[elem].GetPosition();
        body[elem].SetType(b2Body.b2_staticBody);
        body[elem].SynchronizeTransform(new b2Vec2(pos.x+dx,pos.y+dy),0);
        body[elem].SetType(b2Body.b2_dynamicBody);
    });
}

function xToWorld(x) {
    return worldWidth*x/cWidth;
}

function yToWorld(y) {
    return worldHeight*(cHeight-y)/cHeight;
}

function xToCanvas(x) {
    // The x coordinate starts at 0 and ends at 500
    return cWidth*x/worldWidth;
}

function yToCanvas(y) {
    // The y coordinate starts at 500 and ends at 0
    return cHeight*(worldHeight-y)/worldHeight;
}

function toCanvas(x,y) {
    return [xToCanvas(x),yToCanvas(y)];
}

function hasContact(body1, body2) {
    cList = body1.GetContactList();
    while(cList != null) {
        if (cList.other == body2) {
            return true;
        }
        cList = cList.next;
    }
    return false;
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
function handleSpacePressed(keymask) {
 keyState = ' ';
  if (aimode) {
          advance_step();
  } else if (elapsedTime > 1.5) {
      resetJack();
  }
}

function handleQPressed() {
  keyState = 'Q';
  if (maintainLeftHipStability) {
        maintainLeftHipStability = false;
    }
    joint.l_hip.SetMotorSpeed(l_hip_rotate_speed);
    joint.r_hip.SetMotorSpeed(-r_hip_rotate_speed);
}

function handleWPressed() {
  keyState = 'W';
    if (maintainRightHipStability) {
        maintainRightHipStability = false;
    }
    joint.l_hip.SetMotorSpeed(-l_hip_rotate_speed);
    joint.r_hip.SetMotorSpeed(r_hip_rotate_speed);
}

function handleOPressed() {
  keyState = 'O';
    if (maintainLeftKneeStability || maintainRightKneeStability) {
        maintainLeftKneeStability = false;
        maintainRightKneeStability = false;
    }
    joint.l_knee.SetMotorSpeed(l_knee_rotate_speed);
    joint.r_knee.SetMotorSpeed(-r_knee_rotate_speed);
}

function handlePPressed() {
  keyState = 'P';
    if (maintainRightKneeStability || maintainLeftKneeStability) {
        maintainLeftKneeStability = false;
        maintainRightKneeStability = false;
    }
    joint.r_knee.SetMotorSpeed(r_knee_rotate_speed);
    joint.l_knee.SetMotorSpeed(-l_knee_rotate_speed);
}

function handleQReleased() {
  keyState = '';
    maintainLeftHipStability = true;
    joint.l_hip.SetMotorSpeed(0);
    joint.r_hip.SetMotorSpeed(0);
    l_hipAngle = joint.l_hip.GetJointAngle();
    r_hipAngle = joint.r_hip.GetJointAngle();
}

function handleWReleased() {
  keyState = '';
    maintainRightHipStability = true;
    joint.r_hip.SetMotorSpeed(0);
    joint.l_hip.SetMotorSpeed(0);
    r_hipAngle = joint.r_hip.GetJointAngle();
    l_hipAngle = joint.l_hip.GetJointAngle();
}

function handleOReleased() {
  keyState = '';
    maintainLeftKneeStability = true;
    maintainRightKneeStability = true;
    joint.l_knee.SetMotorSpeed(0);
    joint.r_knee.SetMotorSpeed(0);
    l_kneeAngle = joint.l_knee.GetJointAngle();
    r_kneeAngle = joint.r_knee.GetJointAngle();
}

function handlePReleased() {
  keyState = '';
    maintainLeftKneeStability = true;
    maintainRightKneeStability = true;
    joint.r_knee.SetMotorSpeed(0);
    joint.l_knee.SetMotorSpeed(0);
    l_kneeAngle = joint.l_knee.GetJointAngle();
    r_kneeAngle = joint.r_knee.GetJointAngle();
}

listener.PreSolve = function(contact, oldManifold) {
    body_A = contact.GetFixtureA().GetBody();
    body_B = contact.GetFixtureB().GetBody();
    if (body_A == environment.r_wall || body_B == environment.r_wall) {
        requestTeleport = true;
    } else if (autoReset) {
        if (body_A == environment.floor) {
            if (body_B !== body.ll_leg && body_B !== body.ul_leg &&
             body_B !== body.lr_leg && body_B !== body.ur_leg) {
                requestReset = true;
            }
        } else if (body_B == environment.floor) {
            if (body_A !== body.ll_leg && body_A !== body.ul_leg &&
             body_A !== body.lr_leg && body_A !== body.ur_leg) {
                requestReset = true;
            }
        }
    }
}
world.SetContactListener(listener);

function shiftBodyX(dx,dy) {
    Object.keys(body).forEach(function(part) {
        var b = body[part];
        var newPos = new b2Vec2(b.GetWorldCenter().x+dx,b.GetWorldCenter().y+dy);
        b.SetPosition(newPos);
    });
}

function lockRevoluteJoint(joint,torque) {
    torque = torque==undefined ? Infinity : torque;
    joint.SetMaxMotorTorque(torque);
    joint.SetMotorSpeed(0);
    joint.EnableMotor(true);
}

function resetJack() {

    if (init) {
        // Has already been initialized at least once
        Object.keys(body).forEach( function(part) {
            world.DestroyBody(body[part]);
        });
        Object.keys(joint).forEach( function(part) {
            world.DestroyJoint(joint[part]);
        });
        recordedMoves = [{'key':'none', 'type':'initialization', 'time':0}];
        elapsedTime = 0.0;
        totalDistTraveled = 0.0;
        totalStepsTraveled = 0;
    }

    maintainLeftHipStability = true;
    maintainLeftKneeStability = true;
    maintainRightHipStability = true;
    maintainRightKneeStability = true;

    joint = {};
    body = {};

    l_kneeAngle = 0.175, r_kneeAngle = 0.175;
    l_hipAngle = -0.25, r_hipAngle = 0.5;

    init = true;
  
    // Create all body parts
    var r_arm = createBox(world, startX-10, startY-34, 40, 8, 0, false, 0.1);
    var torso = createBox(world, startX-16, startY-92, 32, 70, 0, false, 5);
    var head = createBall(world, startX, startY+10, 25, false, 0.1);
    var ul_leg = createBox(world,startX-2,startY-126,10,40,Math.PI/6,false,10);
    var ll_leg = createBox(world,startX-2,startY -144,10,40,-Math.PI/6,false,10);
    var ur_leg = createBox(world,startX-2,startY-116,10,40,Math.PI/6,false,10);
    var lr_leg = createBox(world,startX-2,16,10,40,-Math.PI/6,false,10);
    var l_arm = createBox(world, startX-48, startY-34, 40, 8, 0, false, 0.1);
  
    curVelX = 0.0;
    // var prevVelX = 0.0;

    // Track joints and body components
    body.head = head;
    body.r_arm = r_arm;
    body.ll_leg = ll_leg;
    body.ul_leg = ul_leg;
    body.lr_leg = lr_leg;
    body.ur_leg = ur_leg;
    body.torso = torso;
    body.l_arm = l_arm;
    head.SetUserData('head');
    r_arm.SetUserData('r_arm');
    ll_leg.SetUserData('ll_leg');
    ul_leg.SetUserData('ul_leg');
    lr_leg.SetUserData('lr_leg');
    ur_leg.SetUserData('ur_leg');
    torso.SetUserData('torso');
    l_arm.SetUserData('l_arm');

    // Connect head and torso
    var neck_jointDef = new b2WeldJointDef();
    var neck_anchor = head.GetWorldCenter();
    neck_anchor.y = neck_anchor.y - 20;
    neck_jointDef.Initialize(head, torso, neck_anchor);
    var neck_joint = world.CreateJoint(neck_jointDef);

    // Connect left arm to torso
    var l_arm_jointDef = new b2RevoluteJointDef();
    var l_arm_anchor = l_arm.GetWorldCenter();
    l_arm_anchor.x = l_arm_anchor.x + 15;
    l_arm_jointDef.Initialize(l_arm, torso, l_arm_anchor);
    var l_arm_joint = world.CreateJoint(l_arm_jointDef);

    // Connect right arm to torso
    var r_arm_jointDef = new b2RevoluteJointDef();
    var r_arm_anchor = r_arm.GetWorldCenter();
    r_arm_anchor.x = r_arm_anchor.x - 15;
    r_arm_jointDef.Initialize(r_arm, torso, r_arm_anchor);
    var r_arm_joint = world.CreateJoint(r_arm_jointDef);

    // Connect upper, lower left leg
    var l_knee_jointDef = new b2RevoluteJointDef();
    var l_knee_anchor = ul_leg.GetWorldCenter();
    l_knee_anchor.x = l_knee_anchor.x + 8.25;
    l_knee_anchor.y = l_knee_anchor.y - 14.3;
    l_knee_jointDef.Initialize(ul_leg, ll_leg, l_knee_anchor);
    var l_knee_joint = world.CreateJoint(l_knee_jointDef);

    // Connect upper, lower right leg
    var r_knee_jointDef = new b2RevoluteJointDef();
    var r_knee_anchor = ur_leg.GetWorldCenter();
    r_knee_anchor.x = r_knee_anchor.x + 8.25;
    r_knee_anchor.y = r_knee_anchor.y - 14.3;
    r_knee_jointDef.Initialize(ur_leg, lr_leg, r_knee_anchor);
    var r_knee_joint = world.CreateJoint(r_knee_jointDef);

    // Attach left, right legs to torso
    var l_hip_jointDef = new b2RevoluteJointDef();
    var l_hip_anchor = ul_leg.GetWorldCenter();
    l_hip_anchor.x = l_hip_anchor.x - 12;
    l_hip_anchor.y = l_hip_anchor.y + 26;
    l_hip_jointDef.Initialize(torso, ul_leg, l_hip_anchor);
    var l_hip_joint = world.CreateJoint(l_hip_jointDef);

    var r_hip_jointDef = new b2RevoluteJointDef();
    var r_hip_anchor = ur_leg.GetWorldCenter();
    r_hip_anchor.x = r_hip_anchor.x - 12;
    r_hip_anchor.y = r_hip_anchor.y + 26;
    r_hip_jointDef.Initialize(torso, ur_leg, r_hip_anchor);
    var r_hip_joint = world.CreateJoint(r_hip_jointDef);

    // body.l_foot = l_foot;
    // body.r_foot = r_foot;
    joint.neck = neck_joint;
    joint.l_arm = l_arm_joint;
    joint.r_arm = r_arm_joint;
    joint.l_hip = l_hip_joint;
    joint.r_hip = r_hip_joint;
    joint.l_knee = l_knee_joint;
    joint.r_knee = r_knee_joint;

    // Prevent arms, legs from colliding with each other
    setFilterGroup([l_arm,r_arm,environment.floor],-1);
    setFilterGroup([torso,ul_leg,ur_leg,ll_leg,lr_leg],-2);

    // Stiffen hip, arm and knee joints
    lockRevoluteJoint(l_knee_joint);
    lockRevoluteJoint(r_knee_joint);
    lockRevoluteJoint(l_hip_joint);
    lockRevoluteJoint(r_hip_joint);
    lockRevoluteJoint(l_arm_joint,8000);
    lockRevoluteJoint(r_arm_joint,8000);

    setInterval(function() {
        if (!mainLoopPaused) {
            if (maintainLeftHipStability) {
                var r = l_hip_joint.GetJointAngle();
                l_hip_joint.SetMotorSpeed(2*(l_hipAngle - r));
            }
            if (maintainRightHipStability) {
                r = r_hip_joint.GetJointAngle();
                r_hip_joint.SetMotorSpeed(2*(r_hipAngle - r));
            }
            if (maintainLeftKneeStability) {
                var r = l_knee_joint.GetJointAngle();
                l_knee_joint.SetMotorSpeed(2*(l_kneeAngle - r));
            }
            if (maintainRightKneeStability) {
                r = r_knee_joint.GetJointAngle();
                r_knee_joint.SetMotorSpeed(2*(r_kneeAngle - r));
            }
        }
    },100);

    l_hip_joint.EnableLimit(true);
    l_hip_joint.SetLimits(hipLimits[0],hipLimits[1]);   // -1 and 1
    r_hip_joint.EnableLimit(true);
    r_hip_joint.SetLimits(hipLimits[0],hipLimits[1]);
    l_knee_joint.EnableLimit(true);
    l_knee_joint.SetLimits(kneeLimits[0],kneeLimits[1]);    // -0.25 and 1
    r_knee_joint.EnableLimit(true);
    r_knee_joint.SetLimits(kneeLimits[0],kneeLimits[1]);

    curX = getHipBaseX();
}

function setFilterGroup(elems, fIndex) {
    elems.forEach(function(elem) {
        var fList = elem.GetFixtureList();
        var filterData = fList.GetFilterData();
        filterData.groupIndex = fIndex;
        fList.SetFilterData(filterData);
    });
}

/**
  Gets the position on the x axis of the ragdoll's hips. We use
  this as the true forward velocity of the ragdoll instead of
  the center of the torso, since we don't want to reward falling
  forward quickly (at least, not as much as before).
*/
function getHipBaseX() {
    var theta = body.torso.GetAngle();
    var x = body.torso.GetPosition().x;
    return x - 35*Math.sin(theta);
}

function getFootY(foot) {
    return (foot.GetUserData()=='ll_leg' ? getLeftFootY() : getRightFootY());
}

function getLeftFootY(bd) {
    bd = (bd==undefined) ? body : bd;
    return bd.ll_leg.GetPosition().y - (20 * Math.cos(bd.ll_leg.GetAngle()));
}

function getRightFootY(bd) {
    bd = (bd==undefined) ? body : bd;
    return bd.lr_leg.GetPosition().y - (20 * Math.cos(bd.lr_leg.GetAngle()));
}

function getFootX(foot) {
    return (foot.GetUserData()=='ll_leg' ? getLeftFootX() : getRightFootX());
}

function getLeftFootX(bd) {
    bd = (bd==undefined) ? body : bd;
    return bd.ll_leg.GetPosition().x + (20 * Math.sin(bd.ll_leg.GetAngle()));
}

function getRightFootX(bd) {
    bd = (bd==undefined) ? body : bd;
    return bd.lr_leg.GetPosition().x + (20 * sin(bd.lr_leg.GetAngle()));
}
function rotateAndPaintImage(image, angleInRad, positionX, positionY, axisX, axisY,height,width) {
  image.x +=positionX;
    image.y +=positionY;
    image.rotation = angleInRad;
    image.height = height;
    image.width = width;
    image.x = axisX;
    image.y = axisY;
    // ctx.translate(positionX, positionY);
    // ctx.rotate(angleInRad);
    // ctx.drawImage(image, -axisX, -axisY,height,width);
    // ctx.rotate(-angleInRad);
    // ctx.translate(-positionX, -positionY);
}
function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x,y,radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#FFF3C3';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
}
function drawJack(node) {
    var pos = node.GetPosition();
if (node.GetUserData() == 'head') {
    rotateAndPaintImage(head, node.GetAngle() * -1, xToCanvas(pos.x), yToCanvas(pos.y), 50, 50, 120, 120);
} else if (node.GetUserData() == 'torso') {
    rotateAndPaintImage(bodyImage, node.GetAngle() * -1, xToCanvas(pos.x), yToCanvas(pos.y), 60, 90, 120, 180);
     
} else if (node.GetUserData() == 'ur_leg') {
        rotateAndPaintImage(thigh, (node.GetAngle()*-1)-.5 , xToCanvas(pos.x), yToCanvas(pos.y), 20, 50, 50, 100);
    } else if (node.GetUserData() == 'lr_leg') {
        rotateAndPaintImage(leg, (node.GetAngle()*-1)+.5 , xToCanvas(pos.x), yToCanvas(pos.y), 20, 50, 80, 100);
    } else if (node.GetUserData() == 'ul_leg') {
        rotateAndPaintImage(thigh, (node.GetAngle() * -1)-.5 , xToCanvas(pos.x), yToCanvas(pos.y),20, 50, 50, 100);
    } else if (node.GetUserData() == 'll_leg') {
        rotateAndPaintImage(leg, (node.GetAngle()*-1)+.5, xToCanvas(pos.x), yToCanvas(pos.y), 20, 50, 80, 100);
  
        } else if (node.GetUserData() == 'r_arm') {
            rotateAndPaintImage(rightArm, node.GetAngle() * -1, xToCanvas(pos.x), yToCanvas(pos.y), 50, 50, 200, 80);
           // drawCircle(xToCanvas(pos.x) - axisX, yToCanvas(pos.y) - axisY, 20);
 } else if (node.GetUserData() == 'l_arm') {
     rotateAndPaintImage(leftArm, node.GetAngle() *-1, xToCanvas(pos.x), yToCanvas(pos.y), 155, 35, 200, 80);

    }
}
function draw(node) {

    var pos = node.GetPosition();
    var fList = node.GetFixtureList();

    if (fList !== null) {

        var shape = fList.GetShape();
        var shapeType = shape.GetType();
        if (node.GetUserData() == 'head') {
          graphics.beginFill(0xFFF3C3, 1.0);
          graphics.drawCircle(xToCanvas(pos.x), yToCanvas(pos.y), 40);
          graphics.endFill();
         // graphics.lineStyle(0x003300, 5);

          // ctx.beginPath();
          //   ctx.arc(xToCanvas(pos.x), yToCanvas(pos.y), 40, 0, 2 * Math.PI, false);
          //   ctx.fillStyle = '#FFF3C3';
          //   ctx.fill();
          //   ctx.lineWidth = 5;
          //   ctx.strokeStyle = '#003300';
          //   ctx.stroke();
        }
           
     else  {
            //ctx.beginPath();

            var vtx = shape.m_vertices;
            var r = node.GetAngle();
            var sinr = Math.sin(r), cosr = Math.cos(r);
            var x0 = (vtx[0].x * cosr - vtx[0].y * sinr), y0 = (vtx[0].x * sinr + vtx[0].y * cosr);

            graphics.lineStyle(5, 0x003300, 1.0);
            graphics.beginFill(0xFFF3C3, 1.0);
            graphics.moveTo(xToCanvas(pos.x + x0), yToCanvas(pos.y + y0));

            for (var i = 1; i < vtx.length; i++) {
                graphics.lineTo(xToCanvas(pos.x + (vtx[i].x * cosr - vtx[i].y * sinr)),
                    yToCanvas(pos.y + (vtx[i].x * sinr + vtx[i].y * cosr)));
            }

//            ctx.lineTo(xToCanvas(pos.x + x0), yToCanvas(pos.y + y0));

            // ctx.fillStyle = '#FFF3C3';
            // ctx.fill();
            // ctx.lineWidth = 5;
            // ctx.strokeStyle = '#003300';
            // ctx.stroke();
            if (node.GetUserData() == 'ur_leg') {
             //   console.log(r);
            }
        }
    }
}

function startRecording() {
    recordLoopId = setInterval(record,50);
}

function endRecording(save,dist) {

    clearInterval(recordLoopId);
    if (save) {
        data = [];
        stepData.slice(0, stepData.length - 3)
            .forEach(function(d) {
                walkData.push(d);
            });
        console.log('SAVED WALK DATA.');
    }
    stepData = [];
}

function record() {
    s = extractState(body,joint,environment,null,0)
    stepData.push([stateVector(s),keyState])
}

function update() {
    if (!mainLoopPaused) {
         var node = world.GetBodyList();
        if (drawWorld) {
            while (node.GetNext() !== null) {
              if(debugDraw)  
                draw(node);
              else
                drawJack(node);
                node = node.GetNext();
            }
            if (fakeWorld !== undefined && fakeWorld != world) {
                var _node = fakeWorld.GetBodyList();
                while(_node.GetNext() !== null) {
                    draw2(_node);
                    _node = _node.GetNext();
                }
            }
        }
        world.Step(freq,2,2);
        elapsedTime += freq;
        if (requestTeleport) {
            requestTeleport = false;
            lastStepX = 0
            shiftBodyX(-300,0);
            curX = getHipBaseX();
        }
        var newX = getHipBaseX();
        var dx = (newX - curX)/25
        totalDistTraveled += dx;
        farthestDistTraveled = Math.max(farthestDistTraveled,totalDistTraveled);
        curX = newX;
        prevVelX = curVelX;
        curVelX = dx/freq;
        
        updateStats();

        if (dx > 0) {
            scoreCheckpointDist -= dx;
            if (scoreCheckpointDist <= 0) {
                if (aimode) {
                    notifyDistTraveled();
                }
                scoreCheckpointDist = 2;
                scorePenaltyDist = 2;
            }
        } else {
            scorePenaltyDist += dx;
            if (scorePenaltyDist <= 0) {
                if (aimode) {
                    notifyBackwardsTraveled();
                }
                scoreCheckpointDist = 2;
                scorePenaltyDist = 2;
            }
        }

        prevHipJointAngle = hipJointAngle;
        hipJointAngle = joint.r_hip.GetJointAngle() - joint.l_hip.GetJointAngle();

        if (!step_phase[0]) {
            if (hipJointAngle < -1.5 && hasContact(body.lr_leg,environment.floor)) {
                // right foot backwards
                lastStepX = getHipBaseX();
                stepBeginAngle = hipJointAngle;
                stepBackLeg = body.lr_leg;
                stepBackJoint = joint.r_knee;
                stepForwardLeg = body.ll_leg;
                step_phase[0] = true;
                if (aimode) {
                    notifyStepBegun();
                }
                if (recordingSteps) {
                    startRecording();
                    console.log('(+) WALK INITIATED');
                }
            } else if (hipJointAngle > 1.5 && hasContact(body.ll_leg,environment.floor)) {
                // left foot backwards
                lastStepX = getHipBaseX();
                stepBeginAngle = hipJointAngle;
                stepBackLeg = body.ll_leg;
                stepBackJoint = joint.l_knee;
                stepForwardLeg = body.lr_leg;
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
            Math.abs(body.torso.GetAngle()+0.25) < 0.4) {

                var cBaseHipX = getHipBaseX();
                var dist = cBaseHipX - lastStepX;

                if (recordingSteps) {
                    endRecording((dist>0),dist);
                }

                // back foot is now forwards
                totalStepsTraveled++;
                stepBeginAngle = hipJointAngle;
                stepBackLeg = (stepBackLeg == body.ll_leg ? body.lr_leg : body.ll_leg);
                stepBackJoint = (stepBackLeg == joint.l_knee ? joint.r_knee : joint.l_knee);
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

        if (body.head.GetPosition().y < 75 && aimode) {
            if (!fallen) {
                notifyFall(totalStepsTraveled);
            }
        }

        if (requestReset) {
            if (aimode) {
                distData.push({'t':iterations,'dist':totalDistTraveled,'steps':totalStepsTraveled})
            }

            if (recordingSteps) {
                endRecording(false);
                console.log('(-) YOU DIED.')
            }

            step_phase = [false,false];
            stepBeginAngle = NaN;
            stepBackLeg = undefined;
            stepBackJoint = undefined;
            stepForwardLeg = undefined;
            lastStepX = 0;
            resetJack();
            requestReset = false;
            respawning = true;
            deathCount++;
            scoreCheckpointDist = 2;
            scorePenaltyDist = 2;
            setTimeout(function() {
                respawning = false;
                activateWalkDelay();
            },1000)
        }
    }
}

function activateWalkDelay() {
    walkDelay = true;
    setTimeout(function() {
        walkDelay = false;
    },1000);
}

//setInterval(mainLoop,1000*freq);


function center_of_mass(body) {

    var xC=0,yC=0,totalM=0;
    for (var p in body) {
        var part = body[p];
        var m = part.GetMass();
        var pos = part.GetPosition();
        totalM += m;
        xC += (m*pos.x);
        yC += (m*pos.y);
    }
    xC /= totalM;
    yC /= totalM;
    return {'x':xC, 'y':yC};
}

function roundToTenThousandth(n) {
    return round(n * 10000) / 10000;
}

function roundToHundredth(n) {
    return round(n * 100) / 100;
}

function roundToTenth(n) {
    return round(n * 10) / 10;
}
