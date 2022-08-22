
// // var   b2Vec2 = Box2D.Common.Math.b2Vec2
// // , b2BodyDef = Box2D.Dynamics.b2BodyDef
// // , b2Body = Box2D.Dynamics.b2Body
// // , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
// // , b2Fixture = Box2D.Dynamics.b2Fixture
// // , b2World = Box2D.Dynamics.b2World
// // , b2MassData = Box2D.Collision.Shapes.b2MassData
// // , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
// // , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
// // , b2Shape = Box2D.Collision.Shapes.b2Shape
// // , b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
// // , b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef
// // , b2FilterData = Box2D.Dynamics.b2FilterData
// // , b2ContactListener = Box2D.Dynamics.b2ContactListener;

// const CANVAS_WIDTH = 800, CANVAS_HEIGHT = 500, SCALE = 30;
// const CATEGORY_BODYPARTS = 0x0001;  // 0000000000000001 in binary
// const CATEGORY_GROUND = 0x0002; // 0000000000000010 in binary
// const MASK_BODYPARTS = CATEGORY_GROUND;
// const MASK_GROUND = -1; 
// const START_X = CANVAS_WIDTH*.1;
// const START_Y =180;
// const AI_MODE = false;
// const SHOW_DEBUG = false;

// var objectMap;
// var mainLoopPaused = false;
// //var listener = new b2ContactListener;
// var debugDraw = false;

// var timestep = 60;
// var freq = 1/timestep;
// // var gravity = new b2Vec2(0, -400);
// // var world = new b2World(gravity, true);

// var worldWidth = 500;
// var worldHeight = 250;
// var environment;
// var fakeWorld = undefined;

// var distData = [];
// var walkData = [];
// var stepData = [];
// var recordLoopId = undefined;

// var background;
// var ul_armSprite;
// var ur_armSprite;
// var ll_armSprite;
// var lr_armSprite;
// var bodySprite;
// var ul_legSprite;
// var ur_legSprite;
// var ll_legSprite;
// var lr_legSprite;
// var l_foot;
// var r_foot;
// var headSprite;

// var ur_arm;
// var lr_arm;
// var torso;
// var head;
// var ul_leg;
// var ll_leg;
// var ur_leg;
// var lr_leg;
// var ul_arm;
// var ll_arm;
// var l_foot;
// var r_foot;

// var aimode = true;
// var showAIDetails = true;
// var drawWorld = true;
// var recordingSteps = false;
// var graphics;
// var init = false;
// // var keyMasks = {q:1,w:2,o:4,p:8};
// var keyState = '';
// // var keyEventCodes = {80:'p',79:'o',87:'w',81:'q',32:' '};
// // var action_strings = {0:' ',1:'Q',2:'W',4:'O',6:'WO',8:'P',9:'QP'};
// var maintainLeftHipStability = true;
// var maintainLeftKneeStability = true;
// var maintainRightHipStability = true;
// var maintainRightKneeStability = true;

// var joint = {};
// var body = {};

// var l_kneeAngle = 0.175, r_kneeAngle = 0.175;
// var l_hipAngle = -0.25, r_hipAngle = 0.5;
// var l_hip_rotate_speed = 3;
// var r_hip_rotate_speed = 3;
// var l_knee_rotate_speed = 3;
// var r_knee_rotate_speed = 3;
// var hipLimits = [-1,1];
// var kneeLimits = [-0.25,1];
// var elbowLimits = [0,1];
// var ankleLimits = [-0.15,0.15];

// var elapsedTime = 0.0;
// var totalDistTraveled = 0.0;
// var farthestDistTraveled = 0.0;
// var curX = 0.0
// var requestTeleport = false;
// var curVelX = 0.0;
// var prevVelX = 0.0;

// var autoReset = true;
// var requestReset = false;
// var respawning = false;
// var walkDelay = false;

// var hipJointAngle = 0.0;
// var prevHipJointAngle = 0.0;
// var step_phase = [false,false];
// var stepBeginAngle = NaN;
// var stepBackLeg = undefined;
// var stepForwardLeg = undefined;
// var stepBackJoint = undefined;
// var totalStepsTraveled = 0;
// var lastStepX = 0;
// var stepDistances = [];

// var deathCount = 0;
// var scoreCheckpointDist = 2;
// var scorePenaltyDist = 2;
// var iterations;
// var ACTIONS = [0,1,2,4,6,8,9]
// var qscores = { 0:0, 1:0, 2:0, 4:0, 6:0, 8:0, 9:0 };
// var var_act = [0,0,0,0,0,0,0];
// var var_pre = [0,0,0,0,0,0,0];
// var var_err = [0,0,0,0,0,0,0];

// var bestDistText = [];
// var timeText = [];
// var totalDistText = [];
// var velocityText = [];
// var KeyStateText=[];
// var PctErrText = [];
// var iterationsText;
// var qText;

// var Qkey;
// var Wkey;
// var OKey;
// var PKey;
// var SpaceKey;

// var Qtext;
// var Wtext;
// var Otext;
// var Ptext;
var startY = 50;
 var startX = 200;

var BodyVertices = 
    [
    -40,-108,
    0,-100,
    20,-80,
    57,85,
    10,110,
    -55,110,
    -50,10
    ];

var Body;
var Neck;
var RThigh;
var Head;
var RCalf;
var RKnee;
var RFoot;
var RAnkle;
var RUpperArm;
var RShoulder;
var RLowerArm;
var RElbow;

