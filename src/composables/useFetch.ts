import ajax from "@/util/ajax";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import { MaybeRefOrGetter, ref, toValue, watch } from "vue";
import { useRouter } from "vue-router";

type FetchParmas<T> = {
    name?: string;
    method?: "get" | "post" | "delete" | "patch";
    param?: MaybeRefOrGetter;
    config?: AxiosRequestConfig;
    onSuccess?: (data: T) => void;
    beforeFetch?: () => void;
    onError?: (error: any) => void;
    onFinally?: () => void;
    url: MaybeRefOrGetter;
    enable?: MaybeRefOrGetter<boolean>;
    dependancy?: MaybeRefOrGetter[];
};

function useFetch<T>({
    url,
    method = "get",
    param,
    config = {},
    beforeFetch,
    onSuccess,
    onError,
    onFinally,
    dependancy = [],
    enable = () => true,
    name = "통신"
}: FetchParmas<T>) {
    const data = ref<T | null>(null);
    const loading = ref(false);
    const router = useRouter();

    // 취소를 위한 token source 선언
    let cancelSource: CancelTokenSource;

    const fetchData = async () => {
        beforeFetch && beforeFetch();
        loading.value = true;

        // 기존 요청이 존재하면 그 요청을 취소합니다.
        if (cancelSource) {
            cancelSource.cancel("기존 요청을 취소합니다.");
        }

        // 새로운 취소 토큰을 생성합니다.
        cancelSource = axios.CancelToken.source();

        let calcUrl: string = toValue(url);
        // 쿼리 스트링
        if (method === "get" && param) {
            calcUrl = calcUrl + router.resolve({ path: "/", query: toValue(param) }).href;
        }

        try {
            const res = await ajax[method](calcUrl, toValue(param), {
                ...config,
                cancelToken: cancelSource.token
            });
            data.value = res.data;
            loading.value = false;
            onSuccess && onSuccess(res.data);
        } catch (err) {
            onError && onError(err);

            if (axios.isCancel(err)) {
                console.log("이전 요청 취소", err.message);
            } else {
                loading.value = false;
                console.warn(name + " / " + err);
            }
        } finally {
            onFinally && onFinally();
        }
    };

    watch(
        () => toValue(enable),
        enable => {
            if (enable) {
                fetchData();
            }
        },
        { immediate: true }
    );

    return { fetchData, data, loading };
}

export default useFetch;
