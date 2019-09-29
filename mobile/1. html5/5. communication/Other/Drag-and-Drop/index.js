let draggableColor = document.getElementsByClassName('draggable')[0];
let greenText = document.getElementsByClassName('t-green')[0];

draggableColor.addEventListener('dragstart', e => {
    // 拖拽开始,存储数据 setData(数据名 ,数据内容)
    e.dataTransfer.setData('ele', '.draggable');
}, false);

greenText.addEventListener('dragover', e => {
    // 结束时必须的操作,否则不生效
    e.preventDefault();
}, false);

greenText.addEventListener('drop', e => {
    // 拖拽结束,读取数据
    let data = e.dataTransfer.getData('ele');
    console.log(data); // 打印当时存储的数据
    draggableColor.style.visibility = 'hidden'; // 隐藏可拖拽元素
    greenText.innerText = '拖入了...'; // 修改释放区域的内容
}, false);