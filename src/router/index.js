import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter);

const routes = [
    {
        path: '',
        component: () => import('@/components/page-header'),
        redirect: 'home',
        children: [
            {
                path: '/home',
                component: () => import('@/pages/home')
            },
            {
                path: '/store/:id',
                component: () => import('@/pages/store'),
                props: true
            },
            {
                path: '/cart',
                component: () => import('@/pages/cart')
            },
            {
                path: '/order',
                component: () => import('@/pages/order')
            },
            {
                path: '/receive',
                component: () => import('@/pages/receive')
            },
            {
                path: '/add',
                component: () => import('@/pages/add')
            },
            {
                path: '/user',
                component: () => import('@/pages/user')
            },
            {
                path: '/star',
                component: () => import('@/pages/star')
            },
            {
                path: '/luck',
                component: () => import('@/pages/luck')
            },
            {
                path: '/return/:status',
                component: () => import('@/pages/result'),
                props: true
            },
            {
                path: '/chat',
                component: () => import('@/pages/chat'),
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/pages/login')
    },
    {
        path: '/register',
        component: () => import('@/pages/register')
    },
    {
        path: '/forget',
        component: () => import('@/pages/forget')
    }, {
        path: '/search',
        component: () => import('@/pages/search')
    }
];

const routers = new VueRouter({
    mode: 'history',
    routes,
});

routers.beforeEach((to, from, next) => {
    if (to.path === '/register' || to.path === '/forget' || to.path === '/login') {
        next();
    } else {
        const token = localStorage.getItem('token');
        if (!token) {
            next({path: '/login'});
        } else {
            next();
        }
    }
});

export default routers