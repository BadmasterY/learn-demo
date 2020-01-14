window.onload = () => {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl');

    // 顶点着色器代码
    // pointSize 只在绘制点的时候有效
    const vertexShaderSource =
        `
        // x' = x cosβ - y sinβ
        // y' = x sinβ + y cosβ
        attribute vec4 a_Position;
        uniform float u_CosB, u_SinB; // 旋转角度的 sin cos 值
        void main() {
            // 经由公式得出
            gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
            gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
            gl_Position.z = a_Position.z;
            gl_Position.w = a_Position.w;
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
        const u_SinB = gl.getUniformLocation(program, 'u_SinB');
        const u_CosB = gl.getUniformLocation(program, 'u_CosB');
        const u_FragColor = gl.getUniformLocation(program, 'u_FragColor');

        const arr = [
            0, 0.5,
            -0.5, -0.5,
            0.5, -0.5,
        ];
        const size = 2; // 一组坐标由几位组成

        const ANGLE = 90; // 旋转90
        const radian = Math.PI * ANGLE / 180.0; // 转化为弧度制
        const sinB = Math.sin(radian);
        const cosB = Math.cos(radian);

        // 点信息
        const vertics = new Float32Array(arr);

        // 使用缓冲区绑定多个点需要遵循以下五个步骤
        // 1.创建缓冲区对象(gl.createBuffer)
        // 2.绑定缓冲区对象(gl.bindBuffer)
        // 3.将数据写入缓冲区(gl.bufferData)
        // 4.将缓冲区对象分配给一个 attribute 变量 (gl.vertexAttribPointer)
        // 5.开启 attribute 变量(gl.enableVertexAtrribArray)

        // 创建缓冲区对象
        const vertexBuffer = gl.createBuffer();

        // 将缓冲区绑定至目标
        // gl.bindBuffer(target, buffer)
        // target: 可能值为:
        //         gl.ARRAY_BUFFER 包含顶点属性的 Buffer, 如顶点坐标, 纹理坐标数据或顶点颜色数据
        //         gl.ELEMENT_ARRAY_BUFFER 用于元素索引的 buffer
        // buffer: 
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // 向缓冲区写入数据
        // gl.bufferData(target, size|ArrayBuffer srcData|ArrayBufferView srcData, usage)
        // targe: 指定 Buffer 绑定目标, 可取以下值:
        //        gl.ARRY_BUFFER 包含顶点属性的 Buffer, 如顶点坐标, 纹理坐标数据和顶点颜色数据
        //        gl.ELEMENT_ARRAY_BUFFER 用于元素索引的 Buffer
        // size: 设置 Buffer 对象的数据存储大小
        // ArrayBuffer srcData: ArrayBuffer 类型的数组对象, 被复制到 Buffer 数据缓冲区
        // ArrayBufferView srcData: ArrayBufferView 类型数组对象, 被复制到 Buffer 数据缓冲区
        // usage: 指定数据存储区的使用方法。可取以下值:
        //        gl.STATIC_DRAW 缓冲区的内容可能经常使用, 而不会经常更改; 内容被写入缓冲区, 但不被读取
        //        gl.DYNAMIC_DRAW 缓冲区的内容可能经常使用, 且经常更改; 内容被写入缓冲区, 但不被读取
        //        gl.STREAM_DRAW 缓冲区的内容可能不会经常使用; 内容写入缓冲区, 但不被读取
        gl.bufferData(gl.ARRAY_BUFFER, vertics, gl.STATIC_DRAW);

        // 将缓冲区对象分配给 a_Position
        // gl.vertexAttribPointer(index, size, type, normalized, stride, offset)
        // index: 指定要修改的顶点属性的索引
        // size: 指定每个顶点属性的组成数量, 必须为 1,2,3或4
        // type: 指定数组内每个成员的类型
        // normalized: 转化为浮点数时, 是否将整数数值归一化到一定范围[0,1],[-1,1]
        // stride: 以字节为单位指定连续顶点属性开始之间的偏移量(即数组中一行长度)
        // offset: 顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数
        gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0, 0);

        // 设置 sin cos
        gl.uniform1f(u_SinB, sinB);
        gl.uniform1f(u_CosB, cosB);
        // 三角形颜色随机
        gl.uniform4f(u_FragColor, Math.random(), Math.random(), Math.random(), 1.0);

        // 连接 a_Position 变量与分配给它的缓冲区对象
        // 缓冲区对象需要调用这个方法
        gl.enableVertexAttribArray(a_Position);

        // 返回需要绘制的点个数
        return arr.length / size;
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