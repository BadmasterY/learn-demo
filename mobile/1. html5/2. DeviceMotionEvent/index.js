var SHAKE_SPEED_THRESHOLD = 300;
var lastTime = 0; // 记录上次变化的时间

var x = y = z = lastX = lastY = lastZ = 0;

function motionHandler(e) {
    // 获取包含重力加速的位置信息
    var acceleration = e.accelerationIncludingGravity;
    var curTime = Date.now(); // 当前时间戳

    if ((curTime - lastTime) > 120) {
        var diffTime = curTime - lastTime; // 变化时间差
        lastTime = curTime; // 将上一次变化的时间改为当前时间

        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;

        //计算摇动速度
        var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 1000;
        if (speed > SHAKE_SPEED_THRESHOLD) {
            // 当摇动速度大于预设的基准速度时触发
            alert('摇一摇成功');
        }

        // 记录此次变化的位置坐标
        lastX = x;
        lastY = y;
        lastZ = z;
    }
}

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', motionHandler, false);
} else {
    alert('设备不支持！');
}