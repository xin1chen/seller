<template>
  <div class="detail_op">
    <a v-if="totalStatus == 1" class="op_pay" @click="pay"
      ><div class="operate_icon pay_icon"></div>
      <div>立即支付</div></a
    >
    <a v-if="order.status == '102'" class="op_cancel" @click="cancel"
      ><div class="operate_icon cancel_icon"></div>
      <div>取消订单</div></a
    >
    <a v-if="order.status == 1031" class="op_send" @click="send"
      ><div class="operate_icon send_icon"><van-icon name="bag" /></div>
      <div>立即发货</div></a
    >
    <a v-if="order.status == 1035" class="op_complete" @click="complete"
      >完成订单</a
    >
    <a class="op_print" @click="print"
      ><div class="operate_icon print_icon"><van-icon name="printer" /></div>
      <div>打印小票</div></a
    >
    <van-dialog
      v-model="showPop"
      title="结单"
      show-cancel-button
      :before-close="close_pop"
    >
      <div class="pop_wrapper">
        <div class="pop_text">
          确定已经收取顾客<span>{{ order.realAmount }}</span
          >元并结束该桌订单吗？
        </div>
        <div>
          <van-field
            v-model="order.realAmount"
            label="实付金额"
            type="number"
            placeholder="请输入金额"
            clearable
          />
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { Toast } from "vant";
import storage from "@/model/storage";
import { printOrder, completeOrder, updateOrder, cancelOrder } from "@/api";
export default {
  data() {
    return {
      tradeId: this.$route.params.tradeId,
      orderType: this.$route.params.orderType,
      token: storage.get("seller").token,
      showPop: false,
    };
  },
  props: {
    order: Object,
    getOrderDetail: Function,
  },
  watch: {
    order: {
      deep: true,
      handler() {},
    },
  },
  methods: {
    pay_order(index) {
      console.log("堂食订单付款：" + this.order.orderList[index].tradeId);
      completeOrder({
        token: this.token,
        tradeId: this.order.orderList[index].tradeId,
      }).then((resdata) => {
        const { code } = resdata;
        if (code == "0") {
          Toast.success("堂食订单付款成功");
          this.getOrderDetail();
        } else {
          Toast.fail("堂食订单付款失败");
        }
      });
    },
    cancel_order(index) {
      cancelOrder({
        token: this.token,
        tradeId: this.order.orderList[index].tradeId,
      }).then((resdata) => {
        const { code } = resdata;
        if (code == "0") {
          Toast.success("取消订单成功");
          this.getOrderDetail();
        } else {
          Toast.fail("取消订单失败");
        }
      });
    },
    cancel() {
      cancelOrder({
        token: this.token,
        tradeId: this.tradeId,
      }).then((resdata) => {
        const { code } = resdata;
        if (code == "0") {
          Toast.success("取消订单成功");
          this.getOrderDetail();
        } else {
          Toast.fail("取消订单失败");
        }
      });
    },
    pay() {
      this.showPop = true;
    },
    close_pop(action, done) {
      var that = this;
      if (action === "confirm") {
        completeOrder({
          token: this.token,
          tradeId: this.tradeId,
          realPayAmount: this.order.realAmount,
        }).then((resdata) => {
          const { code } = resdata;
          if (code == "0") {
            Toast.success({
              message: "堂食结账成功",
              onClose: function () {
                that.showPop = false;
                that.getOrderDetail();
                done();
              },
            });
          } else {
            Toast.fail("堂食结单失败");
            that.showPop = false;
          }
        });
      } else {
        done();
      }
    },
    send() {
      updateOrder({
        token: this.token,
        tradeId: this.tradeId,
        status: "1032",
      }).then((resdata) => {
        const { code } = resdata;
        if (code == "0") {
          Toast.success("配送成功");
          this.getOrderDetail();
        } else {
          Toast.fail("配送失败");
        }
      });
    },
    complete() {
      updateOrder({
        token: this.token,
        tradeId: this.tradeId,
        status: "100",
      }).then((resdata) => {
        const { code } = resdata;
        if (code == "0") {
          Toast.success("自取成功");
          this.getOrderDetail();
        } else {
          Toast.fail("自取失败");
        }
      });
    },
    delgood(val) {
      var { order_index, good_index } = val;
      this.order.orderList[order_index].productList.splice(good_index, 1);
      var that = this;
      Toast.success({
        message: "删除成功",
        onClose: function () {
          that.getOrderDetail();
        },
      });
    },
    print() {
      printOrder({ token: this.token, tradeId: this.tradeId }).then(
        (resdata) => {
          const { code } = resdata;
          if (code == "0") {
            Toast.success("打印小票成功");
            this.getOrderDetail();
          } else {
            Toast.fail("打印小票失败");
          }
        }
      );
    },
  },
  computed: {
    totalStatus: function () {
      var f = 0;
      if (this.order && this.order.orderList && this.order.orderList.length) {
        var i = 0,
          l = this.order.orderList.length,
          o = null;
        for (; i < l; i++) {
          o = this.order.orderList[i];
          if (o.status == 102) {
            f = 1;
            break;
          }
        }
      }
      return f;
    },
  },
};
</script>
<style lang="scss" scoped>
@mixin bg-image($path) {
  background-image: url($path + "@2x.png");
  @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
    background-image: url($path + "@3x.png");
  }
}
.operate_icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-repeat: no-repeat;
  background-size: 32px;
  background-position: center;
}
.detail_op {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  a {
    color: #333;
    min-width: 100px;
    text-align: center;
    line-height: 18px;
    font-size: 13px;
    &.op_cancel {
      .cancel_icon {
        @include bg-image("cancel");
      }
    }
    &.op_pay {
      color: #f28512;
      .pay_icon {
        @include bg-image("pay");
      }
    }
    .send_icon,
    .print_icon {
      font-size: 20px;
    }
  }
}
.pop_wrapper {
  padding: 15px 20px;
  font-size: 14px;
  .pop_text {
    padding: 0 16px;
    span {
      color: #f28512;
      font-size: 16px;
      font-weight: 700;
    }
  }
  /deep/.van-cell {
    align-items: center;
    .van-field__value {
      border: 1px solid #bbb;
      padding: 0px 5px;
      .van-field__control {
        height: 32px;
      }
    }
  }
}
/deep/.van-dialog__confirm {
  color: #fff;
  background: #ee0a24;
}
</style>