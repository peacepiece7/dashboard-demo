import { defineStore } from "pinia";
import { ref } from "vue";

export const useSideBarStore = defineStore("TheSideBar", () => {
    const toggleLnb = ref(false);

    const toggle = (state: boolean) => {
        toggleLnb.value = state;
    };
    return {
        toggleLnb,
        toggle
    };
});
