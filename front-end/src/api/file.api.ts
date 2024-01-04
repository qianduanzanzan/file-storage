import request from "@/utils/request";

export const getFileList = (params:any) => {
    return request({
        url: '/file-stronge-manage/get-file-list',
        method: "get",
        params
    });
};

export const addFile = (data:any,onUploadProgress:any) => {
    const formData = new FormData()
    formData.append('name',data.name)
    formData.append('type',data.type)
    formData.append('file',data.file)
    formData.append('pid',data.pid)
    return request({
        url: '/file-stronge-manage/add-file-or-folder',
        method: "post",
        data:formData,
        onUploadProgress
    });
};

export const delFile = (data:any) => {
    return request({
        url: '/file-stronge-manage/del-file',
        method: "delete",
        data
    });
};

export const updateFile = (data:any) => {
    return request({
        url: '/file-stronge-manage/update-file',
        method: "put",
        data
    });
};

export const downloadFile = (id:String) => {
    return request({
        url: `/file-stronge-manage/get-file/${id}`,
        method: "get"
    });
};
