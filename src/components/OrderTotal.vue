<template>
  <div class="detail_total_wrapper">
    <div class="line"></div>
    <div>
      <div>小计</div>
      <div>¥{{ order.totalAmount }}</div>
    </div>
    <div v-if="order.tipAmount && order.tipAmount != '0.00'">
      <div>小费</div>
      <div>¥{{ order.tipAmount }}</div>
    </div>
    <div v-if="order.exciseAmount && order.exciseAmount != '0.00'">
      <div class="has_icon">
        <support-ico :size="4" :type="'excise'"></support-ico>消费税
      </div>
      <div>¥{{ order.exciseAmount }}</div>
    </div>
    <div v-if="order.reduceAmount && order.reduceAmount != '0.00'">
      <div class="has_icon">
        <support-ico :size="4" :type="'reduce'"></support-ico>满减优惠
      </div>
      <div class="discount">-¥{{ order.reduceAmount }}</div>
    </div>
    <div v-if="order.couponAmount && order.couponAmount != '0.00'">
      <div class="has_icon">
        <support-ico :size="4" :type="'coupon'"></support-ico>优惠券
      </div>
      <div class="discount">-¥{{ order.couponAmount }}</div>
    </div>
    <div v-if="order.redbagReduceAmount && order.redbagReduceAmount != '0.00'">
      <div class="has_icon">
        <support-ico :size="4" :type="'redbagReduce'"></support-ico>红包
      </div>
      <div class="discount">-¥{{ order.redbagReduceAmount }}</div>
    </div>

    <div class="line"></div>
    <div class="detail_total_inner">
      <div v-if="discount != 0">
        已优惠<span class="discount">￥{{ discount }}</span>
      </div>
      <div>
        实付￥<span class="realAmount">{{ order.realAmount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import SupportIco from "@/components/support-ico/support-ico";
export default {
  name: "OrderTotal",
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
    discount() {
      return (
        parseFloat(this.order.reduceAmount || 0) +
        parseFloat(this.order.couponAmount || 0) +
        parseFloat(this.order.redbagReduceAmount || 0)
      );
    },
  },
  components: {
    SupportIco,
  },
};
</script>

<style lang="scss" scoped>
.detail_total_wrapper {
  padding: 0 12px;
  color: #101010;
  .line {
    background: #eee;
    height: 1px;
    width: 100%;
    transform: scaleY(0.5);
    margin: 12px 0;
  }
  .discount {
    color: #f93a4a;
  }
  .support-ico {
    margin-right: 5px;
  }
  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    .has_icon {
      display: flex;
      align-items: center;
    }
  }
  .detail_total_inner {
    justify-content: flex-end;
    align-items: baseline;
    margin-bottom: 0;
    div + div {
      margin-left: 20px;
    }
    .realAmount {
      font-size: 22px;
      font-weight: 700;
    }
  }
}
</style>