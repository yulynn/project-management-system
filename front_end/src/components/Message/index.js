import msgVue from './index.vue'

// define a plugin object
const Message = {}
// install method in Vue，used to define a Vue plugin
Message.install = function (Vue, options) {
  const MessageInstance = Vue.extend(msgVue)
  let currentMsg
  const initInstance = () => {
    // Instantiation of Vue instance
    currentMsg = new MessageInstance()
    let msgEl = currentMsg.$mount().$el
    document.body.appendChild(msgEl)
  }
  // Add an instance method to the Vue prototype to invoke the global method.
  Vue.prototype.$message = {
    showMessage (options) {
      if (!currentMsg) {
        initInstance()
      } else {
        return
      }
      if (typeof options === 'string') {
        currentMsg.content = options
      } else if (typeof options === 'object') {
        Object.assign(currentMsg, options)
      }
      return currentMsg.showMessage()
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
export default Message
