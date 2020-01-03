import * as React from 'react';

class Title extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {id, name} = this.props;
        return (
            <div id={id} className='title'>{name}</div>
        );
    }
}

export default Title;