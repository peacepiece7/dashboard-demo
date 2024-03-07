import { defineStore } from "pinia";
import { reactive, ref } from "vue";

type AlertMsg = {
    msg: string;
    state: boolean;
    type: "alert" | "confirm";
};

export const useAlertStore = defineStore("alert", () => {
    const alertState: AlertMsg = reactive({
        msg: "",
        state: false,
        type: "alert"
    });

    const confirmPromise = ref<Promise<boolean>>();
    const confirmAction = ref<{ confirm: () => void; close: () => void } | null>(null);

    function alert(content: string) {
        alertState.msg = content;
        alertState.type = "alert";
        alertState.state = true;
    }

    // confirm 창을 표시하는 함수
    function confirm(content: string) {
        alertState.state = true;
        alertState.type = "confirm";
        alertState.msg = content;

        confirmPromise.value = new Promise(resolve => {
            const confirm = () => {
                alertState.state = false;
                alertState.msg = "";
                resolve(true);
            };

            const close = () => {
                alertState.state = false;
                alertState.msg = "";
                resolve(false);
            };

            confirmAction.value = { confirm, close };
        });

        return confirmPromise.value;
    }

    function close() {
        if (confirmAction.value) {
            confirmAction.value.close();
        } else {
            alertState.msg = "";
            alertState.state = false;
        }
    }

    return { alertState, close, alert, confirm, confirmAction };
});
