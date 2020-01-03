/*******************************************************************
 * name: InitProcessing.js
 * version: 0.1.0
 * date: 2018-7-19
 * author: BadmasterY / https://github.com/BadmasterY
 * description: This component is used to initialize the scene and render the object to interact with the creation
 * record: null
 * remake: Subsequent updates go to ES6
*********************************************************************/
import * as THREE from 'three';
import '../shader/Shaders';
import JudgeDevice from './JudgeDevice';

let InitProcessing = (function () {
  function _init (scene) {
    _composer.call(this, scene.renderer);
    _renderPass.call(this, scene._scene, scene.camera);
    _outlinePass.call(this, scene._scene, scene.camera, scene.areaWidth, scene.areaHeight);
    _bloomPass.call(this, scene.areaWidth, scene.areaHeight);
    _effectFXAA.call(this, scene.areaWidth, scene.areaHeight);
    _effectVignette.call(this, localStorage.getItem('userOffset'));
    _effectBloom.call(this);
    _effectFilm.call(this);
    _effectBleach.call(this);

    _initlocation.call(this);

    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.outlinePass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.effectFXAA);
    this.composer.addPass(this.effectVignette);
    this.composer.addPass(this.effectBloom);
    this.composer.addPass(this.effectFilm);
    this.composer.addPass(this.effectBleach);
  }

  function _composer (renderer) {
    this.composer = new THREE.EffectComposer(renderer);
  }

  function _renderPass (scene, camera) {
    this.renderPass = new THREE.RenderPass(scene, camera);
  }

  function _outlinePass (scene, camera, width, height) {
    this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(width, height), scene, camera);
    this.outlinePass.edgeStrength = 2;
    this.outlinePass.edgeGlow = 0;
    this.outlinePass.edgeThickness = 1.5;
    this.outlinePass.pulsePeriod = 5;
    this.outlinePass.visibleEdgeColor.set('#ffff00');
    this.outlinePass.hiddenEdgeColor.set('#ffff00');
  }

  function _bloomPass (width, height) {
    this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(width, height));

    this.bloomPass.strength = 0.2;

    this.bloomPass.threshold = 0.9;
    this.bloomPass.radius = 0.4;
  }

  function _effectFXAA (width, height) {
    this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    this.effectFXAA.uniforms[ 'resolution' ].value.set(1 / width, 1 / height);
  }

  function _effectVignette (userOffset) {
    let shaderVignette = THREE.VignetteShader;
    this.effectVignette = new THREE.ShaderPass(shaderVignette);
    this.effectVignette.uniforms[ 'offset' ].value = userOffset;
    this.effectVignette.uniforms[ 'darkness' ].value = 1.6;
  }

  function _effectBleach () {
    let shaderBleach = THREE.BleachBypassShader;
    this.effectBleach = new THREE.ShaderPass(shaderBleach);
    this.effectBleach.uniforms[ 'opacity' ].value = 0.95;
    this.effectBleach.renderToScreen = true;
  }

  function _effectBloom () {
    this.effectBloom = new THREE.BloomPass(0.3);
  }

  function _effectFilm () {
    this.effectFilm = new THREE.FilmPass(0.08, 0, 2048, false);
  }

  function _initlocation () {
    this.useReflective = localStorage.getItem('useReflective') ? this.getLocation('useReflective') : false;
    this.useFXAA = JudgeDevice;
    this.useShadow = localStorage.getItem('useShadow') ? this.getLocation('useShadow') : false;
    this.useFocusing = localStorage.getItem('useFocusing') ? this.getLocation('useFocusing') : false;
    this.userOffset = localStorage.getItem('userOffset') ? localStorage.getItem('userOffset') : 0.95;
    this.speedMode = localStorage.getItem('speedMode') ? this.getLocation('speedMode') : false;
  }

  function _error (message) {
    throw new Error(message);
  }

  function postProcessing (scene) {
    this.SCENE = scene.isScene ? scene : _error('Please pass in the InitScene instance!');
    this.composer = '';
    this.renderPass = '';
    this.outlinePass = '';
    this.bloomPass = '';
    this.effectFXAA = '';
    this.effectVignette = '';
    this.effectBloom = '';
    this.effectFilm = '';
    this.effectBleach = '';
    this.outlineArr = [];
    this.extraPass = [];
    _init.call(this, scene);
  }

  Object.defineProperties(postProcessing.prototype, {
    'useReflective': {
      get: function () { return this.getLocation('useReflective'); },
      set: function (value) {
        this.setLocation('useReflective', value);
        this.bloomPass.enabled = this.checkUse('useReflective');
      }
    },
    'useFXAA': {
      get: function () { return this.getLocation('useFXAA'); },
      set: function (value) {
        this.setLocation('useFXAA', value);
        this.effectFXAA.enabled = this.checkUse('useFXAA');
      }
    },
    'useShadow': {
      get: function () { return this.getLocation('useShadow'); },
      set: function (value) {
        this.setLocation('useShadow', value);
        this.SCENE.light.castShadow = this.checkUse('useShadow');
      }
    },
    'useFocusing': {
      get: function () { return this.getLocation('useFocusing'); },
      set: function (value) {
        this.setLocation('useFocusing', value);
        this.effectVignette.enabled = this.checkUse('useFocusing');
      }
    },
    'userOffset': {
      get: function () { return localStorage.getItem('userOffset') },
      set: function (value) {
        localStorage.setItem('userOffset', value);
      }
    },
    'speedMode': {
      get: function() {return this.getLocation('speedMode');},
      set: function(value) {
        localStorage.setItem('speedMode', value);
      }
    },
    '_outlineArr': {
      get: function () { return this.outlineArr; },
      set: function (value) {
        this.outlineArr = value;
        this.outlinePass.selectedObjects = value;
      }
    }
  })

  Object.assign(postProcessing.prototype, {
    onResize: function (width, height) {
      this.effectFXAA.uniforms[ 'resolution' ].value.set(1 / width, 1 / height);
      this.bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(width, height));
      this.composer.setSize(width, height);
      this.composer.reset();
    },
    addPass: function (render, index) {
      this.composer.insertPass(render, index);
      this.extraPass.push(render);
    },
    getLocation: function (name) {
      return this.checkUse(name);
    },
    setLocation: function (name, value) {
      localStorage.setItem(name, value + '');
    },
    checkUse: function (name) {
      let boolean = false;
      if (localStorage.getItem(name) === 'true') boolean = true;
      return boolean;
    },
    addOutline: function (obj) {
      this._outlineArr = this._outlineArr.concat(obj);
    },
    removeOutline: function (obj) {
      if (!obj.isObject3D) _error('Pass in the THREE.Object3D!');
      for (let i in this._outlineArr) {
        if (this._outlineArr[ i ] === obj) {
          this._outlineArr.splice(i, 1);
          break;
        }
      }
    },
    removeOutlines: function (arr) {
      if (!Array.isArray(arr)) _error('Pass in the array!');
      for (let i in arr) {
        this.removeOutline(arr[i]);
      }
    },
    clearOutline: function () {
      this._outlineArr = [];
    }
  })

  return postProcessing;
})()

export default InitProcessing;
