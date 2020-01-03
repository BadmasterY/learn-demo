import * as React from 'react';

import Btn from '../../components/Btn.jsx';
import List from '../../components/List.jsx';

import '../../css/btnList.css';

class BtnList extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const {classN = '', btns, isHidden} = this.props;
        const style = {
            left: isHidden ? -140 : 10
        };
        return (
            <div style={style} className={'btnList ' + classN}>
                <List btns={btns} />
            </div>
        );
    }
}

export default BtnList;