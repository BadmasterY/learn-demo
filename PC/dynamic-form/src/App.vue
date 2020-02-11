<template>
  <div id="app">
    <Index />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Index from "./components/Index.vue";

@Component({
  components: {
    Index
  }
})
export default class App extends Vue {}
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
