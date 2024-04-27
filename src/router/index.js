import { createRouter, createWebHistory } from 'vue-router'
import myProjectsView from "../views/my-projects.view.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/my-projects',
            name: 'my-projects',
            component: myProjectsView,
        },
        {
            path: '/',
            redirect: 'my-projects'
        },
    ]
})
export default router