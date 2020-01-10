window.onload = () => {
    // 1. 2d
    // 获取 canvas
    const canvas_1 = document.getElementById('index');
    // 获取绘制二维图形的绘图上下文
    const ctx = canvas_1.getContext('2d');
    // 填充颜色 - rgba(0, 0, 255, 1.0);
    ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';
    // 绘制矩形
    // ctx.fillRect(x, y, width, height)
    // x: x 轴坐标, x 轴起始位置
    // y: y 轴坐标, y 轴起始位置
    // width: 绘制的宽度
    // height: 绘制的高度
    ctx.fillRect(195, 105, 150, 150);

    // 2. 3d
    const canvas_2 = document.getElementById('webgl');
    // 获取绘制三维图形的绘图上下文
    const gl = canvas_2.getContext('webgl');
    // gl.clearColor(r, g, b, a);
    // 用于设置清空颜色缓冲时的颜色值
    // 该颜色为调用 clear 方法时使用的颜色
    // 该颜色值一直存储到下一次调用 clearColor
    // 也就是说, 一次设置可以多次使用
    gl.clearColor(0, 0, 0, 1.0);
    // 清空 canvas
    // 可选值：
    // gl.COLOR_BUFFER_BIT: 指定颜色缓存
    // 相关函数 gl.clearColor(r, g, b, a); 默认: (0.0, 0.0, 0.0, 0.0)
    // gl.DEPTH_BUFEER_BIT: 指定深度缓冲区
    // 相关函数 gl.clearDepth(depth); 默认: 1.0
    // gl.STENCIL_BUFFER_BIT: 指定模版缓冲区
    // 相关函数 gl.clearStencli(s); 默认 0
    gl.clear(gl.COLOR_BUFFER_BIT); // 这里只清空颜色缓存
}