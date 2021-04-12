<template>
  <div class="add-ad">
    <van-row type="flex" justify="center">
      <van-col>
        <van-uploader
          class="img_uploader"
          v-model="img"
          :preview-size="120"
          :preview-image=true
          :preview-full-image=true
          :max-count=1
          :after-read="afterRead"
        />
      </van-col>
    </van-row>
    <van-row type="flex" justify="center">
      <van-col style="font-size: 14px; color: #00000073; margin-top: 12px"
        >(只支持图片格式，最佳尺寸800px*1280px)</van-col
      >
    </van-row>
    <div class="ad_form">
      <van-form @submit="onSubmit">
        <van-field
          v-model="ad.title"
          name="广告标题："
          label="广告标题："
          placeholder="输入20字以内的标题"
          :rules="[{ required: true, message: '请填写广告标题' }]"
        />
        <van-field name="promoteType" label="我要推广：">
          <template #input>
            <van-radio-group v-model="promoteType" direction="horizontal">
              <van-radio name="1">本店菜品</van-radio>
              <van-radio name="2">广告链接</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-show="promoteType == 1"
          readonly
          clickable
          name="picker"
          :value="ad.productName"
          label="菜品："
          placeholder="点击选择菜品"
          @click="showDishesPicker = true"
        />
        <van-popup v-model="showDishesPicker" position="bottom">
          <van-picker
            show-toolbar
            value-key="productName"
            :columns="dishesList"
            @confirm="onConfirmDishes"
            @cancel="showDishesPicker = false"
          />
        </van-popup>
        <van-field
          v-if="promoteType == 2"
          v-model="link"
          name="链接："
          label="链接："
          placeholder="输入用户点击广告跳转的网页地址"
          :rules="[{ required: true, message: '请填写链接' }]"
        />
        <van-field name="radio" label="广告市场：">
          <template #input>
            <van-radio-group v-model="ad.durationStr" direction="horizontal">
              <van-radio name="30">30s</van-radio>
              <van-radio name="60">60s</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          readonly
          clickable
          name="calendar"
          :value="dateRange"
          label="投放时间："
          placeholder="点击选择日期"
          @click="showDateRangePicker = true"
        />
        <van-calendar
          v-model="showDateRangePicker"
          type="range"
          @confirm="onDateRangePickerConfirm"
        />
        <div class="footer">
          <div class="van-hairline--top"></div>
          <div class="row_bottom">
            <div class="machine_num">
              已选设备：<span>{{ machineNum }}台</span>
            </div>
            <van-button color="#f8621e" native-type="submit"
              >确认投放</van-button
            >
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
import { getProductList,updateImage, advertPut } from "@/api";
import storage from "@/model/storage";
export default {
  data() {
    return {
      machineNum: 150,
      img: [],
      link: "",
      promoteType: "1",
      dishesList: [],
      dateRange: "",
      showDishesPicker: false,
      showDateRangePicker: false,
      ad: {
        storeId: storage.get("seller").storeId,
        title: "",
        materialType: 1,
        materialUrl: "",
        productNum: "",
        productName: "",
        startTime: "",
        endTime: "",
        durationStr: "30",
        duration: 30,
      },
    };
  },
  created() {
    this._getProductList();
  },
  watch: {
    durationStr: {
      handler(nv) {
        this.duration = parseInt(nv);
      },
      immediate: true,
    },
  },
  methods: {
    _getProductList() {
      getProductList({
        msCode: 10001,
        productWay: 1,
      }).then((resdata) => {
        const { code, data } = resdata;
        if (code == "0") {
          data.list.forEach((element) => {
            this.dishesList = this.dishesList.concat(element.productList);
          });
        } else {
          Toast.fail("获取菜品失败");
        }
      });
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    // 返回布尔值
    // beforeRead(file) {
    //   console.log(file.type);
    //   if (file.type !== "image/jpeg") {
    //     Toast("请上传 jpg 格式图片");
    //     return false;
    //   }
    //   return true;
    // }, // 返回 Promise
    // asyncBeforeRead(file) {
    //   return new Promise((resolve, reject) => {
    //     if (file.type !== "image/jpeg") {
    //       Toast("请上传 jpg 格式图片");
    //       reject();
    //     } else {
    //       resolve(file);
    //     }
    //   });
    // },
    afterRead(promise) {
      const file = promise.file;
      var reader = new FileReader(),
        img = {
          status: "uploading",
          message: "上传中...",
        },
        that = this;
      reader.onload = function (event) {
        img.url = event.target.result; //base64
        img.src = event.target.result;
        that.img.length = 0;
        that.img.push(img);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("image", file);
      
      updateImage(formData).then((resdata) => {
        const { code, data } = resdata;
        if (code !== 1) {
          Toast("上传图片失败！");
          return;
        }
        that.img.length = 0;
        that.img.push({ url: data.url, status: "done", message: "上传完成" });
        that.ad.materialUrl = data.url;
      });
    },
    onConfirmDishes(value) {
      if(!value)
        return;
      this.ad.productNum = value.productId;
      this.ad.productName = value.productName;
      this.showDishesPicker = false;
    },
    onDateRangePickerConfirm(date) {
      const [start, end] = date;
      this.dateRange = `${this.formatDate(start)} 至 ${this.formatDate(end)}`;
      this.ad.startTime = `${this.formatDate(start)} 00:00:00`;
      this.ad.endTime = `${this.formatDate(end)} 00:00:00`;
      this.showDateRangePicker = false;
    },
    onSubmit(values) {
      if (values) {
        console.log(this.ad.materialUrl);
        if (this.ad.materialUrl == "") {
          Toast.fail("请上传图片！");
          return;
        } else {
          var that = this;
          advertPut(this.ad).then((resdata) => {
            const { code } = resdata;
            if (code == 1) {
              Toast.success({
                message: "广告发布成功",
                onClose: function () {
                  that.$router.push({ name: "adBoard" });
                },
              });
            } else {
              Toast.fail("广告发布失败");
            }
          });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.add-ad{
  padding-top: 32px;
}
.img_uploader {
  border: 1px solid #ddd;
  /deep/.van-uploader__upload,
  /deep/.van-uploader__preview{
    margin: 0;
  }
}
.ad_form {
  margin-top: 20px;
  //   padding: 0 20px;
  .van-field {
    padding: 10px 30px;
  }
}
.footer {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  background: #fff;
  .row_bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .van-button {
      border-radius: 0;
    }
    .machine_num {
      font-size: 14px;
      padding-left: 12px;
      span {
        font-size: 18px;
        font-weight: 700;
        color: #ee1515;
      }
    }
  }
}
</style>