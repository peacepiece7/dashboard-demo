import { Ref, onMounted, ref } from "vue";

function useIntersectionObserver(): [Ref<HTMLElement | null>, Ref<number>, () => void] {
    const wrapRef = ref<null | HTMLElement>(null);
    const page = ref(1);

    function intersectWrap() {
        const options = {
            root: wrapRef.value,
            threshold: 0.9
        };

        if (wrapRef.value?.children) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach((a, i) => {
                    if (a.isIntersecting && wrapRef.value) {
                        for (let i = 0; i < wrapRef.value.children.length; i++) {
                            if (wrapRef.value.children[i] === a.target) {
                                page.value = i + 1;
                                break;
                            }
                        }
                    }
                });
            }, options);

            for (let i = 0; i < wrapRef.value.children.length; i++) {
                observer.observe(wrapRef.value.children[i]);
            }
        }
    }

    return [wrapRef, page, intersectWrap];
}

export default useIntersectionObserver;
