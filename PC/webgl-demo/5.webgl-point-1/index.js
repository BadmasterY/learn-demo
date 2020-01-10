window.onload = () => {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl');

    // 顶点着色器代码
    const vertexShaderSource =
        `
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
            gl_Position = vec4(0.0, 0.5, 0.0, 1.0); // 设置顶点坐标
            gl_PointSize = 10.0; // 设置点的尺寸(像素数)
        }
    `;

    // 片元着色器代码
    const fragmentShaderSource =
        `
        void main() {
            // gl_FragColor 为片元着色器唯一内置变量
            // 控制像素在屏幕上的最终颜色, 类型 vec4
            // 对应 rgba
            // gl_FragColor = vec4(1.0, 0, 0, 1.0); // 设置颜色
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // 设置颜色
        }
    `;

    // 初始化 shader
    // 与第一个创建流程、创建方法与 demo start 一致
    initShaders(gl, vertexShaderSource, fragmentShaderSource);

    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制一个点
    gl.drawArrays(gl.POINTS, 0, 1);





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