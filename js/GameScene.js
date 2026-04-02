import { Runner } from "./Runner.js";
const W = 800;
const H = 600;

const PPM = 30;

const px2m = (px) => px / PPM;
const originX = W * .3;
const originY = 295;

// --- Controls / tuning ---
const walkSpeed = 4;
const motorTorque = 420;


// --- Categories / masks (FIXED) ---
// Bodyparts collide ONLY with ground (no self-collision between limbs)
const CATEGORY_BODYPARTS = 0x0002;
const CATEGORY_GROUND = 0x0004;

const MASK_BODYPARTS = CATEGORY_GROUND;
const MASK_GROUND = CATEGORY_BODYPARTS;
const pl = planck;



export default class MainScene extends Phaser.Scene {
    constructor() { super("main"); }

    preload() {
        this.load.path = "assets/images/";
        this.load.image("body", "body.png");
        this.load.image("pelvis", "pelvis.png");
        this.load.image("thigh", "thigh.png");
        this.load.image("leg", "leg.png");
        this.load.image("foot", "foot.png");
        this.load.image("upperArm", "upperArm.png");
        this.load.image("lowerArm", "lowerArm.png");
        this.load.image("head", "head.png");
        this.load.path = "assets/images/background/";
        this.load.image("houses_layer", "houses_layer.png");
        this.load.image("fence_layer", "fence_layer.png");
        this.load.image("foliage_layer", "foliage_layer.png");
        this.load.image("sidewalk_layer", "sidewalk_layer.png");
        this.load.image("grass_layer", "grass_layer.png");
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;
        this.cameraScrollX = 0;

        this.SCROLL_FACTOR = {
            HOUSES: 0.05,
            FENCE: 0.25,
            FOLIAGE: 0.55,
            SIDEWALK: 1,
            GRASS: 1.2
        };

        this.LAYER_HEIGHT = {
            HOUSES: 471,
            FENCE: 493,
            FOLIAGE: 192,
            SIDEWALK: 139,
            GRASS: 247
        }
        this.BackgroundHeight = 1024;
        const backgroundResizeY = this.BackgroundHeight / 600;

        const houseHeight = this.LAYER_HEIGHT.HOUSES / this.BackgroundHeight * (backgroundResizeY);
        this.houses = this.add.image(0, 0, "houses_layer")
            .setOrigin(0, 0)
            .setScale(1, houseHeight);

        const fenceHeight = this.LAYER_HEIGHT.FENCE / this.BackgroundHeight * (backgroundResizeY);
        this.fence = this.add.image(0, 20, "fence_layer")
            .setOrigin(0, 0)
            .setScale(1, fenceHeight);

        const foliageHeight = this.LAYER_HEIGHT.FOLIAGE / this.BackgroundHeight * (backgroundResizeY);
        this.foliage = this.add.image(0, 400, "foliage_layer")
            .setOrigin(0, 0)
            .setScale(1, foliageHeight);

        const sidewalkHeight = this.LAYER_HEIGHT.SIDEWALK / this.BackgroundHeight * (backgroundResizeY);
        this.sidewalk = this.add.image(0, 460, "sidewalk_layer")
            .setOrigin(0, 0)
            .setScale(1, sidewalkHeight);

        const grassHeight = this.LAYER_HEIGHT.GRASS / this.BackgroundHeight * (backgroundResizeY);
        this.grass = this.add.image(0, 480, "grass_layer")
            .setOrigin(0, 0)
            .setScale(1, grassHeight);

        //        World width comes from the stitched strip
        this.worldWidth = this.sidewalk.width;
        this.worldHeight = 600;

        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
        // --- Planck world ---
        this.world = new pl.World(pl.Vec2(0, H / PPM));
        this._accum = 0;

        // --- Ground ---
        this.groundYpx = H - 80;
        const groundW = W;
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
        this.runner = new Runner(this, this.world, originX, originY);
        this.runner.applyPoseHold();
        // --- UI ---
        const font = { fontFamily: "Impact", fontSize: "30px", color: "#faa662", fontWeight: 'bold' };
        const shX = -1, shY = 1, shCol = "rgb(0, 0, 0)", shBlur = 0, shStroke = true, shFill = true;

        this.keyState = "";
        this.bestDist = 0;
        this.totalDist = 0;
        this.velX = 0;
        this.bestDistText = this.add.text(50, 30, "", font).setShadow(shX, shY, shCol, shBlur, shStroke, shFill);
        this.timeText = this.add.text(350, 30, "", font).setShadow(shX, shY, shCol, shBlur, shStroke, shFill);
        this.totalDistText = this.add.text(50, 60, "", font).setShadow(shX, shY, shCol, shBlur, shStroke, shFill);
        this.velocityText = this.add.text(350, 60, "", font).setShadow(shX, shY, shCol, shBlur, shStroke, shFill);
        this.keyStateText = this.add.text(50, 90, "", font).setShadow(shX, shY, shCol, shBlur, shStroke, shFill);

        // --- input ---
        this.keys = this.input.keyboard.addKeys({
            Q: Phaser.Input.Keyboard.KeyCodes.Q,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            O: Phaser.Input.Keyboard.KeyCodes.O,
            P: Phaser.Input.Keyboard.KeyCodes.P,
            RIGHT: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            LEFT: Phaser.Input.Keyboard.KeyCodes.LEFT,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });

        this.keys.Q.on("down", () => this.handleQPressed());
        this.keys.Q.on("up", () => this.handleQReleased());

        this.keys.W.on("down", () => this.handleWPressed());
        this.keys.W.on("up", () => this.handleWReleased());

        this.keys.O.on("down", () => this.handleOPressed());
        this.keys.O.on("up", () => this.handleOReleased());

        this.keys.P.on("down", () => this.handlePPressed());
        this.keys.P.on("up", () => this.handlePReleased());

        this.keys.LEFT.on("down", () => this.handleLeftPressed());
        this.keys.LEFT.on("up", () => this.handleLeftReleased());
        this.keys.RIGHT.on("down", () => this.handleRightPressed());
        this.keys.RIGHT.on("up", () => this.handleRightReleased());

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




    // --- controls ---
    handleQPressed() {
        this.joints.rightHipLeg.setMotorSpeed(-walkSpeed);
        this.leftHipLeg.setMotorSpeed(+walkSpeed);
        this.leftShoulder.setMotorSpeed(+walkSpeed);
        this.rightShoulder.setMotorSpeed(-walkSpeed);
        this.keyState = "Q";
    }
    handleQReleased() {
        this.rightHipLeg.setMotorSpeed(0);
        this.leftHipLeg.setMotorSpeed(0);
        this.hipBack.setMotorSpeed(0);
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
        this.rightHipLeg.setMotorSpeed(+walkSpeed);
        this.leftHipLeg.setMotorSpeed(-walkSpeed);
        this.hipBack.setMotorSpeed(+walkSpeed);
        this.rightShoulder.setMotorSpeed(+walkSpeed);
        this.leftShoulder.setMotorSpeed(-walkSpeed);
        this.keyState = "W";
    }
    handleWReleased() {
        this.rightHipLeg.setMotorSpeed(0);
        this.leftHipLeg.setMotorSpeed(0);
        this.hipBack.setMotorSpeed(0);
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

    handleRightPressed() {
        console.log('right');
        this.houses.x += cameraScrollX * this.SCROLL_FACTOR.HOUSES;
        this.foliage.x += cameraScrollX * this.SCROLL_FACTOR.FOLIAGE;
        this.sidewalk.x += cameraScrollX * this.SCROLL_FACTOR.SIDEWALK;
        this.grass.x += cameraScrollX * this.SCROLL_FACTOR.GRASS;
    }
    handleRightReleased() {
    }
    handleLeftPressed() {
        this.houses.x -= cameraScrollX * this.SCROLL_FACTOR.HOUSES;
        this.foliage.x -= cameraScrollX * this.SCROLL_FACTOR.FOLIAGE;
        this.sidewalk.x -= cameraScrollX * this.SCROLL_FACTOR.SIDEWALK;
        this.grass.x -= cameraScrollX * this.SCROLL_FACTOR.GRASS;
    }
    handleLeftReleased() {
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

    updateHud() {
        const t = (Date.now() - this.nowMs) / 1000;
        const vx = this.runner.head.body.getLinearVelocity().x;
        this.dist = (this.runner.body.sprite.x - originX) / PPM;

        this.bestDist = Math.max(this.bestDist, this.dist);
        this.totalDist = this.dist;
        this.velX = vx;

        this.bestDistText.setText("Best Distance: " + Math.floor(this.bestDist) + " m");
        this.timeText.setText("Time Elapsed: " + (Math.round(t * 10) / 10) + " s");
        this.totalDistText.setText("Total Distance: " + Math.floor(this.totalDist) + " m");
        this.velocityText.setText("Velocity: " + (Math.round(this.velX * 10) / 10) + " m/s");
        this.keyStateText.setText("Keystate: " + this.keyState);
    }
    updateCamera(dt) {
        // Use horizontal velocity (QWOP-style movement)
        this.cameraScrollX += this.runner.vx * dt;
    }
    update(_, deltaMs) {
        this.runner.stepWorld(deltaMs / 1000);
        this.runner.syncSprites();
        this.updateHud();
        this.updateCamera(deltaMs);
        const background = Math.floor(this.dist / 3);
        if (background > this.currentBackground && background < 20) {
            this.currentBackground = background;
            this.bg.setTexture("background-" + this.currentBackground);
            this.bg.setDisplaySize(W, H);
        }

        if (this.runner.head.sprite.y > this.groundYpx - 60) {
            this.resetBody();
        }
    }
}
