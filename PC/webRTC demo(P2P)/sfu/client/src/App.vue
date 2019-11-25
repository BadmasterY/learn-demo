<template>
  <div id="app">
    <Login v-if="!isLogin"/>
    <Room v-else />
    <Calling v-if='isCalling' />
  </div>
</template>

<script>
import Login from "./components/Login.vue";
import Room from "./components/Room.vue";
import Calling from './components/Calling';

export default {
  name: "app",
  components: {
    Login,
    Room,
    Calling,
  },
  data() {
    return {
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.user;
    },
    isCalling() {
      return this.$store.state.isCalling;
    }
  },
};
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
