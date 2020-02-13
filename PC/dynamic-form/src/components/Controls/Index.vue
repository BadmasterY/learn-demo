/* eslint-disable vue/no-parsing-error */
<template>
  <div class="controls">
    <p class="controls-title">基础控件</p>
    <Row :gutter="8">
      <Col v-for="item in basicList" :key="item.index" span="8">
        <div :draggable="true" @dragstart="onDrag($event)">
          <Card :style="{cursor: 'move',margin: '5px 0', 'text-align': 'center'}">{{ item.value }}</Card>
        </div>
      </Col>
    </Row>
    <p class="controls-title">辅助控件</p>
    <Row :gutter="8">
      <Col v-for="item in auxiliaryList" :key="item.index" span="8">
        <div :draggable="true" @dragstart="onDrag($event)">
          <Card :style="{cursor: 'move', 'text-align': 'center'}">{{ item.value }}</Card>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Controls extends Vue {
  basicList: object[] = [
    {
      index: 0,
      value: "输入框"
    },
    {
      index: 1,
      value: "日期控件"
    },
    {
      index: 2,
      value: "文本区域"
    },
    {
      index: 3,
      value: "下拉选框"
    },
    {
      index: 4,
      value: "单选框"
    },
    {
      index: 5,
      value: "多选框"
    },
    {
      index: 6,
      value: "按钮"
    }
  ];

  auxiliaryList: object[] = [
    {
      index: 0,
      value: "标题"
    },
    {
      index: 1,
      value: "分割线"
    },
  ]

  onDrag(e: Event): void {
    this.$store.commit("setDrag", e.target);
  }
}
</script>

<style scoped>
.controls {
  width: 100%;
  height: 100%;
  padding: 5px;
  overflow-y: auto;
}
.controls-title {
  padding: 5px 0;
}
</style>
