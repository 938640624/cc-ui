import menu from "./filterMenu"

export const dataFormat = (value) => {
  const dt = new Date(value * 1000)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') // .padStart(指定位数，"要补全的符号或值")
  const d = (dt.getDay() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

export const genderMenu = (value) => {
  const target = menu.GENDER_MENU.filter(item => {
    return item.code === value;
  })
  return target.length ? target[0].label : value;
}

export const commenMenu = (value) => {
  const target = menu.COMMON_MENU.filter(item => {
    return item.code === value;
  })
  return target.length ? target[0].label : value;
}


