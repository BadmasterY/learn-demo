exports.dataType = data => {

    let typeStr = Object.prototype.toString.call(data);
    let regexp = new RegExp('(\\w+)(?=])', 'g');

    return typeStr.match(regexp)[0];
}