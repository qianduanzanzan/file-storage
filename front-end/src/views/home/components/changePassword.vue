<template>
    <el-dialog title="修改个人密码" v-model="dialogVisible" :close-on-click-modal="false" @close="onClose" width="400px">
        <div class="container">
            <el-form :model="changePasswordForm" ref="form" :rules="rules" label-width="80px" :inline="false"
                size="default">
                <el-form-item label="原密码" prop="old_password">
                    <el-input type="password" v-model="changePasswordForm.old_password" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new_password">
                    <el-input type="password" v-model="changePasswordForm.new_password" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirm_password">
                    <el-input type="password" v-model="changePasswordForm.confirm_password" maxlength="20"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from "element-plus";
import { changePassword } from '@/api/user.api'
import md5 from 'md5-ts';
import store from "@/store";
import { logout as logoutApi } from '@/api/login.api'
import { useRouter } from 'vue-router';

const router = useRouter()

const userStore = store.user()
const form = ref()

const changePasswordForm = ref({
    old_password: '',
    new_password: '',
    confirm_password: ''
})

const checkConfirmPassword = (rule: any, value: any, callback: any) => {
    if (value === changePasswordForm.value.new_password) {
        callback()
    } else {
        callback(new Error('确认密码与新密码不一致'))
    }
}

const rules = reactive({
    old_password: [{ required: true, message: '请输入原密码', trigger: ['blur', 'change'] }],
    new_password: [
        { required: true, message: '请输入新密码', trigger: ['blur', 'change'] },
        { min: 6, max: 20, message: '新密码长度在6-20之间', trigger: ['blur', 'change'] }
    ],
    confirm_password: [{ validator: checkConfirmPassword, trigger: 'blur' }],
})


const dialogVisible = ref(false)

const open = () => {
    dialogVisible.value = true
    nextTick(() => {
        form.value.clearValidate()
    })
}

const save = () => {
    form.value.validate((valid: Boolean) => {
        if (valid) {
            const data = {
                user_id: userStore.user_id,
                old_password: '',
                new_password: '',
                confirm_password: ''
            }
            data.old_password = md5(changePasswordForm.value.old_password)
            data.new_password = md5(changePasswordForm.value.new_password)
            data.confirm_password = md5(changePasswordForm.value.confirm_password)
            console.log(userStore.user_id)
            changePassword(data).then(() => {
                ElMessageBox.confirm('密码已经修改，请重新登录','提示',{
                    type: 'info',
                    showCancelButton: false
                }).then(() => {
                    logout()
                }).catch(() => {
                    logout()
                })
                ElMessage.success('用户信息修改成功')
            })
        } else {
            return false
        }
    })
}

const logout = () => {
    logoutApi({ user_id: userStore.user_id }).then(() => {
        userStore.clearUserInfo()
        router.replace({ name: 'login' })
    })
}

const onClose = () => {
    changePasswordForm.value = {
        old_password: '',
        new_password: '',
        confirm_password: ''
    }
}

defineExpose({
    open
})
</script>
