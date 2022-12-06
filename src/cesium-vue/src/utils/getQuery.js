/**
 * 获取url的参数对象
 * @param {String} [url=location.href] 要处理的url地址
 * @param {Boolean} [normalizeKey=false] 将所有名称规范化为小写
 * @returns {Object}
 */
export function getQueryObject (url, normalizeKey = false) {
  url = url || window.location.href
  const search = url.substring(url.lastIndexOf("?") + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    let name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    if (normalizeKey) {
      name = name.toLowerCase();
    }
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

export function getQueryParam (name, url) {
  url = url || window.location.href
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i");
  const search = url.substring(url.lastIndexOf("?") + 1);
  const r = search.match(reg);
  if (r != null) return unescape(r[2]); return null;
}

export function getQueryString (obj) {
  const arr = [];
  for (const key in obj) {
    arr.push(`${key}=${obj[key]}`)
  }
  return arr.join("&")
}
