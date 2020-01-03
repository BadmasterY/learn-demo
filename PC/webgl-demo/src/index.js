import View from 'view/index.jsx';
import webGLFrame from 'common/index';
import * as THREE from 'three';

let app = webGLFrame({appId:'#app'});

console.log(app)
const btns = [
  {
      name: '修改提示',
      className: 'btn_1',
      onClick: function(){
        view.setState({
          topTip: '这是修改后的提示'
        });
      }
  },
  {
      name: '隐藏',
      className: 'btn_2',
      onClick: function(){
        view.setState({
          isHidden: true
        });
      }
  }
];
const view = View({
  app: app, 
  btns: btns,
  topTip: '请拖动剪刀，对盆栽进行裁剪'
});

console.log(view)

app.scene.scenarios = function (images, models) {
  var desk = models.Desk.deepClone();
  desk.setAll({
    pos: [0, -53.4, 0],
    rot: [0, Math.PI / 2, 0],
    sca: [1.5, 1.4, 1.2],
    name: 'appDesk'
  });
  app.scene.bgModel = desk;
  app.scene.bgImg = images.Desk_Diffuse;
  desk.receiveShadow = true;

  var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
  geometry.rotateX(-Math.PI / 2);

  var plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({visible: false}));
  plane.setAll({
    pos:[0,0.15,0],
    name: 'plane'
  });
  app.scene.addObj(plane);

  var rollOverGeo = new THREE.BoxGeometry(10, 10, 10);
  var rollOverMaterial = new THREE.MeshStandardMaterial({color: 0x00cc00, opacity: 0.5, transparent: true, depthTest: false});
  var rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);

  rollOverMesh.setAll({
    pos:[0,10,0]
  });
  app.scene.addObj(rollOverMesh);

  var objects = [];
  objects.push(plane);
  var index = 0;

  var isShiftDown;

  document.addEventListener('mousemove',onDocumentMouseMove, false);
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('keydown', onDocumentKeyDown, false);
  document.addEventListener('keyup', onDocumentKeyUp, false);

  var mouse = new THREE.Vector2();
  var raycaster = new THREE.Raycaster();

  function onDocumentMouseMove(event) {

    event.preventDefault();

    mouse.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

    raycaster.setFromCamera( mouse, app.scene.camera );

    var intersects = raycaster.intersectObjects([plane]);

    rollOverMesh.material.color.set(0xcc0000);

    if (intersects.length > 0) {

      var intersect = intersects[ 0 ];
      
      rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal ); 
      rollOverMesh.position.divideScalar( 1 ).floor().multiplyScalar( 1 ).addScalar( 5 );
      rollOverMesh.position.set(rollOverMesh.position.x-5,rollOverMesh.position.y - 1,rollOverMesh.position.z - 5);
      if(rollOverMesh.position.x > 80)rollOverMesh.position.setX(80);
      if(rollOverMesh.position.x < -80)rollOverMesh.position.setX(-80);
      if(rollOverMesh.position.z > 42)rollOverMesh.position.setZ(42);
      if(rollOverMesh.position.z < -42)rollOverMesh.position.setZ(-42);

      if(objects.length === 1){
        rollOverMesh.material.color.set(0x00cc00);
        return;
      }

      for(var i = 0; i < objects.length; i++){
        if(objects[i].geometry.type == "PlaneBufferGeometry"){ //dont test against the plane
          continue;
        }
        if(detectCollisionCubes(rollOverMesh, objects[i])){
          rollOverMesh.material.color.set(0xcc0000);
          return; //if collision is found, dont add the box
        }

        rollOverMesh.material.color.set(0x00cc00);
      }
    }
  }
  function onDocumentMouseDown( event ) {

    event.preventDefault();

    if (event.button !== 0) return

    mouse.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1 );

    raycaster.setFromCamera( mouse, app.scene.camera );

    var getPlane = raycaster.intersectObject(plane);
    var intersects = raycaster.intersectObjects( objects );

    if ( getPlane.length > 0 ) {
      var intersect = intersects[ 0 ];

      if ( isShiftDown ) {

        if ( intersect.object != plane ) {

          app.scene.removeObj( intersect.object );

          objects.splice( objects.indexOf( intersect.object ), 1 );
          console.log('cubes: '+ (objects.length - 1))

        }

      } else {
        var voxel = new THREE.Mesh(
          new THREE.BoxGeometry(10, 10, 10),
          new THREE.MeshStandardMaterial({
            // transparent: true,
            castShadow: true,
            opacity: 0.4,
            color: Math.random() * 0xffffff
          })                                     
        );
        voxel.castShadow = true;
        voxel.name = 'cube_'+ index;
        index++;
        voxel.position.copy( getPlane[0].point ).add( getPlane[0].face.normal );
        voxel.position.divideScalar( 1 ).floor().multiplyScalar( 1 ).addScalar( 5 );

        voxel.position.set(voxel.position.x - 5, voxel.position.y - 1, voxel.position.z - 5);
        if(voxel.position.x > 80)voxel.position.setX(80);
        if(voxel.position.x < -80)voxel.position.setX(-80);
        if(voxel.position.z > 42)voxel.position.setZ(42);
        if(voxel.position.z < -42)voxel.position.setZ(-42);

        for(var i = 0; i < objects.length; i++){
          if(objects[i].geometry.type == "PlaneBufferGeometry"){ //dont test against the plane
            continue;
          }
          if(detectCollisionCubes(voxel, objects[i])){
            return; //if collision is found, dont add the box
          }
        }
        
        app.scene.addObj( voxel );

        objects.push( voxel );
        console.log('cubes: '+ (objects.length - 1))
      }

    }

  }

  function onDocumentKeyDown( event ) {

    switch( event.keyCode ) {

      case 16: isShiftDown = true; break;

    }

  }

  function onDocumentKeyUp( event ) {

    switch ( event.keyCode ) {

      case 16: isShiftDown = false; break;

    }

  }

  function detectCollisionCubes(object1, object2){
    object1.geometry.computeBoundingBox();
    object2.geometry.computeBoundingBox();
    object1.updateMatrixWorld();
    object2.updateMatrixWorld();
    
    var box1 = object1.geometry.boundingBox.clone();
    box1.applyMatrix4(object1.matrixWorld);
  
    var box2 = object2.geometry.boundingBox.clone();
    box2.applyMatrix4(object2.matrixWorld);
  
    return box1.intersectsBox(box2);
  }
}

app.scene.loopFn = function () {}