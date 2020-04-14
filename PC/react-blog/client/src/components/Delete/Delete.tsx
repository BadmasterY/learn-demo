import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { Props } from '../../interfaces/delete';

const { confirm } = Modal;

function deleteFn(props: Props) {
    const { onOk, onCancel } = props;

    confirm({
        title: 'Do you want to delete this item?',
        icon: <ExclamationCircleOutlined />,
        content: 'Are you sure you want to delete it? It will not be recovered after deletion!',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk,
        onCancel,
    });
}

export default deleteFn;