<template>
  <div>
    <VanPop :shown="shown" />
    <van-tabbar route active-color="#f28512" inactive-color="#000" safe-area-inset-top=true>
      <van-tabbar-item replace :to="{ name: 'index' }" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item @click="showPopup" icon="notes-o">广告</van-tabbar-item>
      <van-tabbar-item replace :to="{ name: 'my' }" icon="contact">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import VanPop from "@/components/VanPop.vue";
export default {
  data() {
    return {
      shown: { flag: false },
      icon: {
        active: '/static/nav/home_active.png',
        inactive: '/ad/home.png',
      },
    };
  },
  methods: {
    showPopup() {
      this.shown.flag = true;
    },
  },
  components: { VanPop },
};
</script>
<style lang="scss" scoped>
.van-badge--fixed {
  right: 8px !important;
  top: 6px !important;
}
</style>