import Vue from "vue";
import App from "./App.vue";
import * as VueGoogleMaps from "vue2-google-maps";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDPVknvtCLmvIMOSTVM3LKkmf2k00EVmk4",
    libraries: "places",
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");