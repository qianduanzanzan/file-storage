import request from "@/utils/request";

export const test = (params: any = {}) => {
    return request({
        url: '/file-stronge-manage/get-file-list',
        method: "get",
        data: params
    });
};
