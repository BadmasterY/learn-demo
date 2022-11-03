# AngularRouteCache
由 `@angular/cli@14.2.8` 初始化的 `angular demo`

## RouteReuseStrategy
```ts
abstract  class  RouteReuseStrategy {
  // 判断是否复用路由
  abstract  shouldReuseRoute(future:  ActivatedRouteSnapshot, curr:  ActivatedRouteSnapshot): boolean
  // 存储路由快照&组件当前实例对象
  abstract  store(route:  ActivatedRouteSnapshot, handle:  DetachedRouteHandle):  void
  // 判断是否允许还原路由对象及其子对象
  abstract  shouldAttach(route:  ActivatedRouteSnapshot): boolean
  // 获取实例对象，决定是否实例化还是使用缓存
  abstract  retrieve(route:  ActivatedRouteSnapshot):  DetachedRouteHandle  |  null
  // 判断路由是否允许复用
  abstract  shouldDetach(route:  ActivatedRouteSnapshot): boolean
}
```

### 参考文章
[解析Angular路由组件缓存复用和实现问题](https://www.jianshu.com/p/caade8ad46fa)
[使用 Angular RouteReuseStrategy 缓存（路由）组件的实例代码](https://www.yisu.com/zixun/158120.html)