<template>
  <div class="index">
    <Layout class="index-layout">
        <Sider breakpoint="md" collapsible :collapsed-width="50" v-model="isCollapsed" :width="300" :style="{background: '#fff',  'box-shadow': '0 0 3px #aaa'}">
          <Controls />
          <div slot="trigger"></div>
        </Sider>
        <Layout>
          <Content class="index-content">
            <Dragcontent />
          </Content>
        </Layout>
        <Sider :width="300" :style="{background: '#fff', padding: '0 5px', 'box-shadow': '0 0 3px #aaa'}">
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
export default class Index extends Vue {
  isCollapsed = false;
}
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
