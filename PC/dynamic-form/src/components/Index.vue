<template>
  <div class="index">
    <Layout class="index-layout">
        <Sider breakpoint="md" :width="300" :style="{background: '#fff'}">
          <Controls />
        </Sider>
        <Layout>
          <Content class="index-content">
            <Dragcontent />
          </Content>
        </Layout>
        <Sider breakpoint="md" :style="{background: '#fff'}">
          <Attribute />
        </Sider>
    </Layout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Controls from "./Controls/Index.vue";
import Dragcontent from "./Dragcontent/Index.vue";
import Attribute from "./Attribute/Index.vue";

@Component({
  components: {
    Controls,
    Dragcontent,
    Attribute,
  }
})
export default class Index extends Vue {}
</script>

<style scoped>
.index {
  width: 100%;
  height: 100%;
}
.index-layout {
  height: 100%;
}
.index-content {
  overflow-y: auto;
}
</style>
