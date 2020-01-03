/*******************************************************************
 * name: RandomUUID.js
 * version: 0.1.0
 * date: 2018-7-19
 * author: BadmasterY / https://github.com/BadmasterY
 * description: UUID generated
 * record: null
 * remake: Subsequent updates go to ES6
*********************************************************************/

let RandomUUID = (function () {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let rnd = 0, r;

  return function generateUUID () {
    let uuid = '';

    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += '-';
      } else if (i === 14) {
        uuid += '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid += chars[ (i === 19) ? (r & 0x3) | 0x8 : r ];
      }
    }

    return uuid;
  }
})()

export default RandomUUID;
