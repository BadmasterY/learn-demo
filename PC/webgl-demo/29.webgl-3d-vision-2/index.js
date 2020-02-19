window.onload = () => {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl');

    gl.viewport(0, 0, canvas.width, canvas.height);

    let g_eyeX = 0.2, g_eyeY = 0.25, g_eyeZ = 0.25;

    // 顶点着色器代码
    const vertexShaderSource =
        `
        attribute vec4 a_Position;
        attribute vec4 a_Color;

        uniform mat4 u_ViewMatrix; // 添加视图矩阵
        uniform mat4 u_ProjMatrix; // 添加正投影矩阵

        varying vec4 v_Color;

        void main() {
            gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position; // 设置顶点坐标(正投影矩阵 x 视图矩阵 x 原始坐标)
            v_Color = a_Color;
        }
    `;

    // 片元着色器代码
    const fragmentShaderSource =
        `
        precision mediump float;
        varying vec4 v_Color;
        void main() {
            gl_FragColor = v_Color; // 设置颜色
        }
    `;

    // 初始化 shader
    // 与第一个创建流程、创建方法与 demo start 一致
    const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);

    const count = initVertexBUffers(gl, program);

    // 获取 uniform 变量的存储位置
    const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');

    // 设置视点,观察点,和上方向
    const viewMatrix = new Matrix4();

    document.onkeydown = function(ev) {
        keyDown(ev.keyCode, gl, count);
    }

    draw(gl, count);


    /**
     * 键盘按下触发事件
     * @param {number} keyCode 键盘编码
     * @param {WebGLRenderingContext} gl WebGLRenderingContext
     * @param {number} count 需要绘制的点个数
     * @returns {void} undefined
     */
    function keyDown(keyCode, gl, count) {
        if(keyCode == 38) { // 上
            g_eyeY += 0.01;
        }else if(keyCode == 40) { // 下
            g_eyeY -= 0.01;
        }else if(keyCode == 37){ // 左
            g_eyeX -= 0.01;
        }else if(keyCode == 39) { // 右
            g_eyeX += 0.01;
        }
        else {
            return;
        }

        viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

        // 将视图矩阵传入
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

        draw(gl, count);
    }

    /**
     * 绘制
     * @param {WebGLRenderingContext} gl WebGLRenderingContext
     * @param {number} count 需要绘制的点个数
     */
    function draw(gl, count) {
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        // 绘制点
        gl.drawArrays(gl.TRIANGLES, 0, count);
    }

    /**
     * 初始化buffer
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLProgram} program 
     * @returns {Number} 需要绘制的点个数
     */
    function initVertexBUffers(gl, program) {
        // 获取 attribute 变量的存储位置
        const a_Position = gl.getAttribLocation(program, 'a_Position');
        const a_Color = gl.getAttribLocation(program, 'a_Color');

        // 获取 uniform 变量的存储位置
        const u_ViewMatrix = gl.getUniformLocation(program, 'u_ViewMatrix');
        const u_ProjMatrix = gl.getUniformLocation(program, 'u_ProjMatrix');

        // 设置视点,观察点,和上方向
        const viewMatrix = new Matrix4();
        viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);

        // 设置正投影矩阵
        const projMatrix = new Matrix4();
        projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 5.0);

        // 将视图矩阵传入
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        // 将正投影矩阵传入
        gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

        // 点位置与颜色信息
        const verticesSizes = new Float32Array([
            // 绿色三角形
            0.0, 0.5, -0.4, 0.4, 1.0, 0.4,
            -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
            0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
            // 黄色三角形
            0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
            -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
            0.0, -0.6, -0.2, 1.0, 1.0, 0.4,
            // 蓝色三角形
            0.0, 0.5, 0.0, 0.4, 0.4, 1.0,
            -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
            0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
        ]);

        // 坐标与大小
        const positionSize = 3;
        const colorSize = 3;
        const size = positionSize + colorSize;

        // 获取类型化数组中每个元素所占字节数
        const FSIZE = verticesSizes.BYTES_PER_ELEMENT;

        // 创建点坐标缓冲区, 并设置信息与启用
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

        // 后两个参数:
        // stride: 指定相邻两个顶点间点字节数
        // offset: 指定缓冲区对象中的偏移量(以字节为单位)
        gl.vertexAttribPointer(a_Position, positionSize, gl.FLOAT, false, FSIZE * size, 0);
        gl.vertexAttribPointer(a_Color, colorSize, gl.FLOAT, false, FSIZE * size, FSIZE * positionSize);

        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Color);

        return verticesSizes.length / size;
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