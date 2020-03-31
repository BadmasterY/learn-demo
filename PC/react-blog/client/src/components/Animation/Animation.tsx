import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { RouteChildrenProps } from 'react-router-dom';

import 'animate.css';

function Animation(WrappedComponent: JSX.Element, props: RouteChildrenProps<any>, path: string) {
    return (
        <CSSTransition
            key={path}
            in={props.match !== null}
            classNames={{
                enter: 'animated',
                enterActive: 'fadeIn',
                exit: 'animated',
                exitActive: 'fadeOut'
            }}
            timeout={300}
            mountOnEnter={true}
            unmountOnExit={true}
        >
            {WrappedComponent}
        </CSSTransition>
    )

}

export default Animation;