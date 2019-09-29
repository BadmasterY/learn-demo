// 方向事件
window.addEventListener('deviceorientation', function (e) {
    // e.absolute: 如果方向数据跟地球坐标系数和设备坐标系数有差异,则为 true;
    //             如果由设备自身提供,则为false
    // e.alpha: 设备在 Alpha 方向上旋转的角度,范围为 0~360°
    // e.beta: 设备在 Beta 方向上旋转的角度,范围为 -180~180°
    // e.gamma: 设备在 Gamma 方向上旋转的角度,范围为 -90~90°
    this.console.log('方向事件: ', e);
}, true);

// 移动事件
window.addEventListener('devicemotion', function (e) {
    // e.acceleration: 设备在 X, Y, Z 三个轴上移动的距离，已抵消重力加速
    // e.accelerationIncludingGravity: 设备在 X, Y, Z 三个轴上运动的距离，包含重力加速
    // e.rotationRate: 设备在 Alpha, Beta, Gamma 三个方向上旋转的角度
    // e.interval: 从设备获取数据的频率,单位是ms
    this.console.log('移动事件: ', e);
}, false);