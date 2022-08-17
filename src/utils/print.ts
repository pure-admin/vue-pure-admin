interface PrintFunction {
  extendOptions: Function;
  getStyle: Function;
  setDomHeight: Function;
  toPrint: Function;
}

const Print = function (dom, options?: object): PrintFunction {
  options = options || {};
  // @ts-expect-error
  if (!(this instanceof Print)) return new Print(dom, options);
  this.conf = {
    styleStr: "",
    // Elements that need to dynamically get and set the height
    setDomHeightArr: [],
    // Echart dom List
    echartDomArr: [],
    // Callback before printing
    printBeforeFn: null,
    // Callback after printing
    printDoneCallBack: null
  };
  for (const key in this.conf) {
    // eslint-disable-next-line no-prototype-builtins
    if (key && options.hasOwnProperty(key)) {
      this.conf[key] = options[key];
    }
  }
  if (typeof dom === "string") {
    this.dom = document.querySelector(dom);
  } else {
    this.dom = this.isDOM(dom) ? dom : dom.$el;
  }
  if (this.conf.setDomHeightArr && this.conf.setDomHeightArr.length) {
    this.setDomHeight(this.conf.setDomHeightArr);
  }
  this.init();
};

Print.prototype = {
  /**
   * init
   */
  init: function (): void {
    const content = this.getStyle() + this.getHtml();
    this.writeIframe(content);
  },
  /**
   * Configuration property extension
   * @param {Object} obj
   * @param {Object} obj2
   */
  extendOptions: function <T>(obj, obj2: T): T {
    for (const k in obj2) {
      obj[k] = obj2[k];
    }
    return obj;
  },
  /**
    Copy all styles of the original page
  */
  getStyle: function (): string {
    let str = "";
    const styles: NodeListOf<Element> = document.querySelectorAll("style,link");
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }
    str += `<style>.no-print{display:none;}${this.conf.styleStr}</style>`;
    return str;
  },
  // form assignment
  getHtml: function (): Element {
    const inputs = document.querySelectorAll("input");
    const selects = document.querySelectorAll("select");
    const textareas = document.querySelectorAll("textarea");
    for (let k = 0; k < inputs.length; k++) {
      if (inputs[k].type == "checkbox" || inputs[k].type == "radio") {
        if (inputs[k].checked == true) {
          inputs[k].setAttribute("checked", "checked");
        } else {
          inputs[k].removeAttribute("checked");
        }
      } else if (inputs[k].type == "text") {
        inputs[k].setAttribute("value", inputs[k].value);
      } else {
        inputs[k].setAttribute("value", inputs[k].value);
      }
    }

    for (let k2 = 0; k2 < textareas.length; k2++) {
      if (textareas[k2].type == "textarea") {
        textareas[k2].innerHTML = textareas[k2].value;
      }
    }

    for (let k3 = 0; k3 < selects.length; k3++) {
      if (selects[k3].type == "select-one") {
        const child = selects[k3].children;
        for (const i in child) {
          if (child[i].tagName == "OPTION") {
            if ((child[i] as any).selected == true) {
              child[i].setAttribute("selected", "selected");
            } else {
              child[i].removeAttribute("selected");
            }
          }
        }
      }
    }

    return this.dom.outerHTML;
  },
  /**
    create iframe
  */
  writeIframe: function (content) {
    let w: Document | Window;
    let doc: Document;
    const iframe: HTMLIFrameElement = document.createElement("iframe");
    const f: HTMLIFrameElement = document.body.appendChild(iframe);
    iframe.id = "myIframe";
    iframe.setAttribute(
      "style",
      "position:absolute;width:0;height:0;top:-10px;left:-10px;"
    );
    // eslint-disable-next-line prefer-const
    w = f.contentWindow || f.contentDocument;
    // eslint-disable-next-line prefer-const
    doc = f.contentDocument || f.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    iframe.onload = function (): void {
      // Before popping, callback
      if (_this.conf.printBeforeFn) {
        _this.conf.printBeforeFn({ doc });
      }

      _this.drawEchartImg(doc).then(() => {
        _this.toPrint(w);
        setTimeout(function () {
          document.body.removeChild(iframe);
          // After popup, callback
          if (_this.conf.printDoneCallBack) {
            _this.conf.printDoneCallBack();
          }
        }, 100);
      });
    };
  },
  /**
   * echarts printing
   * @param {Object} doc iframe window
   */
  drawEchartImg(doc): Promise<void> {
    return new Promise<void>(resolve => {
      if (this.conf.echartDomArr && this.conf.echartDomArr.length > 0) {
        this.conf.echartDomArr.forEach(e => {
          const dom = doc.querySelector("#" + e.$el.id);
          const img = new Image();
          const w = dom.offsetWidth + "px";
          const H = dom.offsetHeight + "px";

          img.style.width = w;
          img.style.height = H;
          img.src = e.imgSrc;
          dom.innerHTML = "";
          dom.appendChild(img);
        });
      }
      resolve();
    });
  },
  /**
    Print
  */
  toPrint: function (frameWindow): void {
    try {
      setTimeout(function () {
        frameWindow.focus();
        try {
          if (!frameWindow.document.execCommand("print", false, null)) {
            frameWindow.print();
          }
        } catch (e) {
          frameWindow.print();
        }
        frameWindow.close();
      }, 10);
    } catch (err) {
      console.error(err);
    }
  },
  isDOM:
    typeof HTMLElement === "object"
      ? function (obj) {
          return obj instanceof HTMLElement;
        }
      : function (obj) {
          return (
            obj &&
            typeof obj === "object" &&
            obj.nodeType === 1 &&
            typeof obj.nodeName === "string"
          );
        },
  /**
   * Set the height of the specified dom element by getting the existing height of the dom element and setting
   * @param {Array} arr
   */
  setDomHeight(arr) {
    if (arr && arr.length) {
      arr.forEach(name => {
        const domArr = document.querySelectorAll(name);
        domArr.forEach(dom => {
          dom.style.height = dom.offsetHeight + "px";
        });
      });
    }
  }
};

export default Print;
