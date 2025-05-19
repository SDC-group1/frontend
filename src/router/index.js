import { createRouter, createWebHistory } from 'vue-router';
import Blogs from '../views/Blogs.vue';
import Auth from '../views/Auth.vue'

// Define routes
const routes = [
    {
        path: '/',
        name: 'Blogs',
        component: Blogs
    },
    {
        path: '/blogs',
        name: 'Blogs',
        component: Blogs
    },
    {
        path: '/auth',
        name: 'Auth',
        component: Auth
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;