/**
 * 每一步返回 this 方便链式调用
 * 使用hash实现
 */
var r; // 全局的 router 实例
window.addEventListener('load', e => {
    // Router 构造函数
    let Router = function () {
        this._routers = [];
        this._get = (hash) => {
            let router = this._routers.filter(item => (`#${item.url}`) === hash);
            return router[0] || {};
        }
    }

    Object.assign(Router.prototype, {
        // 初始化方法
        init() {
            this.go(this._get(location.hash)); // 对匹配路由进行直接跳转
            
            // 添加 hash 变化监听
            window.addEventListener('hashchange', e => {
                this.go(this._get(location.hash));
            }, false);

            return this;
        },
        // 推入队列方法
        push(route) {
            this._routers.push(route);
            return this;
        },
        // 跳转方法
        go(page) {
            // 获取入场元素
            let enter_page = document.querySelector(page.selector);

            if (!enter_page) return false;

            enter_page.classList.add('enter'); // 添加 class
            if (page.hasOwnProperty('handle')) page.handle.call(this); // 如果有handle方法就调用
        },
    });

    r = new Router();

    let home_page = {
        url: '',
        selector: '.home',
        handle() {
            console.log('This is home page.');
        }
    }

    let index_page = {
        url: '/',
        selector: '.index',
        handle() {
            console.log('This is index page.');
        }
    };

    let start_page = {
        url: '/start',
        selector: '.start',
        handle() {
            console.log('This is start page.');
        }
    }

    r.push(home_page).push(index_page).push(start_page).init();
}, false);