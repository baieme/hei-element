import Vue from 'vue'
import vueRouter from 'vue-router'
Vue.use(vueRouter);
const routes = [
    {
        path: '/',
        redirect: '/login',
    }, {
        path: '/login',
        component: () => import('@/components/login.vue')
    }, {
        path: '/home',
        component: () => import('@/components/home.vue'),
        children: [
            {
                path: '/users',
                component: () => import('@/components/users/users.vue')
            },
            {
                path: '/roles',
                component: () => import('@/components/role/role.vue')
            },
            {
                path: '/rights',
                component: () => import('@/components/role/right.vue')
            },
        ]
    }
]
const router = new vueRouter({
    routes
})
//利用路由导航守卫 来控制访问权限 ，如果用户没有登录，而通过url路径直接访问，会直接跳转到登录界面
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    let token = sessionStorage.getItem('token');

    if (!token) return next('/login');
    next()
})
export default router;
