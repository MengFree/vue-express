// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import store from './store/store'


Vue.use(VueResource)
Vue.config.productionTip = false;
Vue.http.interceptors.push((request, next) => {
    this.loading = true;
    next((response) => {
        // this.loading = false
        return response
    });
});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})