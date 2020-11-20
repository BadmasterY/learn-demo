import types from './types.js';
import createElement from './element.js';

/**
 * find the diff with two tree  
 * Time complexity: `O(n)`
 * @param {createElement} oldTree pre update tree
 * @param {createElement} newTree after update tree
 * @returns {{[number]: {type: number, content: any}[]}} move or insert, the diff
 */
function diff(oldTree, newTree) {
    let index = 0; // tree node index
    const patches = {}; // diff
    // DFS
    dfs(oldTree, newTree, index, patches);
    return patches;
}

/**
 * DFS, post order algorithm
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
        // ignore
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
    const diffs = diffList(oldChildren, newChildren, 'key');
}

/**
 * diff list, `core`
 * @param {(createElement|string)[]} oldList old children
 * @param {(createElement|string)[]} newList new children
 * @param {string} key check key
 * @returns {}
 */
function diffList(oldList, newList, key = 'key') {
    
}

export default diff;