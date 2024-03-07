import { onMounted, onUnmounted } from "vue";

/**
 * @note (un)mounted 시 이벤트 리스너를 추가/제거하는 컴포저블
 * @example
 * useEventListener(document.getElementById("foo"), "click", (e) => console.log("clicked : ", e.target));
 */
export function useEventListener<T extends HTMLElement, K extends keyof HTMLElementEventMap>(
    target: T | null,
    event: K,
    callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown
) {
    if (!target) {
        return process.env.NODE_ENV === "development" && console.error(`Target ${target} is not available`);
    }
    onMounted(() => target.addEventListener(event, callback));
    onUnmounted(() => target.removeEventListener(event, callback));
}
