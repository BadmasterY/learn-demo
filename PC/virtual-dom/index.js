import creteElement from './src/element.js';
import diff from './src/diff.js';

window.onload = function () {
    // console.log('Hello world!');

    const btn = document.getElementById('btn');
    let flag = btn.innerText;

    const oldDiv = document.getElementById('old');
    const newDiv = document.getElementById('new');

    const rootKey = uuid.v4();

    const ul = new creteElement('ul', { class: 'list', key: rootKey }, [
        new creteElement('li', { class: 'item', key: '1' }, ['Item 1']),
        new creteElement('li', { class: 'item', key: '2' }, ['Item 2']),
        new creteElement('li', { class: 'item', key: '3' }, ['Item 3']),
    ]);
    let oldTree = ul;
    let newTree = null;

    oldDiv.appendChild(ul.render());

    btn.addEventListener('click', e => {
        switch(flag) {
            case 'add':
                add();
                flag = 'diff';
                break;
            case 'diff':
                diffFn();
                flag = 'update';
                break;
            case 'update':
                update();
                flag = 'add';
                break;
            default:
                console.error('Unknow flag: ', flag);
        }
        btn.innerText = flag;
    }, false);

    function add() {
        const ul = new creteElement('ul', { class: 'list', key: rootKey }, [
            new creteElement('li', { class: 'item', key: '1' }, ['Item 1']),
            new creteElement('li', { class: 'item', key: '3' }, ['Item 3']),
            new creteElement('li', { class: 'item', key: '2' }, ['Update Item 2']),
        ]);
        newTree = ul;

        console.log(oldTree, newTree);

        newDiv.appendChild(ul.render());
    }

    function diffFn() {
        const patches = diff(oldTree, newTree);
        console.log('diff');
        console.log(patches);
        return patches;
    }

    function update() {
        console.log('update');
        newDiv.innerHTML = '';
    }
}