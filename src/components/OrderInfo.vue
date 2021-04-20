<template>
  <div class="order_outer">
    <h3>订单信息</h3>
    <div class="row">
      <div class="label">订单号：</div>
      <div class="value" :title="tradeId">{{ tradeId }}</div>
    </div>
    <div class="row">
      <div class="label">下单时间：</div>
      <div class="value" :title="tradeTime">{{ tradeTime }}</div>
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
  computed: {
    tradeId() {
      if (this.order.orderType == "w") {
        return this.order.tradeId;
      }
      if (this.order.orderType == "t") {
        var list = this.order.orderList,
          l = list ? list.length : 0;
        if (l) {
          return list
            .map((element) => {
              return element.tradeId;
            })
            .join(",");
        }
        return "";
      }
      return "";
    },
    tradeTime() {
      if (this.order.orderType == "w") {
        return this.order.tradeTime;
      }
      if (this.order.orderType == "t") {
        var list = this.order.orderList,
          l = list ? list.length : 0;
        if (l) {
          return list
            .map((element) => {
              return element.tradeTime;
            })
            .join(",");
        }
        return "";
      }
      return "";
    },
  },
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
    align-items: baseline;
    color: #333;
    .label {
      color: #999999;
      width: 73px;
    }
    .value {
      width: calc(100% - 73px);
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>