import Vue from "vue";
import axios from '@/common/utils/http'
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import './icons'

Vue.config.productionTip = false;

Vue.use(ElementUI)

Vue.prototype.axios = axios

window.gVue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

const whiteList = ['/login']
const teacherWhiteList = ['/teacher', '/teacher/index', '/teacher/topic', '/teacher/class', '/teacher/class/class_info','/teacher/class/class_info/stu_list','/teacher/class/class_info/file', '/teacher/test', '/show_test', '/finish_test']
const studentWhiteList = ['/student', '/student/index', '/student/topic', '/student/class', '/student/classinfo', '/student/files', '/student/test', '/student/info', '/show_test', '/finish_test', '/unfinish_test']
const managerWhiteList = ['/manager', '/register']

document.title = '题库系统'
router.beforeEach(async (to, from, next) => {
  if (to.meta.hasOwnProperty('title')) {
    document.title = to.meta.title
  } else {
    document.title = '题库系统'
  }
  NProgress.start()
  let store = window.gVue.$store.state
  if (store.status != null) {
    if (store.status == 'Teacher') {
      if (to.path === '/login') {
        next({ path: '/teacher'})
      } else {
        if (teacherWhiteList.includes(to.path) == false) {
          next({ path: '/teacher'})
        } else {
          next()
        }
      }
    }

    if (store.status == 'Student') {
      if (to.path === '/login') {
        next({ path: '/student'})
      } else {
        if (studentWhiteList.includes(to.path) == false) {
          next({ path: '/student'})
        } else {
          next()
        }
      }
    }

    if (store.status == 'Manager') {
      if (to.path === '/login') {
        next({ path: '/manager'})
      } else {
        if (managerWhiteList.includes(to.path) == false) {
          next({ path: '/manager'})
        } else {
          next()
        }
      }
    }

  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
})