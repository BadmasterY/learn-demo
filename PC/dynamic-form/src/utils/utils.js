const types = {
    "输入框": "input",
    "日期控件": "date",
    "文本区域": "textarea",
    "标题": "title",
    "分割线": "divider",
}

let json;

fetch("./config.json")
    .then(data => data.json())
    .then(data => json = data)
    .catch(err => new Error(err));

/**
 * 判断数据类型
 * @param {any} data 任意类型数据
 */
function dataType(data) {
    const typeStr = Object.prototype.toString.call(data);
    const regexp = new RegExp('(\\w+)(?=])', 'g');

    return typeStr.match(regexp)[0];
}

/**
 *  浅拷贝
 * @param {Object|Array} value 需要拷贝的对象
 */
function clone(value) {
    const copy = (dataType(value) == "Array") ? [] : {};
    for (const item in value) {
        if (!Object.hasOwnProperty.call(value, item)) continue;
        copy[item] = (typeof value[item] == "object") ? clone(value[item]) : value[item];
    }
    return copy;
}

/**
 * 获取组件初始化数据
 * @param {String} value 内容
 */
function getInitData(value) {
    if (!json) {
        console.warn(`json is not found!`);
        return;
    }

    const type = types[value];

    return clone({
        type,
        isFocus: false,
        atrribute: json[type]
    });
}


export default {
    getInitData,
    dataType,
    clone,
};