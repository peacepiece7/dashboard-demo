import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "common-code",
        name: "systemCommonCode",
        component: () => import("@/pages/system/CommonCode.vue")
    },
    {
        path: "common-member",
        name: "systemCommonMember",
        component: () => import("@/pages/system/CommonMember.vue")
    },
    {
        path: "help",
        name: "systemHelp",
        component: () => import("@/pages/system/Help.vue")
    },
    {
        path: "board",
        name: "systemBoard",
        component: () => import("@/pages/system/Board.vue")
    },
    {
        path: "popup",
        name: "systemPopUp",
        component: () => import("@/pages/system/PopUp.vue")
    },
    {
        path: "banner",
        name: "systemBanner",
        component: () => import("@/pages/system/Banner.vue")
    }

    // {
    //     path: ":disaplyId",
    //     component: () => {
    //         const disaplyId = window.location.pathname.split("/")[2];
    //         return import(`@/pages/system/${disaplyId}.vue`);
    //     }
    // }
];

export default routes;

// url 규칙
// 1. 단순 명료하게
// 2. 동사 말고 명사로
// 3. 띄어쓰기같은 경우는 kebab-case로
// 4. 남들이 모르는 축약어 쓰지말기
