import types from './types.js';
import createElement from './element.js';

/**
 * patch
 * @param {HTMLElement} node dom node
 * @param {{ [number]: {type: number, content?: string, node?: string|createElement, moves?: any[]}[] }} patches diff return
 */
function patch(node, patches) {
    let current = { index: 0 };
    dfs(node, current, patches);
}

/**
 * DFS, pre order algorithm
 * @param {HTMLElement} node dom node
 * @param {{ index: number }} current start index
 * @param {{ [number]: {type: number, content?: string, node?: string|createElement, moves?: any[]}[] }} patches diff return
 */
function dfs(node, current, patches) {
    const currentPatches = patches[current.index];

    const childrenLength = node.childNodes?.length || 0;

    for (let i = 0; i < childrenLength; i++) {
        const child = node.childNodes[i];
        current.index++;
        dfs(child, current, patches);
    }

    if (currentPatches) {
        applyPatches(node, currentPatches);
    }
}

/**
 * apply patches
 * @param {HTMLElement} node dom node
 * @param {{type: number, content?: string, props?: { [string]: any }, node?: string|createElement, moves?: any[]}[]} patches patches
 */
function applyPatches(node, patches) {
    patches.forEach((patch) => {
        const { type, moves, content, node: replaceNode, props } = patch;
        switch (type) {
            case types.REPLACE:
                replace(node, replaceNode);
                break;
            case types.REORDER:
                reorder(node, moves);
                break;
            case types.PROPS:
                setProps(node, props);
                break;
            case types.TEXT:
                setText(node, content);
                break;
            default:
                throw new Error(`Unknown patch type: ${type}`);
        }
    });
}

/**
 * replace
 * @param {HTMLElement} node 
 * @param {string|createElement} replaceNode 
 */
function replace(node, replaceNode) {
    const newNode = typeof replaceNode === 'string' ?
        document.createTextNode(replaceNode) :
        replaceNode.render();
    node.parentNode.replaceChild(newNode, node);
}

/**
 * reorder
 * @param {HTMLElement} node 
 * @param {any[]} moves 
 */
function reorder(node, moves) {
    const childNodes = Array.from(node.childNodes);
    const map = {};

    childNodes.forEach((childNode) => {
        if (childNode.nodeType === 1) {
            const key = childNode.getAttribute('key')
            if (key) {
                map[key] = childNode;
            }
        }
    });

    moves.forEach((move) => {
        const index = move.index;
        if (move.type === types.REMOVE) { // remove item
            if (childNodes[index] === node.childNodes[index]) { // maybe have been removed for inserting
                node.removeChild(node.childNodes[index]);
            }
            childNodes.splice(index, 1);
        } else if (move.type === types.INSERT) { // insert item
            const insertNode = map[move.item.key]
                ? map[move.item.key].cloneNode(true) // reuse old item
                : (typeof move.item === 'string')
                    ? document.createTextNode(move.item)
                    : move.item.render();
            childNodes.splice(index, 0, insertNode);
            node.insertBefore(insertNode, node.childNodes[index] || null);
        }
    });
}

/**
 * set props
 * @param {HTMLElement} node 
 * @param {{ [string]: any }} props 
 */
function setProps(node, props) {
    for (const key in props) {
        if (props[key] === undefined) {
            node.removeAttribute(key);
        } else {
            node.setAttribute(key, props[key]);
        }
    }
}

/**
 * set text
 * @param {HTMLElement} node dom node
 * @param {string} text new text content
 */
function setText(node, text) {
    node.textContent = text;
}

export default patch;