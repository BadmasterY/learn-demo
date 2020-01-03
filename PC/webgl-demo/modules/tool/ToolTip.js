/*******************************************************************
 * name: ToolTip.js
 * version: 0.1.0
 * date: 2018-7-26
 * author: BadmasterY / https://github.com/BadmasterY
 * description: This component is used to initialize the scene and render the object to interact with the creation
 * record: null
 * remake: Subsequent updates go to ES6
*********************************************************************/
import * as THREE from 'three'

let ToolTip = (function () {
  let raycaster = new THREE.Raycaster();
  let mouse = new THREE.Vector2();

  function _createUI (imgArr) {
    this.UI = new THREE.Group();
    this.UI.scale.set(18, 18, 18);

    this.scene.add(this.UI);
    this.UI.visible = false;

    let UItextMap = new THREE.SpriteMaterial({
      map: null,
      transparent: true,
      depthTest: false
    })
    this.UItext = new THREE.Sprite(UItextMap);
    this.UItext.scale.set(8, 1.8, 1);
    this.UItext.position.set(-6.5, 3.2, 0);
    this.UItext.name = 'UItext';

    this.UItext.visible = false;
    this.UI.add(this.UItext);

    let sMat1 = new THREE.SpriteMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.2,
      alphaTest: 0.1,
      depthTest: false
    })
    let sprite1 = new THREE.Sprite(sMat1);
    sprite1.scale.set(10, 3, 1);
    sprite1.position.set(-6.5, 3.3, 0);
    this.UI.add(sprite1);

    let sMat3 = new THREE.SpriteMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.2,
      alphaTest: 0.1,
      depthTest: false,
      rotation: -Math.PI / 4
    })
    let sprite3 = new THREE.Sprite(sMat3);
    sprite3.scale.set(3, 0.1, 1);
    sprite3.position.set(-0.5, 0.75, 0);
    this.UI.add(sprite3);
  }

  function _createUItext (text) {
    let t = text ? text : 'default name';

    let canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.fontColor;
    ctx.strokeStyle = this.fontColor;
    ctx.textAlign = 'center';

    if (t.length <= 4) {
      ctx.font = '46px Georgia';
    } else if (t.length <= 6) {
      ctx.font = '42px Georgia';
    } else if (t.length <= 7) {
      ctx.font = '36px Georgia';
    } else {
      ctx.font = '32px Georgia';
    }

    ctx.fillText(t, 130, 44);
    ctx.strokeText(t, 130, 44);

    let map = new THREE.Texture(canvas);
    map.needsUpdate = true;
    return map;
  }

  function _removeObj (obj) {
    if (!obj.isObject3D) _error('Pass in the THREE.Object3D object!');

    let showArr = [].concat(this._showArr);

    for (let i in showArr) {
      if (showArr[i] === obj) {
        showArr.splice(i, 1);
        this._showArr = [].concat(showArr);
        showArr = null;
        break;
      }
    }
  }

  function _removeObjs (arr) {
    if (!Array.isArray(arr)) _error('Pass in the array object!');

    for (let i = 0; i < arr.length; i++) {
      _removeObj(arr[i]);
    }
  }

  function _onmousemove (e) {
    this.visible = false;

    if (!this.enabled) return;
    if (!this.SCENE.isRender) return;

    let rect = this.SCENE.app[ 0 ].getBoundingClientRect();

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, this.SCENE.camera);

    let hoverInteract = raycaster.intersectObjects(this._showArr, true);
    let hoverInteractAll = raycaster.intersectObjects(this.SCENE.expScene.children, true);

    let pointMesh = null;
    let MESH = null;

    if (hoverInteract.length > 0) {
      let mesh = hoverInteract[ 0 ].object;
      if (hoverInteractAll.length > 0) {
        for (let i in hoverInteractAll) {
          if (hoverInteractAll[ i ].object.isTriggerPoint) {
            this.visible = false;
            pointMesh = hoverInteractAll[ i ].object;

            break;
          }
        }
      }

      if (pointMesh !== null) return;
      if (hoverInteractAll.length > 0) {
        for (let j in hoverInteractAll) {
          if (!hoverInteractAll[ j ].object.isDragArea && !hoverInteractAll[ j ].object.isHidden) {
            MESH = hoverInteractAll[ j ].object;
            break;
          }
        }
      }

      if (mesh !== MESH) {
        this.visible = false;
        return;
      }

      if (mesh.modelName && this.SCENE.expScene.getObjectByName(mesh.modelName)) {
        let obj = this.SCENE.expScene.getObjectByName(mesh.modelName);
        if (!obj.enabledShow) {
          this.visible = false;
          return;
        }

        if (obj.showName) {
          let left = e.clientX - rect.left;
          let bottom = rect.bottom - e.clientY;
          this.UI.position.set(left, bottom, 0);

          this.text = obj.showName;
          this.visible = true;
        }
      }
    }
  }

  function _hidden () {
    this.visible = false;
  }

  function _error (message) {
    throw new Error(message);
  }

  function toolTip (scene, fontColor, imgArr) {
    this.SCENE = scene.isScene ? scene : _error('Please pass in the InitScene instance!');

    this.showArr = [];
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, this.SCENE.areaWidth, this.SCENE.areaHeight, 0, -10, 10);
    this.render = new THREE.RenderPass(this.scene, this.camera);
    this.render.clear = false;
    this.enabled = true;
    this.fontColor = fontColor ? fontColor : '#fff';
    _createUI.call(this, imgArr);
  }

  Object.defineProperties(toolTip.prototype, {
    'enabled': {
      get: function () { return this._enabled; },
      set: function (value) {
        if (this._enabled === value) return;

        this._enabled = value;
        this.removeEvent();
        if (value) this.addEvent();
      }
    },
    'text': {
      set: function (value) {
        this.UItext.material.map = _createUItext.call(this, value);
        this.UItext.material.map.needsUpdate = true;
      }
    },
    'visible': {
      set: function (value) {
        if (this.UItext.visible === value) return;

        this.UItext.visible = value;
        this.UI.visible = value;
      }
    },
    '_showArr': {
      get: function () { return this.showArr; },
      set: function (value) {
        let oldArr = [].concat(this.showArr);
        this.showArr = value;

        for (let i in oldArr) {
          oldArr[i].enabledShow = false;
        }

        for (let j in this.showArr) {
          this.showArr[j].enabledShow = true;
        }
      }
    }
  })

  Object.assign(toolTip.prototype, {
    add: function (obj) {
      this._showArr = this.showArr.concat(obj);
    },

    remove: function (obj) {
      if (obj.isObject3D) _removeObj.call(this, obj);
      if (Array.isArray(obj)) _removeObjs.call(this, obj);
    },

    clear: function () {
      this._showArr = [];
    },

    onResize: function (width, height) {
      _hidden.call(this);
      this.camera.right = width;
      this.camera.top = height;
      this.camera.updateProjectionMatrix();
    },

    addEvent: function () {
      this.SCENE.renderer.domElement.addEventListener('mousemove', _onmousemove.bind(this), false);
      this.SCENE.renderer.domElement.addEventListener('wheel', _onmousemove.bind(this), false);
      this.SCENE.renderer.domElement.addEventListener('touchstart', _hidden.bind(this), false);
    },

    removeEvent: function () {
      this.SCENE.renderer.domElement.removeEventListener('mousemove', _onmousemove.bind(this), false);
      this.SCENE.renderer.domElement.removeEventListener('wheel', _onmousemove.bind(this), false);
      this.SCENE.renderer.domElement.removeEventListener('touchstart', _hidden.bind(this), false);
    },

    reset: function () {
      this.clear();
    }
  })

  return toolTip;
})()

export default ToolTip;
