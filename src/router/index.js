import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import register from '@/components/register'
import login from '@/components/login'
import home from '@/components/home'

Vue.use(Router)

var routes = [{
    path: '/hello',
    name: 'Hello',
    component: Hello
}, {
    path: '/login',
    name: 'login',
    component: login
}, {
    path: '/register',
    name: 'register',
    component: register
}, {
    path: '/',
    name: 'home',
    component: home
}, {
    path: '/home',
    redirect: '/'
}];

export default new Router({
    routes: routes
})