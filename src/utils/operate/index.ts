export const hasClass = (ele: RefType<any>, cls: string): any => {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
};

export const addClass = (
  ele: RefType<any>,
  cls: string,
  extracls?: string
): any => {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
  if (extracls) {
    if (!hasClass(ele, extracls)) ele.className += " " + extracls;
  }
};

export const removeClass = (
  ele: RefType<any>,
  cls: string,
  extracls?: string
): any => {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ").trim();
  }
  if (extracls) {
    if (hasClass(ele, extracls)) {
      const regs = new RegExp("(\\s|^)" + extracls + "(\\s|$)");
      ele.className = ele.className.replace(regs, " ").trim();
    }
  }
};

export const toggleClass = (
  flag: boolean,
  clsName: string,
  target?: RefType<any>
): any => {
  const targetEl = target || document.body;
  let { className } = targetEl;
  className = className.replace(clsName, "");
  targetEl.className = flag ? `${className} ${clsName} ` : className;
};
