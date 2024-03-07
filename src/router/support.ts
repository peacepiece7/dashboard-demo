import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    // {
    //     path: ":disaplyId",
    //     component: () => {
    //         const disaplyId = window.location.pathname.split("/")[2];
    //         return import(`@/pages/system/${disaplyId}.vue`);
    //     }
    // }
];

export default routes;

const pages = {
    SADD0101C: "등록스포츠클럽 신청",
    SADD0301C: "특화프로그램 신청",
    SADD0302C: "특화프로그램 신청결과",
    SADD0303M: "특화프로그램 신청현황"
};

for (const key in pages) {
    routes.push({
        path: key,
        name: key,
        component: () => import(`@/pages/support/${key}.vue`)
    });
}
// url 규칙
// 1. 단순 명료하게
// 2. 동사 말고 명사로
// 3. 띄어쓰기같은 경우는 kebab-case로
// 4. 남들이 모르는 축약어 쓰지말기
