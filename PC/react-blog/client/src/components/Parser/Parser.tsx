/********************************************
 * Content Parser
 * name: parser.tsx
 * vsersion: 0.1.0
 * author: Mr. / https://github.com/BadmasterY
 * desc: Parser the braft-editor content json
 * create: 2020-4-17
 * update:
 *******************************************/
import React from 'react';

import { ArticleCon as ArticleContent } from '../../interfaces/response';
import { parser } from '../../config/default.json';

import './parser.css';

const { fastParserSize } = parser;

interface SortItem {
    offset: number;
    length: number;
    style: string;
}

/**
 * array sort function
 * @param pre preItem
 * @param next nextItem
 */
function sortFn(pre: SortItem, next: SortItem) {
    return pre.offset - next.offset;
}

function FastParser(content: ArticleContent) {
    const { blocks } = content;
    const fastBlocks = blocks.slice(0, fastParserSize);
    const fastContent = Object.assign({}, content, { blocks: fastBlocks });
    return FullParser(fastContent);
}

function FullParser(content: ArticleContent) {
    const { blocks, entityMap } = content;
    return (<div className="parser">
        {
            blocks.map(item => {
                let innerContent: JSX.Element = <>Null</>;
                // normal text
                if (item.type === 'unstyled') {
                    let { text, inlineStyleRanges, entityRanges } = item;
                    inlineStyleRanges.sort(sortFn);
                    const length = inlineStyleRanges.length;
                    if (length === 0) {
                        // no style
                        innerContent = <>{text}</>
                    } else {
                        // use style
                        let oldEnd = 0;

                        const tempElementArr = inlineStyleRanges.map(item => {
                            const { offset, length, style } = item;
                            let noStyleText = '';

                            if (offset > oldEnd) { // push no style text
                                noStyleText = text.slice(oldEnd, offset);
                            }else if(offset < oldEnd) {
                                console.log(offset);
                            }

                            const tempText = text.slice(offset, offset + length);
                            oldEnd = offset + length; // set new end

                            return (<>
                                {noStyleText}
                                <span className={style}>{tempText}</span>
                            </>);
                        });

                        // check end string
                        if (oldEnd < length) {
                            tempElementArr.push((
                                <>{text.slice(oldEnd, length)}</>
                            ))
                        }

                        innerContent = (
                            <>
                                {
                                    tempElementArr.map(item => item)
                                }
                            </>
                        );
                    }
                } else if (item.type === 'atomic') {
                    const { entityRanges } = item;
                }
                return (<p key={item.key}>
                    {innerContent}
                </p>);
            })
        }
    </div>);
}

/**
 * Parser the braft-editor content json
 * @param content Article content json
 * @param isDesc Return description or all, 'true' return describe
 */
function Parser(props: { content: ArticleContent, isDesc?: boolean }) {
    const { content, isDesc } = props;
    if (isDesc === true) {
        return FastParser(content);
    } else {
        return FullParser(content);
    }
}

export default Parser;