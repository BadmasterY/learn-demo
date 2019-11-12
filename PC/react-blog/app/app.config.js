const uuidv4 = require('uuid/v4');

export const VERSION = "v0.0.1";

export const logo = {
    url: '../../',
    name: 'Logo'
};

export const list = [
    {
        id: uuidv4(),
        url: '/notice',
        text: '公告'
    },
    {
        id: uuidv4(),
        url: '/me',
        text: 'ME'
    }
];