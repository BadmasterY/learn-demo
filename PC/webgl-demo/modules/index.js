import InitLoading from './tool/InitLoading';
import InitScene from './tool/InitScene';
import InitProcessing from './tool/InitProcessing';
import Click from './event/Click';
import Drag from './event/Drag';
import TriggerPoint from './tool/TriggerPoint';
import ToolTip from './tool/ToolTip';

import ResolutionConfig from './assembly/ResolutionConfig';
import Loader from './assembly/Loader';

const element = document.getElementById('app');

element.style.width = window.innerWidth + 'px';
element.style.height = (window.innerHeight - 50) + 'px';
element.style.backgroundColor = '#eee';

window.addEventListener('resize', function () {
  element.style.width = window.innerWidth + 'px';
  element.style.height = (window.innerHeight - 50) + 'px';
});

let loading = new InitLoading()

export default ({appId = '#app', bgColor = 0x162129, useProcess = true, useClick = true, useDrag = true, usePoint = true, useTool = true} = {}) => {

  let scene = new InitScene({appId, bgColor});
  let processing = useProcess ? new InitProcessing(scene) : 'disable';
  let click = useClick ? new Click(scene) : 'disable';
  let drag = useDrag ? new Drag(scene) : 'disable';
  let triggerPoint = usePoint ? new TriggerPoint(scene) : 'disable';
  let toolTip = useTool ? new ToolTip(scene) : 'disable';

  processing.addPass(toolTip.render, 1);

  scene.render_callback = function () {
    processing.composer.render();
  }
  scene.resize_callback = function (scene, camera, width, height) {
    processing.onResize(width, height);
    toolTip.onResize(width, height);
  }

  Loader(ResolutionConfig.src, loading, scene);

  let webGLFrame = {
    scene: scene,
    processing: processing,
    click: click,
    drag: drag,
    point: triggerPoint,
    tooltip: toolTip
  };

  return webGLFrame;
}
