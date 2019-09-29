window.addEventListener('load', e => {
    let num = 1;

    let page_1 = document.querySelector('.page_1');
    let page_2 = document.querySelector('.page_2');

    let number_1 = document.querySelector('.number_1');
    let number_2 = document.querySelector('.number_2');

    function count(dom, text) {
        dom.innerHTML = text + (num++);
    };

    // 随随便便触发好几百次的 mousemove 事件
    // page_1.onmousemove = count.bind(null, number_1);
    // page_2.onmousemove = count.bind(null, number_2);

    // 防抖,非立即执行版
    // 触发事件之后不会立即执行函数,而是等到约定的时间戳之后再执行
    // function debounce(fn, wait) {
    //     let timeout;
    //     return (...args) => {
    //         if(timeout) clearTimeout(timeout);

    //         timeout = setTimeout(() => {
    //             fn.apply(this, args);
    //         }, wait);
    //     };
    // }

    // page_1.onmousemove = debounce(count.bind(null, number_1, '非立即执行版: '), 1000);

    // 防抖,立即执行版
    // 触发事件之后会立即执行,但是之后的一段时间之内不会再次被触发,同时定时器会一直监听
    // 如果第一次触发之后,用户一直在进行操作(鼠标一直在触发器内移动),则第二次将不会被触发
    // function debounce(fn, wait) {
    //     let timeout;
    //     return (...args) => {
    //         if(timeout) clearTimeout(timeout);

    //         let triggerNow = !timeout;

    //         timeout = setTimeout(() => {
    //             timeout = null;
    //         }, wait);

    //         if(triggerNow) fn.apply(this, args);
    //     };
    // }

    // page_1.onmousemove = debounce(count.bind(null, number_1, '立即执行版: '), 1000);

    /**
     * 防抖,整合版
     * @param {Function} fn 需要执行的方法
     * @param {Number} wait 等待的时间,默认1000ms
     * @param {Boolean} immediate 是否立即执行,默认true
     */
    function debounce(fn, wait = 1000, immediate = true) {
        let timeout;
        return (...args) => {
            if (timeout) clearTimeout(timeout);

            if (immediate) {
                let triggerNow = !timeout;

                timeout = setTimeout(() => {
                    timeout = null;
                }, wait);

                if (triggerNow) fn.apply(this, args);
            } else {
                timeout = setTimeout(() => {
                    fn.apply(this, args);
                }, wait);
            }
        };
    }

    page_1.onmousemove = debounce(count.bind(null, number_1, ''));

    // 节流,时间戳版
    // 通过上一次触发时间与当前时间来判断是否需要执行方法
    // function throttle(fn, wait) {
    //     let oldTime = 0;
    //     return (...args) => {
    //         let time = Date.now();

    //         if(time - oldTime > wait) {
    //             fn.apply(this, args);

    //             oldTime = time;
    //         }
    //     };
    // }

    // page_2.onmousemove = throttle(count.bind(null, number_2, '时间戳版: '), 1000);

    // 节流,定时器版
    // 只有当上一次事件触发之后,才开始新的计时
    // function throttle(fn, wait) {
    //     let timeout;
    //     return (...args) => {
    //         if(!timeout) {
    //             timeout = setTimeout(() => {
    //                 timeout = null;
    //                 fn.apply(this, args);
    //             }, wait);
    //         }
    //     };
    // }

    // page_2.onmousemove = throttle(count.bind(null, number_2, '定时器版: '), 1000);

    /**
     * 节流,整合版
     * @param {Function} fn 需要执行的方法
     * @param {Number} wait 等待的时间,默认1000ms
     * @param {Boolean} isTimeout 是否为使用定时器,默认false
     */
    function throttle(fn, wait = 1000, isTimeout = false) {
        let oldTime = 0;
        let timeout;
        return (...args) => {

            if (isTimeout) {
                if (!timeout) {
                    timeout = setTimeout(() => {
                        timeout = null;
                        fn.apply(this, args);
                    }, wait);
                }
            } else {
                let time = Date.now();

                if (time - oldTime > wait) {
                    fn.apply(this, args);

                    oldTime = time;
                }
            }
        }
    }

    page_2.onmousemove = throttle(count.bind(null, number_2, ''));

}, false);