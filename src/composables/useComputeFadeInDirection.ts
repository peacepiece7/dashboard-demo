import { ref, onMounted } from "vue";
import { useEventListener } from "./useEvent";

/**
 * @param selector document.querySelector의 인자로 사용될 셀렉터입니다.
 * @param targetHeight 반드시 px 단위의 숫자를 입력해여합니다. ex) 150px -> 150
 * @note
 * onMount시 뷰포트를 기준으로 selector의 상대적인 위치를 계산하여 up, down을 반환합니다.
 * @example
 * const { direction, rect } = useComputedFadeInDirection(".target", 150);
 */
export function useComputeFadeInDirection(selector: string, targetHeight: number) {
    const direction = ref<"up" | "down">("up");
    const rectRef = ref<null | DOMRect>(null);

    const getRect = () => {
        const element = document.querySelector(selector) as HTMLElement;
        if (!element) {
            throw new Error(`Element with selector ${selector} not found`);
        }
        if (typeof window === "undefined") {
            throw new Error("useComputedFadeInDirection must be used in the browser, not in the server side");
        }
        const rect = element.getBoundingClientRect();
        rectRef.value = rect;
        const bottomFromSelector = window.innerHeight - rect.bottom;
        if (bottomFromSelector < targetHeight) {
            direction.value = "down";
        } else {
            direction.value = "up";
        }
    };

    onMounted(() => getRect());
    useEventListener(window as unknown as HTMLElement, "resize", getRect);
    return { direction, rect: rectRef };
}
