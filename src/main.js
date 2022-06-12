import Vue from 'vue'
import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'
import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'
import VueI18n from 'vue-i18n'
import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import './icons'
import './permission'
// import './utils/error-log'

import gojs from 'gojs'
Vue.use(gojs)


import 'default-passive-events'

import * as filters from './filters'
import JSONViewer from 'vue-json-viewer'
// import JsonEditor from 'vue-json-edit'
import vueJsonEditor from 'vue-json-editor' 
Vue.use(vueJsonEditor)

Vue.use(JSONViewer)

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
Vue.use(Element,VueI18n,{
  size: Cookies.get('size') || 'medium',
  locale: enLang
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
