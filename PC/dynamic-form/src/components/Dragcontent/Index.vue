<template>
  <div class="dragcontent" @drop="onDrop($event)" @dragover="allowDrop($event)">
    <Form :label-width="80" label-colon label-position="right">
      <transition-group name="flip-list" mode="out-in">
        <div
          :draggable="true"
          v-for="(item, index) in list"
          :class="['box', 'box'+ index, item.isFocus == true ? 'box-focus' : '']"
          :key="index"
          @dragstart="onDrag($event, index)"
          @dragenter="dragenter(index)"
          @click="boxFocus($event, index)"
        >
          <FormItem
            v-if="item.type === 'input'"
            :label="item.atrribute.basic.isLabel ? item.atrribute.label.name : ''"
          >
            <Input type="text" :placeholder="item.atrribute.basic.placeholder" />
          </FormItem>
          <FormItem
            v-else-if="item.type === 'date'"
            :label="item.atrribute.basic.isLabel ? item.atrribute.label.name : ''"
          >
            <DatePicker type="date" :placeholder="item.atrribute.basic.placeholder"></DatePicker>
          </FormItem>
          <FormItem
            v-else-if="item.type === 'textarea'"
            :label="item.atrribute.basic.isLabel ? item.atrribute.label.name : ''"
          >
            <Input
              type="textarea"
              :autosize="{minRows: 2,maxRows: 10}"
              :placeholder="item.atrribute.basic.placeholder"
            ></Input>
          </FormItem>
          <h5
            v-else-if="item.type === 'title'"
            :style="{'text-align': item.atrribute.basic.align, 'font-size': item.atrribute.basic.fontSize + 'px'}"
          >{{ item.atrribute.basic.value }}</h5>
          <Divider v-else-if="item.type === 'divider'" />
          <Icon
            v-if="item.isFocus == true"
            class="delete-btn"
            size="20"
            color="#fff"
            type="md-trash"
            @click="del($event, index)"
          />
        </div>
      </transition-group>
      <Button class="sub-btn" type="primary">提交</Button>
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import util from "../../utils/utils.js";

@Component
export default class Dragcontent extends Vue {
  list: any[] = [];

  target: EventTarget | null = null;

  oldIndex: number | null = null;
  newIndex: number | null = null;

  onDrop(e: Event): void {
    e.preventDefault();

    const value = this.$store.state.dragger.innerText;
    if (!value) {
      this.onDropSelf(e.target);
      return;
    }
    const data = util.getInitData(value);

    this.list.push(data);

    this.$store.commit("setList", this.list);
    this.$store.commit("setDrag", "");
  }

  onDrag(e: Event, index: number): void {
    this.target = e.target;
    this.oldIndex = index;
  }

  onDropSelf(target: EventTarget | null): void {
    if (this.target == target) return;
    if (this.oldIndex == this.newIndex) return;

    const newList = [...this.list];
    // 删除老的节点
    const data = newList.splice(this.oldIndex, 1);
    // 在列表中目标位置增加新的节点
    newList.splice(this.newIndex, 0, data[0]);
    // this.list一改变，transition-group就起了作用
    // 不过也会有问题
    // 删除不需要的组件时, 会有影响
    this.list = [...newList];

    this.target = null;

    this.$store.commit("setList", this.list);
  }

  allowDrop(e: Event): void {
    e.preventDefault();
  }

  dragenter(index: number) {
    this.newIndex = index;
  }

  boxFocus(e: Event, index: number): void {
    e.preventDefault();

    for (const item of this.list) {
      item.isFocus = false;
    }

    this.list[index].isFocus = true;

    this.$store.commit("setAtrribute", this.list[index].atrribute);
    this.$store.commit("setIndex", index);
    this.$store.commit("setList", this.list);
  }

  del(e: Event, index: number): void {
    e.preventDefault();
    e.stopPropagation();

    this.list.splice(index, 1);

    this.$store.commit("setList", this.list);
    this.$store.commit("setAtrribute", null);
  }
}
</script>

<style scoped>
.dragcontent {
  min-height: 100%;
  padding: 10px 30px;
}
.box {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  position: relative;
  box-sizing: border-box;
  transition: all 300ms;
}

.ivu-form-item {
  margin: 0;
}

.box-focus {
  box-shadow: 0 0 3px #aaa;
}

.box:hover {
  box-shadow: 0 0 3px #aaa;
}

.delete-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  background: #ed4014;
}

.sub-btn {
  display: block;
  margin: 0 auto;
}

.flip-list-move {
  transition: transform 150ms;
}
</style>
