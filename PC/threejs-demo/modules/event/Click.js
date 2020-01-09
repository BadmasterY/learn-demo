/*******************************************************************
 * name: Click.js
 * version: 0.1.0
 * date: 2018-7-20
 * author: BadmasterY / https://github.com/BadmasterY
 * description: Add click events to objects in the scene
 * record: null
 * remake: Subsequent updates go to ES6
*********************************************************************/
import * as THREE from 'three'

let Click = (function () {
  let raycaster = new THREE.Raycaster()
  let mouse = new THREE.Vector2()

  function _onMouseDown (e) {
    if (!this.enabled) return
    if (!this.SCENE.isRender) return

    if (e.button !== 0) return

    let rect = this.SCENE.app[ 0 ].getBoundingClientRect()

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, this.SCENE.camera)

    let clickInteract = raycaster.intersectObjects(this.SCENE.expScene.children, true)

    if (clickInteract.length > 0) {
      let mesh = null

      for (let k in clickInteract) {
        if (clickInteract[k].object.isTriggerPoint) {
          mesh = clickInteract[ k ].object
          break
        }
      }

      if (mesh) {
        if (mesh.enableClick) {
          mesh.clickFn(mesh)
          mesh.clickTimes++
          return
        }
      }

      for (let i in clickInteract) {
        if (!clickInteract[ i ].object.isTriggerArea && !clickInteract[ i ].object.isHidden) {
          mesh = clickInteract[ i ].object
          break
        }
      }

      if (mesh === null) return

      if (mesh.modelName && this.SCENE.expScene.getObjectByName(mesh.modelName)) {
        let modelName = mesh.modelName

        let obj = this.SCENE.expScene.getObjectByName(modelName)
        if (obj.enableClick) {
          if (obj.clickFn) {
            obj.clickFn(obj)
            obj.clickTimes++
          }
        }
      }
    }
  }

  function _onTouchStart (e) {
    e.preventDefault()
    if (!this.SCENE.isRender) return

    let rect = this.SCENE.app[ 0 ].getBoundingClientRect()
    if (e.touches.length === 1) {
      e = e.changedTouches[ 0 ]
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, this.SCENE.camera)

      let clickInteract = raycaster.intersectObjects(this.SCENE.expScene.children, true)

      if (clickInteract.length > 0) {
        let mesh = null

        for (let k in clickInteract) {
          if (clickInteract[k].object.isTriggerPoint) {
            mesh = clickInteract[ k ].object
            break
          }
        }

        if (mesh) {
          if (mesh.enableClick) {
            mesh.clickFn(mesh)
            mesh.clickTimes++
          }
          return
        }

        for (let i in clickInteract) {
          if (!clickInteract[ i ].object.isTriggerArea && !clickInteract[i].object.isHidden) {
            mesh = clickInteract[ i ].object

            break
          }
        }

        if (!mesh) return

        if (mesh.modelName && this.SCENE.expScene.getObjectByName(mesh.modelName)) {
          let modelName = mesh.modelName
          let obj = this.SCENE.expScene.getObjectByName(modelName)

          if (obj.clickFn) {
            if (obj.enableClick) {
              obj.clickFn(obj)
              obj.clickTimes++
            }
          }
        }
      }
    }
  }

  function _error (message) {
    throw new Error(message)
  }

  function click (scene) {
    this.SCENE = scene.isScene ? scene : _error('Please pass in the InitScene instance!')

    this.clickArr = []
    this._enabled = true
  }

  Object.defineProperties(click.prototype, {
    '_enabled': {
      get: function () { return this.enabled },
      set: function (value) {
        if (this.enabled === value) return
        this.enabled = value

        this.removeEvent()
        if (value) this.addEvent()
      }
    },
    '_clickArr': {
      get: function () { return this.clickArr },
      set: function (value) {
        let oldArr = [].concat(this.clickArr)
        this.clickArr = value
        for (let i in oldArr) {
          oldArr[i].enableClick = false
        }

        for (let j in this.clickArr) {
          let clickTimes = this.clickArr[j].clickTimes
          this.clickArr[j].enableClick = true
          if (!clickTimes) this.clickArr[j].clickTimes = 0
        }
      }
    }
  })

  Object.assign(click.prototype, {
    add: function (obj) {
      this._clickArr = this._clickArr.concat(obj)
    },

    remove: function (obj) {
      if (!obj.isObject3D) _error('Please pass in the THREE.Object3D instance!')

      let clickArr = [].concat(this._clickArr)
      for (let key in clickArr) {
        if (clickArr[key] === obj) {
          clickArr.splice(key, 1)
          this._clickArr = [].concat(clickArr)

          clickArr = null
          break
        }
      }
    },

    clear: function () {
      this._clickArr = []
    },

    addEvent: function () {
      this.SCENE.renderer.domElement.addEventListener('mousedown', _onMouseDown.bind(this), false)
      this.SCENE.renderer.domElement.addEventListener('touchstart', _onTouchStart.bind(this), false)
    },

    removeEvent: function () {
      this.SCENE.renderer.domElement.removeEventListener('mousedown', _onMouseDown.bind(this), false)
      this.SCENE.renderer.domElement.removeEventListener('touchstart', _onTouchStart.bind(this), false)
    },

    reset: function () {
      this.clear()
    }
  })
  return click
})()

export default Click
