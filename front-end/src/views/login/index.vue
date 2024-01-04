<script lang="ts" setup>
import { reactive, ref } from 'vue';
import md5 from 'md5-ts';
import { login as loginApi } from '@/api/login.api'
import { useRouter } from 'vue-router';
import store from '@/store';

const userStore = store.user()
const router = useRouter()
const loginFormRef = ref()
const loginForm = reactive({
    account: "",
    password: ""
})
const showLoading = ref(false)

const rules = reactive({
    account: [{ required: true, message: '请输入账户', trigger: ['blur', 'change'] }],
    password: [
        { required: true, message: '请输入新密码', trigger: ['blur', 'change'] }
    ],
})

const login = () => {
    loginFormRef.value.validate((valid:Boolean) => {
        if(valid){
            showLoading.value = true
            loginApi({
                account: loginForm.account,
                password: md5(loginForm.password)
            }).then(res => {
                userStore.setUserInfo(res.data.result)
                localStorage.setItem('userInfo', JSON.stringify(res.data.result))
                router.replace({ name: 'home' })
            }).finally(() => {
                showLoading.value = false
            })
        }else{
            return false
        }
    })
}

const toRegisterPage = () => {
    router.push({ name: 'register' })
}

</script>

<template>
    <div class="login-page">
        <div class="login-grid">
            <div style="position: relative;height: 100%;">
                <div class="title">
                    文件存储系统
                </div>
                <img style="position: absolute;bottom: 20px;width: 100%;" src="@/assets/images/login-icon.png" alt="">
            </div>
            <div></div>
            <div class="login-form">

            </div>
        </div>
        <!-- <div></div>
        <div class="login-container">
            <div class="login-form">
                <div class="title">文件存储系统</div>
                <el-form ref="loginFormRef" label-suffix=":" label-position="right" label-width="70" :rules="rules" :model="loginForm">
                    <el-form-item label="账号" prop="account">
                        <el-input clearable v-model="loginForm.account" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input clearable type="password" v-model="loginForm.password" />
                    </el-form-item>
                </el-form>
                <div style="margin-top: 20%">
                    <el-button :loading="showLoading" size="large" type="primary" style="width: 100%" @click="login">登录</el-button>
                </div>
                <div style="margin-top: 8px;">
                    <el-button :loading="showLoading" style="padding: 0" type="primary" link @click="toRegisterPage">立即注册</el-button>
                </div>
            </div>
        </div> -->
    </div>
</template>

<style lang="scss" scoped>
.login-page {
    height: 100vh;
    box-sizing: border-box;
    padding: 12vh 8vw;
}

.login-grid{
    display: grid;
    grid-template-columns: 48fr 12fr 40fr;
    height: 100%;
    .title{
        font-family: HelloFont ID JiangHuTi;
        font-size: 4.5vw;
        text-align: center;
        font-weight: bold;
        color: #337DFF;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%);
        white-space: nowrap;
    }
    .login-form{
        border: 1px solid #000000;
    }
}
</style>
