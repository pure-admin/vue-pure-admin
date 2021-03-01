import * as Koa from 'koa';

declare function KoaProxies(path: string, options: KoaProxies.IKoaProxiesOptions): Koa.Middleware;

declare namespace KoaProxies {
  interface IKoaProxiesOptions {
    target: string;
    changeOrigin?: boolean;
    logs?: boolean | ((ctx: Koa.Context, target: string) => void);
    agent?: any;
    rewrite?: (path: string) => string;
  }
}

export = KoaProxies;
