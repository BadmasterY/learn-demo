## webgl-3d-cube
之前的所有例子使用 `gl.drawArrays()` 进行绘制, 这次使用 `gl.drawElements()`。

### 1. gl.drawElements(mode, count, type, offset)
执行着色器, 按照 `mode` 参数指定的方式, 根据绑定到 `gl.ELEMNET_ARRAY_BUFFER` 的缓冲区中的顶点索引值绘制图形。

#### 参数:
`mode`: 
指定要绘制的图元类型: 参照 [10.webgl-triangle](https://github.com/BadmasterY/learn-demo/blob/master/PC/webgl-demo/10.webgl-triangle/README.md) 中 `gl.drawArrays()` 的 `mode` 参数。

`count`: 
指定绘制顶点的个数(整数型) - **顶点着色器执行次数**。

`type`: 
指定索引值类型:
- `gl.UNSIGNED_BYTE`
- `gl.UNSIGNED_SHORT`

`offset`:
指定索引数组中开始绘制的位置, 以**字节**为单位。

在调用 `gl.drawElements()` 时, `WebGL` 首先从绑定到 `gl.ELEMENT_ARRAY_BUFFER` 的缓冲区中获取顶点的**索引值**, 然后根据该索引值, 从绑定到 `gl.ARRAY_BUFFER` 的缓冲区中获取顶点**坐标**、**颜色**等信息, 然后传递给 `atrribute` 变量并执行顶点着色器。