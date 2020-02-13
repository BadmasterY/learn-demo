<template>
  <div class="preview">
    <div class="box">
      <Form class="form-box" :label-width="120" label-colon label-position="right">
        <div v-for="(item, index) in list" :key="index">
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
            <RadioGroup :value="item.atrribute.basic.init" :style="item.atrribute.style">
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
            <CheckboxGroup :style="item.atrribute.style" :value="item.atrribute.basic.init">
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
        </div>
      </Form>
      <div class="close-btn" @click="close">X</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Preview extends Vue {
  close() {
    this.$store.commit("setPreview", false);
  }

  get list() {
    return this.$store.state.list;
  }
}
</script>

<style scoped>
.preview {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 9;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
.box {
  max-width: 450px;
  width: 100%;
  height: 90%;
  background: #fff;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  overflow: hidden;
}
.form-box {
  width: calc(100% + 17px);
  height: 100%;
  padding: 20px 30px;
  padding-right: 47px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.close-btn {
  position: absolute;
  width: 25px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  border-radius: 0 0 0 5px;
  background: #ed4014;
  color: #fff;
  font-weight: bold;
  top: 0;
  right: 0;
  cursor: pointer;
  transition: background 200ms;
}
.close-btn:hover {
    background: #f40;
}
</style>
