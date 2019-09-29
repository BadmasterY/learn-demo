### 定位-位置监听
使用高德地图,相关 API 参见[官网](https://lbs.amap.com/api/javascript-api)。

使用物理定位进行监测,详细 API 查看[使用物理定位](https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation/Using_geolocation)。

**地理位置 API 通过 navigator.geolocation 提供。**同时,此功能仅在安全上下文中(https)、部分或所有支持浏览器中可用。非 https 环境可能存在延迟等问题。

#### getCurrentPosition(successCallback, errorCallback, options)
默认情况下，getCurrentPosition() 会尽快返回一个低精度结果，这在不关心准确度只关心快速获取结果的情况下很有用。

- **successCallback(position)**: 获取地理信息成功的回调函数,必需
  - **position.coords**: 地理定位信息
  - **position.coords.latitude**: 十进制的纬度估值,范围为[-90, 90]
  - **position.coords.longitude**: 十进制的经度估值,范围为[-180, 180]
  - **position.coords.altitude**: 海拔,单位米
  - **position.coords.accuracy**: 经纬度的精度,单位为米,该值越小,定位越精准
  - **position.coords.altitudeAccuracy**: 海拔的精度,单位为米,该值越小,定位越精准
  - **position.coords.heading**: 前进的方向,度数表示,相对正北方向设备以顺时针方向运动计算的当前方向
  - **position.coords.speed**: 前进的速度,单位为m/s
  - **position.timestamp**: 成功响应时的时间戳
- **errorCallback(error)**: 获取定位失败时的回调函数
  - **error**: 表示当定位设备位置时发生错误的原因
  - **error.code**: 只读,返回无符号的、简短的错误码
  - **error.message**: 只读,返回一个开发者可以理解的 DOMString 来描述错误的详细信息
- **options**: 选项，此选项含有3种可以设置的属性
  - **enableHighAccuracy**: 默认:false, 是否启用高精度定位,这是一个布尔值
  - **timeout**: 默认: Infinity, 设备必须在多长时间(单位ms)内返回一个位置
  - **maximumAge**: 默认: 0, 地理信息的最大缓存时间(单位ms)

#### watchPosition(successCallback, errorCallback, options)
用于注册监听器，在设备的地理位置发生改变的时候自动被调用。参数信息于 getCurrentPosition 一致。

- **return**: id,定时器ID,用于在不需要的时候清除定时器
  
#### clearWatch(id)
用于注销 watchPosition 注册的定时器