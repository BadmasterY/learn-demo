var render = new THREE.WebGLRenderer({
    antialias: true // 开启抗锯齿
});

// 设置渲染尺寸
render.setSize(400, 300);
// 将对应canvas插入文档
document.body.appendChild(render.domElement);

// 创建相机
var camera = new THREE.PerspectiveCamera();
camera.position.z = 500;

var scene = new THREE.Scene(); // 创建场景
var cube = new THREE.Mesh( // 创建一个正方体
    new THREE.BoxGeometry(200, 200, 200), // 模型
    new THREE.MeshBasicMaterial({  // 材质
        color: 0x6699cc, // 设置材质颜色
        wireframe: true // 使用网格形式
    })
);
cube.rotation.set(0.5, 0.5, 0); // 设置正方体旋转角度

scene.add(cube); // 将正方体添加到场景中

// 渲染相机拍摄到的场景
render.render(scene, camera);