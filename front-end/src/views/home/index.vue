<script lang="ts" setup>
import { getFileIconName } from "@/lib/fileType";
import { ElMessage, ElMessageBox } from "element-plus";
import { Ref, ref } from "vue";
import store from "@/store";
import { storeToRefs } from "pinia";
import { getFileList, delFile as delFileApi, updateFile, downloadFile } from "@/api/file.api";
import { logout as logoutApi } from '@/api/login.api'
import changeInfoVue from "./components/changeInfo.vue";
import changePasswordVue from "./components/changePassword.vue";
import { useRouter } from 'vue-router';

const fileType = ['文件夹', '文件']
const router = useRouter()
const userVux = store.user()
const useStores: any = storeToRefs(userVux);

const fileList: Ref<any[]> = ref([]);
const searchKey = ref("");

const remoteUrl = {
  dev: "http://127.0.0.1:3001",
  prod: "http://124.70.25.229:3000",
};

const changeInfoRef = ref()
const changePasswordRef = ref()

const showLoading = ref(false);

const addFileRef: any = ref(null);

const pid = ref(0);

const breadcrumbArr: any = ref([]);

const onClickBreadcrumb = (e: any) => {
  const data = e.target.dataset;
  if (!data.pid) return;
  searchKey.value = "";
  pid.value = data.pid;
  breadcrumbArr.value = breadcrumbArr.value.slice(
    0,
    Number(e.target.dataset.index) + 1
  );
  getFile();
};

const getFile = () => {
  showLoading.value = true;
  getFileList({ pid: pid.value, name: searchKey.value })
    .then((res) => {
      if (res.data.isOk) {
        fileList.value = res.data.result;
      }
    })
    .finally(() => {
      showLoading.value = false;
    });
};

const downloadOrChangeFolder = (data: any) => {
  if (!Number(data.type)) {
    pid.value = data.id;
    breadcrumbArr.value.push({
      label: data.name,
      pid: data.id,
    });
    getFile();
  } else {
    const a = document.createElement("a");
    a.href = `${remoteUrl.dev}/file-stronge-manage/get-file/${data.id}`;
    document.body.append(a);
    a.click();
    a.remove();
    // downloadFile(data.id).then(res => {
    //   if(res.status === 200){
    //     const blob = res.data;
    //     const reader = new FileReader();
    //     reader.readAsDataURL(blob);
    //     reader.onload = function (e:any) {
    //         console.log(e)
    //         const a = document.createElement("a");
    //         a.href = e.target.result;
    //         document.body.append(a);
    //         a.click();
    //         a.remove();
    //       }
    //   }
    // })
  }
};

getFile();

const addFilebtn = () => {
  addFileRef.value.open(pid.value);
};

const delFile = (id: String) => {
  ElMessageBox.confirm("确认删除吗？", "提示", {
    type: "warning",
  })
    .then(() => {
      showLoading.value = true;
      delFileApi({ id })
        .then((res) => {
          if (res.data.isOk) {
            getFile();
            ElMessage({
              type: "success",
              message: "删除成功",
            });
          }
        })
        .finally(() => {
          showLoading.value = false;
        });
    })
    .catch(() => { });
};

const back = () => {
  if (breadcrumbArr.value.length > 0) {
    breadcrumbArr.value.pop()
    if (breadcrumbArr.value.length > 0) {
      pid.value = breadcrumbArr.value[breadcrumbArr.value.length - 1].pid;
    } else {
      pid.value = 0
    }
    getFile();
  }
}

const changeName = (data: any) => {
  console.log(data)
  const msg = fileType[data.type]
  ElMessageBox.prompt(`请输入${msg}新名称`, `修改${msg}名称`, {
    inputValue: data.name,
    inputPlaceholder: `请输入${msg}新名称`,
    inputValidator: (val: String) => {
      if (!val) {
        return false
      }
      return true
    },
    inputErrorMessage: `请输入${msg}新名称`
  }).then(({ value }) => {
    updateFile({ id: data.id, name: value }).then(res => {
      getFile();
    })
  }).catch(() => { })
}

const changeInfo = () => {
  changeInfoRef.value?.open()
}

const changePWD = () => {
  changePasswordRef.value?.open()
}

const logout = () => {
  ElMessageBox.confirm('确认退出登录吗？', '提示', {
    type: 'warning'
  }).then(() => {
    logoutApi({ user_id: useStores.user_id.value }).then(() => {
      userVux.clearUserInfo()
      router.replace({ name: 'login' })
      ElMessage({
        type: "success",
        message: "登出成功",
      });
    })
  }).catch(() => { })
}
</script>

<template>
  <div class="header">
    <div></div>
    <div style="display: flex; align-items: center">
      <el-avatar style="margin-right: 10px" :size="50" :src="useStores.avatar.value" />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ useStores.nick_name.value }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="changeInfo">修改信息</el-dropdown-item>
            <el-dropdown-item @click="changePWD">修改密码</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <div v-loading="showLoading" class="container">
    <div class="breadcrumb" @click="onClickBreadcrumb">
      <div class="flex a-c">
        <el-icon size="25px" class="backBtn" style="margin-right: 5px" @click="back">
          <Back />
        </el-icon>
        |
        <span style="margin: 0 5px" :data-pid="0" :data-index="-1">首页</span>
        <template v-for="(item, index) in breadcrumbArr" :key="item.pid">
          /
          <span style="margin: 0 5px" :data-index="index" :data-pid="item.pid">{{ item.label }}</span>
        </template>
      </div>
      <div>
        <el-input placeholder="请输入关键字搜索" style="width: 200px" @clear="getFile" clearable v-model="searchKey"></el-input>
        <el-button type="primary" @click="getFile">搜索</el-button>
        <el-button type="primary" @click="addFilebtn">新增</el-button>
      </div>
    </div>
    <div v-if="fileList.length > 0" class="grid-content">
      <template v-for="item in fileList" :key="item.id">
        <div class="m-10 file-card" :class="{ isFile: Number(item.type) }" @click="downloadOrChangeFolder(item)"
          style="height: 120px; padding-top: 10px">
          <div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: #409eff;
              justify-content: center;
              align-items: center;
            " class="mock-setting-btn">
            <el-icon @click.stop="changeName(item)" size="12px" color="#ffffff">
              <Setting />
            </el-icon>
          </div>
          <div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: red;
              justify-content: center;
              align-items: center;
            " class="mock-btn">
              <el-icon style="padding-top: -2px;" @click.stop="delFile(item.id)" size="12px" color="#ffffff">
            <Delete />
          </el-icon>
          </div>
          <svg-icon style="font-size: 70px; height: 85px"
            :iconName="getFileIconName(Number(item.type), item.suffix)"></svg-icon>
          <div class="file-name" style="
              text-align: center;
              line-height: 20px;
              height: 20px;
              font-size: 13px;
            ">
            <span v-if="!Number(item.type) || !item.suffix">{{ item.name }}</span>
            <span v-else>{{ `${item.name}.${item.suffix}` }}</span>
          </div>
          <div class="mask">
            <div class="download-btn">
              <el-icon size="30px" color="#000000"><Download /></el-icon>
              <div>下载</div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-else style="width: 100%;padding-top: 20%">
      <el-empty description="还没有文件哦！！！" />
    </div>
  </div>

  <add-file @on-success="getFile" ref="addFileRef"></add-file>
  <change-info-vue ref="changeInfoRef" />
  <change-password-vue ref="changePasswordRef" />
</template>
  
<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  padding-bottom: 10px;
  font-size: 16px;
  justify-content: space-between;
  align-items: center;

  & span {
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }
}

.backBtn {
  cursor: pointer;

  &:hover {
    color: #409eff;
  }
}

.header {
  height: 60px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  padding: 0 10%;
  align-items: center;

  &>span {
    font-size: 28px;
    font-weight: bold;
  }
}

.container {
  margin: 20px auto;
  width: 1000px;
  box-shadow: 10px 10px 30px 0px #cccccc;
  height: 869px;
  border-radius: 8px;
  padding: 10px;
}

.grid-content {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  text-align: center;
}

.file-card {
  position: relative;
  box-shadow: 5px 5px 10px 0px #cccccc;
  border-radius: 8px;

  & .mock-setting-btn {
    position: absolute;
    top: -10px;
    right: 20px;
    display: none;
    cursor: pointer;
    z-index: 30;
  }

  &:hover .mock-setting-btn {
    display: flex;
  }

  & .mock-btn {
    position: absolute;
    top: -10px;
    right: -8px;
    display: none;
    cursor: pointer;
    z-index: 30;
  }

  &:hover .mock-btn {
    display: flex;
  }
}

.file-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100px;
  margin: 0 auto;
}

.mask{
  width: 100%;
  height: 100%;
  display: none;
  background: #000000;
  opacity: .5;
  position: absolute;
  top: 0px;
  left: 0;
  z-index: 20;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.isFile{
  &:hover{
    & .mask{
      display: flex;
    }
}
}

.download-btn{
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ffffff;
  opacity: 0.8;
  text-align: center;
}
</style>
  