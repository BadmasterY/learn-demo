import types from './types.js';
import createElement from './element.js';

/**
 * find the diff with two tree  
 * Time complexity: `O(n)`
 * @param {createElement} oldTree tree
 * @param {createElement} newTree tree
 * @returns {{[number]: {type: number, content?: string, moves?: any[]}[]}} move or insert, the diff
 */
function diff(oldTree, newTree) {
    let index = 0; // tree node index
    const patches = {}; // diff
    // DFS
    dfs(oldTree, newTree, index, patches);
    return patches;
}

/**
 * DFS, pre order algorithm(?)
 * @param {createElement} oldNode pre update node
 * @param {createElement} newNode after update node
 * @param {number} index tree node index
 * @param {{[number]: {type: number, content: any}[]}} patches diff
 */
function dfs(oldNode, newNode, index, patches) {
    const currentPatches = [];

    if (newNode === null) {
        // no needs to do anything, all removed!
    }
    // TextNode content replace
    else if (typeof oldNode === 'string' && typeof newNode === 'string') {
        if (oldNode !== newNode) {
            currentPatches.push({
                type: types.TEXT,
                content: newNode,
            });
        }
    }
    // tagName and key equal
    // diff props and children
    else if (
        oldNode.tagName === newNode.tagName &&
        oldNode.key === newNode.key
    ) {
        const propsPatches = diffProps(oldNode, newNode);
        if (propsPatches) {
            currentPatches.push({
                type: types.PROPS,
                content: propsPatches,
            });
        }
        // ignore, not to do anything
        // if(!newNode.props.hasOwnProperty('ignore')) {
        diffChildren(
            oldNode.children,
            newNode.children,
            index,
            patches,
            currentPatches,
        );
        // }
    }
    // node not same, replace
    else {
        currentPatches.push({
            type: types.REPLACE,
            content: newNode,
        });
    }

    if (currentPatches.length) {
        patches[index] = currentPatches;
    }
}

/**
 * diff props
 * @param {createElement} oldNode pre update node
 * @param {createElement} newNode after update node
 * @returns {any[]|null} diff
 */
function diffProps(oldNode, newNode) {
    let count = 0; // flag, switch return type
    const oldProps = oldNode.props;
    const newProps = newNode.props;
    const propsPatches = {};

    // find oldProps diff
    for (const key in oldProps) {
        const value = oldProps[key];

        if (newProps[key] !== value) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    // find newProps diff
    for (const key in newProps) {
        // only compare what oldProps doesn't have
        if (!oldProps.hasOwnProperty(key)) {
            count++;
            propsPatches[key] = newProps[key];
        }
    }

    return count === 0 ? null : propsPatches;
}

/**
 * diff children
 * @param {(createElement|string)[]} oldChildren old children
 * @param {(createElement|string)[]} newChildren new children
 * @param {number} index current index
 * @param {{[number]: {type: number, content: any}[]}} patches 
 * @param {{type: number, content: any}[]} currentPatches 
 */
function diffChildren(oldChildren, newChildren, index, patches, currentPatches) {
    const { moves, children } = diffList(oldChildren, newChildren, 'key');

    console.log(moves, children);

    if (moves.length) {
        currentPatches.push({ type: types.REORDER, moves });
    }

    let leftNode = null;
    let currentNodeIndex = index;
    oldChildren.forEach((child, i) => {
        const newChild = children[i];
        currentNodeIndex = (leftNode && leftNode.count)
            ? currentNodeIndex + leftNode.count + 1
            : currentNodeIndex + 1;
        dfs(child, newChild, currentNodeIndex, patches);
        leftNode = child;
    });
}

/**
 * diff list, `core`
 * @param {(createElement|string)[]} oldList old children list
 * @param {(createElement|string)[]} newList new children list
 * @param {string} key check key
 * @returns {{ moves: { type: 0|1, index: number, item?: createElement|string }[], children: (createElement|string|null)[] }} diffs
 */
function diffList(oldList, newList, key = 'key') {
    const { keyMap: oldMap, free: oldFree } = createKeyMap(oldList, key);
    const { keyMap: newMap, free: newFree } = createKeyMap(newList, key);

    const moves = [];
    const children = [];

    let freeIndex = 0;

    const oldLength = oldList.length;

    // first check old list: if removed or not
    for (let i = 0; i < oldLength; i++) {
        const item = oldList[i];
        const itemKey = getKey(item, key);

        if (itemKey) {
            if (newMap.has(itemKey)) {
                const newIndex = newMap.get(itemKey);
                // must push the new one, maybe change
                children.push(newList[newIndex]);
            } else {
                // removed
                children.push(null);
            }
        } else {
            // free, can't judge the order, direct push the new one
            children.push(newFree[freeIndex++] || null);
        }
    }

    // diff array, check with old list
    // don't modify children!
    const simulateList = [].concat(children);

    // secound remove items no longer exist
    // like while(){...}
    for (let i = 0; i < simulateList.length;) {
        if (simulateList[i] === null) {
            // remove item, type '0'
            moves.push({ index: i, type: 0 });
            // remove simulateList[i], and modify simulate list
            simulateList.splice(i, 1);
        } else {
            i++;
        }
    }

    let i = 0; // new list index
    let j = 0; // simulate list index

    const newLength = newList.length;

    // third insert new items, check with new list
    while (i < newLength) {
        const item = newList[i];
        const itemKey = getKey(item, key);

        const simulateItem = simulateList[j];
        const simulateItemKey = getKey(simulateItem, key);

        if (simulateItem) {
            // nothing to do, next one
            if (itemKey === simulateItemKey) {
                j++;
            } else {
                // new item, inesrt
                if (!oldMap.has(itemKey)) {
                    // insert new item, type '1'
                    moves.push({ index: i, item, type: 1 });
                } else {
                    // if remove current simulateItem make item in right place
                    // then just remove it
                    const nextSimulateItemKey = getKey(simulateList[j + 1], key);
                    if (nextSimulateItemKey === itemKey) {
                        // remove item, type '0'
                        moves.push({ index: i, type: 0 });
                        // remove simulateList[i], and modify simulate list
                        simulateList.splice(j, 1);
                        j++ // after removing, current j is right, just jump to next one
                    } else {
                        // insert new item, type '1'
                        moves.push({ index: i, item, type: 1 });
                    }
                }
            }
        } else {
            // insert new item, type '1'
            moves.push({ index: i, item, type: 1 });
        }

        i++;
    }

    // end if j is not remove to the end, remove all the rest item
    let k = simulateList.length - j;
    while (j++ < simulateList.length) {
        k--;
        // remove item, type '0'
        moves.push({ index: k + i, type: 0 });
    }

    return {
        moves,
        children,
    };
}

/**
 * create key-index map and free(key is `undefined`) item array
 * @param {(createElement|string)[]} list children list
 * @param {string} key check key
 * @returns {{ keyMap: Map<string, number>, free: (createElement|string)[] }} indexMap and free array
 */
function createKeyMap(list, key) {
    const keyMap = new Map();
    const free = [];

    const length = list.length;

    for (let i = 0; i < length; i++) {
        const item = list[i];
        const itemKey = item[key];

        if (itemKey) {
            keyMap.set(itemKey, i);
        } else {
            free.push(item);
        }
    }

    return {
        keyMap,
        free,
    };
}

/**
 * get key
 * @param {createElement|string} item item
 * @param {string} key key
 * @returns { string|undefined } key or undefined
 */
function getKey(item, key) {
    if (!item || !key) return;

    return item[key];
}

export default diff;