<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import store from '@/store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { getUserInfo } from './api/login.api';

const userStore = store.user()
const useStores: any = storeToRefs(store.user());

const userInfo = localStorage.getItem('userInfo')
if(userInfo){
  try{
    userStore.setUserInfo(JSON.parse(userInfo))
    getUserInfo({user_id:useStores.user_id.value}).then(res => {
      userStore.setUserInfo(res.data.result)
    })
  }catch (e){
    console.log(e)
    localStorage.removeItem('userInfo')
  }
}
// const resize = () => {
//   const xRate = window.innerWidth / 1920
//   const yRate = window.innerHeight / 969
//   // console.log(document.body.clientWidth,document.body.clientHeight)
//   // const app:any = document.getElementById('app')
//   document.body.style.width = `${1920}px`
//   document.body.style.height = `${969 / yRate}px`
//   document.body.style.transform = `scale(${xRate},${yRate})`
// }
// onMounted(() => {
//   resize()
// })

// window.onresize = resize
</script>

<style>
body{
  transform-origin: 0px 0px;
}
</style>
