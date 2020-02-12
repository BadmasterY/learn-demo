interface Type {
    [p: string]: string;
}

interface Json {
    [p: string]: any;
}

const types: Type = {
    "输入框": "input",
    "日期控件": "date",
    "文本区域": "textarea",
    "下拉选框": "select",
    "标题": "title",
    "分割线": "divider",
}

let json: Json;

fetch("./config.json")
    .then(data => data.json())
    .then(data => json = data)
    .catch(err => new Error(err));

/**
 * 判断数据类型
 * @param {any} data 任意类型数据
 */
function dataType(data: any) {
    const typeStr = Object.prototype.toString.call(data);
    const regexp = new RegExp('(\\w+)(?=])', 'g');
    const regexpArr = typeStr.match(regexp);

    return (regexpArr as RegExpMatchArray);
}

/**
 *  浅拷贝
 * @param {Object|Array} value 需要拷贝的对象
 */
function clone(value: any) {
    const copy: any = (dataType(value)&&dataType(value)[0] == "Array") ? [] : {};
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
function getInitData(value: string) {
    if (!json) {
        throw new Error(`json is not found!`);
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