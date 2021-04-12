<template>
  <div class="main">
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
.main{
  padding: 0;
  font-size: 14px;
  background: #fafafa;
}
</style>