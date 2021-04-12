<template>
  <span class="support-ico" :class="iconCls"></span>
</template>

<script>
export default {
  name: "support-ico",
  props: {
    size: {
      type: Number,
    },
    type: {
      type: String,
    },
  },
  computed: {
    iconCls() {
      // const classMap = ["reduce", "excise", "reduce", "redbagReduce"];
      // return `icon-${this.size} ${classMap[this.type]}`;
      return `icon-${this.size} ${this.type}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin bg-image($path) {
  background-image: url($path + "@2x.png");
  @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
    background-image: url($path + "@3x.png");
  }
}
.support-ico {
  display: inline-block;
  background-repeat: no-repeat;
}

.icon-1 {
  width: 12px;
  height: 12px;
  background-size: 12px 12px;
  &.reduce {
    @include bg-image("reduce");
  }
  &.excise {
    @include bg-image("excise");
  }
  &.reduce {
    @include bg-image("reduce");
  }
  &.redbagReduce {
    @include bg-image("redbagReduce");
  }
}

.icon-2 {
  width: 16px;
  height: 16px;
  background-size: 16px 16px;
  &.reduce {
    @include bg-image("reduce");
  }
  &.excise {
    @include bg-image("excise");
  }
  &.reduce {
    @include bg-image("reduce");
  }
  &.redbagReduce {
    @include bg-image("redbagReduce");
  }
}

.icon-3 {
  width: 12px;
  height: 12px;
  background-size: 12px 12px;
  &.reduce {
    @include bg-image("reduce");
  }
  &.excise {
    @include bg-image("excise");
  }
  &.reduce {
    @include bg-image("reduce");
  }
  &.redbagReduce {
    @include bg-image("redbagReduce");
  }
}

.icon-4 {
  width: 16px;
  height: 16px;
  background-size: 16px 16px;
  &.reduce {
    @include bg-image("reduce");
  }
  &.excise {
    @include bg-image("excise");
  }
  &.reduce {
    @include bg-image("reduce");
  }
  &.redbagReduce {
    @include bg-image("redbagReduce");
  }
}
</style>
