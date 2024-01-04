import request from "@/utils/request";

export const updateUser = (data:any) => {
    const formData = new FormData()
    formData.append('nick_name',data.nick_name)
    formData.append('id',data.id)
    formData.append('avatar',data.avatar)
    return request({
        url: '/user/update',
        method: "put",
        data:formData,
    });
};

export const changePassword = (data:any) => {
    return request({
        url: '/user/change_password',
        method: "post",
        data:data,
    });
};
