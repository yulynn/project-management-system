import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Signin from '@/pages/Signin'
import Signup from '@/pages/Signup'
import User from '@/pages/User'
import UserIndex from '@/pages/User/Index'
import UserProfile from '@/pages/User/Profile'
import Project from '@/pages/Project'
import ProjectIndex from '@/pages/Project/Index'
import ProjectProfile from '@/pages/Project/Profile'
import UserCenter from '@/pages/UserCenter'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    // /
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        paths: [
          {
            name: 'Home',
            link: '/'
          }
        ]
      }
    },
    // /signin
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    // /signup
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    // /usercenter
    {
      path: '/usercenter',
      name: 'UserCenter',
      component: UserCenter,
      meta: {
        paths: [
          {
            name: 'Home',
            link: '/'
          },
          {
            name: 'User Center',
            link: ''
          }
        ],
        requireAuth: true
      }
    },
    // /user
    {
      path: '/user',
      name: 'User',
      component: User,
      children: [{
        path: '/',
        name: 'UserIndex',
        component: UserIndex,
        meta: {
          paths: [
            {
              name: 'Home',
              link: '/'
            },
            {
              name: 'User Manage',
              link: '/user'
            }
          ],
          requireAuth: true
        }
      },
      {
        path: ':userid',
        name: 'UserProfile',
        component: UserProfile,
        meta: {
          paths: [
            {
              name: 'Home',
              link: '/'
            },
            {
              name: 'User Manage',
              link: '/user'
            },
            {
              name: 'User Profile',
              link: ''
            }
          ],
          requireAuth: true
        }
      }]
    },
    // /project
    {
      path: '/project',
      name: 'Project',
      component: Project,
      children: [{
        path: '/',
        name: 'ProjectIndex',
        component: ProjectIndex,
        meta: {
          paths: [
            {
              name: 'Home',
              link: '/'
            },
            {
              name: 'Project Manage',
              link: '/project'
            }
          ],
          requireAuth: true
        }
      },
      {
        path: ':projectid',
        name: 'ProjectProfile',
        component: ProjectProfile,
        meta: {
          paths: [
            {
              name: 'Home',
              link: '/'
            },
            {
              name: 'Project Manage',
              link: '/project'
            },
            {
              name: 'Project Profile',
              link: ''
            }
          ],
          requireAuth: true
        }
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    const token = localStorage.getItem('x-access-token')
    if (token && token !== 'null') {
      next()
    } else {
      next('/signin')
    }
  } else {
    next()
  }
})

export default router
