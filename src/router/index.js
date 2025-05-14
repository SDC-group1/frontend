import { createRouter, createWebHistory } from 'vue-router';
import Blogs from '../views/Blogs.vue';

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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;