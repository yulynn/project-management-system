// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import MessageBox from './components/MessageBox/index'
import Message from './components/Message/index'
Vue.use(MessageBox)
Vue.use(Message)

Vue.config.productionTip = false
Vue.use(iView)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status === 401) {
      Vue.prototype.$msgBox.showMsgBox({
        title: 'error tip',
        content: 'Your login information is invalid. Please login again.',
        isShowCancelBtn: false
      }).then((val) => {
        router.push('/signin')
      }).catch(() => {
        console.log('cancel')
      })
    } else {
      console.log(error)
      console.log()
      console.log(error.response.status)
      Vue.prototype.$message.showMessage({
        type: 'error',
        content: 'System error'
      })
    }
    return Promise.reject(error)
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
