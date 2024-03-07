import { defineStore } from "pinia";
import { reactive, ref } from "vue";

type MemberInfo = {
    intgMemNo: string;
    intgMemId: string;
    intgMemNm: string;
    pwdInizYn: string;
    pwdChgTargetYn: string;
};

export const useLoginStore = defineStore("user", () => {
    const memberInfo = ref<null | MemberInfo>(null);

    // 디스트럭처링 사용하지 않는다.
    // ref()는 state 속성이 됨.
    // computed()는 getters가 됨.
    // function()은 actions가 됨.
    // const { name, doubleCount } = storeToRefs(store)
    // increment 액션은 그냥 구조화 가능.
    // const { increment } = store
    return { memberInfo };
});
