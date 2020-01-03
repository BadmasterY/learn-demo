## import
### 动态 import
一个类似函数的动态 `import()`，它不需要依赖 `type="module"` 的 `script` 标签。

#### 例子:
```js
const main = document.querySelector("main");
for (const link of document.querySelectorAll("nav > a")) {
  link.addEventListener("click", e => {
    e.preventDefault();

    // 在这里动态导入
    // 支持 await
    import('/modules/my-module.js')
      .then(module => {
        module.loadPageInto(main);
      })
      .catch(err => {
        main.textContent = err.message;
      });
  });
}
```

请注意动态 `import` 与通常的 `import` 声明相比的区别：

- `import()` 可以从脚本(`scripts`)中使用，而不仅仅在模块(`modules`)中。
- 如果 `import()` 在模块中使用，则它可以在任何级别的任何位置使用，并且不会被提升。
- `import()` 接受任意字符串（可以为运行时确定的模板字符串，如 `url + '/index.js'`），而不仅仅是静态字符串文字。
- 在该模块中存 `import()` 不建立依赖关系，在获取包含的模块求值之前，必须先获取并求值依赖关系。
- `import()` 不建立可以静态分析的依赖关系。（但是，在更简单的情况下，比如 `import("/foo.js")`中，实现仍然可以执行推测性获取。）