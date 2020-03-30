import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import Main from '../views/Main.vue';
import Editor from '../views/Editor.vue'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
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
      .get("http://localhost:3000/profile", {
        withCredentials: true
      })
      .then(resp => {
          console.log(resp.data.user)
          if (resp.data.user) {
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
