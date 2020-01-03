/*******************************************************************
 * name: DeepClone.js
 * version: 0.1.0
 * date: 2018-7-19
 * author: BadmasterY / https://github.com/BadmasterY
 * description: This is a fake deep cloning, mainly to achieve the cloning model when the material is not cloned
 * record: null
 * remake: Subsequent updates go to ES6
*********************************************************************/

import * as THREE from 'three'

Object.assign(THREE.Object3D.prototype, {
  deepClone: function () {
    let obj = this.clone();

    obj.traverse(function (child) {
      if (child.isMesh) {
        let newMaterial = child.material.clone();
        child.material = newMaterial;
      }
    })

    return obj;
  }
})
