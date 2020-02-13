<template>
  <div class="attribute">
    <transition mode="out-in" name="fade">
      <Collapse key="setting-list" simple accordion v-if="atrribute">
        <Panel name="1">
          基础属性
          <ul slot="content">
            <li v-if="placeholder != undefined">
              提示文字:
              <Input v-model="placeholder" />
            </li>
            <li v-if="value != undefined">
              内容:
              <Input v-model="value" />
            </li>
            <li v-if="list != undefined">
              可选项:
              <ul class="lists">
                <li v-for="(item, index) in list" :key="index">
                  <Row>
                    <Col span="18">
                      <Input type="text" v-model="list[index].value" placeholder="请输入选项..."></Input>
                    </Col>
                    <Col span="4" offset="1">
                      <Button type="error" @click="handleRemove(index)">Delete</Button>
                    </Col>
                  </Row>
                </li>
                <li>
                  <Button type="dashed" @click="addList">+</Button>
                </li>
              </ul>
            </li>
            <!-- <li v-if="init != undefined">
              默认选中:
              <Input v-model="init" />
            </li> -->
            <li v-if="type != undefined">
              类型:
              <RadioGroup v-model="type">
                <Radio border v-for="(item, index) in types" :key="index" :label="item">{{ item }}</Radio>
              </RadioGroup>
            </li>
          </ul>
        </Panel>
        <Panel v-if="isLabel" name="2">
          标签属性
          <ul slot="content">
            <li v-if="name != undefined">
              标签名:
              <Input v-model="name" />
            </li>
          </ul>
        </Panel>
        <Panel name="3">
          样式
          <ul slot="content">
            <li>
              <Input type="textarea" v-model="style" placeholder='请使用类似: {"key": "value"} 的形式, 如果不需要请保留一对大括号 {}...' />
            </li>
          </ul>
        </Panel>
      </Collapse>
      <div class="setting-default" v-else key="default">请点击需要修改的控件</div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Atrribute extends Vue {
  index = 0;

  addList(): void {
    this.list.push({
      value: "新增项目" + (this.index++),
    });
  }

  handleRemove(index: number) {
    this.list.splice(index, 1);
  }

  get atrribute() {
    return this.$store.state.atrribute;
  }

  get placeholder() {
    return this.atrribute.basic.placeholder;
  }

  set placeholder(value) {
    this.atrribute.basic.placeholder = value;
  }

  get value() {
    return this.atrribute.basic.value;
  }

  set value(value) {
    this.atrribute.basic.value = value;
  }

  get isLabel() {
    return this.atrribute.basic.isLabel;
  }

  get name() {
    return this.atrribute.label.name;
  }

  set name(value) {
    this.atrribute.label.name = value;
  }

  get style() {
    const value = JSON.stringify(this.atrribute.style);
    return value;
  }

  set style(value) {
    this.atrribute.style = JSON.parse(value);
  }

  get list() {
    return this.atrribute.basic.list;
  }

  get init() {
    return this.atrribute.basic.init;
  }

  set init(value) {
    this.atrribute.basic.init = value.split(',');
  }

  get type() {
    return this.atrribute.basic.type;
  }

  set type(value) {
    this.atrribute.basic.type = value;
  }

  get types() {
    return this.atrribute.basic.types;
  }
}
</script>

<style scoped>
ul,
li {
  list-style: none;
}

.setting-default {
  text-align: center;
  padding: 15px 0;
  color: #aaa;
}

.lists li {
  padding: 5px 10px;
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
