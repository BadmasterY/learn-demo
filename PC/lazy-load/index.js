window.onload = () => {
    const imgDom = document.getElementById('img-dom');
    // 顶部距离只需要获取一次, 因为会随着滚动条的变化而变化
    const rect = imgDom.getBoundingClientRect();
    let isLoaded = false;

    if (IntersectionObserver) {
        // observer
        console.log('use observer...');
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                showCallback();
            }
        }, {
            threshold: 0.1,
            rootMargin: '20px 0px',
        });

        observer.observe(imgDom)
    } else {
        // offset
        console.log('use offset...');

        const root = document.getElementById('root');

        if (root) {
            root.addEventListener('scroll', function (ev) {
                console.log(rect, root.scrollTop + root.offsetHeight)
                if (imgDom) {
                    // 图片距离顶部距离 > 当前滚动条距离 + 一个页面的高度时, 显示图片
                    if (rect.top <= (root.scrollTop + root.offsetHeight)) {
                        showCallback();
                    }
                }
            })
        }
    }

    // show cb
    function showCallback () {
        if (imgDom && !isLoaded) {
            imgDom.src = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202003%2F14%2F20200314140308_moyyy.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1677749260&t=7299d5a84e9359c7a47b65fd07e9527c';

            imgDom.addEventListener('load', function () { console.log('loaded...'); isLoaded = true; });
            imgDom.addEventListener('error', function () { console.log('load error...'); })
        }
    }
}
