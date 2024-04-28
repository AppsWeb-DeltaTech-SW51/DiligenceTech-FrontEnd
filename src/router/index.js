import { createRouter, createWebHistory } from 'vue-router'
import myProjectsView from "../views/my-projects.vue";
import LogInView from "../iam/pages/log-in.view.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../iam/pages/log-in.view.vue'),
        },
        {
            path: '/workspace',
            name: 'workspace',
            component: () => import('../views/workspace.view.vue'),
            children: [
                {
                    path: '/workspace/due_diligence',
                    name: 'workspace/due_diligence',
                    component: () => import('../views/my-projects.vue'),
                },
                {
                    path: '/workspace/qa',
                    name: 'workspace/qa',
                },
            ],
        },
        {
            path: '/my-projects',
            name: 'my-projects',
            component: () => import('../views/my-projects.vue'),
        },
        {
            path: '/',
            redirect: 'login'
        },
    ]
})
export default router