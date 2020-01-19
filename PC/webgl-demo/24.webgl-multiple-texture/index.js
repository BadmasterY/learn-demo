window.onload = () => {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl');

    gl.viewport(0, 0, canvas.width, canvas.height);

    // 顶点着色器代码
    const vertexShaderSource =
        `
        attribute vec4 a_Position;
        attribute vec2 a_TexCoord; // 贴图信息

        varying vec2 v_TexCoord; // 贴图

        void main() {
            gl_Position = a_Position; // 设置顶点坐标
            v_TexCoord = a_TexCoord;
        }
    `;

    // 片元着色器代码
    const fragmentShaderSource =
        `
        precision mediump float;
        uniform sampler2D u_Sampler0;
        uniform sampler2D u_Sampler1;

        varying vec2 v_TexCoord;
        void main() {
            vec4 color0 = texture2D(u_Sampler0, v_TexCoord);
            vec4 color1 = texture2D(u_Sampler1, v_TexCoord);
            gl_FragColor = color0 * color1; // 设置贴图
        }
    `;

    // 初始化 shader
    // 与第一个创建流程、创建方法与 demo start 一致
    const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);

    const count = initVertexBUffers(gl, program);


    new Promise((resolve, reject) => {
        initTextures(gl, program, resolve);
    }).then(data => {
        console.log(data);
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        // 绘制
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
    }).catch(err => console.error(err));


    /**
     * 初始化buffer
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLProgram} program 
     * @returns {Number} 需要绘制的点个数
     */
    function initVertexBUffers(gl, program) {
        // 获取 attribute 变量的存储位置
        const a_Position = gl.getAttribLocation(program, 'a_Position');
        const a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');

        // 点位置与纹理坐标
        const verticesSizes = new Float32Array([
            -0.5, 0.5, 0.0, 1.0,
            -0.5, -0.5, 0.0, 0.0,
            0.5, 0.5, 1.0, 1.0,
            0.5, -0.5, 1.0, 0.0,
        ]);

        // 坐标与大小
        const positionSize = 2;
        const textureSize = 2;
        const size = positionSize + textureSize;

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
        gl.vertexAttribPointer(a_TexCoord, textureSize, gl.FLOAT, false, FSIZE * size, FSIZE * positionSize);

        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_TexCoord);

        return verticesSizes.length / size;
    }

    /**
     * 初始化贴图
     * @param {WebGLRenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {Function} resolve promise resolve function
     */
    function initTextures(gl, program, resolve) {
        const image0 = new Image();
        const image1 = new Image();

        let promise0, promise1;

        image0.onload = function () {
            new Promise(resolve => {
                loadTexture(gl, 0, program, image0, resolve);
            }).then(data => {
                console.log(data);

                promise0 = true;
                if(promise0 && promise1) resolve('loaded...');
            }).catch(err => console.error(err));
        };
        image0.src = './1.jpg';
        image1.onload = function () {
            new Promise(resolve => {
                loadTexture(gl, 1, program, image1, resolve);
            }).then(data => {
                console.log(data);

                promise1 = true;
                if(promise0 && promise1) resolve('loaded...');
            }).catch(err => console.error(err));
        };
        image1.src = './2.gif';
    }

    /**
     * 装载贴图
     * @param {WebGLRenderingContext} gl
     * @param {Number} count 
     * @param {WebGLProgram} program 
     * @param {HTMLImageElement} image html image element
     * @param {Function} resolve promise resolve function
     */
    function loadTexture(gl, count, program, image, resolve) {
        // 创建纹理
        const texture = gl.createTexture();

        const u_Sampler = gl.getUniformLocation(program, `u_Sampler${count}`);

        // 图像预处理的函数
        // gl.pixelStorei(pname, param)
        // pname: 处理方式
        // param: 处理方式的参数
        // https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/pixelStorei
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // 对纹理图像进行y轴反转, webgl坐标系 y 轴正好与浏览器相反

        // 激活指定纹理单元
        // gl.activeTexture(texture)
        // texture: 需要激活的纹理单元 值为: gl.TEXTURE[n]  n: [0, gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1]
        gl.activeTexture(gl[`TEXTURE${count}`]); // 开启纹理单元

        // 绑定纹理
        // gl.bindTexture(target, texture)
        // target: 指定绑定目标;
        //         gl.TEXTURE_2D: 二维纹理
        //         gl.TEXTURE_CUBE_MAP: 立方体纹理映射
        // texture: 要绑定的 WebGLTexture 对象
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // 用于设置纹理参数
        // gl.texParameter[fi]
        // gl.texParameterf(target, pname, GLfloat param)
        // gl.texParameteri(target, pname, GLint param)
        // target: 指定绑定目标;
        //         gl.TEXTURE_2D: 二维纹理
        //         gl.TEXTURE_CUBE_MAP: 立方体纹理映射
        // pname: 指定要设置的纹理参数
        // param: 设置 pname 的参数值
        // https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texParameter
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // 这里为 纹理缩小滤波器 gl.TEXTURE_MIN_FILTER

        // 配置二维纹理图像
        // gl.texImage2D(target, level, internalformat, format, type, pixels)
        // target: 纹理的绑定对象.可能的值:
        //         gl.TEXTURE_2D: 二维纹理贴图.
        //         gl.TEXTURE_CUBE_MAP_POSITIVE_X:立方体映射纹理的正X面。
        //         gl.TEXTURE_CUBE_MAP_NEGATIVE_X: 立方体映射纹理的负X面。
        //         gl.TEXTURE_CUBE_MAP_POSITIVE_Y: 立方体映射纹理的正Y面。
        //         gl.TEXTURE_CUBE_MAP_NEGATIVE_Y: 立方体映射纹理的负Y面。
        //         gl.TEXTURE_CUBE_MAP_POSITIVE_Z: 立方体映射纹理的正Z面。
        //         gl.TEXTURE_CUBE_MAP_NEGATIVE_Z: 立方体映射纹理的负Z面。
        // level: 指定详细级别。 0级为基本图像等级, n级为第n个金字塔简化级
        // internalformat: 指定纹理中的颜色组件。
        // format: 指定texel数据格式。在 WebGL 1中，它必须与 internalformat 相同。
        // type: 指定texel数据的数据类型。gl.UNSIGNED_BYTE:  gl.RGBA每个通道8位/1字节
        // pixels: 下列对象之一可以用作纹理的像素源:
        //         ArrayBufferView,
        //             Uint8Array  如果 type 是 gl.UNSIGNED_BYTE则必须使用
        //             Uint16Array 如果 type 是 gl.UNSIGNED_SHORT_5_6_5, gl.UNSIGNED_SHORT_4_4_4_4, gl.UNSIGNED_SHORT_5_5_5_1, gl.UNSIGNED_SHORT 或ext.HALF_FLOAT_OES则必须使用
        //                 Uint32Array 如果type 是 gl.UNSIGNED_INT 或ext.UNSIGNED_INT_24_8_WEBGL则必须使用
        //                 Float32Array 如果type 是 gl.FLOAT则必须使用
        //         ImageData,
        //         HTMLImageElement,
        //         HTMLCanvasElement,
        //         HTMLVideoElement,
        //         ImageBitmap.
        // https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/texImage2D
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        gl.uniform1i(u_Sampler, count);

        resolve(`${count} is ok...`);
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