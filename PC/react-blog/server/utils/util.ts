import fs from 'fs';
import path from 'path';

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

/**
 * 自动创建目录
 * @param dirname 目录
 */
const mkdirsSync = (dirname: string) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }else {
            return false;
        }
    }
}

export {
    dataType,
    getDate,
    parser,
    mkdirsSync,
}