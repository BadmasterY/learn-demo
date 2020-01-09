/*******************************************************************
 * name: Drag.js
 * version: 0.1.0
 * date: 2018-7-20
 * author: BadmasterY / https://github.com/BadmasterY
 * description: Add drag events to objects in the scene
 * record: null
 * remake: Subsequent updates go to ES6
*********************************************************************/
import * as THREE from 'three'
import '../DeepClone'
import '../SetObjectPro'

let Drag = (function () {
  let SELECTED, c_Selected, INTERSECTED, currentArea, fourFingerStart, fourFingerEnd, mobileDragSelected

  let raycaster = new THREE.Raycaster()
  let mouse = new THREE.Vector2()
  let offset = new THREE.Vector3()
  let intersection = new THREE.Vector3()
  let operatePlane = new THREE.Plane()
  let cloneOpacity = 0.4
  let cloneColor = 0xff0000

  function _onMouseDown (e) {
    if (!this.enabled) return
    if (!this.SCENE.isRender) return
    if (e.button !== 0) return

    SELECTED = null

    let rect = this.SCENE.app[ 0 ].getBoundingClientRect()

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, this.SCENE.camera)

    let MMinteractAll = raycaster.intersectObjects(this.SCENE.expScene.children, true)
    let MMinteract = raycaster.intersectObjects(this._dragArr, true)

    if (MMinteract.length > 0) {
      let mesh = null
      let MESH = null

      for (let i in MMinteractAll) {
        if (MMinteractAll[ i ].object.isTriggerPoint) {
          MESH = MMinteractAll[ i ].object
          break
        }
      }

      if (MESH) return

      for (let k in MMinteractAll) {
        if (!MMinteractAll[ k ].object.isDragArea && !MMinteractAll[ k ].object.isHidden) {
          MESH = MMinteractAll[ k ].object
          break
        }
      }

      for (let j in MMinteract) {
        if (!MMinteract[ j ].object.isHidden) {
          mesh = MMinteract[ j ].object
          break
        }
      }

      if (!mesh) return

      if (MESH !== mesh) return

      if (mesh.modelName && this.SCENE.expScene.getObjectByName(mesh.modelName)) {
        let modelName = mesh.modelName
        let obj = this.SCENE.expScene.getObjectByName(mesh.modelName)

        if (obj.enableDrag && obj.triggerName) {
          this.SCENE.controls.enabled = false
          SELECTED = obj

          if (SELECTED.MD) SELECTED.MD(SELECTED)

          SELECTED.inArea = false
          c_Selected = SELECTED.deepClone()
          c_Selected.name = null
          c_Selected.traverse(function (child) {
            if (child.isMesh) {
              child.modelName = modelName
              child.material.transparent = true
              child.material.opacity = cloneOpacity

              child.material.color.set(cloneColor)
              child.material.depthTest = false
            }
          })

          this.SCENE.addObj(c_Selected)
          SELECTED.material.visible = false
          SELECTED.lastPos = SELECTED.position.clone()
          SELECTED.lastRot = SELECTED.rotation.clone()
          SELECTED.lastSca = SELECTED.scale.clone()

          if (raycaster.ray.intersectPlane(operatePlane, intersection)) {
            offset.copy(intersection).sub(c_Selected.position)
          }
          this.SCENE.app.css('cursor', 'pointer')
        }
      }
    }
  }

  function _onMouseMove (e) {
    this.SCENE.app.css('cursor', 'auto')

    if (!this.enabled) return
    if (!this.SCENE.isRender) return
    if (e.button !== 0) return

    let rect = this.SCENE.app[ 0 ].getBoundingClientRect()

    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, this.SCENE.camera)

    if (SELECTED) {
      this.SCENE.app.css('cursor', 'pointer')

      let TAinteract = raycaster.intersectObjects(this.TAarr, true)

      if (TAinteract.length > 0) {
        let trigName = SELECTED.triggerName

        for (let i in TAinteract) {
          if (TAinteract[ i ].object.triggerName && TAinteract[ i ].object.triggerName === trigName) {
            currentArea = TAinteract[ i ].object
            break
          } else {
            currentArea = null
          }
        }
        if (currentArea) {
          SELECTED.inArea = true
          SELECTED.material.visible = true
          c_Selected.visible = false

          currentArea.MM(SELECTED)
        } else {
          SELECTED.inArea = false
          SELECTED.visible = false
          c_Selected.visible = true

          SELECTED.position.copy(SELECTED.lastPos)
          SELECTED.rotation.copy(SELECTED.lastRot)
          SELECTED.scale.copy(SELECTED.lastSca)

          if (SELECTED.MM) {
            SELECTED.MM(SELECTED)
          }
        }
      } else {
        currentArea = null
        SELECTED.inArea = false
        SELECTED.material.visible = false
        c_Selected.visible = true
        SELECTED.position.copy(SELECTED.lastPos)
        SELECTED.rotation.copy(SELECTED.lastRot)
        SELECTED.scale.copy(SELECTED.lastSca)

        if (SELECTED.MM) SELECTED.MM(SELECTED)
      }

      if (raycaster.ray.intersectPlane(operatePlane, intersection)) {
        c_Selected.position.copy(intersection.sub(offset))
      }

      return
    }

    let hoverInteract = raycaster.intersectObjects(this.dragArr, true)
    let hoverInteractAll = raycaster.intersectObjects(this.SCENE.expScene.children, true)

    if (hoverInteract.length > 0) {
      let mesh = null
      let MESH = null

      for (let i in hoverInteractAll) {
        if (!hoverInteractAll[ i ].object.isDragArea && !hoverInteractAll[ i ].object.isHidden) {
          MESH = hoverInteractAll[ i ].object
          break
        }
      }

      for (let j in hoverInteractAll) {
        if (hoverInteractAll[ j ].object.isTriggerPoint) {
          MESH = hoverInteractAll[ j ].object
          break
        }
      }

      for (let k in hoverInteract) {
        if (!hoverInteract[ k ].object.isHidden) {
          mesh = hoverInteract[ k ].object
          break
        }
      }

      if (!mesh) return
      if (MESH !== mesh) return

      if (mesh.modelName && this.SCENE.expScene.getObjectByName(mesh.modelName)) {
        let obj = this.SCENE.expScene.getObjectByName(mesh.modelName)

        if (obj.enableDrag && obj.triggerName) {
          INTERSECTED = obj
          operatePlane.setFromNormalAndCoplanarPoint(
            this.SCENE.camera.getWorldDirection(operatePlane.normal),
            INTERSECTED.position
          )

          this.SCENE.app.css('cursor', 'pointer')
        }
      } else {
        INTERSECTED = null
      }
    } else {
      INTERSECTED = null
    }
  }

  function _onMouseUp (e) {
    this.SCENE.app.css('cursor', 'auto')

    if (!this.enabled) return
    if (!this.SCENE.isRender) return
    if (e.button !== 0) return
    if (!SELECTED) return

    this.SCENE.controls.enabled = true

    SELECTED.material.visible = true
    if (SELECTED.MU) SELECTED.MU(SELECTED)

    if (SELECTED.inArea){ 
      currentArea.triggerName = null
      this.remove(SELECTED)
      currentArea.MU(SELECTED)
    } else {
      SELECTED.position.copy(SELECTED.lastPos)
      SELECTED.rotation.copy(SELECTED.lastRot)
      SELECTED.scale.copy(SELECTED.lastSca)
    }
    this.SCENE.removeObj(c_Selected)

    c_Selected = null
    SELECTED = null
    currentArea = null
  }

  function _onTouchStart (e) {
    e.preventDefault()
    if (!this.enabled) return

    if (!this.SCENE.isRender) return
    let rect = this.SCENE.app[ 0 ].getBoundingClientRect()

    if (e.touches.length === 1) {
      e = e.changedTouches[ 0 ]

      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, this.SCENE.camera)

      let MMinteractAll = raycaster.intersectObjects(this.SCENE.expScene.children, true)
      let MMinteract = raycaster.intersectObjects(this._dragArr, true)

      if (MMinteract.length > 0) {
        let mesh = null
        let MESH = null

        for (let i in MMinteractAll) {
          if (MMinteractAll[ i ].object.isTriggerPoint) {
            MESH = MMinteractAll[i].object
            break
          }
        }

        if (MESH) return

        for (let j in MMinteract) {
          if (!MMinteract[ j ].object.isHidden) {
            mesh = MMinteract[ j ].object
            break
          }
        }

        for (let k in MMinteractAll) {
          if (!MMinteractAll[ k ].object.isDragArea && !MMinteractAll[k].object.isHidden) {
            MESH = MMinteractAll[k].object
            break
          }
        }

        if (!mesh) return
        if (MESH !== mesh) return

        if (mesh.modelName && this.SCENE.expScene.getObjectByName(mesh.modelName)) {
          let modelName = mesh.modelName
          let obj = this.SCENE.expScene.getObjectByName(modelName)

          if (obj.enableDrag && obj.triggerName) {
            mobileDragSelected = true
            this.SCENE.controls.enabled = false
            SELECTED = obj

            if (SELECTED.MD) {
              SELECTED.MD(SELECTED)
            }
            SELECTED.inArea = false
            c_Selected = SELECTED.deepClone()
            c_Selected.name = null
            this.SCENE.addObj(c_Selected)
            SELECTED.material.visible = false

            c_Selected.traverse(function (child) {
              if (child.isMesh) {
                child.modelName = modelName
                child.material.transparent = true
                child.material.opacity = cloneOpacity

                child.material.color.set(cloneColor)
                child.material.depthTest = false
              }
            })

            SELECTED.lastPos = SELECTED.position.clone()
            SELECTED.lastRot = SELECTED.rotation.clone()
            SELECTED.lastSca = SELECTED.scale.clone()

            operatePlane.setFromNormalAndCoplanarPoint(
                this.SCENE.camera.getWorldDirection(operatePlane.normal),
                SELECTED.position
            )

            if (raycaster.ray.intersectPlane(operatePlane, intersection)) {
              offset.copy(intersection).sub(c_Selected.position)
            }
          }
        }
      }
    } else {
      if (SELECTED && e.touches.length > 1) {
        mobileDragSelected = false
        this.SCENE.controls.enabled = true

        SELECTED.visible = true
        if (SELECTED.MU) SELECTED.MU(SELECTED)

        SELECTED.position.copy(SELECTED.lastPos)
        SELECTED.rotation.copy(SELECTED.lastRot)
        SELECTED.scale.copy(SELECTED.lastSca)
        this.SCENE.removeObj(c_Selected)
        c_Selected = null
        SELECTED = null
        currentArea = null
      }

      if (e.touches.length > 3) {
        let xArr = []
        let yArr = []

        for (let i = 0; i < 4; i++) {
          xArr.push(e.touches[ i ].pageX)
          yArr.push(e.touches[ i ].pageY)
        }

        xArr.sort()
        yArr.sort()

        let dx = ((xArr[ 0 ] + xArr[ 1 ]) - (xArr[ 2 ] + xArr[ 3 ])) / 2
        let dy = ((yArr[ 0 ] + yArr[ 1 ]) - (yArr[ 2 ] + yArr[ 3 ])) / 2

        fourFingerStart = Math.sqrt(dx * dx + dy * dy)
      }
    }
  }

  function _onTouchMove (e) {
    e.preventDefault()
    if (!this.SCENE.isRender) return

    let rect = this.SCENE.app[ 0 ].getBoundingClientRect()

    if (e.touches.length === 1) {
      e = e.changedTouches[ 0 ]
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, this.SCENE.camera)

      if (SELECTED) {
        let TAinteract = raycaster.intersectObjects(this.TAarr, true)
        if (TAinteract.length > 0) {
          let trigName = SELECTED.triggerName
          for (let i in TAinteract) {
            if (TAinteract[ i ].object.triggerName && TAinteract[ i ].object.triggerName === trigName) {
              currentArea = TAinteract[ i ].object
              break
            } else {
              currentArea = null
            }
          }

          if (currentArea) {
            SELECTED.inArea = true
            SELECTED.material.visible = true
            c_Selected.visible = false
            currentArea.MM(SELECTED)
          } else {
            currentArea = null
            SELECTED.inArea = false
            SELECTED.material.visible = false
            c_Selected.visible = true
            SELECTED.position.copy(SELECTED.lastPos)
            SELECTED.rotation.copy(SELECTED.lastRot)
            SELECTED.scale.copy(SELECTED.lastSca)

            if (SELECTED.MM) SELECTED.MM(SELECTED)
          }
        } else {
          currentArea = null
          SELECTED.inArea = false
          SELECTED.material.visible = false
          c_Selected.visible = true
          SELECTED.position.copy(SELECTED.lastPos)
          SELECTED.rotation.copy(SELECTED.lastRot)
          SELECTED.scale.copy(SELECTED.lastSca)

          if (SELECTED.MM) SELECTED.MM(SELECTED)
        }
        if (raycaster.ray.intersectPlane(operatePlane, intersection)) {
          c_Selected.position.copy(intersection.sub(offset))
        }
      }
    } else {
      if (SELECTED && e.touches.length > 1) {
        mobileDragSelected = false

        this.SCENE.controls.enabled = true
        SELECTED.material.visible = true
        SELECTED.MU(SELECTED)
        SELECTED.position = SELECTED.lastPos.clone()
        SELECTED.rotation = SELECTED.lastRot.clone()
        SELECTED.scale = SELECTED.lastSca.clone()
        this.SCENE.removeObj(c_Selected)
        c_Selected = null
        SELECTED = null
        currentArea = null
      }

      if (e.touches.length > 3) {
        let xArr = []
        let yArr = []

        for (let i = 0; i < 4; i++) {
          xArr.push(e.touches[ i ].pageX)
          yArr.push(e.touches[ i ].pageY)
        }

        xArr.sort()
        yArr.sort()

        let dx = ((xArr[ 0 ] + xArr[ 1 ]) - (xArr[ 2 ] + xArr[ 3 ])) / 2
        let dy = ((yArr[ 0 ] + yArr[ 1 ]) - (yArr[ 2 ] + yArr[ 3 ])) / 2

        fourFingerEnd = Math.sqrt(dx * dx + dy * dy)

        let distance = fourFingerStart - fourFingerEnd

        if (distance > 35) this.SCENE.initCameraView()

        fourFingerStart = fourFingerEnd
      }
    }
  }

  function _onTouchEnd (e) {
    e.preventDefault()
    if (!this.SCENE.isRender) return

    if (SELECTED && e.touches.length === 0) {
      mobileDragSelected = false
      this.SCENE.controls.enabled = true
      SELECTED.material.visible = true

      if (SELECTED.MU) SELECTED.MU(SELECTED)
      if (SELECTED.inArea) {
        currentArea.triggerName = null
        SELECTED.triggerName = null
        currentArea.MU(SELECTED)
      } else {
        SELECTED.position.copy(SELECTED.lastPos)
        SELECTED.rotation.copy(SELECTED.lastRot)
        SELECTED.scale.copy(SELECTED.lastSca)
      }

      this.SCENE.removeObj(c_Selected)
      c_Selected = null
      SELECTED = null
      currentArea = null
    }
  }

  function _error (message) {
    throw new Error(message)
  }

  function drag (scene) {
    this.SCENE = scene.isScene ? scene : _error('Please pass in the InitScene instance!')
    this._dragArr = []
    this.TAarr = []
    this.enabled = true
  }

  Object.defineProperties(drag.prototype, {
    'enabled': {
      get: function () { return this._enabled },
      set: function (value) {
        if (this._enabled === value) return

        this._enabled = value

        this.removeEvent()
        if (value) this.addEvent()
      }
    },

    '_dragArr': {
      get: function () { return this.dragArr },
      set: function (value) {
        if (!this.dragArr) this.dragArr = []

        let oldArr = [].concat(this.dragArr)
        this.dragArr = value

        for (let i in oldArr) {
          oldArr[i].enableDrag = false
        }

        for (let j in this.dragArr) {
          this.dragArr[j].enableDrag = true
          if (!this.dragArr[j].MD) this.dragArr[j].MD = function () {}
          if (!this.dragArr[j].MM) this.dragArr[j].MM = function () {}
          if (!this.dragArr[j].MU) this.dragArr[j].MU = function () {}
        }
      }
    }
  })

  Object.assign(drag.prototype, {
    add: function (obj) {
      this._dragArr = this._dragArr.concat(obj)
    },

    remove: function (obj) {
      if (!obj.isObject3D) throw new Error('Please pass in the THREE.Object3D instance!')

      let dragArr = [].concat(this._dragArr)
      for (let i in dragArr) {
        if (dragArr[i] === obj) {
          dragArr.splice(i, 1)
          this._dragArr = [].concat(dragArr)
          dragArr = null

          break
        }
      }
    },

    showArea: function () {
      for (let key in this.TAarr) {
        this.TAarr[key].material.visible = true
      }
    },

    clear: function () {
      this._dragArr = []
    },

    createArea: function (pamerse) {
      let parent
      let area = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({
          visible: false,
          transparent: true,
          opacity: 0.4,
          color: Math.random() * 0xffffff,
          depthWrite: false
        })
      )
      area.isDragArea = true
      parent = pamerse.parent ? pamerse.parent : this.SCENE.expScene

      area.setAll(pamerse)
      this.TAarr.push(area)

      parent.add(area)

      return area
    },

    removeArea: function (obj) {
      if (!obj.isDragArea) _error('Please pass in the DragArea instance!')
      for (let i in this.TAarr) {
        this.TAarr.splice(i, 1)
      }
      obj.triggerName = null
    },

    addEvent: function () {
      this.SCENE.renderer.domElement.addEventListener('mousedown', _onMouseDown.bind(this), false)
      this.SCENE.renderer.domElement.addEventListener('mousemove', _onMouseMove.bind(this), false)
      this.SCENE.renderer.domElement.addEventListener('mouseup', _onMouseUp.bind(this), false)
      this.SCENE.renderer.domElement.addEventListener('mouseout', _onMouseUp.bind(this), false)
      this.SCENE.renderer.domElement.addEventListener('wheel', _onMouseMove.bind(this), false)

      this.SCENE.renderer.domElement.addEventListener('touchstart', _onTouchStart.bind(this), false)
      this.SCENE.renderer.domElement.addEventListener('touchmove', _onTouchMove.bind(this), false)
      this.SCENE.renderer.domElement.addEventListener('touchend', _onTouchEnd.bind(this), false)
    },

    removeEvent: function () {
      this.SCENE.renderer.domElement.removeEventListener('mousedown', _onMouseDown.bind(this), false)
      this.SCENE.renderer.domElement.removeEventListener('mousemove', _onMouseMove.bind(this), false)
      this.SCENE.renderer.domElement.removeEventListener('mouseup', _onMouseUp.bind(this), false)
      this.SCENE.renderer.domElement.removeEventListener('mouseout', _onMouseUp.bind(this), false)
      this.SCENE.renderer.domElement.removeEventListener('wheel', _onMouseMove.bind(this), false)

      this.SCENE.renderer.domElement.removeEventListener('touchstart', _onTouchStart.bind(this), false)
      this.SCENE.renderer.domElement.removeEventListener('touchmove', _onTouchMove.bind(this), false)
      this.SCENE.renderer.domElement.removeEventListener('touchend', _onTouchEnd.bind(this), false)
    },

    reset: function () {
      this._dragArr = []
      this.TAarr = []
    }
  })
  return drag
})()

export default Drag
