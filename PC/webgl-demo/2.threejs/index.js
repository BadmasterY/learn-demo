window.onload = () => {
    const div = document.getElementById('index');

    // 1. 渲染器
    // 记住 new
    // three.js 没有对任何构造函数进行处理
    // 这将导致不会抛出异常
    // 或者隐匿的使用 new
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(div.offsetWidth, div.offsetHeight);
    div.appendChild(renderer.domElement);

    // 2. 场景
    const scene = new THREE.Scene();

    // 3. 相机
    const camera = new THREE.PerspectiveCamera(45, div.offsetWidth / div.offsetHeight, 1, 4000);
    camera.position.set(0, 0, 3.333);
    scene.add(camera);

    // 4. 创建平面(场景内的物体)
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    scene.add(mesh);

    // 渲染
    renderer.render(scene, camera);
}