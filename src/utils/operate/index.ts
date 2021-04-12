export const hasClass = (ele: Element, cls:string) :any => {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

export const addClass = (ele: Element, cls:string) :any =>  {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

export const removeClass =(ele: Element, cls:string, extracls?: string) :any => {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ').trim()
  }
  if (extracls) {
    if (hasClass(ele, extracls)) {
      const regs = new RegExp('(\\s|^)' + extracls + '(\\s|$)')
      ele.className = ele.className.replace(regs, ' ').trim()
    }
  }
}