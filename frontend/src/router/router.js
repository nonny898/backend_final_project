import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import Main from '../views/Main.vue';
import Editor from '../views/Editor.vue'
import config from "../services/app.config"

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/editor/:sessionId',
      name: 'EditorSession',
      component: Editor,
      props: true,
      meta: {
      requiresAuth: true,
      }
    },
    {
      path: '/editor',
      name: 'Editor',
      component: Editor,
      props: true,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout,
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    axios
      .get(`http://${config.OAUTH_ADDR}/profile`, {
        withCredentials: true
      })
      .then(resp => {
          if (resp.data.user) {
            Vue.$cookies.set('userId', resp.data.user.id);
            next();
            return;
          }
          next('/login');
        })
  } else {
    next();
  }
});

export default router;
