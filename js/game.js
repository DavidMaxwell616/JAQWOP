var game = new Phaser.Game(CANVAS_WIDTH, 500, Phaser.AUTO, 'phaser-example', 
{preload: preload, create: create, update: update});


function create() {
  background = game.add.image(0, 0, 'background');
  background.anchor.setTo(0, 0);
  background.width = CANVAS_WIDTH*1.25;
  background.height = CANVAS_HEIGHT*1.25;
  
  game.add.image(CANVAS_WIDTH-150, 0, 'maxxdaddy');
  
  ul_armSprite = game.add.sprite(0, 0, 'UpperArmImage');
  ll_armSprite = game.add.sprite(0, 0, 'LowerArmImage');
  headSprite = game.add.sprite(0, 0, 'headImage');
  ll_legSprite = game.add.sprite(0, 0, 'legImage');
  ul_legSprite = game.add.sprite(0, 0, 'thighImage');
  lr_legSprite = game.add.sprite(0, 0, 'legImage');
  ur_legSprite = game.add.sprite(0, 0, 'thighImage');
  bodySprite = game.add.sprite(0, 0, 'bodyImage');
  lr_armSprite = game.add.sprite(0, 0, 'LowerArmImage');
  ur_armSprite = game.add.sprite(0, 0, 'UpperArmImage');

  if(debugDraw){
    ur_armSprite.visible = false;
    ul_armSprite.visible = false;
    ll_armSprite.visible = false;
    lr_armSprite.visible = false;
    bodySprite.visible = false;
    ul_legSprite.visible = false;
    ur_legSprite.visible = false;
    ll_legSprite.visible = false;
    lr_legSprite.visible = false;
    headSprite.visible = false;
  }

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

  environment = initWalls(worldWidth,worldHeight,24);
 
  if(debugDraw) 
    graphics = game.add.graphics(0,0);
  world.SetContactListener(listener);
  aimode=AI_MODE;
  showAIDetails=SHOW_DEBUG;
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
 
} 

function createBall(x, y, radius, fixed, density, collisionType) {

    var bodyDef = new b2BodyDef;
    var fixDef = new b2FixtureDef;

    fixDef.density = density==undefined ? 1 : density;
    fixDef.friction = 5;
    fixDef.restitution = 0.5;

    bodyDef.type = fixed ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

    fixDef.shape = new b2CircleShape(radius);

    bodyDef.position.x = x;
    bodyDef.position.y = y;
    fixDef.filter.categoryBits=collisionType.category;
    fixDef.filter.maskBits=collisionType.mask;
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    return world.GetBodyList();
}

function createPolygon(x, y, points, fixed, density, collisionType) {
  
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
    fixDef.filter.categoryBits=collisionType.category;
    fixDef.filter.maskBits=collisionType.mask;
    world.CreateBody(bodyDef).CreateFixture(fixDef);
     return world.GetBodyList();
}

function createBox(x, y, width, height, r, fixed, density,collisionType) {
  if (r == 0 || r == undefined) {
        vtx = [ {'x':-width/2, 'y':-height/2},
            {'x':width/2, 'y':-height/2},
            {'x':width/2, 'y':height/2},
            {'x':-width/2, 'y':height/2}];
             return createPolygon(x+(width/2),y+(height/2), vtx, fixed,density,collisionType);
    } else {
        var cosr = Math.cos(r);
        var sinr = Math.sin(r);
        var dx = width/2, dy = height/2;
        vtx = [ {'x':-dx*cosr+dy*sinr, 'y':-dx*sinr-dy*cosr},
            {'x':dx*cosr+dy*sinr, 'y':dx*sinr-dy*cosr},
            {'x':dx*cosr-dy*sinr, 'y':dx*sinr+dy*cosr},
            {'x':-dx*cosr-dy*sinr, 'y':-dx*sinr+dy*cosr}];
            return createPolygon(x+(width/2),y+(height/2), vtx, fixed,density,collisionType);
    }
}

function initWalls(w,h,t) {
    // Create the floor
    var collisionType = {category: CATEGORY_GROUND, mask: MASK_GROUND};
     var floor = createBox(-t*2,-t/2,w,t,0,true,1,collisionType);
    floor.SetUserData('floor');
    // Create the left wall
    var l_wall = createBox(-t*3,-t/2,t/2,h,0,true,1,collisionType);
    l_wall.SetUserData('l_wall');
    // Create the right wall
    var r_wall = createBox(w-t/2,0,t,h,0,true,1,collisionType);
    r_wall.SetUserData('r_wall');
    return {'floor':floor, 'l_wall':l_wall, 'r_wall':r_wall};
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
    const collisionType = {category: CATEGORY_BODYPARTS, mask: MASK_BODYPARTS};
    ur_arm = createBox(START_X-10, START_Y-48, 10, 20, 0, false, 0.1,collisionType);
    lr_arm = createBox(START_X-10, START_Y-85, 10, 40, 0, false, 0.1,collisionType);
    torso = createBox(START_X-16, START_Y-92, 32, 67, 0, false, 5,collisionType);
    head = createBall(START_X+3, START_Y-10, 20, false, 0.1,collisionType);
    ul_leg = createBox(START_X-2,START_Y-116,15,40,Math.PI/6,false,10,collisionType);
    ll_leg = createBox(START_X-2,START_Y -144,10,40,-Math.PI/6,false,10,collisionType);
    ur_leg = createBox(START_X-2,START_Y-116,15,40,Math.PI/6,false,10,collisionType);
    lr_leg = createBox(START_X-2,START_Y -144,10,40,-Math.PI/6,false,10,collisionType);
    ul_arm = createBox(START_X-10, START_Y-48, 10, 20, 0, false, 0.1,collisionType);
    ll_arm = createBox(START_X-10, START_Y-85, 10, 40, 0, false, 0.1,collisionType);
    
    curVelX = 0.0;
    // var prevVelX = 0.0;

    // Track joints and body components
    body.head = head;
    body.ur_arm = ur_arm;
    body.lr_arm = lr_arm;
    body.ll_leg = ll_leg;
    body.ul_leg = ul_leg;
    body.lr_leg = lr_leg;
    body.ur_leg = ur_leg;
    body.torso = torso;
    body.ul_arm = ul_arm;
    body.ll_arm = ll_arm;
    
    objectMap={
      'ul_arm': ul_armSprite,
      'll_arm': ll_armSprite,
      'll_leg': ll_legSprite,
      'ul_leg': ul_legSprite,
      'lr_leg': lr_legSprite,
      'ur_leg': ur_legSprite,
      'head': headSprite,
      'torso': bodySprite,
      'ur_arm': ur_armSprite,
      'lr_arm': lr_armSprite
    };

    head.SetUserData('head');
    lr_arm.SetUserData('lr_arm');
    ur_arm.SetUserData('ur_arm');
    ll_leg.SetUserData('ll_leg');
    ul_leg.SetUserData('ul_leg');
    lr_leg.SetUserData('lr_leg');
    ur_leg.SetUserData('ur_leg');
    torso.SetUserData('torso');
    ul_arm.SetUserData('ul_arm');
    ll_arm.SetUserData('ll_arm');

    // Create neck
    var neck_jointDef = new b2WeldJointDef();
    var neck_anchor = head.GetWorldCenter();
    neck_anchor.y = neck_anchor.y - 20;
    neck_jointDef.Initialize(head, torso, neck_anchor);
    var neck_joint = world.CreateJoint(neck_jointDef);

    // Create left shoulder
    var l_shoulder_jointDef = new b2RevoluteJointDef();
    var l_shoulder_anchor = ul_arm.GetWorldCenter();
    l_shoulder_anchor.x = l_shoulder_anchor.x + 5;
    l_shoulder_anchor.y = l_shoulder_anchor.y + 14.3;
    l_shoulder_jointDef.Initialize(ul_arm, torso, l_shoulder_anchor);
    var l_shoulder_joint = world.CreateJoint(l_shoulder_jointDef);

    // Create right shoulder
    var r_shoulder_jointDef = new b2RevoluteJointDef();
    var r_shoulder_anchor = ur_arm.GetWorldCenter();
    r_shoulder_anchor.x = r_shoulder_anchor.x + 5;
    r_shoulder_anchor.y = r_shoulder_anchor.y + 14.3;
       r_shoulder_jointDef.Initialize(ur_arm, torso, r_shoulder_anchor);
    var r_shoulder_joint = world.CreateJoint(r_shoulder_jointDef);

    // Connect Right elbow
    var r_elbow_jointDef = new b2RevoluteJointDef();
    var r_elbow_anchor = lr_arm.GetWorldCenter();
    r_elbow_anchor.y = r_elbow_anchor.y+25;
    r_elbow_jointDef.Initialize(ur_arm, lr_arm, r_elbow_anchor);
    var r_elbow_joint = world.CreateJoint(r_elbow_jointDef);

    // Connect Left elbow
    var l_elbow_jointDef = new b2RevoluteJointDef();
    var l_elbow_anchor = ul_arm.GetWorldCenter();
    l_elbow_anchor.y = l_elbow_anchor.y +25;
    l_elbow_jointDef.Initialize(ul_arm, ll_arm, l_elbow_anchor);
    var l_elbow_joint = world.CreateJoint(l_elbow_jointDef);

    // Create left knee
    var l_knee_jointDef = new b2RevoluteJointDef();
    var l_knee_anchor = ul_leg.GetWorldCenter();
    l_knee_anchor.x = l_knee_anchor.x + 8.25;
    l_knee_anchor.y = l_knee_anchor.y - 14.3;
    l_knee_jointDef.Initialize(ul_leg, ll_leg, l_knee_anchor);
    var l_knee_joint = world.CreateJoint(l_knee_jointDef);

    // Create right knee
    var r_knee_jointDef = new b2RevoluteJointDef();
    var r_knee_anchor = ur_leg.GetWorldCenter();
    r_knee_anchor.x = r_knee_anchor.x + 8.25;
    r_knee_anchor.y = r_knee_anchor.y - 14.3;
    r_knee_jointDef.Initialize(ur_leg, lr_leg, r_knee_anchor);
    var r_knee_joint = world.CreateJoint(r_knee_jointDef);

    // Create left hip
    var l_hip_jointDef = new b2RevoluteJointDef();
    var l_hip_anchor = ul_leg.GetWorldCenter();
    l_hip_anchor.x = l_hip_anchor.x - 12;
    l_hip_anchor.y = l_hip_anchor.y + 26;
    l_hip_jointDef.Initialize(torso, ul_leg, l_hip_anchor);
    var l_hip_joint = world.CreateJoint(l_hip_jointDef);

    // Create right hip
    var r_hip_jointDef = new b2RevoluteJointDef();
    var r_hip_anchor = ur_leg.GetWorldCenter();
    r_hip_anchor.x = r_hip_anchor.x - 12;
    r_hip_anchor.y = r_hip_anchor.y + 26;
    r_hip_jointDef.Initialize(torso, ur_leg, r_hip_anchor);
    var r_hip_joint = world.CreateJoint(r_hip_jointDef);

    joint.neck = neck_joint;
    joint.l_shoulder = l_shoulder_joint;
    joint.l_elbow = l_elbow_joint;
    joint.r_shoulder = r_shoulder_joint;
    joint.r_elbow = r_elbow_joint;
    joint.l_hip = l_hip_joint;
    joint.r_hip = r_hip_joint;
    joint.l_knee = l_knee_joint;
    joint.r_knee = r_knee_joint;

    // Stiffen hip, arm and knee joints
    lockRevoluteJoint(l_knee_joint);
    lockRevoluteJoint(r_knee_joint);
    lockRevoluteJoint(l_hip_joint);
    lockRevoluteJoint(r_hip_joint);
    lockRevoluteJoint(l_shoulder_joint,8000);
    lockRevoluteJoint(r_shoulder_joint,8000);
    lockRevoluteJoint(l_elbow_joint,5000);
    lockRevoluteJoint(r_elbow_joint,5000);
   
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
    l_knee_joint.SetLimits(kneeLimits[0],kneeLimits[1]); 
    r_knee_joint.EnableLimit(true);
    r_knee_joint.SetLimits(kneeLimits[0],kneeLimits[1]);
    r_elbow_joint.EnableLimit(true);
    r_elbow_joint.SetLimits(elbowLimits[0],elbowLimits[1]);
    l_elbow_joint.EnableLimit(true);
    l_elbow_joint.SetLimits(elbowLimits[0],elbowLimits[1]);
    curX = getHipBaseX();

  
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

function drawCircle(x, y, radius) {
  graphics.beginFill(0xFFF3C3, 1.0);
  graphics.drawCircle(x, y, radius);
  graphics.endFill();

}

function getBodySize(shape){
var w2=0;
var h2=0;
if(shape.m_type==0) {
    w2 = shape.m_radius * 2
    h2 = shape.m_radius * 2
   } 
else {
var minX = Math.min(...shape.m_vertices.map(a => a.x));
var maxX = Math.max(...shape.m_vertices.map(a => a.x));
var minY = Math.min(...shape.m_vertices.map(a => a.y));
var maxY = Math.max(...shape.m_vertices.map(a => a.y));
w2 = Math.floor(maxX-minX);
h2 = Math.floor(maxY-minY);
}
return {'width':w2, 'height':h2};
}
function drawJack(node) {
 
var bodyPart = node.GetUserData(); 
sprite = objectMap[bodyPart];
 if(sprite===undefined)
 return;
 var scale = 2.1;
  var pos = node.GetPosition();
  var shape = getBodySize(node.GetFixtureList().GetShape());
  //console.log(bodyPart,shape.width,shape.height);
  sprite.anchor.setTo(0.5, 0.5);
  sprite.rotation = -node.GetAngle();
  sprite.x =xToCanvas(pos.x);
  sprite.y =yToCanvas(pos.y);
  sprite.width = shape.width*scale;
  sprite.height = shape.height*scale;
}

function draw(node) {

    var pos = node.GetPosition();
    var fList = node.GetFixtureList();

    if (fList !== null) {

        var shape = fList.GetShape();
        if (node.GetUserData() == 'head') {
          graphics.beginFill(0xFFF3C3, 1.0);
          graphics.drawCircle(xToCanvas(pos.x), yToCanvas(pos.y), 40);
          graphics.endFill();
        }
           
     else  {
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
      if(debugDraw)
        graphics.clear();
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
                    //notifyDistTraveled();
                }
                scoreCheckpointDist = 2;
                scorePenaltyDist = 2;
            }
        } else {
            scorePenaltyDist += dx;
            if (scorePenaltyDist <= 0) {
                if (aimode) {
                    //notifyBackwardsTraveled();
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
                    //notifyStepBegun();
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
                    //notifyStepBegun();
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
                //notifyHalfStep();
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
                    //notifyStepComplete(dist);
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
                //notifyFall(totalStepsTraveled);
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

function translateBody(dx, dy) {
  (Object.keys(body)).forEach(function(elem) {
      var pos = body[elem].GetPosition();
      body[elem].SetType(b2Body.b2_staticBody);
      body[elem].SynchronizeTransform(new b2Vec2(pos.x+dx,pos.y+dy),0);
      body[elem].SetType(b2Body.b2_dynamicBody);
  });
}

function xToWorld(x) {
  return worldWidth*x/CANVAS_WIDTH;
}

function yToWorld(y) {
  return worldHeight*(cHeight-y)/CANVAS_HEIGHT*-1;
}

function xToCanvas(x) {
  // The x coordinate starts at 0 and ends at 500
  return CANVAS_WIDTH*x/worldWidth;
}

function yToCanvas(y) {
  // The y coordinate starts at 500 and ends at 0
  return CANVAS_HEIGHT*(worldHeight-y)/worldHeight;
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
