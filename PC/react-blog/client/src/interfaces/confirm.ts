import React from 'react';

interface ConfirmProps {
    title?: React.ReactNode;
    content?: React.ReactNode;
    icon?: React.ReactNode;
    okText?: React.ReactNode;
    cancelText?: React.ReactNode;
    okType?: string;
    cancelType?: string;
    onOk?: (...args: any[]) => any;
    onCancel?: (...args: any[]) => any;
}

export type Props = ConfirmProps;