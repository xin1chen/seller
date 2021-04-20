<template>
  <div class="order_item">
    <router-link
      :to="{
        name: 'orderDetail',
        params: { tradeId: order.tradeId, orderType: order.orderType },
      }"
    >
      <div class="order_title">
        <div class="order_sn">订单号: {{ order.tradeId }}</div>
        <span v-if="order.orderType == 't'" class="table_no"
          >桌号：{{ order.tableNo }}</span
        >
        <span class="order_status" :class="{ ing }">{{
          order.status | orderStatusText
        }}</span>
      </div>
      <div class="order_goods">
        <div class="order_goods_list">
          <div
            class="good"
            v-for="(good, i) in order.productList.slice(0, 3)"
            :key="good.productId + i"
          >
            <img :src="good.img" />
          </div>
          <div class="good_info" v-if="order.productList.length == 1">
            <div class="good_name">{{ order.productList[0].productName }}</div>
            <div class="good_desc">{{ order.productList[0].remark }}</div>
          </div>
        </div>
        <div class="order_count" v-if="order.productList.length == 1">
          <van-icon name="cross" /> 1
        </div>
        <div class="order_count" v-if="order.productList.length > 1">
          共{{ order.productList.length }}件 <van-icon name="arrow" />
        </div>
      </div>
      <div class="order_time_price">
        <div class="order_time">{{ order.tradeTime }}</div>
        <div class="order_price">
          合计：<span>¥{{ order.realAmount }}</span>
        </div>
      </div>
    </router-link>
    <div
      class="order_operate"
      v-if="order.status != 100 && order.status != 1052"
    >
      <a
        class="order_pay"
        v-if="order.status == 102 && order.orderType == 't'"
        @click="pay"
        >支付</a
      >
      <a class="order_delivery" v-if="order.status == 1031" @click="send"
        >配送</a
      >
      <a class="order_delivery" v-if="order.status == 1035" @click="complete"
        >提货</a
      >
      <a
        class="order_cancel"
        v-if="
          order.orderType == 'w' &&
          (order.status == 102 || order.status == 1031)
        "
        @click="cancel"
        >取消订单</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderItem",
  props: {
    order: Object,
  },
  methods: {
    pay() {
      this.$emit("pay", this.order.tradeId);
    },
    send() {
      this.$emit("send", this.order.tradeId);
    },
    complete() {
      this.$emit("complete", this.order.tradeId);
    },
    cancel() {
      this.$emit("cancel", this.order.tradeId);
    },
  },
  filters: {
    orderStatusText: function (status) {
      var statuses = {
        100: "已完成",
        102: "待付款",
        1031: "待发货",
        1032: "已发货",
        1035: "待提货",
        1052: "订单取消",
      };
      return statuses[status];
    },
  },
  computed: {
    ing: function () {
      return this.order.status !== 100 && this.order.status !== 1052;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.order_item {
  & + .order_item {
    margin-top: 12px;
  }
  border-radius: 5px;
  background: #fff;
  padding: 12px;
  .order_title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 14px;
    align-items: center;
    color: #333;
    .order_status {
      font-size: 13px;
      color: #0d0d0db5;
    }

    .order_status.ing {
      color: #49ae35fc;
    }
  }
  .order_sn,
  .table_no {
    font-weight: 700;
  }
  .order_goods {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    padding: 8px 0;
    .order_count {
      font-size: 11px;
      color: #464444cc;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .order_goods_list {
      display: flex;
      flex: 1;
      .good {
        width: 65px;
        height: 65px;
        overflow: hidden;
        border-radius: 5px;
        margin-right: 8px;
        img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
      }
    }
    .good_info {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      color: #333;
      .good_desc {
        font-size: 12px;
        color: #464444cc;
      }
    }
  }
  .order_time_price {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #444444;
    margin-top: 5px;
    span {
      color: #0d0d0dd6;
      font-weight: 700;
      font-size: 14px;
    }
  }
  .order_operate {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
    a {
      border: 1px solid #aaa7a7;
      padding: 5px 10px;
      background: #aaa7a7;
      border-radius: 5px;
      color: #fff;
      margin-left: 10px;
      font-size: 14px;
      &.order_delivery,
      &.order_pay {
        border-color: #f27e03;
        color: #f27e03;
        background: transparent;
      }
    }
  }
}
</style>
