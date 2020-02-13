<template>
  <div class="dragcontent" @click="clearFocus" @drop="onDrop($event)" @dragover="allowDrop($event)">
    <Form :label-width="120" label-colon label-position="right">
      <transition-group name="fade" mode="out-in">
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
            <Input
              type="text"
              :style="item.atrribute.style"
              :placeholder="item.atrribute.basic.placeholder"
            />
          </FormItem>
          <FormItem
            v-else-if="item.type === 'date'"
            :label="item.atrribute.basic.isLabel ? item.atrribute.label.name : ''"
          >
            <DatePicker
              type="date"
              :style="item.atrribute.style"
              :placeholder="item.atrribute.basic.placeholder"
            ></DatePicker>
          </FormItem>
          <FormItem
            v-else-if="item.type === 'textarea'"
            :label="item.atrribute.basic.isLabel ? item.atrribute.label.name : ''"
          >
            <Input
              type="textarea"
              :style="item.atrribute.style"
              :autosize="{minRows: 2,maxRows: 10}"
              :placeholder="item.atrribute.basic.placeholder"
            ></Input>
          </FormItem>
          <FormItem
            v-else-if="item.type === 'select'"
            :label="item.atrribute.basic.isLabel ? item.atrribute.label.name : ''"
          >
            <Select
              :style="item.atrribute.style"
              clearable
              :placeholder="item.atrribute.basic.placeholder"
            >
              <Option
                v-for="item in item.atrribute.basic.list"
                :value="item.value"
                :key="item.value"
              >{{ item.value }}</Option>
            </Select>
          </FormItem>
          <FormItem
            v-else-if="item.type === 'radio'"
            :label="item.atrribute.basic.isLabel ? item.atrribute.label.name : ''"
          >
            <RadioGroup v-model="item.atrribute.basic.init" :style="item.atrribute.style">
              <Radio
                v-for="value in item.atrribute.basic.list"
                :key="value.value"
                :label="value.value"
              >{{ value.value }}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            v-else-if="item.type === 'checkbox'"
            :label="item.atrribute.basic.isLabel ? item.atrribute.label.name : ''"
          >
            <CheckboxGroup v-model="item.atrribute.basic.init" :style="item.atrribute.style">
              <Checkbox
                v-for="value in item.atrribute.basic.list"
                :key="value.value"
                :label="value.value"
              ></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <Button
            v-else-if="item.type === 'button'"
            :type="item.atrribute.basic.type"
            :style="item.atrribute.style"
          >{{ item.atrribute.basic.value }}</Button>
          <h5
            v-else-if="item.type === 'title'"
            :style="{'text-align': item.atrribute.basic.align, 'font-size': item.atrribute.basic.fontSize + 'px', ...item.atrribute.style}"
          >{{ item.atrribute.basic.value }}</h5>
          <Divider v-else-if="item.type === 'divider'" :style="item.atrribute.style" />
          <transition name="fade">
            <Icon
              v-if="item.isFocus == true"
              class="delete-btn"
              size="20"
              color="#fff"
              type="md-trash"
              @click="del($event, index)"
            />
          </transition>
        </div>
      </transition-group>
      <!-- <Button class="sub-btn" type="primary">提交</Button> -->
    </Form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import util from "../../utils/utils";

interface Json {
  [p: string]: string;
}

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
    const data: Json = util.getInitData(value);

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
    const data = newList.splice(this.oldIndex as number, 1);
    // 在列表中目标位置增加新的节点
    newList.splice(this.newIndex as number, 0, data[0]);
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

    this.clearFocus(e);

    this.list[index].isFocus = true;

    this.$store.commit("setAtrribute", this.list[index].atrribute);
    this.$store.commit("setIndex", index);
    this.$store.commit("setList", this.list);
  }

  clearFocus(e: Event): void {
    e.preventDefault();
    e.stopPropagation();

    for (const item of this.list) {
      item.isFocus = false;

      this.$store.commit("setAtrribute", null);
      this.$store.commit("setIndex", null);
      this.$store.commit("setList", this.list);
    }
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
  background: #f90;
  transition: background 200ms;
}

.delete-btn:hover {
  background: #ed4014;
}

.sub-btn {
  display: block;
  margin: 0 auto;
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
