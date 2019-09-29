window.addEventListener('load', e => {
    let btn = document.querySelector('.btn');
    let mark = document.querySelector('.mark');
    let nav = document.querySelector('.nav');

    // 显示侧边栏
    btn.addEventListener('click', e => {
        e.preventDefault();
        mark.style.display = 'block';
        nav.style.left = '0px';
        document.body.style.overflow = 'hidden';
    }, false);

    // 隐藏侧边栏
    mark.addEventListener('click', e => {
        mark.style.display = '';
        nav.style.left = '';
        setTimeout(() => {
            document.body.style.overflow = '';
        },150);
    }, false);
}, false);