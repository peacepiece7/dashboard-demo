import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";
import SADD0002CVue from "@/pages/SADD0002C.vue";



const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: SADD0002CVue,

    }
];

const router = createRouter({
    history: createWebHistory(process.env.VUE_APP_PUBLIC_PATH),
    routes
    // strict: true,
    // sensitive: true
});


export default router;
