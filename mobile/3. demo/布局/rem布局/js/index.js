/**
 * 偷懒,动态生成一下
 */
window.addEventListener('load', e => {
    const imgList = [
        {
            id: 0,
            name: '超市',
            image: 'supermarket',
        },
        {
            id: 1,
            name: '数码电器',
            image: 'figures',
        },
        {
            id: 2,
            name: '服饰',
            image: 'clothes',
        },
        {
            id: 3,
            name: '生鲜',
            image: 'fresh',
        },
        {
            id: 4,
            name: '京东到家',
            image: 'comehome',
        },
        {
            id: 5,
            name: '超市',
            image: 'supermarket',
        },
        {
            id: 6,
            name: '数码电器',
            image: 'figures',
        },
        {
            id: 7,
            name: '服饰',
            image: 'clothes',
        },
        {
            id: 8,
            name: '生鲜',
            image: 'fresh',
        },
        {
            id: 9,
            name: '京东到家',
            image: 'comehome',
        },
    ];

    let entry = document.querySelector('div.entry');
    let temp = '';

    for(let i = 0; i < imgList.length; i++) {
        temp += `
            <a class="box" href="#" alt="${imgList[i].id}">
                <img src="./images/${imgList[i].image}.png" />
                <span>${imgList[i].name}</span>
            </a>
        `;
    }

    entry.innerHTML = temp;
    temp = '';
}, false);