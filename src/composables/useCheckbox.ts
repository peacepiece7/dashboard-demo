import { ref, computed, toValue, MaybeRefOrGetter, watch, Ref } from "vue";

function useCheckbox<T>(list: MaybeRefOrGetter<T[]>, initValue?: MaybeRefOrGetter<T[]>) {
    const checkedList: Ref<T[]> = ref([]);
    const allList: Ref<T[]> = ref([]);

    const allCheck = computed({
        get() {
            return checkedList.value.length !== 0 && checkedList.value.length === allList.value.length;
        },
        set(checked: boolean) {
            checked ? (checkedList.value = allList.value) : (checkedList.value = []);
        }
    });

    watch(
        [() => toValue(list), () => toValue(initValue)],
        ([a, b]) => {
            allList.value = a;
            checkedList.value = b ? b : [];
        },
        {
            immediate: true
        }
    );

    return { checkedList, allCheck };
}

export default useCheckbox;
