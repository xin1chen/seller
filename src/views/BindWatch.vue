<template>
  <div class="bind">
    <van-row class="watch_wrapper">
      <van-col span="24">
        <van-field
          readonly
          clickable
          label="手表"
          :value="name"
          placeholder="选择手表"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="watchList"
            value-key="deviceName"
            @cancel="showPicker = false"
            @confirm="confirm"
          />
        </van-popup>
      </van-col>
    </van-row>
    <div class="table_wrapper">
      <div class="table_title">桌号<span>（选择需要绑定的桌号）</span></div>
      <div class="table_list">
        <van-checkbox-group
          v-model="result"
          v-for="n in deskListLength"
          :key="n"
          direction="horizontal"
          class="table_row"
        >
          <van-checkbox
            v-for="desk in deskList.slice((n - 1) * 2, n * 2)"
            :key="desk.mac"
            :name="desk.mac"
            shape="square"
            >{{ desk.tableNum }}</van-checkbox
          >
        </van-checkbox-group>
      </div>
    </div>
    <div class="bind_op">
      <a class="bind_link" @click="bind">绑定</a>
    </div>
  </div>
</template>

<script>
import { getDeviceListByStoreId, updateDeviceTableNum } from "@/api";
import storage from "@/model/storage";
import { Toast } from "vant";
export default {
  data() {
    return {
      name: "",
      value: "",
      showPicker: false,
      seller: storage.get("seller"),
      watchList: [],
      result: [],
      deskList: [],
    };
  },
  created() {
    this._getWatchs();
    this._getTables();
  },
  computed: {
    deskListLength: function () {
      return Math.round(this.deskList.length / 2);
    },
  },
  methods: {
    confirm(value) {
      this.name = value.deviceName;
      this.value = value.id;
      this.showPicker = false;
      this.result = value.tableNum.split(",");
    },
    bind() {
      console.log(this.value);
      console.log(this.result.join());
      if (this.value == "") {
        Toast.fail("请选择手表");
        return;
      }
      // if(this.result.length == 0){
      //   Toast.fail("请选择桌号");
      //   return;
      // }
      updateDeviceTableNum({
        storeId: this.seller.storeId,
        deviceId: this.value,
        tableNum: this.result.join(","),
      }).then((data) => {
        if (data.code == 1) {
          Toast.fail("绑定成功");
          this._getWatchs();
          this._getTables();
        } else {
          Toast.fail("绑定失败");
        }
      });
    },
    _getWatchs() {
      getDeviceListByStoreId({
        storeId: this.seller.storeId,
        deviceType: 2,
      }).then((data) => {
        if (data.code == 1) {
          this.watchList = data.data;
        }
      });
    },
    _getTables() {
      getDeviceListByStoreId({
        storeId: this.seller.storeId,
        deviceType: 1,
      }).then((data) => {
        if (data.code == 1) {
          this.deskList = data.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bind{
  padding-top: 12px;
  background: #fff;
}

.watch_wrapper {
  padding: 50px 50px 20px;
  display: flex;
  align-items: center;
}

.watch_wrapper select {
  flex: 1;
  margin-left: 10px;
  border: 1px solid #ddd;
  padding: 5px;
}

.table_wrapper {
  padding: 0 50px 50px;
}

.table_title span {
  color: #1010109c;
}

.table_list {
  margin-top: 10px;
}

.table_row {
  display: flex;
  justify-content: space-between;
  padding: 7px 0;
}

.table_row label {
  margin-right: 30px;
}

.bind_op {
  text-align: center;
}

.bind_op .bind_link {
  display: inline-block;
  background: #5677fc;
  border-radius: 5px;
  padding: 10px 35px;
  color: #fff;
}
</style>