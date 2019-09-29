#### 路由
根据不同的url地址，展示不同的页面或者更新页面局部视图

##### 后端路由 vs 前端路由
###### 后端路由:
- 浏览器发出请求
- 服务器监听到80端口（或443）有请求过来，并解析url路径
- 根据服务器的路由配置，返回相应信息（可以是 html 字串，也可以是 json 数据，图片等）
- 浏览器根据数据包的Content-Type来决定如何解析数据

###### 前端路由:
- 根据不同的hash展示对应的页面
- 监听hash值的改变
- 保存当前url的请求状态或者参数(比如页面刷新和分享链接，别人可以获取同样的内容)
- 可以实现浏览器的前进后退功能

##### 前端路由的实现方式
- [hash](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/location)
- [history](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/history) | [history API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)

##### 两种实现方式比较:
- **hash**: 兼容性比较好，url 比较丑陋(是真的丑,N 年前的 VUE 就是这样)，不能使用浏览器栈操作前进后退
- **history**: 比较直观，需要服务器端配合，用户体验好，响应快，不需要每次发送服务器请求，通过操作浏览器历史栈完成页面跳转，低版本浏览器不支持H5特性，建议使用 hash


##### 参考
- [Web开发中路由实现原理](https://segmentfault.com/a/1190000019606192)
- [前端路由的前世今生及实现原理](https://segmentfault.com/a/1190000011967786)
- MDN文档