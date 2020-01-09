/*******************************************************************
 * name: TriggerPoint.js
 * version: 0.1.0
 * date: 2018-7-23
 * author: BadmasterY / https://github.com/BadmasterY
 * description: This component is used to create interaction points that have click events
 * record: null
 * remake: Subsequent updates go to ES6
*********************************************************************/
import * as THREE from 'three';
import JudgeDevice from './JudgeDevice';

let TriggerPoint = (function () {
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();
  let hoverPoint = null;

  let color = 0xa22222;
  let defaultRatio = JudgeDevice ? 0.025 : 0.04;

  function _getParent (point, scale) {
    let x = scale.x;
    let y = scale.y;
    if (point.parent.name === 'expScene') {
      x *= 0.8;
      y *= 0.8;

      return { x: x, y: y };
    } else {
      x = x / point.parent.scale.x;
      y = y / point.parent.scale.y;

      return _getParent(point.parent, { x: x, y: y });
    }
  }

  function _pointsAdapt () {
    this._pointsArr.forEach(function (item) {
      let cameraDistance = this.SCENE.camera.position.clone().sub(item.getWorldPosition()).length();
      let parentScale = { x: 1, y: 1 };
      item.originScale = defaultRatio * cameraDistance;
      parentScale = _getParent(item, parentScale);
      item.scale.set(item.originScale * parentScale.x, item.originScale * parentScale.y, 1);
    }.bind(this));
  }

  function _onMouseMove (e) {
    if (!this.SCENE.isRender) return;
    if (!this.SCENE.hasTriggerPoint) return;

    let rect = this.SCENE.app[ 0 ].getBoundingClientRect();

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, this.SCENE.camera);

    let pointInteract = raycaster.intersectObjects(this._pointsArr, true);

    if (pointInteract.length > 0) {
      let point = pointInteract[0].object;

      if (!hoverPoint) {
        if (point.enableClick) {
          hoverPoint = point;
          let cameraDistance = this.SCENE.camera.position.clone().sub(hoverPoint.getWorldPosition()).length();
          hoverPoint.originScale = hoverPoint.defaultRatio * cameraDistance;
          let parentScale = { x: 1, y: 1 };
          parentScale = _getParent(hoverPoint, parentScale);
          let ratio = 1.3;
          hoverPoint.scale.set(ratio * hoverPoint.originScale * parentScale.x, ratio * hoverPoint.originScale * parentScale.y, 1);
        }
      } else {
        if (point.enableClick) {
          let cameraDistance = this.SCENE.camera.position.clone().sub(hoverPoint.getWorldPosition()).length();
          hoverPoint.originScale = hoverPoint.defaultRatio * cameraDistance;
          let parentScale = { x: 1, y: 1 };
          parentScale = _getParent(hoverPoint, parentScale);
          let ratio = 1;
          hoverPoint.scale.set(ratio * hoverPoint.originScale * parentScale.x, ratio * hoverPoint.originScale * parentScale.y, 1);
          hoverPoint = point;
          cameraDistance = this.SCENE.camera.position.clone().sub(hoverPoint.getWorldPosition()).length();
          hoverPoint.originScale = hoverPoint.defaultRatio * cameraDistance;
          parentScale = { x: 1, y: 1 };
          parentScale = _getParent(hoverPoint, parentScale);
          ratio = 1.3;
          hoverPoint.scale.set(ratio * hoverPoint.originScale * parentScale.x, ratio * hoverPoint.originScale * parentScale.y, 1);
        } else {
          let cameraDistance = this.SCENE.camera.position.clone().sub(hoverPoint.getWorldPosition()).length();
          hoverPoint.originScale = hoverPoint.defaultRatio * cameraDistance;
          let parentScale = { x: 1, y: 1 };
          parentScale = _getParent(hoverPoint, parentScale);
          let ratio = 1;
          hoverPoint.scale.set(ratio * hoverPoint.originScale * parentScale.x, ratio * hoverPoint.originScale * parentScale.y, 1);
          hoverPoint = null;
        }
      }
    } else {
      if (hoverPoint) {
        let cameraDistance = this.SCENE.camera.position.clone().sub(hoverPoint.getWorldPosition()).length();
        hoverPoint.originScale = hoverPoint.defaultRatio * cameraDistance;
        let parentScale = { x: 1, y: 1 };
        parentScale = _getParent(hoverPoint, parentScale);
        let ratio = 1;
        hoverPoint.scale.set(ratio * hoverPoint.originScale * parentScale.x, ratio * hoverPoint.originScale * parentScale.y, 1);
        hoverPoint = null;
      }
    }
  }

  function _error (message) {
    throw new Error(message);
  }

  function point (scene, img) {
    this.SCENE = scene.isScene ? scene : _error('Please pass in the InitScene instance!');
    this.IMG = img ? img : console.warn('Image is not found');
    this.pointsArr = [];

    this.removeEvent();
    this.addEvent();
  }

  Object.defineProperties(point.prototype, {
    '_pointsArr': {
      get: function () { return this.pointsArr; },
      set: function (value) {
        this.pointsArr = value;
        this.SCENE.hasTriggerPoint = false;
        if (this.pointsArr.length > 0) this.SCENE.hasTriggerPoint = true;
      }
    }
  })

  Object.assign(point.prototype, {
    addPoint: function (parmers) {
      parmers = parmers ? parmers : {};

      let pColor = parmers.color ? parmers.color : color;
      let pPos = parmers.pos ? parmers.pos : [ 0, 0, 0 ];
      let pParent = parmers.parent ? parmers.parent : this.SCENE.expScene;

      let mat = new THREE.SpriteMaterial({
        map: this.IMG,
        transparent: true,
        opacity: 0.7,
        alphaTest: 0.1,
        color: pColor,
        rotation: Math.PI / 4,
        depthTest: false
      })

      let point = new THREE.Sprite(mat);
      pParent.add(point);
      point.position.set(pPos[ 0 ], pPos[ 1 ], pPos[ 2 ]);
      this.SCENE.expScene.updateMatrixWorld();

      point.defaultRatio = defaultRatio;
      let cameraDistance = this.SCENE.camera.position.clone().sub(point.getWorldPosition()).length();
      let parentScale = {x: 1, y: 1};
      point.originScale = defaultRatio * cameraDistance;
      parentScale = _getParent(point, parentScale);
      point.scale.set(point.originScale * parentScale.x, point.originScale * parentScale.y, 1);
      point.name = 'triggerPoint';
      point.isTriggerPoint = true;

      point.enableClick = true;

      point.clickFn = function (point) { console.log(point); }
      point.clickTimes = 0;
      this._pointsArr = this._pointsArr.concat(point);

      return point;
    },

    removePoint: function (point) {
      if (!point.isTriggerPoint) _error('Please pass in the TriggerPoint instance!');

      let pointsArr = [].concat(this._pointsArr);
      for (let i in pointsArr) {
        if (pointsArr[ i ] === point) {
          pointsArr.splice(i, 1);
          this._pointsArr = [].concat(pointsArr);
          pointsArr = null;

          this.SCENE.removeObj(point);
          break;
        }
      }
    },

    removePoints: function (arr) {
      if (!Array.isArray(arr)) _error('Please pass in the array!');

      for (let i in arr) {
        this.removePoint(arr[i]);
      }
    },

    clearPoints: function () {
      for (let i in this._pointsArr) {
        this.SCENE.removeObj(this._pointsArr[ i ]);
      }

      this._pointsArr = [];
    },

    addEvent: function () {
      this.SCENE.controls.addEventListener('change', _pointsAdapt.bind(this));
      this.SCENE.renderer.domElement.addEventListener('mousemove', _onMouseMove.bind(this), false);
    },

    removeEvent: function () {
      this.SCENE.controls.removeEventListener('change', _pointsAdapt.bind(this));
      this.SCENE.renderer.domElement.removeEventListener('mousemove', _onMouseMove.bind(this), false);
    },

    reset: function () {
      this._pointsArr = [];
    }
  })

  return point;
})()

export default TriggerPoint;
