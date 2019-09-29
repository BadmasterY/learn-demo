window.addEventListener('load', e => {
    let video = document.querySelector('video');
    let btns = document.querySelectorAll('input');

    // 播放
    btns[0].addEventListener('click', e => {
        if (video.paused) {
            video.play();
            e.target.value = '暂停';
        } else {
            video.pause();
            e.target.value = '播放';
        }
    }, false);

    // 快进
    btns[1].addEventListener('click', e => {
        if (video.playbackRate >= 8) {
            video.playbackRate = 1;
        } else {
            video.playbackRate *= 2;
        }

        e.target.value = `快进(x${video.playbackRate})`;
    }, false);

    // 静音
    btns[2].addEventListener('click', e => {
        video.muted = !video.muted;
        e.target.value = video.muted ? '取消静音' : '静音';
    }, false);
}, false);