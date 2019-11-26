// chrome 49
if (navigator.mediaDevices && !navigator.mediaDevices.getUserMedia && navigator.webkitGetUserMedia) {
  navigator.mediaDevices.getUserMedia = function (constraint) {
    return new Promise((resolve, reject) => {
      navigator.webkitGetUserMedia(constraint, res => resolve(res), err => reject(err));
    });
  }
}

// 创建媒体流
async function createMedia() {
  let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 1280, height: 720, facingMode: 'environment' } });
  return stream;
}

export {
  createMedia,
}