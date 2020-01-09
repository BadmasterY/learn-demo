import * as React from 'react';
import ReactDOM from 'react-dom';

import Root from './Root.jsx';

const View = ({app, btns, topTip}) => {
    const view = ReactDOM.render(
        <Root app={app} btns={btns} innerText={topTip} />,
        document.getElementById('reactRoot')
    );

    return view;
}

export default View;