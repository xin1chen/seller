<template>
  <div class="index">
    <van-row type="flex" justify="end"
      ><van-col span="24" class="admin_info" v-if="seller.operatorName">{{
        seller.operatorName
      }}</van-col></van-row
    >
    <van-row>
      <van-col span="8" class="sell_avatar"
        ><van-image width="85" height="85" fit="cover" :src="seller.msLogo"
      /></van-col>
      <van-col span="16">
        <van-row>
          <van-col class="seller_name">{{ seller.msName }}</van-col>
        </van-row>
        <van-row>
          <van-col class="seller_time"
            >营业时间：{{ seller.startTime }} - {{ seller.endTime }}</van-col
          >
        </van-row>
        <van-row type="flex" class="seller_desc">
          <van-col span="6" class="seller_label"
            ><van-tag type="warning">{{ seller.category }}</van-tag></van-col
          >
          <van-col span="18" class="seller_machine_number">{{
            seller.tel
          }}</van-col>
        </van-row>
      </van-col>
    </van-row>
    <div class="line_split">
      <div><van-icon name="todo-list" />门店订单</div>
    </div>
    <van-row type="flex" justify="space-around">
      <van-col span="8">
        <router-link
          class="orders_inner"
          :to="{ name: 'orderList', params: { orderType: 't' } }"
        >
          <div>今日堂食</div>
          <div class="number">{{ orderCount.tangshiCount }}</div>
        </router-link>
      </van-col>
      <van-col span="8">
        <router-link
          class="orders_outer"
          :to="{ name: 'orderList', params: { orderType: 'w' } }"
        >
          <div>今日外卖</div>
          <div class="number">{{ orderCount.waimaiCount }}</div>
        </router-link>
      </van-col>
    </van-row>

    <div class="line_split">
      <div><van-icon name="balance-list" />门店设备</div>
    </div>
    <van-row type="flex" justify="space-around">
      <van-col span="5">
        <div class="machine machine_online">
          <div class="machine_number">
            {{ deviceStatistics.onlineDeviceNum }}
          </div>
          <p>在线</p>
        </div>
      </van-col>
      <van-col span="5">
        <div class="machine machine_offline">
          <div class="machine_number">
            {{ deviceStatistics.offlineDeviceNum }}
          </div>
          <p>离线</p>
        </div>
      </van-col>
      <van-col span="5">
        <div class="machine machine_lowpower">
          <div class="machine_number">
            {{ deviceStatistics.lowPowerDeviceNum }}
          </div>
          <p>电量&lt;20%</p>
        </div>
      </van-col>
    </van-row>
    <div class="line_split">
      <div><van-icon name="wap-nav" />常用操作</div>
    </div>
    <van-row type="flex" justify="space-around">
      <van-col span="8">
        <router-link
          class="orders_list"
          :to="{ name: 'orderList', params: { orderType: 'a' } }"
          >订单管理</router-link
        >
      </van-col>
      <van-col span="8">
        <router-link class="bind_list" to="bind-watch">手机绑桌号</router-link>
      </van-col>
    </van-row>
  </div>
</template>
<script>
import { getOrderCount, getDeviceStatistics } from "@/api";
import storage from "@/model/storage";
export default {
  data() {
    return {
      orderCount: { tangshiCount: 0, waimaiCount: 0 },
      seller: storage.get("seller"),
      deviceStatistics: {
        lowPowerDeviceNum: 0,
        offlineDeviceNum: 0,
        onlineDeviceNum: 0,
      },
    };
  },
  created() {
    this._getOrderCount();
    this._getDeviceStatistics();
  },
  methods: {
    _getOrderCount() {
      getOrderCount({ token: this.seller.token }).then((orderCount) => {
        this.orderCount = Object.assign({}, this.orderCount, orderCount.data);
      });
    },
    _getDeviceStatistics() {
      getDeviceStatistics({ storeId: this.seller.storeId }).then((data) => {
        if (data.code == 1) {
          this.deviceStatistics = Object.assign(
            {},
            this.deviceStatistics,
            data.data
          );
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.van-row {
  padding: 0 12px;
}
.admin_info {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.sell_avatar {
  text-align: center;
}
.seller_name {
  color: #313030;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
}

.seller_time {
  font-size: 12px;
  color: rgb(91, 91, 91);
  line-height: 17px;
  margin: 12px 0;
}

.seller_desc {
  align-items: center;
  .seller_label {
    display: flex;
    align-items: center;
    span {
      background-color: #f8621e;
    }
  }
  .seller_machine_number {
    color: #f8621e;
    font-size: 16px;
    font-weight: 700;
  }
}

.line_split {
  background: #f3f3f3;
  padding: 12px;
  margin: 20px 0;
  div {
    font-size: 14px;
    color: #101010;
    display: flex;
    align-items: center;
    i {
      color: #f8621e;
      font-size: 18px;
      margin-right: 5px;
    }
  }
}
a.orders_inner,
a.orders_outer {
  width: 100%;
  text-align: center;
  height: 25vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 5px;
  color: #fff;
  &.orders_inner {
    background-color: #f8621e;
  }
  &.orders_outer {
    background: #668bf9f0;
  }
  .number {
    margin-top: 15px;
    font-size: 20px;
    line-height: 28px;
    font-weight: 700;
  }
}

.machine {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  .machine_number {
    color: #fff;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  p {
    color: #101010;
    font-size: 12px;
    padding: 0;
    margin: 0;
    margin-top: 8px;
  }
  &.machine_online .machine_number {
    background: #f8621e;
  }

  &.machine_offline .machine_number {
    background: #464444f7;
  }

  &.machine_lowpower .machine_number {
    background: #7cb042ed;
  }
}
a.orders_list,
a.bind_list {
  width: 100%;
  display: inline-block;
  text-align: center;
  border-radius: 5px;
  color: #fff;
  padding: 14px 0;
  background: #0b3146e8;
  &.orders_list {
    background-color: #f8621e;
  }
}
</style>