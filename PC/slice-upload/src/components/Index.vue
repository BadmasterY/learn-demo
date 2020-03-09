<template>
  <div class="index">
    <p>{{ msg }}</p>
    <span>切片大小(mb)</span><input type="text" v-model="size" /><br>
    <input type="file" id="file" @change="onChange" /><br>
    <button @click="upload">上传</button>
  </div>
</template> 

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Index extends Vue {
  @Prop() private msg!: string;

  size = 1;
  
  onChange(event: Event): void {
    const target = (event.target as HTMLInputElement);
    if(target) {
      const fileList = (target.files as FileList);
      if(fileList && fileList.length > 0) {
        const formData = new FormData();
        console.log(formData);
      }
    }
  }

  upload(): void {
    console.log('上传')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
