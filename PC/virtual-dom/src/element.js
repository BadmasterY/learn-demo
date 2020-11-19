/**
 * createElement
 * @param {string} tagName root tag name
 * @param {{ id: string }} props prop types
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

    return this;
}

Object.assign(createElement.prototype, {
    /**
     * render createelement  
     * now use ReactDOM.render()
     */
    render() {
        // create createelement by tagName
        let root = document.createElement(this.tagName);

        // set attributes
        for (const propName in this.props) {
            const propValue = this.props[propName];
            root.setAttribute(propName, propValue);
        }

        // loop render
        this.children.forEach((value) => {
            const child = (value instanceof createElement) ?
                value.render() : document.createTextNode(value);

            root.appendChild(child);
        });

        return root;
    },
});

export default createElement;