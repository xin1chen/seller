<template>
  <div>
    <van-search
      v-model="value"
      shape="round"
      placeholder="请输入桌号或订单号"
      @search="onSearch"
    />
    <van-tabs v-model="orderType" @click="tabClick" animated sticky>
      <van-tab title="全部" name="a">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <OrderItem
              v-for="order in orderList"
              :order="order"
              :key="order.tradeId"
              @pay="pay"
              @send="send"
              @complete="complete"
              @cancel="cancel"
            ></OrderItem
          ></van-list> </van-pull-refresh
      ></van-tab>
      <van-tab title="堂食" name="t">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <OrderItem
              v-for="order in tangshiOrderList"
              :order="order"
              :key="order.tradeId"
              @pay="pay"
              @send="send"
              @complete="complete"
              @cancel="cancel"
            ></OrderItem>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="外卖" name="w">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <OrderItem
              v-for="order in waimaiOrderList"
              :order="order"
              :key="order.tradeId"
              @pay="pay"
              @send="send"
              @complete="complete"
              @cancel="cancel"
            ></OrderItem
          ></van-list> </van-pull-refresh
      ></van-tab>
    </van-tabs>
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
import {
  completeOrder,
  updateOrder,
  cancelOrder,
  getWaimaiOrderList,
  getTangshiOrderList,
} from "@/api";
import { Toast } from "vant";
import OrderItem from "@/components/OrderItem";
import storage from "@/model/storage";
export default {
  data() {
    return {
      value: "",
      orderType: this.$route.params.orderType,
      tangshiOrderList: [],
      waimaiOrderList: [],
      token: storage.get("seller").token,
      showPop: false,
      order: { realAmount: 0, totalAmount: 0 },
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  props: {},
  created() {
    this.orderType = this.$route.params.orderType;
    this._getOrderList();
  },
  watch: {
    $route(to) {
      this.orderType = to.params.orderType;
    },
  },
  computed: {
    orderList: function () {
      return [].concat(this.waimaiOrderList).concat(this.tangshiOrderList);
    },
  },
  methods: {
    onLoad() {
      this.loading = true;
      if (this.orderType == "t") {
        this._getTangshiOrderList();
      }
      if (this.orderType == "w") {
        this._getWaimaiOrderList();
      }
      if (this.orderType == "a") {
        this._getTangshiOrderList();
        this._getWaimaiOrderList();
      }
    },
    onRefresh() {
      this.finished = false;
      this.loading = true;
      if (this.orderType == "t") {
        this.tangshiOrderList = [];
      }
      if (this.orderType == "w") {
        this.waimaiOrderList = [];
      }
      if (this.orderType == "a") {
        this.tangshiOrderList = [];
        this.waimaiOrderList = [];
      }
      this.onLoad();
    },
    onSearch(val) {
      console.log(val);
      this._getOrderList();
    },
    tabClick(name) {
      if (this.$route.params.orderType != name) {
        this.$router
          .push({
            name: "orderList",
            params: { orderType: name },
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    _getOrderList() {
      this._getWaimaiOrderList();
      this._getTangshiOrderList();
    },
    _getWaimaiOrderList() {
      getWaimaiOrderList({
        token: this.token,
        search: this.value,
        page: 1,
        pageRows: 20,
      }).then((resdata) => {
        const { code, data } = resdata;
        if (code == "0") {
          data.list.forEach((element) => {
            element.orderType = "w";
          });
          this.waimaiOrderList = data.list;
          this.loading = false;
          this.finished = true;
          this.refreshing = false;
        } else {
          Toast.fail("获取外卖订单失败");
        }
      });
    },
    _getTangshiOrderList() {
      getTangshiOrderList({
        token: this.token,
        search: this.value,
        page: 1,
        pageRows: 20,
      }).then((resdata) => {
        const { code, data } = resdata;
        if (code == "0") {
          data.list.forEach((element) => {
            element.orderType = "t";
          });
          this.tangshiOrderList = data.list;
          this.loading = false;
          this.finished = true;
          this.refreshing = false;
        } else {
          Toast.fail("获取堂食订单失败");
        }
      });
    },
    cancel(value) {
      var that = this;
      cancelOrder({
        token: this.token,
        tradeId: value,
      }).then((resdata) => {
        const { code } = resdata;
        if (code == "0") {
          Toast.success("取消订单成功");
          that._getOrderList();
        } else {
          Toast.fail("取消订单失败");
        }
      });
    },
    pay(value) {
      var order = this.orderList.find((element) => element.tradeId == value);
      if (order) {
        this.order = order;
      }
      this.showPop = true;
    },
    close_pop(action, done) {
      var that = this;
      if (action === "confirm") {
        completeOrder({
          token: this.token,
          tradeId: this.order.tradeId,
          realPayAmount: this.order.realAmount,
        }).then((resdata) => {
          const { code } = resdata;
          if (code == "0") {
            Toast.success({
              message: "结算成功",
              onClose: function () {
                that.showPop = false;
                if (that.order.orderType == "w") {
                  that._getWaimaiOrderList();
                }
                if (that.order.orderType == "t") {
                  that._getTangshiOrderList();
                }
              },
            });
            done();
          } else {
            Toast.fail("结算失败");
          }
        });
      } else {
        this.order = {};
        done();
      }
    },
    send(value) {
      var that = this;
      updateOrder({
        token: this.token,
        tradeId: value,
        status: "1032",
      }).then((resdata) => {
        const { code } = resdata;
        if (code == "0") {
          Toast.success("配送成功");
          that._getOrderList();
        } else {
          Toast.fail("配送失败");
        }
      });
    },
    complete(value) {
      var that = this;
      updateOrder({
        token: this.token,
        tradeId: value,
        status: "100",
      }).then((resdata) => {
        const { code } = resdata;
        if (code == "0") {
          Toast.success("自取成功");
          that._getOrderList();
        } else {
          Toast.fail("自取失败");
        }
      });
    },
  },
  components: {
    OrderItem,
  },
};
</script>
<style lang="scss" scoped>
/deep/.main {
  background: #fff;
}

/deep/.van-tabs__content {
  background: #fafafa;
  //overflow-y: auto;
  //max-height: calc(100vh - 150px);
  .van-tab__pane {
    padding: 12px 12px 50px;
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