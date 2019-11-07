### CustomTable
根据现有业务重新封装表格

#### 属性
参数 | 说明 | 类型 | 默认值
-|-|-|-
list | 表格数据源 | array | []
paginator | 分页对象 | object | {}
loading | 表格加载中 | boolean | false
columns | 表格配置 | array | []
rowKey | 表格的主键 | string | id
hasPagination | 是否有分页 | boolean | true
onChangePaginator | 分页操作 | function(currentPage, pageSize)


