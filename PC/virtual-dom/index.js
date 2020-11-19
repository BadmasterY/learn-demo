import creteElement from './src/element.js';

window.onload = function() {
    // console.log('Hello world!');

    const ul = new creteElement('ul', { id: 'list' }, [ 
        new creteElement('li', { class: 'item' }, ['Item 1']),
        new creteElement('li', { class: 'item' }, ['Item 2']),
        new creteElement('li', { class: 'item' }, ['Item 3']),
    ]);

    console.log('ul: ', ul);

    document.body.appendChild(ul.render());
}