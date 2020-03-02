import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Account/Login/index.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Account/Register/index.vue'),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: () => import('./views/Teacher/index.vue'),
      meta: {
        title: '教师界面'
      },
      children: [
        {
          path: 'index',
          name: 'teacherHome',
          component: () => import('./views/Teacher/Home/index.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: 'topic',
          name: 'teacherTopic',
          component: () => import('./views/Teacher/Topic/index.vue'),
          meta: {
            title: '题库'
          }
        },
        {
          path: 'class',
          name: 'teacherClass',
          component: () => import('./views/Teacher/Class/index.vue'),
          meta: {
            title: '班级'
          }
        },
        {
          path: 'class/class_info',
          name: 'teacherClassInfo',
          component: ()=>import('./views/Teacher/Class/ClassInfo/index.vue'),
          meta: {
            title: '班级信息'
          }
        },
        {
          path: 'class/class_info/stu_list',
          name: 'ClassInfoStuList',
          component: () => import('./views/Teacher/Class/ClassInfo/StuList/index.vue'),
          meta: {
            title: '班级学生列表'
          }
        },
        {
          path: 'class/class_info/file',
          name: 'ClassInfoFile',
          component: () => import('./views/Teacher/Class/ClassInfo/FileList/index.vue'),
          meta: {
            title: '文件列表'
          }
        },
        {
          path: 'test',
          name: 'teacherTest',
          component: () => import('./views/Teacher/Test/index.vue'),
          meta: {
            title: '试卷'
          }
        },
      ]
    },
    {
      path: '/student',
      name: 'student',
      component: () => import('./views/Student/index.vue'),
      meta: {
        title: '学生界面'
      },
      children: [
        {
          path: 'index',
          name: 'studentHome',
          component: () => import('./views/Student/Home/index.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: 'topic',
          name: 'studentTopic',
          component: () => import('./views/Student/Topic/index.vue'),
          meta: {
            title: '题库'
          }
        },
        {
          path: 'class',
          name: 'studentClass',
          component: () => import('./views/Student/Class/index.vue'),
          meta: {
            title: '班级'
          },
        },
        {
          path: 'classinfo',
          name: 'studentClassInfo',
          component: () => import('./views/Student/Class/Classinfo/index.vue'),
          meta: {
            title: '班级详情'
          }
        },
        {
          path: 'files',
          name: 'studentFiles',
          component: () => import('./views/Student/Class/Classinfo/FileList/index.vue'),
          meta: {
            title: '文件详情'
          }
        },
        {
          path: 'test',
          name: 'studentTest',
          component: () => import('./views/Student/Test/index.vue'),
          meta: {
            title: '试卷'
          }
        },
        {
          path: 'info',
          name: 'studentInfo',
          component: () => import('./views/Student/Myinfo/index.vue'),
          meta: {
            title: '个人信息'
          }
        },
      ]
    },
    {
      path: '/manager',
      name: 'manager',
      component: () => import('./views/Manager/index.vue'),
      meta: {
        title: '管理员界面'
      }
    },
    {
      path: '/finish_test',
      name: 'finish_test',
      component: () => import('./views/Test/Finishtest.vue'),
      meta:{
        title: '学生试卷',
      }
    },
    {
      path: '/unfinish_test',
      name: 'unfinish_test',
      component: () => import('./views/Test/Unfinishtest.vue'),
      meta:{
        title: '测试试卷',
      }
    },
    {
      path: '/show_test',
      name: 'show_test',
      component: () => import('./views/Test/Showtest.vue'),
      meta:{
        title: '试卷详情',
      }
    }
  ]
});
