import { MOTOR_TORQUE, originX, originY } from "./config.js";
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


// const hipLimits = [0, 0];
// const pelvisLimits = [-0.6, 1.6];
// const kneeLimits = [0, 1.6];
// const ankleLimits = [-0.6, 0.6];
// const shoulderLimits = [-1.0, 1.0];
// const elbowLimits = [-1.2, 0.2];


export class Runner {
    constructor(scene) {
        this.lowerLeftArmOffset = { x: 0, y: 40 };
        this.upperLeftArmOffset = { x: - 10, y: - 20 };
        this.leftThighOffset = { x: 0, y: 70 };
        this.leftFootOffset = { x: 10, y: 172 };
        this.leftLegOffset = { x: -10, y: 140 };
        this.rightFootOffset = { x: 10, y: 172 };
        this.rightLegOffset = { x: -10, y: 140 };
        this.rightThighOffset = { x: 0, y: 70 };
        this.headOffset = { x: 0, y: -95 };
        this.backOffset = { x: 0, y: 0 };
        this.pelvisOffset = { x: 0, y: 0 };
        this.lowerRightArmOffset = { x: 0, y: 40 };
        this.upperRightArmOffset = { x: - 10, y: - 20 };

        this.motorTorque = MOTOR_TORQUE ?? 140;
        this.shoulderLimits = [-1.8, 1.8];
        this.elbowLimits = [-1.6, 0.2];
        this.hipLimits = [-0.5, 0.5];
        this.pelvisLimits = [-1.1, 1.1];
        this.kneeLimits = [-0.1, 2.0];
        this.ankleLimits = [-0.7, 0.7];

        this.S = {
            body: { w: 71, h: 140 },
            pelvis: { w: 42, h: 42 },
            thigh: { w: 62, h: 80 },
            leg: { w: 30, h: 80 },
            foot: { w: 50, h: 23 },
            upperArm: { w: 47, h: 80 },
            lowerArm: { w: 43, h: 80 },
            head: { r: 35 }
        };

        this.offsets = {
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

        this.v = (xPx, yPx) => pl.Vec2(px2m(xPx), px2m(yPx));

        // Parts
        this.parts = {
            head: this.makePartCircle("head", originX + this.offsets.head.x, originY + this.offsets.head.y, this.S.head.r, 0.8),
            body: this.makePartRect("body", originX + this.offsets.body.x, originY + this.offsets.body.y, this.S.body.w, this.S.body.h, 1.2),
            pelvis: this.makePartRect("pelvis", originX + this.offsets.pelvis.x, originY + this.offsets.pelvis.y, this.S.pelvis.w, this.S.pelvis.h, 1.2),

            upperLeftArm: this.makePartRect("upperArm", originX + this.offsets.upperLeftArm.x, originY + this.offsets.upperLeftArm.y, this.S.upperArm.w, this.S.upperArm.h),
            lowerLeftArm: this.makePartRect("lowerArm", originX + this.offsets.lowerLeftArm.x, originY + this.offsets.lowerLeftArm.y, this.S.lowerArm.w, this.S.lowerArm.h),
            upperRightArm: this.makePartRect("upperArm", originX + this.offsets.upperRightArm.x, originY + this.offsets.upperRightArm.y, this.S.upperArm.w, this.S.upperArm.h),
            lowerRightArm: this.makePartRect("lowerArm", originX + this.offsets.lowerRightArm.x, originY + this.offsets.lowerRightArm.y, this.S.lowerArm.w, this.S.lowerArm.h),

            leftThigh: this.makePartRect("thigh", originX + this.offsets.leftThigh.x, originY + this.offsets.leftThigh.y, this.S.thigh.w, this.S.thigh.h),
            leftLeg: this.makePartRect("leg", originX + this.offsets.leftLeg.x, originY + this.offsets.leftLeg.y, this.S.leg.w, this.S.leg.h),
            leftFoot: this.makePartRect("foot", originX + this.offsets.leftFoot.x, originY + this.offsets.leftFoot.y, this.S.foot.w, this.S.foot.h),

            rightThigh: this.makePartRect("thigh", originX + this.offsets.rightThigh.x, originY + this.offsets.rightThigh.y, this.S.thigh.w, this.S.thigh.h),
            rightLeg: this.makePartRect("leg", originX + this.offsets.rightLeg.x, originY + this.offsets.rightLeg.y, this.S.leg.w, this.S.leg.h),
            rightFoot: this.makePartRect("foot", originX + this.offsets.rightFoot.x, originY + this.offsets.rightFoot.y, this.S.foot.w, this.S.foot.h)
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

    resetBody() {
        const set = (part, xPx, yPx) => {
            part.body.setTransform(pl.Vec2(px2m(xPx), px2m(yPx)), 0);
            part.body.setLinearVelocity(pl.Vec2(0, 0));
            part.body.setAngularVelocity(0);
        };

        set(this.head, originX + headOffset.x, originY + headOffset.y);
        set(this.body, originX + backOffset.x, originY + backOffset.y);
        set(this.pelvis, originX + pelvisOffset.x, originY + pelvisOffset.y);

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
}