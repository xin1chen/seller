<template>
  <div class="form_wrapper">
    <van-form @submit="onSubmit">
      <h1><van-icon name="manager" /><span class="title">登录</span></h1>
      <van-field
        v-model="loginAccount"
        name="loginAccount"
        label="商户号"
        placeholder="请输入商户号"
        :rules="[{ required: true, message: '请填写商户号' }]"
      />
      <van-field
        v-model="operatorName"
        name="operatorName"
        label="用户名"
        placeholder="请输入用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="loginPwd"
        type="password"
        name="loginPwd"
        label="密码"
        placeholder="请输入密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin-top: 16px">
        <van-button
          color="#f28512"
          block
          type="info"
          native-type="submit"
          class="login_btn"
          ><van-icon name="sign" class="sign_icon" /><span
            >确认</span
          ></van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
import { login } from "@/api";
import storage from "@/model/storage";
export default {
  data() {
    return {
      loginAccount: "menupls",
      operatorName: "zhong",
      loginPwd: "123456",
      seller: {},
    };
  },
  methods: {
    onSubmit(values) {
      login(values).then((seller) => {
        this.seller = Object.assign({}, this.seller, seller.data);
        storage.set("seller", this.seller);
        this.$store.commit("storeseller", {
          seller: this.seller,
        });
        this.$router.push({
          name: "index",
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.form_wrapper {
  height: 100vh;
  overflow: hidden;
  background: #bbbbbb3b;
  color: #444;
  .van-form {
    width: 250px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    padding: 40px;
    padding-top: 32px;
    -webkit-box-shadow: 0px 3px 20px 3px rgba(0, 0, 0, 0.15);
    box-shadow: 0px 3px 20px 3px rgba(0, 0, 0, 0.15);
    h1 {
      font-size: 26px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0 0 20px;
      span {
        margin-left: 5px;
      }
    }
    /deep/.van-button__text {
      display: flex;
      align-items: center;
      justify-content: center;
      .sign_icon {
        font-size: 18px;
        margin-right: 3px;
      }
    }
  }
}
</style>