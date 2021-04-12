<template>
  <div class="my">
    <van-row type="flex" justify="center">
      <van-col class="admin_avatar">
        <van-image
          round
          width="90"
          height="90"
          fit="cover"
          :src="seller.msLogo"
        />
      </van-col>
    </van-row>
    <van-row type="flex" justify="center">
      <van-col class="admin_name">{{ seller.operatorName }}</van-col>
    </van-row>
    <van-row type="flex" justify="space-around" class="orders">
      <van-col span="6">
        <van-badge :content="orderCount.total">
          <router-link
            class="order_link"
            :to="{ name: 'orderList', params: { orderType: 'a' } }"
          >
            <div class="order_icon">
              <van-icon name="orders-o" size="24" color="#f8621e" />
            </div>
            <div>全部订单</div>
          </router-link>
        </van-badge>
      </van-col>
      <van-col span="6">
        <van-badge :content="orderCount.tangshiCount">
          <router-link
            class="order_link"
            :to="{ name: 'orderList', params: { orderType: 't' } }"
          >
            <div class="order_icon">
              <van-icon name="apps-o" size="24" color="#f8621e" />
            </div>
            <div>堂食订单</div>
          </router-link>
        </van-badge>
      </van-col>
      <van-col span="6">
        <van-badge :content="orderCount.waimaiCount">
          <router-link
            class="order_link"
            :to="{ name: 'orderList', params: { orderType: 'w' } }"
          >
            <div class="order_icon">
              <van-icon name="notes-o" size="24" color="#f8621e" />
            </div>
            <div>外卖订单</div>
          </router-link>
        </van-badge>
      </van-col>
    </van-row>
    <van-row class="links">
      <van-cell
        title="店内广告"
        is-link
        :to="{ name: 'adBoard' }"
        icon="volume-o"
      />
      <van-cell
        title="手机绑定桌号"
        is-link
        :to="{ name: 'bindWatch' }"
        icon="shrink"
      />
      <van-cell
        title="我的资料"
        is-link
        :to="{ name: 'index' }"
        icon="contact"
      />
    </van-row>
  </div>
</template>
<script>
import { getOrderCount } from "@/api";
import storage from "@/model/storage";
export default {
  data() {
    return {
      orderCount: { tangshiCount: 0, waimaiCount: 0, total: 0 },
      seller: storage.get("seller"),
    };
  },
  created() {
    this._getOrderCount();
  },
  methods: {
    _getOrderCount() {
      getOrderCount({ token: this.seller.token }).then((resdata) => {
        const {  data } = resdata;
        this.orderCount = Object.assign({}, this.orderCount, data);
        this.orderCount.total =
          this.orderCount.tangshiCount + this.orderCount.waimaiCount;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.my{
  padding-top: 12px;
}
* {
  font-size: 14px;
}
.admin_avatar {
  width: 90px;
  height: 90px;
  margin: 12px auto 12px;
  border-radius: 50%;
  overflow: hidden;
  //box-shadow: rgb(216, 30, 6) 0 2px 6px 0;
}
.admin_name {
  margin: 0 auto;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}
.orders {
  justify-content: space-evenly;
  margin-top: 20px;
  margin-bottom: 20px;
  /deep/.van-col {
    display: flex;
    justify-content: center;
  }
  a.order_link {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #101010;
    .order_icon {
      width: 48px;
      height: 48px;
      line-height: 62px;
      text-align: center;
      background-color: rgb(251, 251, 251);
      //border: 1px solid rgb(250, 79, 81);
      //box-shadow: rgba(16, 16, 16, 0.22) 0px 2px 6px 0px;
      //border-radius: 50%;
      //margin-bottom: 8px;
      position: relative;
    }
  }
  /deep/.van-badge--fixed{
    top: 13px;
    right: 13px;
  }
}
.links {
  position: relative;
  .van-cell__left-icon {
    font-size: 20px;
    color: #f8621e;
  }
  &:before {
    content: "";
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: #ebedf0;
    transform: scaleY(0.5);
  }
}
</style>