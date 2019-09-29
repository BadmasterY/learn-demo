window.addEventListener('load', e => {
    const CSS_PREVIEW = 'preview'; // 预览模式className
    let startOffsetX, isTouchStart, currentTranX = 0;
    let imgs = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg'];

    let gallery = document.getElementById('gallery');

    let list = '';

    // 初始化
    for (let i = 0; i < imgs.length; i++) {
        list += `
        <div class="item">
            <img src="images/${imgs[i]}" alt="${i}" />
        </div>`;
    }

    gallery.innerHTML = list;

    // 监听点击事件,通过修改className控制样式实现预览
    gallery.addEventListener('click', e => {
        let classList = gallery.classList;

        if (classList.contains(CSS_PREVIEW)) {
            // 是预览模式,退出
            classList.remove(CSS_PREVIEW);
            gallery.style.transform = '';
            gallery.style.width = '';
        } else {
            // 非预览模式,进入
            classList.add(CSS_PREVIEW);
            // 修改宽度等于 子项个数 * 100vw
            // 保证所有子项排在同一行
            gallery.style.width = 100 * imgs.length + 'vw';

            let width = document.body.offsetWidth;
            currentTranX = -(e.target.alt * width);
            gallery.style.transform = `translateX(${currentTranX}px)`
        }
    }, false);

    // 添加鼠标事件
    // 不大好使,和 click 事件冲突
    // 使用clientX clientY 实现
    // gallery.addEventListener('mousedown', start, false);
    // gallery.addEventListener('mousemove', move, false);
    // gallery.addEventListener('mouseup', end, false);

    // 添加触摸事件
    gallery.addEventListener('touchstart', start, false);
    gallery.addEventListener('touchmove', move, false);
    gallery.addEventListener('touchend', end, false);

    // 开始/按下
    function start (e) {
        // 不在预览界面,不执行
        let classList = gallery.classList;
        if(!classList.contains(CSS_PREVIEW)) return;

        isTouchStart = true;
        gallery.classList.remove('animation');
        // 触摸开始时,记录当前手指 x 轴位置
        startOffsetX = e.changedTouches[0].pageX;
    }

    // 移动
    function move (e) {
        // 未开始,不进行偏移
        if (!isTouchStart) return;
        // 触摸移动,偏移量等于当前位置 + 当前偏移量
        let dx = e.changedTouches[0].pageX - startOffsetX;
        changeTranX(dx + currentTranX);
    }

    // 结束
    function end (e) {
        // 触摸事件结束
        if (!isTouchStart) return;

        let width = document.body.offsetWidth;
        gallery.classList.add('animation');
        let dx = e.changedTouches[0].pageX - startOffsetX;// 计算结束时的偏移量
        // 便宜量过半进行切换
        if (Math.abs(dx) > (width / 2)) {
            // 边界处理,只有最外层偏移量在 (-width*item.length, 0]之间才是合理的
            if(currentTranX <= 0 && currentTranX > (-width * imgs.length)) {
                // 右划
                if(dx > 0) {
                    if(currentTranX < 0) {
                        // 不是第一张
                        currentTranX += width;
                    }
                }else {
                    // 左划
                    if(currentTranX > (-width * (imgs.length - 1))) { // 不是最后一张
                        currentTranX -= width;
                    }
                }
            } 
        }
        // 进行位置移动/复位
        changeTranX(currentTranX);
        isTouchStart = false;
    }

    function changeTranX(translateX){
        gallery.style.transform = `translateX(${translateX}px)`;
    }
}, false);