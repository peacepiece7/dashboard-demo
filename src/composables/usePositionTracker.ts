import { ref, CSSProperties, nextTick, watch } from "vue";

function usePositionTracker(addMargin: number | undefined = 0, blurEvent?: () => void) {
    const isHidden = ref(false);
    const targetElement = ref<null | HTMLElement>(null);
    const element = ref<null | HTMLElement>(null);
    const position = ref<CSSProperties>({});

    const toggleHandler = async () => {
        await nextTick();

        if (targetElement.value && element.value) {
            const targetRect = targetElement.value.getBoundingClientRect();
            const left = targetRect.left;
            const top = targetRect.top;
            const topScroll = top + window.scrollY;
            const height = targetRect.height;

            // 요소가 브라우저창에 넘치는지 여부
            const isOverflowing = window.innerHeight < top + height + element.value.offsetWidth;

            if (!isOverflowing) {
                position.value = {
                    left: left + "px",
                    top: topScroll + height + addMargin + "px",
                    bottom: "auto"
                };
            } else {
                position.value = {
                    top: "auto",
                    left: left + "px",
                    bottom: -(topScroll - window.innerHeight - addMargin) + "px"
                };
            }
        }
    };

    function blur(e: Event) {
        if (element.value && e.target instanceof HTMLElement && targetElement.value) {
            if (
                !element.value.contains(e.target) &&
                !targetElement.value.contains(e.target) &&
                !e.target.classList.contains("item")
            ) {
                blurEvent && blurEvent();
                isHidden.value = false;
            }
        }
    }

    function scrollEv() {
        toggleHandler();
    }

    watch(isHidden, open => {
        if (open) {
            document.body.addEventListener("click", blur);
            window.addEventListener("scroll", scrollEv);
        } else {
            document.body.removeEventListener("click", blur);
            window.removeEventListener("scroll", scrollEv);
        }
    });

    return { position, targetElement, element, toggleHandler, isHidden };
}

export default usePositionTracker;
