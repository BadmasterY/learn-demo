<template>
  <div id="app">
    <HelloWorld v-if="!this.$store.state.user" msg="Welcome to Your Vue.js App"/>
    <Room v-else />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Room from './components/Room'

export default {
  name: 'app',
  components: {
    HelloWorld,
    Room
  },
  methods: {
    
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
  margin-top: 60px;
}
</style>
