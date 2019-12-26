<template>
  <div class="room">
    <div class="sidbar">
      <ul>
        <li v-for="user in roomInfo.users" :key="user.userid" @click="call(user)">{{ user.username }}</li>
      </ul>
    </div>
    <div class="content">
      <video ref="video" autoplay></video>
    </div>
  </div>
</template>

<script>
export default {
  name: "Room",
  data() {
    return {
      roomInfo: this.$store.state.room
    };
  },
  computed: {},
  mounted() {
    this.$store.commit("setVideo", this.$refs.video);
  },
  methods: {
    call(user) {
      const state =this.$store.state;
      if (state.user.userid === user.userid) {
        console.warn(`Can't call yourself...`);
        return;
      }
      
      this.$socket.emit('call', {otherUser: user, self: state.user});
    }
  }
};
</script>

<style scope>
.room {
  width: 100%;
  height: 100%;
}
.sidbar,
.content {
  width: 25%;
  height: 100%;
  float: left;
  box-sizing: border-box;
  background: #eee;
}
.sidbar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.sidbar ul li {
  padding: 10px 20px;
  cursor: pointer;
  margin-bottom: 5px;
  transition: background 300ms;
}

.sidbar ul li:hover {
  background: rgba(0, 0, 0, 0.1);
}
.content {
  width: 75%;
  background: #fff;
}

video {
  width: 1280px;
  height: 720px;
}
</style>