<template>
  <view class="content">
    <image class="logo" src="../../static/logo.png"></image>
    <view>
      <text class="title">{{ title }}</text>
      <text class="count">{{ count }}</text>
      <button @click="handleClick"></button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello",
      count: 0
    };
  },
  onLoad() {
  },
  methods: {
    handleClick() {
      this.count++;
      if(this.count > 2) {
        this.title = 'hello world';
      }
    }
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
.count{
  font-size: 36rpx;
  font-weight: bold;
  display: inline-block;
}
</style>
