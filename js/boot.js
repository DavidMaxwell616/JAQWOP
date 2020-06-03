var aimode = false;
var showAIDetails = false;
var drawWorld = true;
var recordingSteps = false;

var init = false;
var maintainLeftHipStability = true;
var maintainLeftKneeStability = true;
var maintainRightHipStability = true;
var maintainRightKneeStability = true;

var joint = {};
var body = {};
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
var leftHipJoint;
var leftShoulderJoint;
var leftElbowJoint;

var rightAnkleJoint;
var rightKneeJoint;
var rightHipJoint;
var rightShoulderJoint;
var rightElbowJoint;

var neckJoint;

var QKey;
var WKey;
var OKey;
var PKey;

var bestDistanceText1;
var totalDistanceText1;
var keystateText1;
var bestDistanceText2;
var totalDistanceText2;
var keystateText2;
var keyState='';

var l_kneeAngle = 0.175, r_kneeAngle = 0.175;
var l_hipAngle = -0.25, r_hipAngle = 0.5;
var l_hip_rotate_speed = 3;
var r_hip_rotate_speed = 3;
var l_knee_rotate_speed = 3;
var r_knee_rotate_speed = 3;
var hipLimits = [-20,20];
var kneeLimits = [-20,20];
var ankleLimits = [-20,20];
var elbowLimits = [0,40];
var shoulderLimits = [-50,50];

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

var QPressed=false;
var WPressed=false;
var OPressed=false;
var PPressed = false;

var headStartY = 195;
var headStartX = 100;

var timestep = 60;
var freq = 1/timestep;

var worldWidth = 500;
var worldHeight = 250;
var fakeWorld = undefined;

var distData = [];
var walkData = [];
var stepData = [];
var recordLoopId = undefined;