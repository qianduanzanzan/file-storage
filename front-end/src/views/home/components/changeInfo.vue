<template>
    <el-dialog title="修改个人信息" v-model="dialogVisible" :close-on-click-modal="false" @close="onClose" width="500px">
        <div class="container">
            <el-form :model="updateForm" ref="form" :rules="rules" label-width="80px" :inline="false" size="default">
                <el-form-item label="用户名">
                    <el-input v-model="updateForm.nick_name" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload class="avatar-uploader" action="" drag :show-file-list="false"
                        :before-upload="beforeUpload" :limit="1">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
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
import { reactive, ref } from 'vue';
import store from "@/store";
import { storeToRefs } from "pinia";
import { updateUser } from "@/api/user.api"
import { getUserInfo } from '@/api/login.api';
import { ElMessage } from "element-plus";

const userStore = store.user()

const useStores: any = storeToRefs(store.user());

const updateForm = ref({
    nick_name: '',
})

const form = ref()

const imageUrl = ref('')

const rules = reactive({
    nick_name: [{ required: true, message: '用户名不能为空', trigger: ['blur', 'change'] }],
})

let avatar:any = null

const dialogVisible = ref(false)

const open = () => {
    updateForm.value.nick_name = useStores.nick_name.value
    imageUrl.value = useStores.avatar.value
    dialogVisible.value = true
}

const save = () => {
    form.value.validate((valid:Boolean) => {
        if(valid){
            updateUser({...updateForm.value,avatar: avatar,id: useStores.user_id.value}).then(() => {
                getUserInfo({user_id:useStores.user_id.value}).then(res => {
                    userStore.setUserInfo(res.data.result)
                })
                ElMessage.success('用户信息修改成功')
                dialogVisible.value = false
            })
        }else{
            return false
        }
    })
}

const beforeUpload = (file: any) => {
    avatar = file
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        imageUrl.value = this.result as string
    }
    return false
}

const onClose = () => {
    updateForm.value = {
        nick_name: ''
    }
    imageUrl.value = ''
    avatar = null
    form.value.clearValidate()
}

defineExpose({
    open
})
</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

:deep(.el-upload-dragger) {
    padding: 0;
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

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
