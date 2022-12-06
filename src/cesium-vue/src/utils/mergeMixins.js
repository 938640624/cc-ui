import { isObject, isFunction } from "./is";

export function mergeMixins (...arr) {
  const ret = {}
  arr.forEach(mixin => {
    Object.keys(mixin).forEach(key => {
      const mixinItem = mixin[key];
      if (isObject(mixinItem)) {
        ret[key] = ret[key] ? { ...ret[key], ...mixinItem } : mixinItem
      } else if (isFunction(mixinItem)) {
        if (ret[key]) {
          ret[key] = function () {
            ret[key]();
            mixinItem();
          }
        } else {
          ret[key] = mixinItem
        }
      }
    })
  })
  return ret;
}
