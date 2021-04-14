<template>
  <div class="order_wrapper">
    <div class="order_inner_wrapper">
      <div class="detail_info">
        <OrderOperateInfo
          :order="order"
          :getOrderDetail="getOrderDetail"
          class="order_pay"
        />
      </div>
      <div class="detail_wrapper">
        <div class="detail_goods_list">
          <div
            class="detail_item"
            v-if="order.goodsList && order.goodsList.length > 0"
          >
            <Good
              v-for="(good, index) in order.goodsList"
              :good="good"
              :key="index"
            />
          </div>
          <div
            v-for="(_order, index) in order.orderList"
            :key="index"
            class="detail_item"
          >
            <div class="item_title">
              <div>
                下单时间：<span>{{ _order.tradeTime }}</span>
              </div>
              <div v-if="_order.status == 102" class="item_op">
                <a href="javascript:;" @click="cancel_order(index)">取消</a>
              </div>
              <div v-if="_order.status == 100" style="padding-right: 12px">
                已结账
              </div>
            </div>
            <Good
              v-for="(good, good_index) in _order.productList.slice(0, _order.slice)"
              :good="good"
              :status="_order.status"
              :orderIndex="index"
              :goodIndex="good_index"
              :key="good_index"
              @delgood="delgood"
            />
          <div v-if="_order.productList.length > _order.slice" class="more_goods" @click="showAllGoods(_order)">展开（共{{_order.productList.length}}件）<van-icon name="arrow-down" /></div>
          </div>
        </div>
        <OrderTotal :order="order" />
      </div>
      <OrderOuterInfo v-if="orderType == 'w'" :order="order" />
      <OrderInfo :order="order" />
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { getWaimaiOrderDetail, getTangshiOrderDetail } from "@/api";
import Good from "@/components/Good";
import OrderOperateInfo from "@/components/OrderOperateInfo";
import OrderOuterInfo from "@/components/OrderOuterInfo";
import OrderInfo from "@/components/OrderInfo";
import OrderTotal from "@/components/OrderTotal";
import storage from "@/model/storage";
export default {
  data() {
    return {
      tradeId: this.$route.params.tradeId,
      orderType: this.$route.params.orderType,
      token: storage.get("seller").token,
      order: {},
      //slice: 3
    };
  },
  created() {
    this.getOrderDetail();
  },
  methods: {
    showAllGoods(order){
      order.slice = order.productList.length;
    },
    getOrderDetail() {
      const fm = { w: getWaimaiOrderDetail, t: getTangshiOrderDetail };
      fm[this.orderType]({
        token: this.token,
        tradeId: this.tradeId,
      }).then((resdata) => {
        const { code, data } = resdata;
        if (code == "0") {
          data.orderList.forEach(element => {
            element.slice = 3;
          });
          this.order = data;
          this.true_pay = this.order.realAmount;
          this.order.orderType = this.$route.params.orderType;
        } else {
          Toast.fail("获取订单详情失败");
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
  },
  computed: {},
  components: {
    Good,
    OrderOperateInfo,
    OrderOuterInfo,
    OrderTotal,
    OrderInfo,
  },
};
</script>

<style lang="scss" scoped>
@mixin bgImage($path) {
  background-image: url($path + "@2x.png");
  @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
    background-image: url($path + "@3x.png");
  }
}
.order_wrapper {
  font-size: 14px;
  background: #fafafa;
  .order_inner_wrapper {
    overflow-y: auto;
    padding: 12px 12px 62px;
    min-height: calc(100vh - 74px);
    .detail_info {
      font-size: 16px;
      line-height: 24px;
      color: #111111;
    }
    .detail_wrapper {
      margin-top: 12px;
      background: #fff;
      border-radius: 8px;
      padding: 12px;
      .detail_goods_list {
        .detail_item {
          .item_title {
            display: flex;
            justify-content: space-between;
            span {
              color: #999999;
            }
          }
          .item_op a {
            color: #999999;
            padding: 12px;
          }
          .more_goods{
            text-align: center;
            color: #999;
            font-size: 13px;
            padding: 3px 0 12px;
          }
        }
      }
    }
  }
  /deep/.van-dialog__message {
    span {
      font-size: 16px;
      font-weight: 700;
    }
  }
}
</style>>
