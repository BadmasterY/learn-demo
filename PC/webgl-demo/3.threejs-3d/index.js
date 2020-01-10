window.onload = () => {
    const div = document.getElementById('index');

    // 渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(div.offsetWidth, div.offsetHeight);
    div.appendChild(renderer.domElement);

    // 场景
    const scene = new THREE.Scene();

    // 相机
    const camera = new THREE.PerspectiveCamera(45, div.offsetWidth / div.offsetHeight, 1, 4000);
    camera.position.set(0, 0, 3);
    scene.add(camera);

    // 光源
    // 平行光
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(0, 0, 1);
    scene.add(light);

    // 立方体
    // 贴图
    // 由于异步加载贴图，需确保贴图已加载

    const promise = new Promise((resolve, reject) => {
        const map = new THREE.TextureLoader()
            .load(
                './images/1.png', // 贴图路径
                function onLoad() { resolve(map); },
                function onProgress() { }, // 用来监听进度, 不过目前暂不支持 r112，如果希望使用，可以用 FileLoader
                function onError(err) { reject(err); }
            );
    });

    // 如果贴图为复数
    // 可以使用 promise.all 或者 promise.allSettled
    promise.then(map => {
        // 材质
        const material = new THREE.MeshPhongMaterial({ map });
        // 创建几何体
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        // 组合
        const box = new THREE.Mesh(geometry, material);
        box.rotation.set(Math.PI / 5, Math.PI / 5, 0);
        scene.add(box);

        // 渲染
        render();
        // 使用 requestAnimationFrame
        function render() {
            renderer.render(scene, camera);

            // 每次重绘都改变一次 y 轴数据
            box.rotation.y -= 0.01;

            requestAnimationFrame(render);
        }
    }).catch(err => console.error(err));

}