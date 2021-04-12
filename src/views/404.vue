<template>
  <div>
    <h1>404</h1>
    <div>页面不存在</div>
    <a href="javascript:;" @click="back">返回首页</a>
  </div>
</template>
<script>
export default {
  methods: {
    back() {
      this.$router.push({name: "index"});
    },
  },
};
</script>
<style lang="scss" scoped>
div {
  text-align: center;
}
h1 {
  font-size: 148px;
  color: crimson;
}
a {
  margin-top: 30px;
  display: block;
  color: chocolate;
}
</style>