<template>
  <div class="home">
    <router-view />
    <Nav />
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue"
export default {
  data() {
    return {
    };
  },
  components:{
    Nav
  }
};
</script>
<style lang="scss" scoped>
.home{
  height: calc(100% - 50px);
  padding: 0;
  font-size: 14px;
  background: #fafafa;
}
</style>