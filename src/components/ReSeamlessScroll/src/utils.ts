/**
 * @desc AnimationFrame简单兼容hack
 */
export const animationFrame = () => {
  window.cancelAnimationFrame = (() => {
    return (
      window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.oCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      function (id) {
        return window.clearTimeout(id);
      }
    );
  })();
  window.requestAnimationFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  })();
};

/**
 * @desc 判断数组是否相等
 * @return {Boolean}
 * @param arr1
 * @param arr2
 */
export const arrayEqual = (arr1: Array<any>, arr2: Array<any>) => {
  if (arr1 === arr2) return true;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; ++i) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

/**
 * @desc 深浅合并拷贝
 */
export function copyObj() {
  if (!Array.isArray) {
    // @ts-expect-error
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };
  }
  let name,
    options,
    src,
    copy,
    copyIsArray,
    clone,
    i = 1,
    target = arguments[0] || {}, // 使用||运算符，排除隐式强制类型转换为false的数据类型
    deep = false,
    len = arguments.length;
  if (typeof target === "boolean") {
    deep = target;

    target = arguments[1] || {};
    i++;
  }
  if (typeof target !== "object" && typeof target !== "function") {
    target = {};
  }
  // 如果arguments.length === 1 或typeof arguments[0] === 'boolean',且存在arguments[1]，则直接返回target对象
  if (i === len) {
    return target;
  }
  for (; i < len; i++) {
    //所以如果源对象中数据类型为Undefined或Null那么就会跳过本次循环，接着循环下一个源对象

    if ((options = arguments[i]) != null) {
      // 如果遇到源对象的数据类型为Boolean, Number for in循环会被跳过，不执行for in循环// src用于判断target对象是否存在name属性
      for (name in options) {
        // src用于判断target对象是否存在name属性
        src = target[name];
        // 需要复制的属性当前源对象的name属性
        copy = options[name];
        // 判断copy是否是数组
        copyIsArray = Array.isArray(copy);
        // 如果是深复制且copy是一个对象或数组则需要递归直到copy成为一个基本数据类型为止
        if (deep && copy && (typeof copy === "object" || copyIsArray)) {
          if (copyIsArray) {
            copyIsArray = false;
            // 如果目标对象存在name属性且是一个数组
            // 则使用目标对象的name属性，否则重新创建一个数组，用于复制
            clone = src && Array.isArray(src) ? src : [];
          } else {
            // 如果目标对象存在name属性且是一个对象则使用目标对象的name属性，否则重新创建一个对象，用于复制
            clone = src && typeof src === "object" ? src : {};
          }
          // 深复制，所以递归调用copyObject函数
          // 返回值为target对象，即clone对象
          // copy是一个源对象
          // @ts-expect-error
          target[name] = copyObj(deep, clone, copy);
        } else if (copy !== undefined) {
          // 浅复制，直接复制到target对象上
          target[name] = copy;
        }
      }
    }
  }
  return target;
}
