import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import NotFound from '../views/404.vue'

Vue.use(VueRouter)

const routes = [{
        path: "/",
        name: "/",
        component: Login
    }, {
        path: "/login",
        name: "login",
        component: Login
    }, {
        path: '/home',
        name: 'home',
        component: Home,
        meta: {
            requireAuth: true
        },

        children: [{
                path: 'index',
                name: 'index',
                component: () =>
                    import ('../views/Index.vue'),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: 'my',
                name: 'my',
                component: () =>
                    import ('../views/My.vue'),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: "bind-watch",
                name: "bindWatch",
                component: () =>
                    import ("../views/BindWatch.vue"),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: "add-ad",
                name: "addAd",
                component: () =>
                    import ("../views/AddAd.vue"),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: "ad-board",
                name: "adBoard",
                component: () =>
                    import ("../views/AdBoard.vue"),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: "order-list/:orderType",
                name: "orderList",
                component: () =>
                    import ("../views/OrderList.vue"),
                meta: {
                    requireAuth: true
                }
            },
            {
                path: "order-detail/:orderType/:tradeId",
                name: "orderDetail",
                component: () =>
                    import ("../views/OrderDetail.vue"),
                meta: {
                    requireAuth: true
                }
            }
        ]
    },
    {
        path: "*",
        name: "404",
        component: NotFound
    }

]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {
        if (sessionStorage.getItem("seller") != null) {
            next()
        } else {
            next({
                path: '/login'
            })
        }
    } else {
        if (sessionStorage.getItem("seller") != null) {
            next();
        } else {
            next();
        }
    }
});

export default router