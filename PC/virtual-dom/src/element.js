/**
 * createElement
 * @param {string} tagName root tag name
 * @param {{ id: string, key?: string }} props prop types
 * @param {(createElement|string)[]} children children
 */
function createElement(tagName, props = {}, children = []) {
    if (!(this instanceof createElement)) {
        console.warn(`Please use 'new createElement()'!`);
        return new createElement(tagName, props, children);
    }

    this.tagName = tagName;
    this.props = props;
    this.children = children;
    // save key
    this.key = props.key;
}

Object.assign(createElement.prototype, {
    /**
     * render element  
     * now use ReactDOM.render()
     */
    render() {
        // create element by tagName
        let root = document.createElement(this.tagName);

        // set attributes
        for (const propName in this.props) {
            // 'key' attribute is used with diff
            // if (propName === 'key') continue;

            const propValue = this.props[propName];
            root.setAttribute(propName, propValue);
        }

        // loop render
        this.children.forEach((child) => {
            const childNode = (child instanceof createElement) ?
                child.render() : document.createTextNode(child);

            root.appendChild(childNode);
        });

        return root;
    },
});

export default createElement;