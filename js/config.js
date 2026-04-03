export const SCROLL_FACTOR = {
    HOUSES: 0.05,
    FENCE: 0.25,
    FOLIAGE: 0.55,
    SIDEWALK: 1,
    GRASS: 1.2
};

export const LAYER_HEIGHT = {
    HOUSES: 471,
    FENCE: 493,
    FOLIAGE: 192,
    SIDEWALK: 139,
    GRASS: 247
}

export const W = 800;
export const H = 600;

export const PPM = 30;

export const px2m = (px) => px / PPM;
export const originX = W * .3;
export const originY = 295;

// --- Controls / tuning ---
export const walkSpeed = 4;
export const motorTorque = 420;
