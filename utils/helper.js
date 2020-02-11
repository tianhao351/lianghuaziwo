export function getType(exp) {
    // 1 是卡路里， 0 是步数
    const type = exp.split('+').shift();
    return type === 'Nclear' ? 1 : 0;
}