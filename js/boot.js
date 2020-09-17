
var   b2Vec2 = Box2D.Common.Math.b2Vec2
, b2BodyDef = Box2D.Dynamics.b2BodyDef
, b2Body = Box2D.Dynamics.b2Body
, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
, b2Fixture = Box2D.Dynamics.b2Fixture
, b2World = Box2D.Dynamics.b2World
, b2MassData = Box2D.Collision.Shapes.b2MassData
, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
, b2Shape = Box2D.Collision.Shapes.b2Shape
, b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
, b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef
, b2FilterData = Box2D.Dynamics.b2FilterData
, b2ContactListener = Box2D.Dynamics.b2ContactListener;

var CANVAS_WIDTH = 800, CANVAS_HEIGHT = 500, SCALE = 30;
var canv;
var ctx;
var cWidth;
var cHeight;
var mainLoopPaused = false;
var listener = new b2ContactListener;

var timestep = 60;
var freq = 1/timestep;
var gravity = new b2Vec2(0, -200);
var world = new b2World(gravity, true);
var worldWidth = 500;
var worldHeight = 250;
var environment;
var fakeWorld = undefined;
const startX = 80;
const startY = 160;

var distData = [];
var walkData = [];
var stepData = [];
var recordLoopId = undefined;


var rightArmImage;
var leftarmImage;
var bodyImage;
var thighImage;
var legImage;
var headImage;
var background;

var aimode = false;
var showAIDetails = false;
var drawWorld = true;
var recordingSteps = false;

var init = false;
var keyMasks = {q:1,w:2,o:4,p:8};
var keyState = 0;
var keyEventCodes = {80:'p',79:'o',87:'w',81:'q',32:' '};
var action_strings = {0:' ',1:'Q',2:'W',4:'O',6:'WO',8:'P',9:'QP'};
var maintainLeftHipStability = true;
var maintainLeftKneeStability = true;
var maintainRightHipStability = true;
var maintainRightKneeStability = true;

var joint = {};
var body = {};

var l_kneeAngle = 0.175, r_kneeAngle = 0.175;
var l_hipAngle = -0.25, r_hipAngle = 0.5;
var l_hip_rotate_speed = 3;
var r_hip_rotate_speed = 3;
var l_knee_rotate_speed = 3;
var r_knee_rotate_speed = 3;
var hipLimits = [-1,1];
var kneeLimits = [-0.25,1];

var elapsedTime = 0.0;
var totalDistTraveled = 0.0;
var farthestDistTraveled = 0.0;
var curX = 0.0
var requestTeleport = false;
var curVelX = 0.0;
var prevVelX = 0.0;

var autoReset = true;
var requestReset = false;
var respawning = false;
var walkDelay = false;

var legalKeyStates = [true,true,true,false,true,false,true,false,true,
                    true,false,false,false,false,false,false];

var hipJointAngle = 0.0;
var prevHipJointAngle = 0.0;
var step_phase = [false,false];
var stepBeginAngle = NaN;
var stepBackLeg = undefined;
var stepForwardLeg = undefined;
var stepBackJoint = undefined;
var totalStepsTraveled = 0;
var lastStepX = 0;
var stepDistances = [];

var deathCount = 0;
var scoreCheckpointDist = 2;
var scorePenaltyDist = 2;

var qscores = { 0:0, 1:0, 2:0, 4:0, 6:0, 8:0, 9:0 };
var var_act = [0,0,0,0,0,0,0];
var var_pre = [0,0,0,0,0,0,0];
var var_err = [0,0,0,0,0,0,0];