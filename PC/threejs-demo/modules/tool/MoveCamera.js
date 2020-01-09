/*******************************************************************
 * name: MoveCamera.js
 * version: 0.1.0
 * date: 2018-7-19
 * author: BadmasterY / https://github.com/BadmasterY
 * description: This component is position of moving camera
 * record: null
 * remake: Subsequent updates go to ES6
*********************************************************************/
import * as THREE from 'three';
import TWEEN from 'tween';

Object.assign(THREE.Camera.prototype, {
  moveCameraFocus: function (params) {
    if (!this.PARENT) throw new Error('The PARENT should be InitScene instance!');
    let scene = this.PARENT;
    scene.camera.lastState = {
      targetX: scene.controls.target.x,
      targetY: scene.controls.target.y,
      targetZ: scene.controls.target.z,
      posX: scene.camera.position.x,
      posY: scene.camera.position.y,
      posZ: scene.camera.position.z
    }

    scene.camera.changeState = {
      targetX: scene.controls.target.x,
      targetY: scene.controls.target.y,
      targetZ: scene.controls.target.z,
      posX: scene.camera.position.x,
      posY: scene.camera.position.y,
      posZ: scene.camera.position.z
    }

    let moveCamera = new TWEEN.Tween(scene.camera.changeState)
    .to(
      {
        targetX: params.target[0],
        targetY: params.target[1],
        targetZ: params.target[2],
        posX: params.pos[0],
        posY: params.pos[1],
        posZ: params.pos[2]
      }, params.time)
    .easing(TWEEN.Easing.Cubic.Out)
    .onStart(function () {
      if (params.onStart) {
        params.onStart();
      }
    })
    .onUpdate(function () {
      scene.camera.position.set(this.posX, this.posY, this.posZ);
      scene.controls.target.set(this.targetX, this.targetY, this.targetZ);

      if (params.onUpdate) params.onUpdate();
    })
    .onComplete(function () {
      moveCamera = null;
      if (params.onComplete) {
        params.onComplete();
      }
    })
    .start();
  },
  resetCameraFocus: function (params) {
    if (!this.PARENT) throw new Error('The PARENT should be InitScene instance!');
    let scene = this.PARENT;

    if ((!params.target || !params.pos) && !scene.camera.lastState) {
      throw new Error('This method is used after the full argument or call .MoveCameraFocus');
    }

    scene.camera.changeState = {
      targetX: scene.controls.target.x,
      targetY: scene.controls.target.y,
      targetZ: scene.controls.target.z,
      posX: scene.camera.position.x,
      posY: scene.camera.position.y,
      posZ: scene.camera.position.z
    }

    let tx = params.target ? params.target[0] : scene.camera.lastState.targetX;
    let ty = params.target ? params.target[1] : scene.camera.lastState.targetY;
    let tz = params.target ? params.target[2] : scene.camera.lastState.targetZ;
    let posX = params.pos ? params.pos[0] : scene.camera.lastState.posX;
    let posY = params.pos ? params.pos[1] : scene.camera.lastState.posY;
    let posZ = params.pos ? params.pos[2] : scene.camera.lastState.posZ;
    let resetCamera = new TWEEN.Tween(scene.camera.changeState)
    .to(
      {
        targetX: tx,
        targetY: ty,
        targetZ: tz,
        posX: posX,
        posY: posY,
        posZ: posZ
      }, params.time)
    .easing(TWEEN.Easing.Cubic.Out)
    .onStart(function () {
      if (params.onStart) {
        params.onStart();
      }
    })
    .onUpdate(function () {
      scene.camera.position.set(this.posX, this.posY, this.posZ);
      scene.controls.target.set(this.targetX, this.targetY, this.targetZ);

      if (params.onUpdate) params.onUpdate();
    })
    .onComplete(function () {
      resetCamera = null;
      if (params.onComplete) {
        params.onComplete();
      }
    })
    .start();
  }
})
