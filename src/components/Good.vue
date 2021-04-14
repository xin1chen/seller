<template>
  <div>
    <div class="good" v-if="status !== 102">
      <div class="good_img">
        <img :src="good.img" />
      </div>
      <div class="good_info">
        <div class="good_name">
          <div>{{ good.productName }}</div>
          <p>{{ good.remark }}</p>
        </div>
        <div class="good_price">
          <div>¥{{ good.price }}</div>
          <p>
            <van-icon name="cross" /><span>{{ good.count }}</span>
          </p>
        </div>
      </div>
    </div>

    <van-swipe-cell v-if="status == 102">
      <div class="good">
        <div class="good_img">
          <img :src="good.img" />
        </div>
        <div class="good_info">
          <div class="good_name">
            <div>{{ good.productName }}</div>
            <p>{{ good.remark }}</p>
          </div>
          <div class="good_price">
            <div>¥{{ good.price }}</div>
            <p>
              <van-icon name="cross" /><span>{{ good.count }}</span>
            </p>
          </div>
        </div>
      </div>
      <template #right>
        <van-button
          square
          text="删除"
          type="danger"
          class="delete-button"
          @click="delGood"
        />
      </template>
    </van-swipe-cell>
  </div>
</template>

<script>
import { Dialog } from "vant";
export default {
  name: "Good",
  props: {
    good: Object,
    status: Number,
    orderIndex: Number,
    goodIndex: Number,
  },
  computed: {},
  methods: {
    delGood() {
      Dialog.confirm({
        getContainer: function(){return document.querySelector(".order_wrapper")},
        message: `确定要删除<span> ${this.good.productName} </span>吗？`,
      })
        .then(() => {
          this.$emit("delgood", {
            order_index: this.orderIndex,
            good_index: this.goodIndex,
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.good {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 10px 5px;
  .good_img {
    width: 60px;
    height: 60px;
    border-radius: 5px;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .good_info {
    display: flex;
    justify-content: space-between;
    flex: 1;
    padding: 0 12px;
    .good_name,
    .good_price {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      & > div {
        font-weight: 700;
      }
    }
    .good_name {
      color: #4b5867;
      p{
        justify-content: flex-start;
      }
    }
    .good_price {
      color: #101010;
      p {
        align-items: center;
      }
    }
    p {
      margin-top: 12px;
      margin-bottom: 0;
      padding: 0;
      font-size: 12px;
      display: flex;
      justify-content: center;
      color: #101010c4;
      span {
        color: #f71717;
        padding-left: 3px;
        padding-bottom: 1px;
      }
    }
  }
  .good_op {
    a {
      color: #7e8c8d;
      padding: 12px;
    }
  }
}
/deep/.van-swipe-cell__right {
  .van-button {
    height: 100%;
  }
}

</style>