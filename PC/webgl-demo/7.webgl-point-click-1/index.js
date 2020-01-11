window.onload = () => {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl');

    // 顶点着色器代码
    const vertexShaderSource =
        `
        // 由外部 JavaScript 传入的数据
        // attribute 声明的变量必须为全局变量
        attribute vec4 a_Position;
        attribute float a_PointSize;
        void main() {
            // 这两个变量都是内置在顶点着色器中
            // gl_Position 必须设置, 否则着色器无法正常工作 类型: vec4, 表示由四个 float 组成的矢量
            // gl_PointSize 非必须，默认值为 1.0 类型 float

            // vec4 方法用于创建一个 vec4 实例(矢量)
            // 这个实例(矢量)被称为 齐次坐标, 四维
            // 齐次坐标(x, y, z, w)等价于三维坐标 (x/w, y/w, z/w)
            // 所以, 如果齐次坐标的第四个分量是 1, 就可以当作三维坐标使用
            // w 的值必须大于 0
            // w 越趋近于 0, 则表示的点趋近于无穷远

            // gl_Position = vec4(0.0, 0.0, 0.0, 1.0); // 设置顶点坐标
            // gl_Position = vec4(0.5, 0.0, 0.0, 1.0); // 设置顶点坐标
            gl_Position = a_Position; // 设置顶点坐标
            gl_PointSize = a_PointSize; // 设置点的尺寸(像素数)
        }
    `;

    // 片元着色器代码
    const fragmentShaderSource =
        `
        void main() {
            // gl_FragColor 为片元着色器唯一内置变量
            // 控制像素在屏幕上的最终颜色, 类型 vec4
            // 对应 rgba
            gl_FragColor = vec4(1.0, 0, 0, 1.0); // 设置颜色
        }
    `;

    // 初始化 shader
    // 与第一个创建流程、创建方法与 demo start 一致
    const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);

    // 获取 attribute 变量的存储位置
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    const a_PointSize = gl.getAttribLocation(program, 'a_PointSize');

    canvas.addEventListener('click', event => click(event, canvas, gl, a_Position, a_PointSize));

    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const g_points = []; // 鼠标点击位置数组
    /**
     * 点击事件
     * @param {MouseEvent} event 鼠标点击事件
     * @param {HTMLCanvasElement} canvas canvas元素
     * @param {WebGLRenderingContext} gl canvas三维绘制上下文
     * @param {Number} a_Position 点坐标参数位置
     * @param {Number} a_PointSize 点大小参数位置
     * @returns {Boolean} 是否成功执行
     */
    function click(event, canvas, gl, a_Position, a_PointSize) {
        let x = event.clientX; // 鼠标 x 轴
        let y = event.clientY; // 鼠标 y 轴
        // const rect = event.target.getBoundingClientRect();
        const rect = canvas.getBoundingClientRect();

        // 关于这两个参数计算方式
        // 转化流程 browser --> canvas --> webgl
        // 由于 webgl 默认为 右手坐标系(简单默认, 实际上并不是这样)
        // x 轴方向一致  y 轴方向相反 z 轴暂不考虑
        // 原因查看 4.webgl 下的 x-y.png 与 5.webgl-point-1 下的 右手坐标系.png
        // 由当前 x 轴坐标 - canvas 左侧距离 => 相对于 canvas 原点坐标顶点位置
        // 再减去 二分之一 canvas 宽度, 得到相当于当前 webgl 原点位置(到现在还是二维坐标)
        // 由于相机位置未改变(也没有任何视角变化)
        // 直接由当前获取的相对于 webgl 原点坐标 除以 二分之一 canvas 宽度转化为 三维场景坐标
        // y 轴同理
        // 不过由于 y 轴与 canvas y 轴相反
        // 所以由 二分之一 canvas 高度 减去 相对于 canvas 原点 y 轴坐标
        x = ((x - rect.left) - rect.width / 2) / (rect.width / 2);
        y = (rect.height / 2 - (y - rect.top)) / (rect.height / 2);
        g_points.push({ x, y });

        // 由于 webgl 使用颜色缓冲区
        // 每次在浏览器中成功绘制之后
        // 缓冲区就被清理一次(丢弃上一次绘制)
        // 所以这里再执行一次
        gl.clear(gl.COLOR_BUFFER_BIT);

        for (let item of g_points) {
            gl.vertexAttrib4f(a_Position, item.x, item.y, 0.0, 1.0);
            gl.vertexAttrib1f(a_PointSize, 5);

            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }





    /**
     * 初始化着色器
     * @param {WebGLRenderingContext} gl WebGLRenderingContext
     * @param {String} vertex 顶点着色器代码
     * @param {String} fragment 片元着色器代码
     * @returns {WebGLProgram} 一个 WebGLProgram 对象
     */
    function initShaders(gl, vertex, fragment) {
        // 创建 WebGLShader
        const vertexShader = createShader(gl, vertex, gl.VERTEX_SHADER);
        const fragmentShader = createShader(gl, fragment, gl.FRAGMENT_SHADER);

        // 创建对应的 program 并连接
        // gl.createProgram()
        // 用于创建和初始化一个 WebGLProgram 对象
        const shaderProgram = gl.createProgram();

        // gl.attachShader(program, shader)
        // program: 一个 WebGLProgram 对象
        // shader: 一个类行为片元或顶点的 WebGLShader
        // 负责往 WebGLProgram 添加一个片元或者顶点着色器
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // gl.linkProgram(program)
        // program: 一个 WebGLProgram 对象
        // 链接一个给定的 WebGLProgram 到已附着的顶点着色器和片段着色器
        // 并将着色器代码转化为GPU代码
        gl.linkProgram(shaderProgram);

        // 设置着色器
        // gl.useProgram(program)
        // program: 一个 WebGLProgram 对象
        // 将定义好的 WebGLProgram 对象添加到当前的渲染状态中
        gl.useProgram(shaderProgram);

        return shaderProgram;
    }

    /**
     * 创建 WebGLShader
     * @param {WebGLRenderingContext} gl WebGLRenderingContext
     * @param {String} str 顶点或片元着色器代码
     * @param {number} type 需要创建的着色器类型
     * @returns {WebGLShader} WebGLShader 对象
     */
    function createShader(gl, str, type) {
        // gl.createShader(type)
        // 参数为 gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER 两者中的一个
        // 创建一个 WebGLShader 着色器对象
        let shader = gl.createShader(type);

        // gl.shaderSource(shader, source)
        // shader: 用于设置程序代码的 WebGLShader （着色器对象）
        // source: 包含 GLSL 程序代码片段的字符串
        // 用于设置 WebGLShader 着色器（顶点着色器及片元着色器）的GLSL程序代码
        gl.shaderSource(shader, str);

        // gl.compileShader(shader)
        // shader: 一个片元或顶点着色器 (WebGLShader)
        // 编译一个GLSL着色器，使其成为为二进制数据
        // 然后就可以被 WebGLProgram 对象所使用
        gl.compileShader(shader);

        return shader;
    }
}