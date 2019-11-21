<template>
  <div class="login">
    <form action>
      roomid:
      <input type="text" v-model="roomid" placeholder="please input roomid..." />
      <br />nickname:
      <input type="text" v-model="nickname" placeholder="please input nickname..." />
      <br />
      <input type="button" value="Login" @click="login" />
    </form>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      roomid: null,
      nickname: null
    };
  },
  methods: {
    login() {
      const store = this.$store;
      if (this.roomid && this.nickname) {
        console.log(this.roomid, this.nickname);
        this.axios
          .post("/app/login", {
            roomid: this.roomid,
            nickname: this.nickname
          })
          .then(response => {
            const data = response.data.content;

            store.commit('setUser', data.user);
            store.commit('setRoom', data.room);
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        console.warn("check roomid or nickname");
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  width: 350px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login form {
  width: 100%;
  height: 100%;
  line-height: 33px;
}
</style>
