import { onMounted, onUnmounted, ref } from "vue";

function useNodrag() {
    const element = ref<HTMLElement | null>(null);

    const elementPrevent = (e: Event) => {
        e.preventDefault();
    };

    onMounted(() => {
        if (element.value) {
            const ele = element.value as HTMLElement;
            ele.addEventListener("dragstart", elementPrevent);
            ele.addEventListener("selectstart", elementPrevent);
            ele.addEventListener("contextmenu", elementPrevent);
        }
    });

    onUnmounted(() => {
        if (element.value) {
            const ele = element.value as HTMLElement;
            ele.removeEventListener("dragstart", elementPrevent);
            ele.removeEventListener("selectstart", elementPrevent);
            ele.removeEventListener("contextmenu", elementPrevent);
        }
    });

    return element;
}

export default useNodrag;
