// 创建实例
let mediaSource = new MediaSource();
let mediaRecorder, recordedBlobs, sourceBuffer;

// 监听 sourceopen 事件,媒体数据源打开时触发
mediaSource.addEventListener('sourceopen', e => {
    sourceBuffer = mediaSource.addSourceBuffer('video/webm', codecs = 'vp8'); // 获取视频流
    console.log(sourceBuffer);
}, false);

let sourceVideo = document.getElementById('source'); // 源视频
let recordedVideo = document.getElementById('recorded'); // 已录制视频
let recordBtn = document.getElementById('record'); // 录制按钮

recordBtn.disabled = true;

// 监听 click 事件
recordBtn.addEventListener('click', e => {
    console.log('click...');
    // 切换录制
    if (recordBtn.textContent === '开始录制') {
        startRecording(); // 开始录制
    } else {
        stopRecording(); // 停止录制
    }
}, false);

// 设置媒体约束,接收声音和视频,视频宽度160px
let constraints = {
    audio: true,
    video: {
        width: 160
    },
};

// 获取用户媒体
navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    // 将按钮设置为可用
    recordBtn.disabled = false;
    window.stream = stream;
    sourceVideo.srcObject = stream;
}).catch(err => {
    console.error('获取用户媒体错误: ' + err.name + ' => ' + err.message);
    document.body.innerHTML += '获取用户媒体错误: ' + err.name + ' => ' + err.message;
});

// 开始录制
function startRecording() {
    recordedBlobs = []; // 初始化记录数据
    let mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
    ];
    // 查找支持的视频格式
    let mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || '';
    // 创建媒体录制器
    mediaRecorder = new MediaRecorder(window.stream, {mimeType});
    recordBtn.textContent = '停止录制';
    // 监听 dataavailable 事件
    mediaRecorder.addEventListener('dataavailable', e => {
        if(e.data && e.data.size > 0) {
            recordedBlobs.push(e.data); // 存在数据存入记录区
        }
    }, false);
    mediaRecorder.start(10);
}
// 停止录制
function stopRecording() {
    mediaRecorder.stop();
    let buf = new Blob(recordedBlobs, {type: 'video/webm'});
    // 设置已录制视频的源为录制好的视频
    recordedVideo.src = URL.createObjectURL(buf);
    recordBtn.textContent = '开始录制';
}