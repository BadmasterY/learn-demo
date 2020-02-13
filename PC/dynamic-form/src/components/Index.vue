<template>
  <div class="index">
    <Layout class="index-layout">
      <Sider
        breakpoint="md"
        collapsible
        :collapsed-width="50"
        v-model="isCollapsed"
        :width="300"
        :style="{background: '#fff',  'box-shadow': '0 0 3px #aaa'}"
      >
        <Controls />
        <div slot="trigger"></div>
      </Sider>
      <Layout>
        <Header class="index-header">
          <ul>
            <li>
              <a @click="preview">
                <Icon type="ios-eye" />
                <span>预览</span>
              </a>
            </li>
          </ul>
        </Header>
        <Content class="index-content">
          <Dragcontent />
        </Content>
      </Layout>
      <Sider
        :width="300"
        :style="{background: '#fff', padding: '0 5px', 'box-shadow': '0 0 3px #aaa', 'overflow-y': 'auto'}"
      >
        <Attribute />
      </Sider>
    </Layout>
    <transition name="fade">
      <Preview v-if="isPreview" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Controls from "./Controls/Index.vue";
import Dragcontent from "./Dragcontent/Index.vue";
import Attribute from "./Attribute/Index.vue";
import Preview from "./Preview/Index.vue";

@Component({
  components: {
    Controls,
    Dragcontent,
    Attribute,
    Preview
  }
})
export default class Index extends Vue {
  isCollapsed = false;

  preview(): void {
    this.$store.commit("setPreview", true);
  }

  get isPreview(): boolean {
    return this.$store.state.isPreview;
  }
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
.index-header {
  background: #fff;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #eee;
}
.index-header ul {
  list-style: none;
}
.index-header ul li {
  float: right;
}
.index-header ul li a {
  display: inline-block;
  height: 100%;
  padding: 0 10px;
}
.index-content {
  overflow-x: hidden;
  overflow-y: auto;
}

fade-enter-active,
fade-leave-active {
  transition: opacity 150ms ease;
}
fade-enter,
fade-leave-to {
  opacity: 0;
}
</style>
