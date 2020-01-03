/*******************************************************************
 * name: SetObjectPro.js
 * version: 0.1.0
 * date: 2018-7-19
 * author: BadmasterY / https://github.com/BadmasterY
 * description: Quickly set the attributes of THREE.Object3D
 * record: null
 * remake: Subsequent updates go to ES6
*********************************************************************/
import * as THREE from 'three';

Object.assign(THREE.Object3D.prototype, {
  setAll: function (paramers) {
    if (!paramers) paramers = {};

    let lastPos = this.position.clone(); // Last position
    let lastRot = this.rotation.clone(); // Last rotation
    let lastSca = this.scale.clone(); // Last scale

    let pos = paramers.pos;
    let rot = paramers.rot;
    let sca = paramers.sca;
    let name = paramers.name;
    let mName = paramers.mName;
    let trigName = paramers.trigName;
    let showName = paramers.showName;
    let castShadow = paramers.cast;
    let receiveShadow = paramers.receive;
    let MM = paramers.MM;
    let MU = paramers.MU;
    let MD = paramers.MD;

    // Position
    if (pos !== undefined) {
      if (pos.isVector3) {
        this.position.copy(pos);
      }
      if (Array.isArray(pos)) {
        let len = pos.length;

        if (len === 1) {
          this.position.set(pos[0], lastPos.y, lastPos.z);
        } else {
          for (let i = 0; i < 3; i++) {
            if (typeof pos[i] !== 'number') {
              let posNum = parseFloat(pos[i]);

              if (isNaN(posNum)) {
                switch (i) {
                  case 0:
                    pos[0] = lastPos.x;
                    break;
                  case 1:
                    pos[1] = lastPos.y;
                    break;
                  case 2:
                    pos[2] = lastPos.z;
                    break;
                }
              } else {
                pos[i] = posNum;
              }
            }
          }

          this.position.set(pos[0], pos[1], pos[2]);
        }
      }

      if (typeof pos === 'number') {
        this.position.set(pos, pos, pos);
      }

      if (Object.prototype.toString.call(pos) === '[object String]') {
        let posNum = parseFloat(pos);
        if (isNaN(posNum)) {
          this.position.set(lastPos.x, lastPos.y, lastPos.z);
        } else {
          this.position.set(posNum, posNum, posNum);
        }
      }
    } else {
      this.position.copy(lastPos);
    }

    // Rotation
    if (rot !== undefined) {
      if (rot.isEuler) {
        this.rotation.copy(rot);
      }

      if (Array.isArray(rot)) {
        for (let i = 0; i < 3; i++) {
          if (typeof rot[i] !== 'number') {
            let rotNum = parseFloat(rot[i]);
            if (isNaN(rotNum)) {
              switch (i) {
                case 0:
                  rot[0] = lastRot.x;
                  break;
                case 1:
                  rot[1] = lastRot.y;
                  break;
                case 2:
                  rot[2] = lastRot.z;
                  break;
              }
            } else {
              rot[i] = rotNum;
            }
          }
        }

        this.rotation.set(rot[0], rot[1], rot[2]);
      }

      if (typeof rot === 'number') {
        this.rotation.set(rot, rot, rot);
      }

      if (Object.prototype.toString.call(rot) === '[object String]') {
        let rotNum = parseFloat(rot);
        if (isNaN(rotNum)) {
          this.rotation.set(lastRot.x, lastRot.y, lastRot.z);
        } else {
          this.rotation.set(rotNum, rotNum, rotNum);
        }
      }
    } else {
      this.rotation.copy(lastRot);
    }

    // Scale
    if (sca !== undefined) {
      if (sca.isVector3) {
        this.scale.copy(sca);
      }

      if (Array.isArray(sca)) {
        for (let i = 0; i < 3; i++) {
          if (typeof sca[i] !== 'number') {
            let scNum = parseFloat(sca[i]);

            if (isNaN(scNum)) {
              switch (i) {
                case 0:
                  sca[0] = lastSca.x;
                  break;
                case 1:
                  sca[1] = lastSca.y;
                  break;
                case 2:
                  sca[2] = lastSca.z;
                  break;
              }
            } else {
              sca[i] = scNum;
            }
          }
        }

        this.scale.set(sca[0], sca[1], sca[2]);
      }

      if (typeof sca === 'number') {
        this.scale.set(sca, sca, sca);
      } else if (Object.prototype.toString.call(sca) === '[object String]') {
        let scNum = parseFloat(sca);

        if (isNaN(scNum)) {
          this.scale.set(lastSca.x, lastSca.y, lastSca.z);
        } else {
          this.scale.set(scNum, scNum, scNum);
        }
      }
    } else {
      this.scale.copy(lastSca);
    }

    if (!this.oldPos) this.oldPos = this.position.clone(); // Old position
    if (!this.oldRot) this.oldRot = this.rotation.clone(); // Old rotation
    if (!this.oldSca) this.oldSca = this.scale.clone(); // Old scale

    // Name
    if (name !== undefined) {
      this.name = name;
      this.traverse(function (child) {
        if (child.isMesh) {
          child.modelName = name;
        }
      })
    }

    // modelName
    if (mName !== undefined) {
      this.traverse(function (child) {
        if (child.isMesh) {
          child.modelName = mName;
        }
      })
    }

    // triggerName
    if (trigName !== undefined) this.triggerName = trigName;

    // showName
    if (showName !== undefined) this.showName = showName;

    // castShadow
    if (castShadow !== undefined) {
      this.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = castShadow;
        }
      })
    }

    // receiveShadow
    if (receiveShadow !== undefined) {
      this.traverse(function (child) {
        if (child.isMesh) {
          child.receiveShadow = receiveShadow;
        }
      })
    }

    if (MM !== undefined) this.MM = MM;

    if (MU !== undefined) this.MU = MU;

    if (MD !== undefined) this.MD = MD;
  }
})
