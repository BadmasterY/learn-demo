<template>
  <div class="hello">
    <input type="text" placeholder="roomid" v-model="roomid"><br>
    <input type="text" placeholder="username" v-model="username"><br>
    <input type="button" value="登录" @click="login">
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      roomid: '1',
      username: 'K'
    }
  },
  mounted() {
    // this.login();
  },
  methods: {
    login() {
      if(this.roomid != '' && this.username != '') {
        console.log(this.roomid, this.username);
        this.axios.post('/app/login', {
          roomid: this.roomid,
          username: this.username
        })
        .then(response => {
          console.log(response);
          const data = response.data.content;

          this.$store.commit('setUser', data.user);
          this.$store.commit('setRoom', data.room);

          this.$socket.connect()
        })
        .catch(error => {
          console.error(error);
        });
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
