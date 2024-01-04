<script lang="ts" setup>
import { reactive, Ref, ref } from 'vue';
import md5 from 'md5-ts';
import { register as registerApi } from '@/api/login.api'
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';

const router = useRouter()
const showLoading = ref(false)
const avatar:Ref<any> = ref(null)

const imageUrl:Ref<string> = ref('')
const registerFormRef = ref()
const registerForm = reactive({
    account: "",
    password: "",
    nick_name: "",
    confirm_password: ''
})

const checkConfirmPassword = (rule: any, value: any, callback: any) => {
    if (value === registerForm.password) {
        callback()
    } else {
        callback(new Error('确认密码与新密码不一致'))
    }
}

const rules = reactive({
    nick_name: [{ required: true, message: '请输入用户名', trigger: ['blur', 'change'] }],
    account: [{ required: true, message: '请输入账户', trigger: ['blur', 'change'] }],
    password: [
        { required: true, message: '请输入新密码', trigger: ['blur', 'change'] },
        { min: 6, max: 20, message: '新密码长度在6-20之间', trigger: ['blur', 'change'] }
    ],
    confirm_password: [
        { required: true, message: '请再次输入密码', trigger: ['blur', 'change'] },
        { validator: checkConfirmPassword, trigger: 'blur' }
    ],
})

const beforeUpload = (file:any) => {
    avatar.value = file
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) { 
        imageUrl.value = this.result as string
    }
    return false
}

const register = () => {
    registerFormRef.value.validate((valid:Boolean) => {
        if(valid){
            showLoading.value = true
            registerApi({...registerForm, password: md5(registerForm.password)},avatar.value).then(() => {
                ElMessageBox.confirm('注册成功,是否跳转登录页？','提示',{
                    type: 'success'
                }).then(() => {
                    router.push({name: 'login'})
                }).catch(() => {
                    registerFormRef.value.resetFields()
                })
            }).finally(() => {
                showLoading.value = false
            })
        }else{
            return false
        }
    })
}

const toLoginPage = () => {
    router.push({name: 'login'})
}

</script>

<template>
    <div class="register-page">
        <div></div>
        <div class="register-container">
            <div class="register-form">
                <el-form size="default" :rules="rules" label-suffix=":" ref="registerFormRef" :model="registerForm" label-position="right" label-width="101">
                    <el-form-item label="用户名" prop="nick_name">
                        <el-input clearable v-model="registerForm.nick_name" />
                    </el-form-item>
                    <el-form-item label="账号" prop="account">
                        <el-input clearable v-model="registerForm.account" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input clearable type="password" v-model="registerForm.password" />
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirm_password">
                        <el-input clearable type="password" v-model="registerForm.confirm_password" />
                    </el-form-item>
                    <el-form-item label="头像">
                    <el-upload
                            class="avatar-uploader"
                            action=""
                            drag
                            :show-file-list="false"
                            :before-upload="beforeUpload"
                            :limit="1"
                            accept="image/png, image/jpeg, image/jpg"
                        >
                            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                            <div v-else class="upload-box">
                                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                                <div class="el-upload__text">点击上传头像</div>
                            </div>
                            
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div>
                    <el-button :loading="showLoading" size="large" type="primary" style="width: 100%" @click="register">注册</el-button>
                </div>
                <div style="margin-top: 8px;">
                    <el-button :loading="showLoading" style="padding: 0" type="primary" link @click="toLoginPage">返回登录</el-button>
                </div>
                <!-- <div>
                    <el-button>登录</el-button>
                    <el-button @click="register">注册</el-button>
                </div> -->
            </div>
            <img style="height: 70%" src="../../assets/images/people-icon.png" alt="" srcset="">
        </div>
    </div>
</template>

<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 150px;
  height: 150px;
  display: block;
}

:deep(.el-upload-dragger){
    padding: 0;
    width: 150px;
    height: 150px;
    margin: 0 0 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.upload-box {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  text-align: center;
  padding-top: 50px;
}

.register-page {
    background-image: url(../../assets/images/background.png);
    background-position: 0 bottom;
    background-repeat: no-repeat;
    background-size: contain;
    height: 100vh;
    padding-top: 10vh;
    box-sizing: border-box;
}

.register-container {
    width: 80%;
    margin: 0 auto;
    background: #ffffff;
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10% 0 8%;
    box-sizing: border-box;
    border-radius: 50px;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
}

.register-form{
    padding-top: 20px;
    height: 70%;
    width: 35%;
}

:deep(.el-form-item__label){
    font-size: 18px;
    font-weight: normal;
    // line-height: 28px;
}
</style>
