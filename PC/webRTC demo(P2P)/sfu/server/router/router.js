const router = require('koa-router')();
const { utilMaps } = require('../util/maps');
const { uuid } = require('uuidv4');

router.post('/login', async ctx => {
  const { roomid, nickname } = ctx.request.body;
  const { userMap, roomMap } = utilMaps;
  let res;
  if (roomid && nickname) {
    const userid = uuid();
    userMap.set(userid, nickname);

    if (roomMap.get(roomid)) {
      let users = roomMap.get(roomid).users;
      users = users.concat({id: userid, nickname});
      roomMap.set(roomid, { id: roomid, users });
    } else {
      roomMap.set(roomid, { id: roomid, users: [{id: userid, nickname}] });
    }
    res = {
      error: 0,
      type: 'ok',
      content: {
        user: {
          id: userid,
          nickname
        },
        room: roomMap.get(roomid)
      }
    }
  } else {
    res = { error: 1, type: 'error', content: 'please check roomid or nickname!' };
  }
  ctx.body = res;
});

exports.routers = router.routes();