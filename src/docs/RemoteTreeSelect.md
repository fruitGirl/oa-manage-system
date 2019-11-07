### RemoteTreeSelect
获取远程数据的下拉 TreeSelect 组件

#### 属性
参数 | 说明 | 类型 | 默认值
-|-|-|-
value | 需要预览的图片集合 | array[string] | []
action | 接口 | string | -
onChange | 下拉选择改变 | function(value) | function() {}
parseStructure | 解析数据结构 | function(response) | function() {}
style | 组件容器样式 | object | { width: '176px' }

#### demo
```
...
// 解析公司树的函数
parseCompanyTreeData = (res) => {
  const { companySimpleList = [] } = res.outputParameters;
  return combineCompanyData(companySimpleList);
};

// 重新组合公司树
function combineCompanyData(data = []) {
  return data.map(i => {
    const { shortName, id, directCompany = [] } = i;
    const children = combineCompanyData(directCompany);
    return {
      title: shortName,
      value: id,
      key: id,
      children,
    };
  });
}

render() {
  return (
    <RemoteTreeSelect
      action={'/xxxx/api' }
      parseStructure={this.parseCompanyTreeData}
    />
  )
}
```
