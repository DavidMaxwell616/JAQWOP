const pl = planck;
const m2px = (m) => m * PPM;
const px2m = (px) => px / PPM;
const PPM = 30;
// const hipLimits = [-0.8, 0.8];
// const kneeLimits = [-1.2, 0.1];
// const ankleLimits = [-0.6, 0.6];
// const shoulderLimits = [-1.0, 1.0];
// const elbowLimits = [-1.2, 0.2];
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


const hipLimits = [0, 0];
const pelvisLimits = [-0.6, 1.6];
const kneeLimits = [0, 1.6];
const ankleLimits = [-0.6, 0.6];
const shoulderLimits = [-1.0, 1.0];
const elbowLimits = [-1.2, 0.2];
const lowerLeftArmOffset = { x: 0, y: 40 };
const upperLeftArmOffset = { x: - 10, y: - 20 };
const leftThighOffset = { x: 0, y: 70 };
const leftFootOffset = { x: 10, y: 172 };
const leftLegOffset = { x: -10, y: 140 };
const rightFootOffset = { x: 10, y: 172 };
const rightLegOffset = { x: -10, y: 140 };
const rightThighOffset = { x: 0, y: 70 };
const headOffset = { x: 0, y: -95 };
const backOffset = { x: 0, y: 0 };
const pelvisOffset = { x: 0, y: 0 };
const lowerRightArmOffset = { x: 0, y: 40 };
const upperRightArmOffset = { x: - 10, y: - 20 };

export class Runner {
    constructor(scene, world, originX, originY, options = {}) {
        this.scene = scene;
        this.world = world;
        this.originX = originX;
        this.originY = originY;

        const motorTorque = options.motorTorque ?? 140;
        const shoulderLimits = options.shoulderLimits ?? [-1.8, 1.8];
        const elbowLimits = options.elbowLimits ?? [-1.6, 0.2];
        const hipLimits = options.hipLimits ?? [-0.5, 0.5];
        const pelvisLimits = options.pelvisLimits ?? [-1.1, 1.1];
        const kneeLimits = options.kneeLimits ?? [-0.1, 2.0];
        const ankleLimits = options.ankleLimits ?? [-0.7, 0.7];

        const S = {
            body: { w: 71, h: 140 },
            pelvis: { w: 42, h: 42 },
            thigh: { w: 62, h: 80 },
            leg: { w: 30, h: 80 },
            foot: { w: 50, h: 23 },
            upperArm: { w: 47, h: 80 },
            lowerArm: { w: 43, h: 80 },
            head: { r: 35 }
        };

        const offsets = {
            head: { x: 0, y: -110 },
            body: { x: 0, y: -20 },
            pelvis: { x: 0, y: 55 },

            upperLeftArm: { x: -42, y: -25 },
            lowerLeftArm: { x: -50, y: 35 },
            upperRightArm: { x: 42, y: -25 },
            lowerRightArm: { x: 50, y: 35 },

            leftThigh: { x: -18, y: 105 },
            leftLeg: { x: -18, y: 185 },
            leftFoot: { x: -18, y: 238 },

            rightThigh: { x: 18, y: 105 },
            rightLeg: { x: 18, y: 185 },
            rightFoot: { x: 18, y: 238 }
        };

        const v = (xPx, yPx) => pl.Vec2(px2m(xPx), px2m(yPx));

        // Parts
        this.parts = {
            head: this.makePartCircle("head", originX + offsets.head.x, originY + offsets.head.y, S.head.r, 0.8),
            body: this.makePartRect("body", originX + offsets.body.x, originY + offsets.body.y, S.body.w, S.body.h, 1.2),
            pelvis: this.makePartRect("pelvis", originX + offsets.pelvis.x, originY + offsets.pelvis.y, S.pelvis.w, S.pelvis.h, 1.2),

            upperLeftArm: this.makePartRect("upperArm", originX + offsets.upperLeftArm.x, originY + offsets.upperLeftArm.y, S.upperArm.w, S.upperArm.h),
            lowerLeftArm: this.makePartRect("lowerArm", originX + offsets.lowerLeftArm.x, originY + offsets.lowerLeftArm.y, S.lowerArm.w, S.lowerArm.h),
            upperRightArm: this.makePartRect("upperArm", originX + offsets.upperRightArm.x, originY + offsets.upperRightArm.y, S.upperArm.w, S.upperArm.h),
            lowerRightArm: this.makePartRect("lowerArm", originX + offsets.lowerRightArm.x, originY + offsets.lowerRightArm.y, S.lowerArm.w, S.lowerArm.h),

            leftThigh: this.makePartRect("thigh", originX + offsets.leftThigh.x, originY + offsets.leftThigh.y, S.thigh.w, S.thigh.h),
            leftLeg: this.makePartRect("leg", originX + offsets.leftLeg.x, originY + offsets.leftLeg.y, S.leg.w, S.leg.h),
            leftFoot: this.makePartRect("foot", originX + offsets.leftFoot.x, originY + offsets.leftFoot.y, S.foot.w, S.foot.h),

            rightThigh: this.makePartRect("thigh", originX + offsets.rightThigh.x, originY + offsets.rightThigh.y, S.thigh.w, S.thigh.h),
            rightLeg: this.makePartRect("leg", originX + offsets.rightLeg.x, originY + offsets.rightLeg.y, S.leg.w, S.leg.h),
            rightFoot: this.makePartRect("foot", originX + offsets.rightFoot.x, originY + offsets.rightFoot.y, S.foot.w, S.foot.h)
        };

        // Aliases for convenience
        this.head = this.parts.head;
        this.body = this.parts.body;
        this.pelvis = this.parts.pelvis;

        this.upperLeftArm = this.parts.upperLeftArm;
        this.lowerLeftArm = this.parts.lowerLeftArm;
        this.upperRightArm = this.parts.upperRightArm;
        this.lowerRightArm = this.parts.lowerRightArm;

        this.leftThigh = this.parts.leftThigh;
        this.leftLeg = this.parts.leftLeg;
        this.leftFoot = this.parts.leftFoot;
        this.rightThigh = this.parts.rightThigh;
        this.rightLeg = this.parts.rightLeg;
        this.rightFoot = this.parts.rightFoot;

        // Joints
        this.joints = {
            neck: this.world.createJoint(
                pl.WeldJoint({}, this.head.body, this.body.body, v(originX, originY - 35))
            ),

            leftShoulder: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: motorTorque * 0.7,
                    enableLimit: true,
                    lowerAngle: shoulderLimits[0],
                    upperAngle: shoulderLimits[1]
                }, this.upperLeftArm.body, this.body.body, v(originX, originY - 40))
            ),

            rightShoulder: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: motorTorque * 0.7,
                    enableLimit: true,
                    lowerAngle: shoulderLimits[0],
                    upperAngle: shoulderLimits[1]
                }, this.upperRightArm.body, this.body.body, v(originX, originY - 40))
            ),

            leftElbow: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: false,
                    motorSpeed: 0,
                    maxMotorTorque: motorTorque * 0.5,
                    enableLimit: true,
                    lowerAngle: elbowLimits[0],
                    upperAngle: elbowLimits[1]
                }, this.upperLeftArm.body, this.lowerLeftArm.body, v(originX, originY + 10))
            ),

            rightElbow: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: false,
                    motorSpeed: 0,
                    maxMotorTorque: motorTorque * 0.5,
                    enableLimit: true,
                    lowerAngle: elbowLimits[0],
                    upperAngle: elbowLimits[1]
                }, this.upperRightArm.body, this.lowerRightArm.body, v(originX, originY + 10))
            ),

            hipBack: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: motorTorque,
                    enableLimit: true,
                    lowerAngle: hipLimits[0],
                    upperAngle: hipLimits[1]
                }, this.body.body, this.pelvis.body, v(originX, originY + 20))
            ),

            leftHipLeg: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: motorTorque,
                    enableLimit: true,
                    lowerAngle: pelvisLimits[0],
                    upperAngle: pelvisLimits[1]
                }, this.pelvis.body, this.leftThigh.body, v(originX - 10, originY + 50))
            ),

            rightHipLeg: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: motorTorque,
                    enableLimit: true,
                    lowerAngle: pelvisLimits[0],
                    upperAngle: pelvisLimits[1]
                }, this.pelvis.body, this.rightThigh.body, v(originX + 10, originY + 50))
            ),

            leftKnee: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: motorTorque,
                    enableLimit: true,
                    lowerAngle: kneeLimits[0],
                    upperAngle: kneeLimits[1]
                }, this.leftThigh.body, this.leftLeg.body, v(originX, originY + 110))
            ),

            rightKnee: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: motorTorque,
                    enableLimit: true,
                    lowerAngle: kneeLimits[0],
                    upperAngle: kneeLimits[1]
                }, this.rightThigh.body, this.rightLeg.body, v(originX, originY + 120))
            ),

            leftAnkle: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: motorTorque * 0.7,
                    enableLimit: true,
                    lowerAngle: ankleLimits[0],
                    upperAngle: ankleLimits[1]
                }, this.leftLeg.body, this.leftFoot.body, v(originX - 10, originY + 172))
            ),

            rightAnkle: this.world.createJoint(
                pl.RevoluteJoint({
                    enableMotor: true,
                    motorSpeed: 0,
                    maxMotorTorque: motorTorque * 0.7,
                    enableLimit: true,
                    lowerAngle: ankleLimits[0],
                    upperAngle: ankleLimits[1]
                }, this.rightLeg.body, this.rightFoot.body, v(originX - 10, originY + 172))
            )
        };

        this.leftSide = [
            this.upperLeftArm, this.lowerLeftArm,
            this.leftThigh, this.leftLeg, this.leftFoot
        ];

        this.rightSide = [
            this.upperRightArm, this.lowerRightArm,
            this.rightThigh, this.rightLeg, this.rightFoot
        ];

        this.allParts = Object.values(this.parts);
        this.allJoints = Object.values(this.joints);
    }

    makePartRect(name, x, y, w, h, density = 1) {
        // replace with your actual implementation
        return this.scene.makePartRect(name, x, y, w, h, density);
    }

    makePartCircle(name, x, y, r, density = 1) {
        // replace with your actual implementation
        return this.scene.makePartCircle(name, x, y, r, density);
    }

    setDebugVisible(visible) {
        for (const part of this.allParts) {
            if (part.image) part.image.setVisible(visible);
            if (part.graphics) part.graphics.setVisible(visible);
        }
    }

    destroy() {
        for (const joint of this.allJoints) {
            this.world.destroyJoint(joint);
        }
        for (const part of this.allParts) {
            this.world.destroyBody(part.body);
            if (part.image) part.image.destroy();
            if (part.graphics) part.graphics.destroy();
        }
    }
    // --- fixed-step stepping ---
    stepWorld(dtSec) {
        const fixed = 1 / 60;
        dtSec = Math.min(dtSec, 1 / 30); // clamp spikes harder

        this._accum += dtSec;

        const velIters = 20;
        const posIters = 10;

        while (this._accum >= fixed) {
            this.applyPoseHold();
            this.world.step(fixed, velIters, posIters);
            this._accum -= fixed;
        }
    }
    applyPoseHold() {
        if (!this.poseHoldEnabled) return;

        this.driveJointToAngle(this.hipBack, this.targets.hipBack, 10, 2.2, 6);

        this.driveJointToAngle(this.leftHipLeg, this.targets.leftHip, 8, 1.6, 5);
        this.driveJointToAngle(this.rightHipLeg, this.targets.rightHip, 8, 1.6, 5);

        this.driveJointToAngle(this.leftKnee, this.targets.leftKnee, 9, 1.8, 5);
        this.driveJointToAngle(this.rightKnee, this.targets.rightKnee, 9, 1.8, 5);

        this.driveJointToAngle(this.leftAnkle, this.targets.leftAnkle, 8, 1.5, 5);
        this.driveJointToAngle(this.rightAnkle, this.targets.rightAnkle, 8, 1.5, 5);

        this.driveJointToAngle(this.leftShoulder, this.targets.leftShoulder, 5, 1.0, 4);
        this.driveJointToAngle(this.rightShoulder, this.targets.rightShoulder, 5, 1.0, 4);

        this.driveJointToAngle(this.leftElbow, this.targets.leftElbow, 4, 0.8, 3);
        this.driveJointToAngle(this.rightElbow, this.targets.rightElbow, 4, 0.8, 3);
    }
    driveJointToAngle(joint, targetAngle, stiffness = 8, damping = 1.5, maxSpeed = 6) {
        const angleError = targetAngle - joint.getJointAngle();
        const speedError = joint.getJointSpeed();
        const motorSpeed = Phaser.Math.Clamp(angleError * stiffness - speedError * damping, -maxSpeed, maxSpeed);
        joint.setMotorSpeed(motorSpeed);
    }
    syncSprites() {
        const sync = (part) => {
            const p = part.body.getPosition();
            part.sprite.x = m2px(p.x);
            part.sprite.y = m2px(p.y);
            part.sprite.rotation = part.body.getAngle();
        };

        sync(this.head);
        sync(this.body);
        sync(this.pelvis);
        sync(this.upperLeftArm);
        sync(this.lowerLeftArm);
        sync(this.upperRightArm);
        sync(this.lowerRightArm);
        sync(this.leftThigh);
        sync(this.leftLeg);
        sync(this.leftFoot);
        sync(this.rightThigh);
        sync(this.rightLeg);
        sync(this.rightFoot);
    }
}