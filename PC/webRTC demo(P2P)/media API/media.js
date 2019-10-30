// 判断是否有 navigator.mediaDevices，没有赋成空对象
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// 继续判断是否有 navigator.mediaDevices.getUserMedia，没有就采用 navigator.getUserMedia
if (!navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia = function (prams) {
    let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    // 兼容获取
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, prams, resolve, reject);
    });
  };
}

navigator.mediaDevices.getUserMedia({
  audio: true,
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 776, ideal: 720, max: 1080 }
  }
})
  // 参数表示需要同时获取到音频和视频
  .then(stream => {
    // 获取到优化后的媒体流
    let video = document.querySelector('#rtc');
    if ('srcObject' in video) { // 判断是否支持 srcObject 属性
      video.srcObject = stream;
    } else {
      video.src = window.URL.createObjectURL(stream);
    }
  })
  .catch(err => {
    // 捕获错误
  });