import { cloneDeep } from "@/util/common";
import axios from "axios";
import { MaybeRefOrGetter, onMounted, ref, toValue, watch } from "vue";

function useAreaDropdown(sidoValue?: MaybeRefOrGetter) {
    const sidoOptions = ref<any[]>([]);
    const sigunguOptions = ref<any[]>([]);
    let initSigunguOptions: any[] = [];

    const getSido = async () => {
        try {
            const res = await Promise.all<[any, any]>([
                axios.get("https://sportsclub-api-dev.sports.or.kr/admin/code/CO011"),
                axios.get("https://sportsclub-api-dev.sports.or.kr/admin/code/CO012")
            ]);

            res[0].data.list.unshift({ cdNm: "전체 시도", commnCd: "" });
            res[1].data.list.unshift({ cdNm: "전체 시군구", commnCd: "" });
            sidoOptions.value = res[0].data.list;
            sigunguOptions.value = res[1].data.list;

            initSigunguOptions = res[1].data.list;
        } catch (err) {
            console.error(err);
        }
    };

    onMounted(getSido);

    watch(
        () => toValue(sidoValue),
        sido => {
            if (sido && !!sidoOptions.value.length) {
                if (sido.cdNm === "전체 시도") {
                    sigunguOptions.value = cloneDeep(initSigunguOptions);
                } else {
                    sigunguOptions.value = initSigunguOptions.filter(ele => ele.hrnkCommnCd === sido.commnCd);
                }
            }
        },
        {
            immediate: true
        }
    );

    return { sidoOptions, sigunguOptions };
}

export default useAreaDropdown;
