/*******************************************************************
 * name: JudgeDevice.js
 * version: 0.1.0
 * date: 2018-7-19
 * author: BadmasterY / https://github.com/BadmasterY
 * description: Used to determine the current device, if PC that returns true, else return false
 * record: null
 * remake: Subsequent updates go to ES6
*********************************************************************/

let JudgeDevice = (function () {
  let userAgentInfo = navigator.userAgent;
  let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  let flag = true;

  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }

  return flag;
})()

export default JudgeDevice;
