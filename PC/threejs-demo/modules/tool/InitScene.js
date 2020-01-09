/*******************************************************************
 * name: InitScene.js
 * version: 0.1.0
 * date: 2018-7-19
 * author: BadmasterY / https://github.com/BadmasterY
 * description: This component is used to initialize the scene and render the object to interact with the creation
 * record: null
 * remake: Subsequent updates remove jquery dependencies
 *         Subsequent updates go to ES6
*********************************************************************/

import * as THREE from 'three';
import '../controls/OrbitControls';
import './MoveCamera';
import '../DeepClone';
import '../SetObjectPro';

import * as $ from 'jquery';
import * as TWEEN from 'tween';

import Constants from 'confPath/js/constants';

let InitScene = (function () {
  let sceneId = 0;
  let _obj3D = null;

  function _init (paramers) {
    _disableRight();
    _initRenderer.call(this, paramers.bgColor);
    _initScene.call(this);
    _initCamera.call(this);
    _initControls.call(this);
    _initBasicScene.call(this);
    _resetCamera.call(this);
    window.addEventListener('resize', _onWindowResize.bind(this));
    (function loop () {
      requestAnimationFrame(loop.bind(this));
      this.loopFn();
      _render.call(this);
    }).call(this);
  }

  function _initScene () {
    this._scene = new THREE.Scene();
    this._scene.add(this.expScene);
  }

  function _initRenderer (bgColor) {
    let clearColor = bgColor;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })

    this.renderer.autoClear = false;

    Constants.ANISOTROPY = this.renderer.capabilities.getMaxAnisotropy();

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.areaWidth, this.areaHeight);
    this.app.append(this.renderer.domElement);
    this.renderer.setClearColor(clearColor);
  }

  function _initCamera () {
    this.camera = new THREE.PerspectiveCamera(45, this.areaWidth / this.areaHeight, 0.1, 10000);
    this.camera.position.set(0, 10, 0);
    this.camera.PARENT = this;
  }

  function _initControls () {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
  }

  function _initBasicScene () {
    let ambient = new THREE.AmbientLight(0xffffff, 0.58);
    this._scene.add(ambient);

    this.light = new THREE.SpotLight(0xffffff, 0.8, 0, 0.77);
    this.light.position.set(0, 180, 130);
    this._scene.add(this.light);

    this.camera.initPosition = {x: 0, y: 76, z: 134};
    this.camera.target = {x: 0, y: 10, z: 0};
    this.initCameraView();

    /* The experimental scene controls the translation range */
    this.controls.addEventListener('change', function () {
      let point = this.camera.position.clone();
      let line = new THREE.Line3(point, this._scene.position);
      let length = line.distance();
      if (length <= 350 && this.camera.position.y >= 0 && this.camera.position.y <= 300) {
        this.camera.lastPosition = this.camera.position.clone();
        this.controls.lastTarget = this.controls.target.clone();
      } else {
        this.camera.position.copy(this.camera.lastPosition);
        this.controls.target.copy(this.controls.lastTarget);
      }
    }.bind(this));
  }

  function _resetCamera () {
    this.controls.reset();
    this.controls.enabled = true;
    this.initCameraView();
  }

  function _onWindowResize () {
    this.areaWidth = this.app.width();
    this.areaHeight = this.app.height();

    this.camera.aspect = this.areaWidth / this.areaHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.areaWidth, this.areaHeight);

    if (this.resize_callback) this.resize_callback(this._scene, this.camera, this.areaWidth, this.areaHeight);
  }

  function _render () {
    TWEEN.update();
    this.controls.update();

    if (this.render_callback) {
      this.render_callback();
    } else {
      this.renderer.render(this._scene, this.camera);
    }
  }

  function _disableRight () {
    document.oncontextmenu = function (e) { return false; }
    document.onselectstart = function (e) { return false; }
  }

  function _hiddenMesh (mesh) {
    mesh.material.visible = false;
    mesh.isHidden = true;
  }

  function _hiddenObj (obj) {
    obj.traverse(function (child) {
      if (child.isMesh) _hiddenMesh(child);
    })

    obj.isHidden = true;
  }

  function _showMesh (mesh) {
    mesh.material.visible = true;
    mesh.isHidden = false;
  }

  function _showObj (obj) {
    obj.traverse(function (child) {
      if (child.isMesh) _showMesh(child);
    })

    obj.isHidden = false;
  }

  function _error (message) {
    throw new Error(message);
  }

  function scene (paramers) {
    if (!paramers) paramers = {};

    if (!paramers.appId) _error('appId cannot be omitted!');

    this.id = sceneId++;
    this.expScene = new THREE.Group(); // Reset scene
    this.expScene.name = 'expScene'; // Reset the scene name
    this.camera = null; // Camera
    this.renderer = null; // Render
    this.controls = null; // Control,The default is a third-person controller
    this.app = $(paramers.appId); // Render container
    this.areaWidth = this.app.width(); // Width of the container
    this.areaHeight = this.app.height(); // Height of the container
    this.clock = new THREE.Clock(); // Clock
    this.loopFn = function () {};
    this.render_callback = null; // The render callback
    this.resize_callback = null; // Container resize callback

    // THREE.Scene.
    // Do not use this parameter on your own initiative unless necessary.
    // Because the parameters in this scenario are not reset.
    this._scene = null;

    this._isRender = true; // Whether to render the current scenario
    this.scenarios = function () {};
    _init.call(this, paramers);
  }

  Object.defineProperties(scene.prototype, {
    'bgImg': {
      set: function (value) {
        this._scene.background = value;
      }
    },
    'bgModel': {
      set: function (value) {
        this._scene.remove(_obj3D);
        _obj3D = value;
        this._scene.add(value);
      }
    },
    'isRender': {
      get: function () { return this._isRender; },
      set: function (value) {
        this._isRender = value;
        this._scene.visible = value;
        this.controls.enabled = value;
      }
    }
  })

  Object.assign(scene.prototype, {
    constructor: scene,

    isScene: true,

    addObj: function (obj) {
      if (!obj.isObject3D) _error('Pass in the THREE.Object3D object!');

      this.expScene.add(obj);
    },

    addObjs: function (arr) {
      if (!Array.isArray(arr)) _error('Pass in the array object!');

      for (let i = 0; i < arr.length; i++) {
        this.addObj(arr[i]);
      }
    },

    removeObj: function (obj) {
      if (!obj.isObject3D) _error('Pass in the THREE.Object3D object!');

      this.expScene.remove(obj);
    },

    removeObjs: function (arr) {
      if (!Array.isArray(arr)) _error('Pass in the array object!');

      for (let i = 0; i < arr.length; i++) {
        this.removeObj(arr[i]);
      }
    },

    hiddenObj: function (obj) {
      if (obj.isMesh) {
        _hiddenMesh(obj);
        return;
      }

      if (obj.isObject3D) {
        _hiddenObj(obj);
        return;
      }

      _error('Pass in the three.mesh object, or three.object3d object!');
    },

    hiddenObjs: function (arr) {
      if (!Array.isArray(arr)) _error('Pass in the array object!');

      for (let i = 0; i < arr.length; i++) {
        this.hiddenObj(arr[i]);
      }
    },

    showObj: function (obj) {
      if (obj.isMesh) {
        _showMesh(obj);
        return;
      }

      if (obj.isObject3D) {
        _showObj(obj);
        return;
      }

      _error('Pass in the three.mesh object, or three.object3d object!');
    },

    showObjs: function (arr) {
      if (!Array.isArray(arr)) _error('Pass in the array object!');

      for (let i = 0; i < arr.length; i++) {
        this.showObj(arr[i]);
      }
    },

    getObjectByName: function (name) {
      return this.expScene.getObjectByName(name);
    },

    resetExpScene: function (callback) {
      let TweenMax, TWEEN, layer;

      if (TweenMax) TweenMax.killAll();
      if (TWEEN) TWEEN.removeAll();
      if (layer) layer.closeAll();

      this._scene.remove(this.expScene);
      this.expScene = new THREE.Group();
      this.expScene.name = 'expScene';
      this._scene.add(this.expScene);

      if (callback) callback();

      _resetCamera.call(this);
      this._scenarios();
    },

    initCameraView: function () {
      this.camera.position.copy(this.camera.initPosition);
      this.camera.lookAt(this.camera.target);
      this.controls.target.copy(this.camera.target);
    }
  })

  return scene;
})()

export default InitScene;
