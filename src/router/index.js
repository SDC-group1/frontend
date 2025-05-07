import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

// Define routes
const routes = [
    {
        path: '/home',         // URL path (i.e., http://home/)
        name: 'Home',    // Route name
        component: Home  // Maps the route to the component
    },
    {
        path: '/about',         // URL path (i.e., http://home/)
        name: 'About',    // Route name
        component: About  // Maps the route to the component
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;