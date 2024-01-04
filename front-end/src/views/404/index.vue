<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const time = ref(3)
let timeout:any = null

const toHome = () => {
    router.push({name: 'login'})
    if(timeout){
        clearInterval(timeout)
        timeout = null
    }
}

onMounted(() => {
    timeout = setInterval(() => {
        time.value--
        if(time.value == 0){
            toHome()
        }
    },1000)
})

</script>

<template>
    <div class="page-404">
        <img style="height: 500px" src="@/assets/images/404.png" alt="">
        <div class="tip-text">您找的页面不存在，<span class="time">{{ time }}</span>秒后返回首页</div>
        <div class="tip-text" style="margin-top: 10px">或者点击<span @click="toHome" class="mock-btn">此处</span>立即返回首页</div>
    </div>
</template>

<style lang="scss" scoped>
.page-404{
    padding: 120px 0 0 0;
    text-align: center;
}
.tip-text{
    color: #9f9f9f;
}
.mock-btn{
    color: #409eff;
    font-style:oblique;
    cursor: pointer;
    font-weight: bold;
    font-size: 18px;
}
.time{
    color: #409eff;
    font-weight: bold;
    font-size: 18px;
}
</style>
