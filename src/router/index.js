import { createRouter, createWebHistory } from 'vue-router'
import myProjectsView from "../due-diligence/pages/my-projects.vue";
import LogInView from "../iam/pages/log-in.view.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../iam/pages/log-in.view.vue'),
            props: true,
        },
        {
            path: '/:id',
            name: 'workspace',
            component: () => import('../views/workspace.view.vue'),
            props: true,
            children: [
                {
                    path: '/:id/workspace',
                    name: 'due_diligence',
                    component: () => import('../due-diligence/pages/my-projects.vue'),
                    props: true,
                },
                {
                    path: '/:id/workspace/:project_id',
                    name: 'due_diligence/project',
                    component: () => import('../due-diligence/pages/project-showcase.vue'),
                    props: true,
                },
                {
                    path: '/:id/qa',
                    name: 'qa',
                },
                {
                    path: '/:id/settings',
                    name: 'settings',
                },
            ],
        },
        {
            path: '/',
            redirect: 'login'
        },
    ]
})
export default router