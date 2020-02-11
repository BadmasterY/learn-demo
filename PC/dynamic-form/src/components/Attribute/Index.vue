<template>
  <div class="attribute">
    <Collapse simple accordion v-if="this.$store.state.atrribute">
      <Panel name="1">
        基础属性
        <ul slot="content">
          <li v-if="this.$store.state.atrribute.basic.placeholder">
            提示文字:
            <Input :value="this.$store.state.atrribute.basic.placeholder" />
          </li>
          <li v-if="this.$store.state.atrribute.basic.value">
            内容:
            <Input :value="this.$store.state.atrribute.basic.value" />
          </li>
        </ul>
      </Panel>
      <Panel v-if="this.$store.state.atrribute.basic.isLabel" name="2">
        标签属性
        <p
          slot="content"
        >斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。</p>
      </Panel>
      <Panel name="3">
        样式
        <p
          slot="content"
        >乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。</p>
      </Panel>
    </Collapse>
    <div v-else>请选择需要修改的控件</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Atrribute extends Vue {
  switchChange(e): void {
    console.log(this.$store.state.list[this.$store.state.focusIndex]);
  }
}
</script>

<style scoped>
ul,
li {
  list-style: none;
}
</style>
