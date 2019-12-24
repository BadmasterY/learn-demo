const router = require('koa-router')();
const { uuid } = require('uuidv4');
const { utilMaps } = require('../utils/maps');

router.post('/login', ctx => {
    console.log('login...');
    const { roomid, username } = ctx.request.body;
    const { userMap, roomMap } = utilMaps;

    const userid = uuid();
    userMap.set(userid, username);

    let users = [];
    if (roomMap.has(roomid)) {
        users = roomMap.get(roomid);
        users = users.concat({ userid, username });
        roomMap.set(roomid, users);

        console.log(roomMap);
    } else {
        users = users.concat({ userid, username })
        roomMap.set(roomid, users);
    }

    ctx.body = {
        error: 0,
        type: 'ok',
        content: {
            user: {
                userid,
                username
            },
            room: {
                roomid,
                users
            }
        }
    };
});

exports.routers = router.routes();