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
var rightArm;
var leftArm;
var thigh;
var leg;

var QKey;
var WKey;
var OKey;
var PKey;

var bestDistanceText1;
var totalDistanceText1;
var keystateText1;

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
