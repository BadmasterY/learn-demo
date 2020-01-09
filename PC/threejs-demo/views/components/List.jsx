import * as React from 'react';
import uuid from 'uuid';

class List extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {btns, id, children, app} = this.props;
        return (
            <ul id={id}>{btns.map(
                btn =>{
                    return (
                        <li 
                            key={btn.key ? btn.key : uuid.v4()} 
                            className={btn.className} 
                            id={btn.id}
                            onClick={btn.onClick ? btn.onClick.bind(this) : function(){}}
                        >
                            <span className='list-name'>{btn.name}</span>
                            {(children && children instanceof Function) ? children(btn.key, btn.callback.bind(null, app.processing)) : children}
                        </li>
                    );
                }             
            )}
            </ul>
        );
    }
}

export default List;