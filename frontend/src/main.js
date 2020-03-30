import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import vuetify from './plugins/vuetify';

import './assets/custom.css';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app');
