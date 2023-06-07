class Vue {
  constructor(options) {
    this.data = options.data
    this.el = document.querySelector(options.el)
    this.dep = new Dep()

    this.Observer(this.data)
    this.Compile(this.el)
  }

  // 监听器
  Observer(obj) {
    if (!obj || typeof obj !== 'object') {
      return
    }

    for (const key in obj) {
      let value = obj[key]
      Object.defineProperty(obj, key, {
        get: () => {
          return value
        },
        set: (newValue) => {
          value = newValue

          // TODO 通知订阅者
          this.dep.notify()
        }
      })
    }
  }

  // 编译
  Compile(el) {
    const nodes = el.children

      ;[...nodes].forEach((node, index) => {
        if (node.hasAttribute('v-text')) {
          let attrVal = node.getAttribute('v-text')
          this.dep.addSub(new Watcher(node, this, attrVal, 'innerHTML'))
        }

        if (node.hasAttribute('v-model')) {
          let attrVal = node.getAttribute('v-model')
          this.dep.addSub(new Watcher(node, this, attrVal, 'value'))

          node.addEventListener('input', () => {
            this.data[attrVal] = node.value
          })
        }
      })
  }
}

// 订阅者
class Watcher {
  constructor(el, vm, exp, attr) {
    this.el = el
    this.vm = vm
    this.exp = exp
    this.attr = attr

    this.update()
  }

  update() {
    this.el[this.attr] = this.vm.data[this.exp] // 更新视图
  }
}

// 收集订阅者
class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}