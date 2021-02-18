const MIN_SKEL_LENGTH = 200
const MAX_SKEL_LENGTH = 400
export const SKELETON_LINE_NUM = 7

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}
export function getRandomLineWidth() {
    return randInt(MIN_SKEL_LENGTH, MAX_SKEL_LENGTH)
}
