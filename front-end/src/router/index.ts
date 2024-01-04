/**
 * createRouter 这个为创建路由的方法
 * createWebHashHistory 这个就是vue2中路由的模式，
 *                      这里的是hash模式，这个还可以是createWebHistory等
 * RouteRecordRaw 这个为要添加的路由记录，也可以说是routes的ts类型
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import store from '@/store';
import { storeToRefs } from 'pinia'

// 路由记录，这个跟vue2中用法一致，就不做过多解释了
const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'home',
        component: () => import("@/views/home/index.vue"),
        meta: {
            title: '首页'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import("@/views/login/index.vue"),
        meta: {
            title: 'login'
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import("@/views/register/index.vue"),
        meta: {
            title: 'register'
        }
    },
    {
        path: '/user',
        name: 'user',
        component: () => import("@/views/user/index.vue"),
        meta: {
            title: 'user'
        }
    },
    {
        path: '/404',
        name: '404',
        component: () => import("@/views/404/index.vue"),
        meta: {
            title: '404'
        }
    },
    {
        path: '/401',
        name: '401',
        component: () => import("@/views/401/index.vue"),
        meta: {
            title: '401'
        }
    },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/404'
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to,from,next) => {
    const useStores: any = storeToRefs(store.user())
    const token = useStores.token.value
    const is_admin = useStores.is_admin.value
    if(to.name === 'login' || to.name === 'register'){
        if(token){
            next({ name: 'home' })
            return
        }
    }else{
        if(!token){
            next({ name: 'login' })
            return
        }else{
            if(to.name === 'user'){
                if(!is_admin){
                   next({name: '401'}) 
                   return
                }
            }
        }
    }
    next()
})

export default router;
