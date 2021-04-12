<template>
  <div class="order_outer">
    <h3>配送信息</h3>
    <div class="row">
      <div class="label">收货人：</div>
      <div>
        {{ order.name }}
      </div>
    </div>
    <div class="row">
      <div class="label">电话：</div>
      <div>
        {{ order.tel }}
      </div>
    </div>
    <div class="row">
      <div class="label">收货地址：</div>
      <div class="value">{{ order.address }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    order: Object,
  },
  watch: {
    order: {
      deep: true,
      handler() {},
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.order_outer {
  padding: 12px;
  background: #fff;
  margin: 12px 0 0;
  border-radius: 8px;
  h3 {
    font-size: 16px;
    font-weight: 700;
    padding: 0;
    margin: 0;
  }
  .row {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    color: #333;
    .label {
      color: #999999;
      width: 70px;
    }
    .value {
      width: calc(100% - 70px);
      text-align: right;
    }
  }
}
</style>