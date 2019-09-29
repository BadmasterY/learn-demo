### Transition
transition 属性设置元素当过渡效果，四个简写属性为：

- **transition-property**: 规定应用过渡效果的 CSS 属性名
- **transition-duration**: 规定完成过渡效果需要花费的时间,属性值为浮点数,单位可以是 s,也可以是 ms
- **transition-timing-function**: 规定过渡效果的速度曲线
  - **linea**: 规定以匀速进行过渡
  - **ease**: 规定逐渐变慢进行过渡,等同于贝济埃曲线(0.25, 0.1, 0.25, 1.0)
  - **ease-in**: 规定慢速开始,等同于贝济埃曲线(0.42, 0, 1.0, 1.0)
  - **ease-out**: 规定慢速结束,等同于贝济埃曲线(0, 0, 0.58, 1.0)
  - **cubic-bezier(n, n, n, n)**: 允许自定义贝济埃曲线实现过渡效果
- **transition-delay**: 规定过渡动画的延迟时间,单位可以是 s,也可以是 ms