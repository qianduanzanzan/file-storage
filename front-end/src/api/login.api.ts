import request from "@/utils/request";

export const login = (data:any) => {
    return request({
        url: '/auth/login',
        method: "post",
        headers: {
            noToken: true
        },
        data
    });
};

export const register = (data:any,avatar:File) => {
    const formData = new FormData()
    formData.append('account',data.account)
    formData.append('password',data.password)
    formData.append('avatar',avatar)
    formData.append('nick_name',data.nick_name)
    return request({
        url: '/user/add',
        method: "post",
        headers: {
            noToken: true
        },
        data: formData
    });
};

export const getUserInfo = (params:any) => {
    return request({
        url: '/user/get_user_info_from_token',
        method: "get",
        params
    });
}

export const logout = (data:any) => {
    return request({
        url: '/auth/logout',
        method: "post",
        data
    });
}
