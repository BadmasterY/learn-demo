// 标签模板
var divstr = `
<div class='note'>
    <a class='close'>X</a>
    <textarea placeholder='请输入便签内容'></textarea>
</div>`;

// 实例化一个便签数据库、数据表
var db = new LocalDB('db1', 'notes');

// 打开数据库
db.open(() => {
    console.log('打开数据库...')
    // 页面初始化时读取所有便签
    db.getAll(data => {
        var div = $(divstr);
        div.data('id', data.id);
        div.find('textarea').val(data.content);
        // 插到 add 之前
        div.insertBefore(add);
    });
});

// add 按钮添加事件
var add = $('.add').on('click', () => {
    var div = $(divstr);
    div.insertBefore(add);
    // 添加一条空数据到数据库
    db.set({content: ''}, id => {
        // 将数据库生成的 id 添加到便签上
        div.data('id', id);
    });
});

// 监听所有便签编辑域的焦点事件
$('.notes').on('blur', 'textarea', function() {
    var div = $(this).parent();
    // 获取该标签的 id 和内容
    var data = {id: div.data('id'), content: $(this).val()};
    // 写入数据库
    db.set(data);
}).on('click', '.close', function(){
    if(confirm('确定删除该便签么?')) {
        var div = $(this).parent();
        // 删除数据
        db.remove(div.data('id'));
        // 删除 DOM 元素
        div.remove();
    }
});
