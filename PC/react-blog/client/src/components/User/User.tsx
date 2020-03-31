import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { reduxState } from '../../interfaces/state';

import './user.css';

function User() {
    const { isLogin } = useSelector((state: reduxState) => state.user);
    const history = useHistory();

    useEffect(() => {
        if(!isLogin) history.push('/');
    });

    return (
        <div className="user-box">
            用户
        </div>
    );
}

export default User;
