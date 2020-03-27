## Blog Client
博客客户端。

### 关于 redux
`Redux` 整体设计采用 [Ducks](https://github.com/erikras/ducks-modular-redux)。

#### state
`State` 设计遵循以下原则(数据库设计原则):
- 数据按照领域（`Domain`）分类，存储在不同的表中，不同的表中存储的列数据不能重复。
- 表中每一列的数据都依赖于这张表的主键。
- 表中除了主键以外的其他列，互相之间不能有直接依赖关系。