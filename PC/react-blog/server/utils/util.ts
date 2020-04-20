import { ArticleContent } from '../interfaces/articles';

const dataType = (data: any) => {

    let typeStr = Object.prototype.toString.call(data);
    let regexp = new RegExp('(\\w+)(?=])', 'g');

    if(!typeStr.match(regexp)) return '';

    return (typeStr.match(regexp) as RegExpMatchArray)[0];
}

const getDate = (date = Date.now()) => {
    return new Date(date).toLocaleString();
}

// TODO
// parser the publish json
const parser = (data: ArticleContent) => {

};

export {
    dataType,
    getDate,
    parser,
}