let menu = $('ul.navigator > li'); // 获取导航元素
let content = $('div.content'); // 获取内容容器

// 根据当前 URL,初始化页面
initPage(location.pathname.substring(1));

// 初始化页面方法
function initPage(page) {
    menu.removeClass('selected-item'); // 清空导航栏元素选中
    // 找到对应的导航栏元素,并设置选中
    menu.filter(function() {
        return $(this).text().toLowerCase().trim() === page;
    }).addClass('selected-item');
    // 修改内容
    content.text(`this is a ${page} page.`);
}
// 监听导航栏元素点击事件
menu.on('click', function() {
    let page = $(this).text().toLowerCase().trim(); // 获取被点击元素
    initPage(page);
    history.pushState('', page, page); // 修改URL
});

// 监听 URL 变化
window.addEventListener('popstate', e => {
    // 根据 URL 变化初始化界面
    initPage(location.pathname.substring(1));
})