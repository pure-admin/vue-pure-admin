interface ProxyLoader {
  loadCss(src: string): any;
  loadScript(src: string): Promise<any>;
  loadScriptConcurrent(src: Array<string>): Promise<any>;
}

class loaderProxy implements ProxyLoader {
  constructor() {}

  protected scriptLoaderCache: Array<string> = [];

  public loadCss = (src: string): any => {
    const element: HTMLLinkElement = document.createElement("link");
    element.rel = "stylesheet";
    element.href = src;
    document.body.appendChild(element);
  };

  public loadScript = async (src: string): Promise<any> => {
    if (this.scriptLoaderCache.includes(src)) {
      return src;
    } else {
      const element: HTMLScriptElement = document.createElement("script");
      element.src = src;
      document.body.appendChild(element);
      element.onload = () => {
        return this.scriptLoaderCache.push(src);
      };
    }
  };

  public loadScriptConcurrent = async (
    srcList: Array<string>
  ): Promise<any> => {
    if (Array.isArray(srcList)) {
      const len: number = srcList.length;
      if (len > 0) {
        let count = 0;
        srcList.map(src => {
          if (src) {
            this.loadScript(src).then(() => {
              count++;
              if (count === len) {
                return;
              }
            });
          }
        });
      }
    }
  };
}

export const loader = new loaderProxy();
