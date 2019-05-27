// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

import {DatePicker,Input,Form, FormItem,  Icon, Button} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueI18n from 'vue-i18n'
import vuePicturePreview from 'vue-picture-preview'
import {_getCookie} from '../src/utils/util'
import './assets/iconfont/iconfont.css'

Vue.use(vuePicturePreview);
Vue.use(VueI18n) // 通过插件的形式挂载
Vue.config.productionTip = false

// Vue.use(ElementUI)
Vue.use(DatePicker)

Vue.use(Input)

Vue.use(Form)

Vue.use(FormItem)

Vue.use(Icon)

Vue.use(Button)

/* eslint-disable no-new */
const i18n = new VueI18n({
  // locale: 'zh-CN',    // 语言标识
  locale: _getCookie('PLAY_LANG'),
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh-CN': require('../src/i18n/lang/cn'),   // 中文语言包
    'en-US': require('../src/i18n/lang/en')    // 英文语言包
  }
})

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
