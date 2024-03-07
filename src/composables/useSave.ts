import ajax from "@/util/ajax";

type UseSaveType = {
    url: string;
    param: any;
    method?: "get" | "post" | "put" | "delete";
};

function useSave({ url, param, method = "post" }: UseSaveType) {
    return new Promise((resolve, reject) => {
        ajax[method](url, param)
            .then(res => {
                console.log(res.data);
                resolve(res.data);
            })
            .catch(error => {
                console.error(error);
                reject("fail");
            });
    });
}

export default useSave;
