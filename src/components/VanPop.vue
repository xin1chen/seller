<template>
  <van-popup
    v-model="shown.flag"
    closeable
    close-icon-position="top-left"
    position="bottom"
    @click-overlay="hidePopup"
    @click-close-icon="hidePopup"
    @click="hidePopup"
    :style="{ height: '30%' }"
  >
    <van-row type="flex" justify="center" class="pop_title">
      <van-col>请选择素材类型</van-col>
    </van-row>
    <van-row type="flex" justify="center" gutter="20" class="pop_contet">
      <van-col span="6">
        <div class="upload_img" @click="hidePopup">
          <router-link :to="{ name: 'addAd' }">
            <van-row type="flex" justify="center">
              <van-col><van-icon name="photo-o" size="24" /></van-col>
            </van-row>
            <div>上传照片</div>
          </router-link>
        </div>
      </van-col>
      <van-col span="6">
        <div class="upload_video">
          <van-row type="flex" justify="center">
            <van-col><van-icon name="video-o" size="24" /></van-col>
          </van-row>
          <div>上传视频</div>
        </div>
      </van-col>
    </van-row>
  </van-popup>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    shown: Object,
  },
  methods: {
    hidePopup: function () {
      this.shown.flag = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.pop_title {
  background: #fff8d7;
  text-align: center;
  padding: 10px 0;
}
.van-popup {
  //background: red;
  /deep/.van-popup__close-icon {
    top: 10px;
  }
}
.pop_contet {
  margin-top: 30px;
  .upload_img,
  .upload_video {
    padding: 20px 10px;
    border: 2px dashed #bbbbbb;
    background: #f9f9f9;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-size: 14px;
    text-align: center;
    color: #a4a4a4;
    a {
      color: #a4a4a4;
      &:active,
      &:hover {
        color: #808080;
      }
    }
  }
}
</style>