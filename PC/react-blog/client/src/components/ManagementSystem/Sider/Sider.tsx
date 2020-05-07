import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';

import { system } from '../../../config/default.json';

import './sider.css';

const { Sider } = Layout;
const { menuList, initialSelectItem } = system;

interface SelectArguments {
    key: string;
    keyPath: string[];
    item: MenuItem;
    domEvent: any;
}

function SystemSider(props: { callback?: Function }) {
    const { callback } = props;
    const [initialSelect, setSelect] = useState(initialSelectItem);
    const [collapsed, setCollapsed] = useState(true);

    function changeSelect(select: SelectArguments) {
        setSelect(select.key);

        if(callback !== undefined) callback(select.key);
    }

    function onCollapse(collapsed: boolean, type: string) {
        setCollapsed(collapsed);
    }

    return (
        <Sider
            className="system-sider"
            breakpoint="md"
            collapsedWidth={0}
            collapsed={collapsed}
            collapsible={true}
            onCollapse={onCollapse}
        >
            <Menu
                // theme='dark'
                selectedKeys={[initialSelect]}
                onClick={changeSelect}
            >
                {
                    menuList.map((item) => (
                        <Menu.Item key={item.key}>
                            {item.name}
                        </Menu.Item>
                    ))
                }
            </Menu>
        </Sider>
    );
}

export default SystemSider;