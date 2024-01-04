<template>
    <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="false" @close="onClose" width="500px">
        <div v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="努力上传中，请稍后" class="container">
            <el-form :model="fileForm" ref="form" :rules="rules" label-width="80px" :inline="false" size="default">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="fileForm.name" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select style="width: 100%" @change="onChange" v-model="fileForm.type">
                        <el-option v-for="(item, index) in ['文件夹', '文件']" :key="index" :label="item"
                            :value="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="fileForm.type == 1" label="文件">
                    <el-upload action="" style="width: 100%" ref="uploadRef" :before-upload="beforeUpload"
                        :auto-upload="false" :limit="1" v-model:file-list="fileList">
                        <template #trigger>
                            <el-button size="default" type="primary">选择文件</el-button>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
        </template>
    </el-dialog>
    <el-progress :width="200" :stroke-width="15" class="progress" v-if="showProgress" type="dashboard"
        :percentage="percentage">
        <template #default="{ percentage }">
            <div class="percentage-value">{{ percentage }}%</div>
            <div class="percentage-label">{{ uploadedSize }} / {{ totleSize }}</div>
        </template>
    </el-progress>
</template>

<script lang="ts" setup>
import { reactive, ref, Ref } from 'vue';
import { addFile } from "@/api/file.api"
import { formatSize } from '@/utils/tools'
import { ElMessage } from 'element-plus';

const fileForm = ref({
    name: '',
    type: 0,
})
const form = ref()
const uploadRef = ref()
const showProgress = ref(false)

const percentage = ref(0)

const totleSize = ref('0')

const uploadedSize = ref('0')

const fileList: Ref<any[]> = ref([])

const fullscreenLoading = ref(false)

const emit = defineEmits(['on-success'])

const pid = ref(0)

const rules = reactive({
    name: [{ required: true, message: '名称不能为空', trigger: ['blur', 'change'] }],
    type: [{ required: true, message: '类型不能为空', trigger: ['blur', 'change'] }],
})

const title = ref('新增')
const dialogVisible = ref(false)

const open = (currentPid: any) => {
    pid.value = currentPid
    dialogVisible.value = true
}

const save = () => {
    form.value.validate((valid: Boolean) => {
        if (valid) {
            if (fileForm.value.type == 1) {
                if (fileList.value.length === 0) {
                    ElMessage.warning('类型为文件时必须上传文件')
                    return
                }
            }
            fullscreenLoading.value = true
            if (fileForm.value.type == 1) showProgress.value = true
            addFile({ ...fileForm.value, pid: pid.value, file: fileList.value[0]?.raw }, (ps: any) => {
                percentage.value = Number(((ps.loaded / ps.total) * 100).toFixed(2))
                totleSize.value = formatSize(ps.total)
                uploadedSize.value = formatSize(ps.loaded)
            }).then((res) => {
                if (res.data.isOk) {
                    dialogVisible.value = false
                    emit('on-success')
                }
            }).finally(() => {
                fullscreenLoading.value = false
                showProgress.value = false
            })
        } else {
            return false
        }
    })
}

const beforeUpload = (file: any) => {
    return false
}

const onClose = () => {
    fileForm.value = {
        name: '',
        type: 0,
    }
    fileList.value = []
    form.value.clearValidate()
}

const onChange = () => {
    fileList.value = []
}

defineExpose({
    open
})
</script>

<style lang="scss" scoped>
.container {
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
    padding: 20px 0;
    height: 300px;
}

.progress {
    position: fixed;
    left: 50%;
    top: 30%;
    transform: translateX(-50%);
    z-index: 10000;
}

.percentage-value {
    display: block;
    margin-top: 10px;
    font-size: 28px;
}

.percentage-label {
    display: block;
    margin-top: 10px;
    font-size: 12px;
}
</style>
