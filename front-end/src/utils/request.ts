import axios from 'axios'
import { ElMessage } from "element-plus";
import store from '@/store';
import { storeToRefs } from 'pinia'

import router from '@/router';

axios.defaults.timeout = 600000;
axios.defaults.baseURL = 'http://127.0.0.1:3001'
// axios.defaults.baseURL = 'http://124.70.25.229:3000'
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = false;

axios.interceptors.request.use(
    (config:any) => {
        if(!config.headers?.noToken){
            const useStores: any = storeToRefs(store.user())
            config.headers['Authorization'] = `Bearer ${useStores.token.value}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (res) => {
        if(res.data.statusCode == 401){
            const userStore = store.user()
            userStore.clearUserInfo()
            router.replace({ name: 'login' })
            ElMessage.error('登录已过期')
        }else if(!res.data.isOk){
            ElMessage.error(res.data.message)
            return Promise.reject(res);
        }
        return res;
    },
    (error) => {
        return Promise.reject(new Error(error));
    }
);

export default axios;