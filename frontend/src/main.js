import Vue from 'vue';
import VueCookies from 'vue-cookies'
import App from './App.vue';
import router from './router/router';
import vuetify from './plugins/vuetify';
import NavBar from "./components/NavBar";

import './assets/custom.css';

Vue.use(VueCookies)

Vue.component('NavBar', NavBar);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app');
