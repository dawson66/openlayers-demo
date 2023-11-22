/*
 * @Description: 基础发布订阅，最好改为ts
 * @Author: wangmeng
 * @Date: 2023-09-26 16:24:22
 * @LastEditTime: 2023-10-24 14:17:54
 */

interface Event {
  on: (type: string, fn: Function) => void,
  emit: (type: string, ...args: Array<any>) => void,
  off: (type: string, fn: Function) => void,
  once: (type: string, fn: Function) => void
}

interface Listener {
  [key: string]: Array<Function>
}



export default class EventEmitter implements Event {

  listeners: Listener

  constructor() {
    this.listeners = {}
  }


  // 订阅
  on(type: string, fn: Function) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    const listenersForType = this.listeners[type];
    if (!listenersForType.includes(fn)) {
      listenersForType.push(fn)
    }
  }

  once(type: string, fn: Function) {
    const decorator = (...args: Array<any>) => {
      fn.apply(this, args);
      this.off(type, decorator)
    }
    this.on(type, decorator)
  }

  emit(type: string, ...args: Array<any>) {
    const fns = this.listeners[type] || [];

    fns.forEach(f => {
      f.call(this, ...args);
    })
  }

  // 移除单个订阅
  off(type: string, fn: Function) {
    if (!this.listeners) {
      return;
    }
    const listeners = this.listeners[type];
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(fn);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  // Clean up
  clear() {
    if (this.listeners) {
      for (const property in this.listeners) {
        delete this.listeners[property];
      }
    }
  }
}
