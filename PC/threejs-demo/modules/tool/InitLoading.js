/*******************************************************************
 * name: InitLoading.js
 * version: 0.1.0
 * date: 2018-7-25
 * author: BadmasterY / https://github.com/BadmasterY
 * description: This component is used to initialize the loading interface
 * record: null
 * remake: Subsequent updates remove jquery dependencies
 *         Subsequent updates go to ES6
*********************************************************************/
import $ from 'jquery';

let InitLoading = (function () {
  let _progress = 0;

  function _loadStart (progress) {
    let doms = _getDoms();

    if (progress === 0) {
      doms.loading.style.opacity = 1;
      doms.loading.style.width = '0%';
    }
    if (progress >= 100) {
      doms.progress.innerHTML = '正在进行最后的渲染!';
      doms.loading.style.width = 100 + '%';
      doms.loading.style.background = '#fff';
      doms.loading.style.opacity = 0;

      _removeDom(true)
    } else {
      doms.loading.style.width = progress + '%';
      doms.progress.innerHTML = '加载进度: ' + progress + '%';
    }
  }

  function _removeDom (timeout) {
    if (timeout) {
      setTimeout(_needRemove, 1500);
    } else {
      _needRemove();
    }
  }

  function _needRemove () {
    if ($('.container').length !== 0) {
      $('.container').remove();
    }
  }

  function _getDoms () {
    let loading = document.getElementById('loading');
    let progress = document.getElementsByClassName('progress')[0];
    if (!loading || !progress) throw new Error('Failed to capture loading or progress! Please check whether the loading is initialized!');

    return {
      loading: loading,
      progress: progress
    }
  }

  function loading () {};

  Object.defineProperties(loading.prototype, {
    'progress': {
      get: function () { return _progress },
      set: function (value) {
        if (_progress >= value) return;
        _progress = value;
        _loadStart(_progress);
      }
    }
  })

  return loading;
})()

export default InitLoading;
