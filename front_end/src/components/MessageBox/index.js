import msgboxVue from './index.vue'

// define a plugin object
const MessageBox = {}
// install method in Vue，used to define a Vue plugin
MessageBox.install = function (Vue, options) {
  const MessageBoxInstance = Vue.extend(msgboxVue)
  let currentMsg
  const initInstance = () => {
    // Instantiation of Vue instance
    currentMsg = new MessageBoxInstance()
    let msgBoxEl = currentMsg.$mount().$el
    document.body.appendChild(msgBoxEl)
  }
  // Add an instance method to the Vue prototype to invoke the global method.
  Vue.prototype.$msgBox = {
    showMsgBox (options) {
      if (!currentMsg) {
        initInstance()
      }
      if (typeof options === 'string') {
        currentMsg.content = options
      } else if (typeof options === 'object') {
        Object.assign(currentMsg, options)
      }
      return currentMsg.showMsgBox()
        .then(val => {
          currentMsg = null
          return Promise.resolve(val)
        })
        .catch(err => {
          currentMsg = null
          return Promise.reject(err)
        })
    }
  }
}
export default MessageBox
