import { RouteReuseStrategy, DefaultUrlSerializer, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class SimpleReuseStrategy implements RouteReuseStrategy {

    public static handlers: { [key: string]: DetachedRouteHandle } = {};

    private static waitDelete: string;

    /** 表示对所有路由允许复用 如果你有路由不想利用可以在这加一些业务逻辑判断 */
    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
        console.debug('===shouldDetach-route', route);
        if (route.data.isPage) {
            return true;
        } else {
            return false;
        }
    }

    /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
    public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        console.debug('===store-route', route, 'store-handle', handle);
        SimpleReuseStrategy.handlers[this.getRouteUrl(route)] = handle;
    }

    /** 若 path 在缓存中有的都认为允许还原路由 */
    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        console.debug('===shouldAttach-route', route);
        return !!SimpleReuseStrategy.handlers[this.getRouteUrl(route)];
    }

    /** 从缓存中获取快照，若无则返回null */
    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        console.debug('===retrieve-route', route);
        if (!route.routeConfig) {
            return null;
        }

        return SimpleReuseStrategy.handlers[this.getRouteUrl(route)];
    }

    /** 进入路由触发，判断是否同一路由 */
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        console.debug('===shouldReuseRoute-future', future, 'shouldReuseRoute-cur', curr);
        return future.routeConfig === curr.routeConfig &&
            JSON.stringify(future.params) == JSON.stringify(curr.params);
    }

    private getRouteUrl(route: ActivatedRouteSnapshot) {
        var path = route['_routerState'].url.replace(/\//g, '_');
        console.debug('---getRouteUrl-path', path);
        return path;
    }

    public static deleteRouteSnapshot(name: string): void {
        if (SimpleReuseStrategy.handlers[name]) {
            delete SimpleReuseStrategy.handlers[name];
        } else {
            SimpleReuseStrategy.waitDelete = name;
        }
    }
}
