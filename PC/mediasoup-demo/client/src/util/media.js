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
    let audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    let videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
    })
    return {
        audioStream,
        videoStream
    };
  }
  
  export {
    createMedia,
  }