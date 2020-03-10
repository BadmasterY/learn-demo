<template>
  <div class="index">
    <h2>{{ msg }}</h2>
    <span>切片大小(mb):</span>
    <input type="text" v-model="size" />
    <br />
    <input type="file" id="file" @change="onChange" />
    <br />
    <p>上传进度: {{ progress }}</p>
    <button @click="upload">上传</button>
  </div>
</template> 

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { uuid } from "uuidv4";

/**
 * 文件名转码
 * @param {String} fileName 原始文件名
 * @returns {String} 转码后文件名
 */
function EncodeFileName(fileName = "") {
  const nameArr = fileName.split(".");
  const index = nameArr.length - 1;
  if (index > -1) {
    const suffix = nameArr.splice(index, 1)[0]; // 获取后缀
    const name = nameArr.join("."); // 还原文件名
    const encodeName = encodeURI(name); // 转码

    return `${encodeName}.${suffix}`; // 返回转码后文件名+后缀
  } else {
    return fileName;
  }
}

@Component
export default class Index extends Vue {
  @Prop() private msg!: string;

  start = false;

  size = 1;

  progress = "0%";

  file: File = new File([], "");

  formData = new FormData();

  // 监听上传文件变化
  onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const fileList = target.files as FileList;
      if (fileList && fileList.length > 0) {
        this.file = fileList[0]; // 获取文件列表第一个
      }
    }
  }

  async upload() {
    if (this.file.size == 0) return;
    if (this.start) return;

    this.start = true;

    this.progress = "0%";

    let start = 0; // 起始位置大小
    let end = 0; // 结束位置大小
    let index = 0; // 当前起始位置下标
    const id = uuid(); // 创建 uuid, 确保每次上传 id 唯一
    const size = this.file.size; // 文件总字节数
    const chunkSize = this.size * 1024 * 1024; // 默认为1mb, 根据前端输入框可调
    const total = Math.ceil(size / chunkSize); // 文件切片数, 向上取整
    const name = EncodeFileName(this.file.name); // 文件名转码, 避免中文名异常

    const config = {
      // 在 axios 配置信息 onUploadProgress 中监听进度
      onUploadProgress: (progressEvent: ProgressEvent) => {
        if (progressEvent.loaded / progressEvent.total == 1) {
          start = end;
          index++;
          this.progress = `${Math.ceil((index / total) * 100)} %`;
        }
      }
    };
    // 只要起始位置比文件大小小, 就继续执行
    while (start < size) {
      end = start + chunkSize; // 结束位置为当前起始位置 + 切片大小
      if (end > size) {
        end = size; // 当结束位置比当前文件大小大时, 设置为当前文件大小
      }

      const chunk = this.file.slice(start, end); // 切片
      this.formData = new FormData();
      this.formData.append("id", id);
      this.formData.append("name", `${name}.${index}`);
      this.formData.append("index", `${index}`);
      this.formData.append("file", chunk);
      const result = await this.axios.post(
        "/app/uploadStart",
        this.formData,
        config
      );
      if (result.data.error == 1) {
        throw new Error("上传异常! 请重新尝试!");
      }
    }

    this.progress = "文件合并中...请稍候...";
    this.formData = new FormData();
    this.formData.append("id", id);
    this.formData.append("name", name);
    this.formData.append("total", `${total}`);
    this.axios
      .post("/app/uploadEnd", this.formData)
      .then(({ data }) => {
        console.log(data.url);
        this.progress = "上传完毕!";
        this.start = false;
      })
      .catch(err => {
        throw new Error(err);
      });
  }
}
</script>

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
