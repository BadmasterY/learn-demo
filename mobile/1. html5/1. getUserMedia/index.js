// 访问用户媒体设备的兼容性写法
function getUserMedia(constraints, sucess, error) {
    // 标准API
    if (navigator.mediaDevices) {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(sucess).catch(error);
        }
    } else if (navigator.webkitGetUserMedia) {
        // webkit 内核
        navigator.webkitGetUserMedia(constraints, sucess, error);
    } else if (navigator.mozGetUserMedia) {
        // Firefox
        navigator.mozGetUserMedia(constraints, sucess, error);
    } else if (navigator.getUserMedia) {
        // 旧版本 API 兼容
        navigator.getUserMedia(constraints, sucess, error);
    } else {
        throw new Error('无法使用！请更换浏览器!');
    }
}

var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// 成功回调
function sucess(stream) {
    // 兼容 webkit 内核
    var compatibleURL = window.URL || window.webkitURL;
    // 将摄像头捕获的视频流作为 video 的源
    video.src = compatibleURL.createObjectURL(stream);
    video.play();
}

// 失败回调
function error(err) {
    console.log(`访问用户媒体失败: ${err.name} => ${err.message}`);
}

// 调用用户媒体设备访问摄像头
// 移动端默认为前置摄像头
getUserMedia({
    video: {
        width: 480,
        height: 320
    }
}, sucess, error);

// 拍照按钮绑定事件
document.getElementById('capture').addEventListener('click', function (e) {
    // 将 video 画面在 canvas 上绘制
    context.drawImage(video, 0, 0, 480, 320);
})