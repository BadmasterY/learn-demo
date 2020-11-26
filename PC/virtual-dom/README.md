## Virtual DOM
基于 `React` 的 `Virtual DOM` 思考与实现的粗糙版 `Virtual DOM` 及 `Diff` 算法。

该算法是基于 `16.x` 以下(不包含 `16.x`)版本实现。

### Start
首先确保已在全局安装 `npm`:
```bash
npm -v
```
安装项目依赖:
```bash
yarn install
yarn start
```

### 实现思路
#### element.js
用 `JavaScript` 来表示一个 `DOM` 节点, 实现产出 `virtual dom`, 并将其渲染为 `dom` 节点。
```js
import createElement from 'element.js';

const ul = new createElement('ul', { class: 'list', key: rootKey }, [
    new createElement('li', { class: 'item', key: '1' }, ['Item 1']),
    new createElement('li', { class: 'item', key: '2' }, ['Item 2']),
    new createElement('li', { class: 'item', key: '3' }, ['Item 3']),
    new createElement('li', { class: 'item', key: '4' }, ['Item 4']),
]);

const ulNode = ul.render();

document.body.appendChild(ulNode);
```

其中 `ul` 为产出的包含 `virtual dom` 的实例, `.render` 为实例上的渲染方法(`ReactDOM.render()`), 将 `virtual dom` 渲染为真实的 `dom` 节点。
 
#### diff.js
通过 `DFS` 实现新树与老树的比较。

**策略**
- `Web UI` 中 `DOM` 节点跨层级的移动操作特别少, 可以忽略不计。
- 拥有相同类的两个组件将会生成相似的树形结构, 拥有不同类的两个组件将会生成不同的树形结构。
- 对于同一层级的一组子节点, 它们可以通过唯一 `id` 进行区分。

现在知道了新旧的顺序, 求最小的插入、删除操作(移动可以看成是删除和插入操作的结合)。这个问题抽象出来其实是字符串的最小编辑距离问题(`Edition Distance`), 最常见的解决算法是 `Levenshtein Distance`, 通过动态规划求解, 时间复杂度为 `O(M * N)`。但是我们并不需要真的达到最小的操作, 我们只需要优化一些比较常见的移动情况, 牺牲一定 `DOM` 操作, 让算法时间复杂度达到线性的(`O(max(M, N)`)。  
> https://www.zhihu.com/question/29504639/answer/73607810

#### patch.js
使用 `dfs` 将差异更新到原有 `dom` 节点上。

```js
import patch from 'patch.js';

patch(ulNode, patches);
```