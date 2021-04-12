<template>
  <div>
    <div class="page_header">店内广告</div>
    <van-tabs v-model="adStatus" @click="tabClick" animated>
      <van-tab name="all"
        ><template #title
          ><div class="ad_tab">
            <div class="tab_num">{{ all.length }}</div>
            <p>全部</p>
          </div></template
        >
        <div class="ad_list">
          <AdItem v-for="ad in all" :key="ad.id" :ad="ad" /></div
      ></van-tab>

      <van-tab name="ing"
        ><template #title
          ><div class="ad_tab">
            <div class="tab_num">{{ ing.length }}</div>
            <p>投放中</p>
          </div></template
        >
        <div class="ad_list">
          <AdItem v-for="ad in ing" :key="ad.id" :ad="ad" /></div
      ></van-tab>

      <van-tab name="review"
        ><template #title
          ><div class="ad_tab">
            <div class="tab_num">{{ review.length }}</div>
            <p>审核中</p>
          </div></template
        >
        <div class="ad_list">
          <AdItem v-for="ad in review" :key="ad.id" :ad="ad" /></div
      ></van-tab>

      <van-tab name="reject"
        ><template #title
          ><div class="ad_tab">
            <div class="tab_num">{{ reject.length }}</div>
            <p>未通过</p>
          </div></template
        >
        <div class="ad_list">
          <AdItem v-for="ad in reject" :key="ad.id" :ad="ad" /></div
      ></van-tab>

      <van-tab name="end"
        ><template #title
          ><div class="ad_tab">
            <div class="tab_num">{{ end.length }}</div>
            <p>已结束</p>
          </div></template
        >
        <div class="ad_list">
          <AdItem v-for="ad in end" :key="ad.id" :ad="ad" /></div
      ></van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { Toast } from "vant";
import storage from "@/model/storage";
import { getAdvertByMac } from "@/api";
import AdItem from "@/components/AdItem";
export default {
  data() {
    return {
      adStatus: "all",
      storeId: storage.get("seller").storeId,
      all: [],
      ing: [],
      review: [],
      reject: [],
      end: [],
    };
  },
  created() {
    this.orderType = this.$route.params.orderType;
    this._getAdvertByMac();
  },
  computed: {},
  methods: {
    tabClick() {},
    _getAdvertByMac() {
      getAdvertByMac({ storeId: this.storeId }).then((resdata) => {
        const { code, data } = resdata;
        if (code != 1) {
          Toast.fail("获取广告失败");
          return;
        }
        data.forEach((element) => {
          element.checked = element.advertStatus == 2;
          this.all.push(element);
          if (element.advertStatus == 0) {
            this.review.push(element);
          }
          if (element.advertStatus == 1 || element.advertStatus == 2) {
            this.ing.push(element);
          }
          if (element.advertStatus == 3) {
            this.end.push(element);
          }
          if (element.advertStatus == -1) {
            this.reject.push(element);
          }
        });
      });
    },
  },
  components: {
    AdItem,
  },
};
</script>
<style lang="scss" scoped>
.page_header {
  padding: 12px 12px 12px 30px;
  font-weight: 700;
}
/deep/.van-tabs__wrap {
  height: 60px;
  .van-tab {
    line-height: 10px;
  }
}
.ad_tab {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  .tab_num {
    font-weight: 700;
    font-size: 20px;
    padding: 5px 0;
  }
  p {
    padding: 5px 0;
    margin: 0;
    color: #838383;
  }
}
.ad_list {
  background: #f8f8f8;
  padding: 12px;
}
</style>