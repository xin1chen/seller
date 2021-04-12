<template>
  <div>
    <div class="order_status">
      {{ totalStatus }}
      <span v-if="order.orderType == 't'">桌号:{{ order.tableNo }}</span>
    </div>
    <div class="order_op_wrapper">
      <OrderOperate :order="order" :getOrderDetail="getOrderDetail"/>
    </div>
  </div>
</template>

<script>
import OrderOperate from "@/components/OrderOperate/OrderOperate";
export default {
  name: "OrderInnerInfo",
  data() {
    return {};
  },
  props: {
    order: Object,
    getOrderDetail: Function
  },
  watch: {
    order: {
      deep: true,
      handler() {},
    },
  },
  methods:{
    
  },
  computed: {
    totalStatus: function () {
      var statuses = {
        100: "订单已完成",
        102: "订单待付款",
        1031: "订单待发货",
        1032: "订单已发货",
        1035: "订单待提货",
        1052: "订单已取消",
      };
      if (this.order.orderType == "w") {
        return statuses[this.order.status];
      }
      if (
        this.order.orderType == "t" &&
        this.order.orderList &&
        this.order.orderList.length
      ) {
        var i = 0,
          l = this.order.orderList.length,
          o = null;
        for (; i < l; i++) {
          o = this.order.orderList[i];
          if (o.status == 102) {
            return statuses[this.order.orderList[i].status];
          }
          if (o.status == 100) {
            return statuses[this.order.orderList[i].status];
          }
        }
        //return ["订单已完成", "订单待付款"][f];
        return statuses[1052];
      }
      return "";
    },
  },
  components: {
    OrderOperate,
  },
};
</script>

<style lang="scss" scoped>
.order_status {
  font-size: 22px;
  font-weight: 700;
  display: flex;
  span {
    margin-left: 30px;
    font-size: 16px;
  }
}
.order_op_wrapper {
  margin-top: 12px;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  h3 {
    font-size: 15px;
    padding: 0;
    margin: 0;
  }
  .line {
    background: #eee;
    height: 1px;
    width: 100%;
    transform: scaleY(0.5);
    margin: 12px 0;
  }
}
</style>