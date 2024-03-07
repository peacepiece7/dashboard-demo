import { ref } from "vue";
import { useEventListener } from "./useEvent";

/**
 * @note target 요소에 클릭 이벤트를 추가합니다.
 * 파라메터와 동일한 id 속성을 가지는 요소 외부를 클릭하면 dropdown을 닫습니다.
 * @example
 * ```html
 * <div id='foo'>
 * <-- ...the rest of the component -->
 * </div>
 * <-- in javascript -->
 * ```
 * ```javascript
 * const { isOpen } = useOpen('foo', document.body);
 * ```
 */
export function useOpenDropdown<T extends HTMLElement>(
    id: string,
    target: T | null,
    type: "multiple" | "single" = "single"
) {
    const isOpen = ref(false);

    const withType = {
        single: (target: Element | null) => {
            if (!target || target.id !== id) isOpen.value = false;
            else isOpen.value = !isOpen.value;
        },
        multiple: (target: Element | null) => {
            if (target && target.id === id) isOpen.value = true;
            else isOpen.value = false;
        }
    };

    function clickEventCb(e: MouseEvent) {
        const target = (e.target as HTMLElement).closest(`#${id}`);
        return withType[type](target);
    }

    useEventListener(target, "click", clickEventCb);

    return { isOpen };
}
