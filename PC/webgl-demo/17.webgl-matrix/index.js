window.onload = () => {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl');

    // 顶点着色器代码
    // pointSize 只在绘制点的时候有效
    const vertexShaderSource =
        `
        attribute vec4 a_Position;
        uniform mat4 u_xformMatrix; // 变换矩阵
        void main() {
            gl_Position = u_xformMatrix * a_Position; // 通过矩形乘法获得, 注意顺序
        }
    `;

    // 片元着色器代码
    const fragmentShaderSource =
        `
        precision mediump float;
        uniform vec4 u_FragColor;
        void main() {
            gl_FragColor = u_FragColor; // 设置颜色
        }
    `;

    // 初始化 shader
    // 与第一个创建流程、创建方法与 demo start 一致
    const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);

    // 初始化缓冲区
    const n = initVertexBUffers(gl, program);

    // 清空 canvas
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

    /**
     * 初始化缓冲区
     * @param {WebGLRenderingContext} gl WebGLRenderingContext
     * @param {WebGLProgram} program WebGLProgram
     * @returns {Number} 点的个数
     */
    function initVertexBUffers(gl, program) {
        // 获取 attribute 变量的存储位置
        const a_Position = gl.getAttribLocation(program, 'a_Position');
        const u_xformMatrix = gl.getUniformLocation(program, 'u_xformMatrix');
        const u_FragColor = gl.getUniformLocation(program, 'u_FragColor');

        const pointArr = [
            0, 0.1,
            -0.1, -0.1,
            0.1, -0.1,
        ];
        const size = 2; // 一组坐标由几位组成

        // 旋转 45 度
        // 右手准则 正向旋转
        const ANGLE = 45;

        const radian = Math.PI * ANGLE / 180.0;
        const sin = Math.sin(radian);
        const cos = Math.cos(radian);

        // 旋转矩阵
        const rotationMatrix = new Float32Array([
            cos, sin, 0.0, 0.0,
            -sin, cos, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ]);

        // 偏移量
        const Tx = 0.5, Ty = 0.5, Tz = 0.0;

        // 平移矩阵
        const translateMatrix = new Float32Array([
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            Tx, Ty, Tz, 1.0,
        ]);

        // 缩放
        // 整体扩大两倍
        const Sx = 1.0, Sy = 1.0, Sz = 1.0;

        // 缩放
        // webgl 中矩阵是列主序的
        // 竖着看是 x, y, z, w
        const scaleMatrix = new Float32Array([
            Sx, 0.0, 0.0, 0.0,
            0.0, Sy, 0.0, 0.0,
            0.0, 0.0, Sz, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ]);

        const result = multiply(scaleMatrix ,multiply(translateMatrix, rotationMatrix))

        // 点信息
        const vertics = new Float32Array(pointArr);

        // 使用缓冲区绑定多个点需要遵循以下五个步骤
        // 1.创建缓冲区对象(gl.createBuffer)
        // 2.绑定缓冲区对象(gl.bindBuffer)
        // 3.将数据写入缓冲区(gl.bufferData)
        // 4.将缓冲区对象分配给一个 attribute 变量 (gl.vertexAttribPointer)
        // 5.开启 attribute 变量(gl.enableVertexAtrribArray)

        // 创建缓冲区对象
        const vertexBuffer = gl.createBuffer();

        // 将缓冲区绑定至目标
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // 向缓冲区写入数据
        gl.bufferData(gl.ARRAY_BUFFER, vertics, gl.STATIC_DRAW);

        // 将缓冲区对象分配给 a_Position
        gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0, 0);

        // 设置变换矩阵
        gl.uniformMatrix4fv(u_xformMatrix, false, result);
        // 三角形颜色随机
        gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1.0);

        // 连接 a_Position 变量与分配给它的缓冲区对象
        // 缓冲区对象需要调用这个方法
        gl.enableVertexAttribArray(a_Position);

        // 返回需要绘制的点个数
        return pointArr.length / size;
    }

    /**
     * 4x4矩阵乘法
     * @param {Float32Array} left 
     * @param {Float32Array} right 
     * @returns {Float32Array} 乘算结果
     */
    function multiply(left, right) {
        let result = new Float32Array(16); // 长度为16  4x4

        if(left.length != 16 || right.length != 16) return null;

        for (i = 0; i < 4; i++) {
            lefti0=left[i];  lefti1=left[i+4];  lefti2=left[i+8];  lefti3=left[i+12];
            result[i]    = lefti0 * right[0]  + lefti1 * right[1]  + lefti2 * right[2]  + lefti3 * right[3];
            result[i+4]  = lefti0 * right[4]  + lefti1 * right[5]  + lefti2 * right[6]  + lefti3 * right[7];
            result[i+8]  = lefti0 * right[8]  + lefti1 * right[9]  + lefti2 * right[10] + lefti3 * right[11];
            result[i+12] = lefti0 * right[12] + lefti1 * right[13] + lefti2 * right[14] + lefti3 * right[15];
          }

        return result;
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

        // 创建 program
        const shaderProgram = gl.createProgram();

        // 负责往 WebGLProgram 添加一个片元或者顶点着色器
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // 连接 program
        gl.linkProgram(shaderProgram);

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
        // 创建一个 WebGLShader 着色器对象
        let shader = gl.createShader(type);

        // 用于设置 WebGLShader 着色器（顶点着色器及片元着色器）的GLSL程序代码
        gl.shaderSource(shader, str);

        // 编译一个GLSL着色器，使其成为为二进制数据
        // 然后就可以被 WebGLProgram 对象所使用
        gl.compileShader(shader);

        return shader;
    }
}