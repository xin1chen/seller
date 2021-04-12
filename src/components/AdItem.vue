<template>
  <div class="ad_item">
    <div class="ad_sn_wrapper">
      <div class="ad_sn">编号：{{ ad.id }}</div>
      <div class="ad_status" :class="setClass()">{{ adStatus }}</div>
    </div>
    <div class="ad_row">标题：{{ ad.title }}</div>
    <div class="ad_row">地点：1个地点/142台设备</div>
    <div class="ad_row">
      金额：¥00.00
      <div class="switch" v-if="ad.advertStatus == 1 || ad.advertStatus == 2">
        <van-switch
          v-model="ad.checked"
          active-color="#00e266"
          inactive-color="#dcdee0"
          size="24px"
          @input="onSwitch"
        />
      </div>
    </div>
    <div class="ad_row">时长：{{ ad.duration }}s</div>
    <div class="ad_time">
      投放时间：{{ ad.startTime.substr(0, 10) }} 至
      {{ ad.endTime.substr(0, 10) }}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    adStatus() {
      if (this.ad.advertStatus == 0) {
        return "审核中";
      }
      if (this.ad.advertStatus == 1) {
        return "审核通过";
      }
      if (this.ad.advertStatus == 2) {
        return "投放中";
      }
      if (this.ad.advertStatus == 3) {
        return "已结束";
      }
      if (this.ad.advertStatus == -1) {
        return "审核失败";
      }
      return "";
    },
  },
  methods: {
    setClass() {
      return "status" + this.ad.advertStatus;
    },
    onSwitch(checked) {
      console.log(checked);
    },
  },
  props: { ad: Object },
};
</script>
<style lang="scss" scoped>
.ad_item {
  background: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 12px;
  & > div {
    padding: 5px 0;
    color: #464444d6;
    font-size: 13px;
    position: relative;
    .switch {
      position: absolute;
      width: 46px;
      height: 27px;
      right: 0;
      top: -2px;
      z-index: 116;
      font-weight: normal;
      font-style: normal;
    }
  }
  .ad_time,
  .ad_sn_wrapper {
    display: flex;
    justify-content: space-between;
    color: #101010;
    font-size: 14px;
    .status0 {
      color: #f28512;
    }
    .status1 {
      color: #468006ed;
    }
    .status2 {
      color: #468006ed;
    }
    .status3 {
      color: #6c6a6afa;
    }
    .status-1 {
      color: #ee1515;
    }
  }
}
</style>