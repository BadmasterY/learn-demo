import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

/**
 * 路由拦截器
 */
export class RouterService implements RouteReuseStrategy {
  constructor() {}

  public static handlers: { [key: string]: DetachedRouteHandle | null } = {};

  /** 使用route的path作为快照的key */
  getRouteUrl(route: ActivatedRouteSnapshot) {
    const path = (route as any)['_routerState'].url.replace(/\//g, '_');
    return path;
  }

  /**
   * 判断是否复用路由
   * @desction 会进入两次, 第一次入参路径为空
   */
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    console.log('shouldReuseRoute: ', future, curr);

    return (
      future.routeConfig === curr.routeConfig &&
      JSON.stringify(future.params) === JSON.stringify(curr.params)
    );
  }

  // 从缓存读取cached route
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    console.log('retrieve: ', route);

    return RouterService.handlers[this.getRouteUrl(route)] || null;
  }

  // 路由离开时调用, 返回 true 调用 store
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    console.log('shouldDetach: ', route);
    if (route.routeConfig?.path !== 'login') {
      return false;
    }
    return true;
  }

  // 存储路由快照&组件当前实例对象
  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | null
  ): void {
    console.log('store: ', route, handle);

    RouterService.handlers[this.getRouteUrl(route)] = handle;
  }

  /**
  * 路由被导航 如果此方法返回 true 则触发 retrieve 方法 
  * 
  * 如果返回 false 这个组件将会被重新创建
  */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    console.log('shouldAttach: ', route);

    return !!RouterService.handlers[this.getRouteUrl(route)];
  }
}
