<template>
  <div id="app">
    <HelloWorld v-if="!isLogin" msg="Welcome to Your Vue.js App"/>
    <Room v-else />
    <Calling v-if='isCalling' />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import Room from './components/Room';
import Calling from './components/Calling';

export default {
  name: 'app',
  components: {
    HelloWorld,
    Room,
    Calling
  },
  methods: {
    
  },
  computed: {
    isCalling() {
      return this.$store.state.isCalling;
    },
    isLogin() {
      return this.$store.state.user;
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
