const W = 800;
const H = 500;

const PPM = 30;

const m2px = (m) => m * PPM;
const px2m = (px) => px / PPM;
const originX = 400;
const originY = 260;

// --- Controls / tuning ---
const walkSpeed = 2.5;
const motorTorque = 150;

// const hipLimits = [-0.8, 0.8];
// const kneeLimits = [-1.2, 0.1];
// const ankleLimits = [-0.6, 0.6];
// const shoulderLimits = [-1.0, 1.0];
// const elbowLimits = [-1.2, 0.2];

const hipLimits = [-0.8, 0.8];
const kneeLimits = [-1.2, 0.1];
const ankleLimits = [-0.6, 0.6];
const shoulderLimits = [-1.0, 1.0];
const elbowLimits = [-1.2, 0.2];
// --- Categories / masks (FIXED) ---
// Bodyparts collide ONLY with ground (no self-collision between limbs)
const CATEGORY_BODYPARTS = 0x0002;
const CATEGORY_GROUND = 0x0004;

const MASK_BODYPARTS = CATEGORY_GROUND;
const MASK_GROUND = CATEGORY_BODYPARTS;
const pl = planck;

const lowerLeftArmOffset = { x: 0, y: 40 };
const upperLeftArmOffset = { x: - 10, y: - 20 };
const leftThighOffset = { x: 0, y: 70 };
const leftFootOffset = { x: - 25, y: 180 };
const leftLegOffset = { x: - 15, y: 140 };
const rightFootOffset = { x: 25, y: 180 };
const rightLegOffset = { x: 0, y: 140 };
const rightThighOffset = { x: 0, y: 70 };
const headOffset = { x: 0, y: -95 };
const torsoOffset = { x: 0, y: 0 };
const lowerRightArmOffset = { x: 0, y: 40 };
const upperRightArmOffset = { x: - 10, y: - 20 };


export default class MainScene extends Phaser.Scene {
    constructor() { super("main"); }

    preload() {
        // External sprites (add these files to assets/images/)
        this.load.image("body", "assets/images/body.png");
        this.load.image("thigh", "assets/images/thigh.png");
        this.load.image("leg", "assets/images/leg.png");
        this.load.image("foot", "assets/images/foot.png");
        this.load.image("upperArm", "assets/images/upperArm.png");
        this.load.image("lowerArm", "assets/images/lowerArm.png");
        this.load.image("head", "assets/images/head.png");
        this.load.image("background", "assets/images/background.JPG");
    }

    create() {
        this.cameras.main.setBackgroundColor(0x124184);
        const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
        bg.setDisplaySize(W * 1.25, H * 1.25);

        // --- Planck world ---
        this.world = new pl.World(pl.Vec2(0, 500 / PPM)); // ~500 px/s^2
        this._accum = 0;

        // --- Ground ---
        this.groundYpx = 490;

        const groundW = 800;
        const groundH = 60; // thicker = less tunneling

        this.ground = this.world.createBody({
            type: "static",
            position: pl.Vec2(px2m(W / 2), px2m(this.groundYpx))
        });

        const groundFix = this.ground.createFixture(pl.Box(px2m(groundW / 2), px2m(groundH / 2)), {
            density: 0,
            friction: 1.0,
            restitution: 0.0
        });

        // IMPORTANT: filters are on the FIXTURE
        groundFix.setFilterData({
            categoryBits: CATEGORY_GROUND,
            maskBits: MASK_GROUND,
            groupIndex: 0
        });


        // --- Build ragdoll ---
        this.createBodiesAndJoints();

        // --- UI ---
        const font = { fontFamily: "Calibri, Arial", fontSize: "20px", color: "#ffffff" };
        const shX = -5, shY = 5, shCol = "rgba(0,0,0,0.5)", shBlur = 1;

        this.keyState = "";
        this.bestDist = 0;
        this.totalDist = 0;
        this.velX = 0;
        this.nowMs = Date.now();

        this.bestDistText = this.add.text(50, 30, "", font).setShadow(shX, shY, shCol, shBlur);
        this.timeText = this.add.text(300, 30, "", font).setShadow(shX, shY, shCol, shBlur);
        this.totalDistText = this.add.text(50, 60, "", font).setShadow(shX, shY, shCol, shBlur);
        this.velocityText = this.add.text(300, 60, "", font).setShadow(shX, shY, shCol, shBlur);
        this.keyStateText = this.add.text(50, 90, "", font).setShadow(shX, shY, shCol, shBlur);

        // --- input ---
        this.keys = this.input.keyboard.addKeys({
            Q: Phaser.Input.Keyboard.KeyCodes.Q,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            O: Phaser.Input.Keyboard.KeyCodes.O,
            P: Phaser.Input.Keyboard.KeyCodes.P,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        this.keys.Q.on("down", () => this.handleQPressed());
        this.keys.Q.on("up", () => this.handleQReleased());

        this.keys.W.on("down", () => this.handleWPressed());
        this.keys.W.on("up", () => this.handleWReleased());

        this.keys.O.on("down", () => this.handleOPressed());
        this.keys.O.on("up", () => this.handleOReleased());

        this.keys.P.on("down", () => this.handlePPressed());
        this.keys.P.on("up", () => this.handlePReleased());

        this.keys.SPACE.on("down", () => this.resetBody());
    }

    // --- Helpers: parts with FIXTURE filtering correctly applied ---
    makePartRect(key, xPx, yPx, wPx, hPx, density = 1.0, friction = 0.6, restitution = 0.1) {
        const body = this.world.createBody({
            type: "dynamic",
            position: pl.Vec2(px2m(xPx), px2m(yPx)),
            angle: 0,
            linearDamping: 0.05,
            angularDamping: 0.10
        });

        const fix = body.createFixture(pl.Box(px2m(wPx / 2), px2m(hPx / 2)), {
            density, friction, restitution
        });

        // IMPORTANT: filter goes on the fixture
        fix.setFilterData({
            categoryBits: CATEGORY_BODYPARTS,
            maskBits: MASK_BODYPARTS,
            groupIndex: 0
        });

        const sprite = this.add.image(xPx, yPx, key).setOrigin(0.5);
        sprite.setDisplaySize(wPx, hPx);
        sprite._pbody = body;

        return { body, sprite, fix };
    }

    makePartCircle(key, xPx, yPx, rPx, density = 1.0, friction = 0.6, restitution = 0.1) {
        const body = this.world.createBody({
            type: "dynamic",
            position: pl.Vec2(px2m(xPx), px2m(yPx)),
            angle: 0,
            linearDamping: 0.05,
            angularDamping: 0.10
        });

        const fix = body.createFixture(pl.Circle(px2m(rPx)), {
            density, friction, restitution
        });

        fix.setFilterData({
            categoryBits: CATEGORY_BODYPARTS,
            maskBits: MASK_BODYPARTS,
            groupIndex: 0
        });

        const sprite = this.add.image(xPx, yPx, key).setOrigin(0.5);
        sprite.setDisplaySize(rPx * 2, rPx * 2);
        sprite._pbody = body;

        return { body, sprite, fix };
    }

    /*
BODY PART DIMENSIONS
body: 222 x 435 1.959
thigh: 120 x 153 1.275
leg: 68 x 183 2.651
foot: 148 x 64 .432 
upperArm: 112 x 189 1.6875
lowerArm: 100 x 212 2.12
head: 180 x 237 1.316
    */

    createBodiesAndJoints() {
        const S = {
            body: { w: 71, h: 140 },
            thigh: { w: 62, h: 80 },
            leg: { w: 30, h: 80 },
            foot: { w: 50, h: 23 },
            upperArm: { w: 47, h: 80 },
            lowerArm: { w: 43, h: 80 },
            head: { r: 35 }
        };

        // Arms
        this.lowerLeftArm = this.makePartRect("lowerArm", originX + lowerLeftArmOffset.x, originY + lowerLeftArmOffset.y, S.lowerArm.w, S.lowerArm.h);
        this.upperLeftArm = this.makePartRect("upperArm", originX + upperLeftArmOffset.x, originY + upperLeftArmOffset.y, S.upperArm.w, S.upperArm.h);

        // Legs
        this.leftThigh = this.makePartRect("thigh", originX + leftThighOffset.x, originY + leftThighOffset.y, S.thigh.w, S.thigh.h);
        this.leftFoot = this.makePartRect("foot", originX + leftFootOffset.x, originY + leftFootOffset.y, S.foot.w, S.foot.h);
        this.leftLeg = this.makePartRect("leg", originX + leftLegOffset.x, originY + leftLegOffset.y, S.leg.w, S.leg.h);

        this.rightFoot = this.makePartRect("foot", originX + rightFootOffset.x, originY + rightFootOffset.y, S.foot.w, S.foot.h);
        this.rightLeg = this.makePartRect("leg", originX + rightLegOffset.x, originY + rightLegOffset.y, S.leg.w, S.leg.h);
        this.rightThigh = this.makePartRect("thigh", originX + rightThighOffset.x, originY + rightThighOffset.y, S.thigh.w, S.thigh.h);

        // Torso + head
        this.head = this.makePartCircle("head", originX + headOffset.x, originY + headOffset.y, S.head.r, 0.8);
        this.torso = this.makePartRect("body", originX + torsoOffset.x, originY + torsoOffset.y, S.body.w, S.body.h, 1.2);

        this.lowerRightArm = this.makePartRect("lowerArm", originX + lowerRightArmOffset.x, originY + lowerRightArmOffset.y, S.lowerArm.w, S.lowerArm.h);
        this.upperRightArm = this.makePartRect("upperArm", originX + upperRightArmOffset.x, originY + upperRightArmOffset.y, S.upperArm.w, S.upperArm.h);

        const v = (xPx, yPx) => pl.Vec2(px2m(xPx), px2m(yPx));

        // Neck weld
        this.neck = this.world.createJoint(pl.WeldJoint({}, this.head.body, this.torso.body, v(originX, originY - 35)));

        // Shoulders
        this.rightShoulder = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true, motorSpeed: 0, maxMotorTorque: motorTorque,
            enableLimit: true, lowerAngle: shoulderLimits[0], upperAngle: shoulderLimits[1]
        }, this.upperRightArm.body, this.torso.body, v(originX - 10, originY - 40)));

        this.leftShoulder = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true, motorSpeed: 0, maxMotorTorque: motorTorque,
            enableLimit: true, lowerAngle: shoulderLimits[0], upperAngle: shoulderLimits[1]
        }, this.upperLeftArm.body, this.torso.body, v(originX - 10, originY - 40)));

        // Elbows (disabled by default)
        this.rightElbow = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: false, motorSpeed: 0, maxMotorTorque: motorTorque,
            enableLimit: true, lowerAngle: elbowLimits[0], upperAngle: elbowLimits[1]
        }, this.upperRightArm.body, this.lowerRightArm.body, v(originX, originY + 10)));

        this.leftElbow = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: false, motorSpeed: 0, maxMotorTorque: motorTorque,
            enableLimit: true, lowerAngle: elbowLimits[0], upperAngle: elbowLimits[1]
        }, this.upperLeftArm.body, this.lowerLeftArm.body, v(originX - 45, originY + 10)));

        // Hips
        this.rightHip = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true, motorSpeed: 0, maxMotorTorque: motorTorque,
            enableLimit: true, lowerAngle: hipLimits[0], upperAngle: hipLimits[1]
        }, this.torso.body, this.rightThigh.body, v(originX + 10, originY + 40)));

        this.leftHip = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true, motorSpeed: 0, maxMotorTorque: motorTorque,
            enableLimit: true, lowerAngle: hipLimits[0], upperAngle: hipLimits[1]
        }, this.torso.body, this.leftThigh.body, v(originX + 10, originY + 40)));

        // Knees
        this.rightKnee = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true, motorSpeed: 0, maxMotorTorque: motorTorque,
            enableLimit: true, lowerAngle: kneeLimits[0], upperAngle: kneeLimits[1]
        }, this.rightThigh.body, this.rightLeg.body, v(originX + 15, originY + 110)));

        this.leftKnee = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true, motorSpeed: 0, maxMotorTorque: motorTorque,
            enableLimit: true, lowerAngle: kneeLimits[0], upperAngle: kneeLimits[1]
        }, this.leftThigh.body, this.leftLeg.body, v(originX - 15, originY + 110)));

        // Ankles
        this.rightAnkle = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true, motorSpeed: 0, maxMotorTorque: motorTorque,
            enableLimit: true, lowerAngle: ankleLimits[0], upperAngle: ankleLimits[1]
        }, this.rightLeg.body, this.rightFoot.body, v(originX + 20, originY + 185)));

        this.leftAnkle = this.world.createJoint(pl.RevoluteJoint({
            enableMotor: true, motorSpeed: 0, maxMotorTorque: motorTorque,
            enableLimit: true, lowerAngle: ankleLimits[0], upperAngle: ankleLimits[1]
        }, this.leftLeg.body, this.leftFoot.body, v(originX - 20, originY + 185)));
    }

    // --- fixed-step stepping ---
    stepWorld(dtSec) {
        const fixed = 1 / 60;
        dtSec = Math.min(dtSec, 1 / 30); // clamp spikes harder

        this._accum += dtSec;

        const velIters = 20;
        const posIters = 10;

        while (this._accum >= fixed) {
            this.world.step(fixed, velIters, posIters);
            this._accum -= fixed;
        }
    }

    syncSprites() {
        const sync = (part) => {
            const p = part.body.getPosition();
            part.sprite.x = m2px(p.x);
            part.sprite.y = m2px(p.y);
            part.sprite.rotation = part.body.getAngle();
        };

        sync(this.head);
        sync(this.torso);
        sync(this.upperLeftArm); sync(this.lowerLeftArm);
        sync(this.upperRightArm); sync(this.lowerRightArm);
        sync(this.leftThigh); sync(this.leftLeg); sync(this.leftFoot);
        sync(this.rightThigh); sync(this.rightLeg); sync(this.rightFoot);
    }

    // --- controls ---
    handleQPressed() {
        this.rightHip.setMotorSpeed(+walkSpeed);
        this.leftHip.setMotorSpeed(-walkSpeed);
        this.leftShoulder.setMotorSpeed(+walkSpeed);
        this.rightShoulder.setMotorSpeed(-walkSpeed);
        this.keyState = "Q";
    }
    handleQReleased() {
        this.rightHip.setMotorSpeed(0);
        this.leftHip.setMotorSpeed(0);
        this.leftShoulder.setMotorSpeed(0);
        this.rightShoulder.setMotorSpeed(0);
        this.keyState = "";
    }

    handleOPressed() {
        this.leftKnee.setMotorSpeed(+walkSpeed);
        this.rightKnee.setMotorSpeed(-walkSpeed);
        this.rightElbow.enableMotor(true);
        this.leftElbow.enableMotor(true);
        this.rightElbow.setMotorSpeed(+walkSpeed);
        this.leftElbow.setMotorSpeed(-walkSpeed);
        this.keyState = "O";
    }
    handleOReleased() {
        this.leftKnee.setMotorSpeed(0);
        this.rightKnee.setMotorSpeed(0);
        this.rightElbow.setMotorSpeed(0);
        this.leftElbow.setMotorSpeed(0);
        this.rightElbow.enableMotor(false);
        this.leftElbow.enableMotor(false);
        this.keyState = "";
    }

    handleWPressed() {
        this.leftHip.setMotorSpeed(+walkSpeed);
        this.rightHip.setMotorSpeed(-walkSpeed);
        this.rightShoulder.setMotorSpeed(+walkSpeed);
        this.leftShoulder.setMotorSpeed(-walkSpeed);
        this.keyState = "W";
    }
    handleWReleased() {
        this.leftHip.setMotorSpeed(0);
        this.rightHip.setMotorSpeed(0);
        this.rightShoulder.setMotorSpeed(0);
        this.leftShoulder.setMotorSpeed(0);
        this.keyState = "";
    }

    handlePPressed() {
        this.rightKnee.setMotorSpeed(+walkSpeed);
        this.leftKnee.setMotorSpeed(-walkSpeed);
        this.leftElbow.enableMotor(true);
        this.rightElbow.enableMotor(true);
        this.leftElbow.setMotorSpeed(+walkSpeed);
        this.rightElbow.setMotorSpeed(-walkSpeed);
        this.keyState = "P";
    }
    handlePReleased() {
        this.rightKnee.setMotorSpeed(0);
        this.leftKnee.setMotorSpeed(0);
        this.leftElbow.setMotorSpeed(0);
        this.rightElbow.setMotorSpeed(0);
        this.leftElbow.enableMotor(false);
        this.rightElbow.enableMotor(false);
        this.keyState = "";
    }

    resetBody() {
        const set = (part, xPx, yPx) => {
            part.body.setTransform(pl.Vec2(px2m(xPx), px2m(yPx)), 0);
            part.body.setLinearVelocity(pl.Vec2(0, 0));
            part.body.setAngularVelocity(0);
        };

        set(this.head, originX + headOffset.x, originY + headOffset.y);
        set(this.torso, originX + torsoOffset.x, originY + torsoOffset.y);

        set(this.rightThigh, originX + rightThighOffset.x, originY + rightThighOffset.y);
        set(this.rightLeg, originX + rightLegOffset.x, originY + rightThighOffset.y);
        set(this.rightFoot, originX + rightFootOffset.x, originY + rightFootOffset.y);

        set(this.leftThigh, originX + leftThighOffset.x, originY + leftThighOffset.y);
        set(this.leftLeg, originX + leftLegOffset.x, originY + leftLegOffset.y);
        set(this.leftFoot, originX + leftFootOffset.x, originY + leftFootOffset.y);

        set(this.upperRightArm, originX + upperRightArmOffset.x, originY + upperRightArmOffset.y);
        set(this.lowerRightArm, originX + lowerRightArmOffset.x, originY + lowerRightArmOffset.y);
        set(this.upperLeftArm, originX + upperLeftArmOffset.x, originY - upperRightArmOffset.y);
        set(this.lowerLeftArm, originX + lowerLeftArmOffset.x, originY + lowerLeftArmOffset.y);

        this.handleQReleased();
        this.handleWReleased();
        this.handleOReleased();
        this.handlePReleased();

        this.nowMs = Date.now();
    }

    updateHud() {
        const t = (Date.now() - this.nowMs) / 1000;
        const vx = this.head.body.getLinearVelocity().x;
        const dist = (this.torso.sprite.x - originX) / PPM;

        this.bestDist = Math.max(this.bestDist, dist);
        this.totalDist = dist;
        this.velX = vx;

        this.bestDistText.setText("Best Distance: " + Math.floor(this.bestDist) + " m");
        this.timeText.setText("Time Elapsed: " + (Math.round(t * 10) / 10) + " s");
        this.totalDistText.setText("Total Distance: " + Math.floor(this.totalDist) + " m");
        this.velocityText.setText("Velocity: " + (Math.round(this.velX * 10) / 10) + " m/s");
        this.keyStateText.setText("Keystate: " + this.keyState);
    }

    update(_, deltaMs) {
        this.stepWorld(deltaMs / 1000);
        this.syncSprites();
        this.updateHud();

        if (this.head.sprite.y > this.groundYpx - 60) {
            this.resetBody();
        }
    }
}
