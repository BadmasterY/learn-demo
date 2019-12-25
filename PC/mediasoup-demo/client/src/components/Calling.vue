<template>
  <div class="calling">
    <div class="calling-box">
      <h2>有新的来电...</h2>
      <button class="box-accept" @click="answer('yes')">接听</button>
      <button class="box-reject" @click="answer('no')">拒绝</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Calling",
  data() {
    return {};
  },
  computed: {},
  methods: {
    answer(str) {
      const caller = this.$store.state.caller;
      this.$store.commit('setCalling', false);

      // 修改一下逻辑，避免因为某些错误直接接通
      let accept = false;
      if(str == 'yes') accept = true;
      const response = {
        accept: accept, 
        otherUser: caller.self,
        self: caller.otherUser,
      };
      
      this.$socket.emit('accept', response);
      this.$store.commit('setCaller', null);
    }
  }
};
</script>

<style>
.calling {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
}
.calling-box {
  height: 150px;
  overflow: hidden;
  width: 300px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 5px;
}
.calling-box button {
  display: block;
  margin: 3px auto;
  width: 75%;
  height: 30px;
  line-height: 30px;
  border: none;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  transition: background 300ms;
}
.box-accept {
  background: #32bf32;
}
.box-reject {
    background: #eee;
}
.box-accept:hover {
  background: #7ae37a;
}
.box-reject:hover {
  background: #f40;
}
</style>