
/**
 * sessionStorage | localStorage 封装
 *
 */
export default class Storage {
  /**
   *
   * @param namespace
   * @param {String} type  sessionStorage | localStorage
   */
  constructor (namespace, type = "sessionStorage") {
    this.namespace = namespace;
    this.type = type;
  }

  get (key) {
    try {
      return JSON.parse(window[this.type].getItem(`${this.namespace}_${key}`));
    } catch (error) {
      return null;
    }
  }

  set (key, val) {
    window[this.type].setItem(`${this.namespace}_${key}`, JSON.stringify(val));
  }

  remove (key) {
    window[this.type].removeItem(`${this.namespace}_${key}`);
  }

  clear () {
    Object.keys(window[this.type]).forEach(key => {
      const reg = new RegExp(`^${this.namespace}.*`)
      if (reg.test(key)) {
        window[this.type].removeItem(key);
      }
    })
  }
}
