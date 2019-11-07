### CustomBreadcrumb
根据设计稿重新封装的面包屑组件

#### 属性
参数 | 说明 | 类型 | 默认值
-|-|-|-
title | 页面的标题 | string | -
config | 面包屑的配置 | array | []

#### demo
```
  class Demo extends React.PureComponent {
    componentDidMount() {
      this.config = [
        { link: '/xxx/xxxx.html', label: '文章管理'},
        { label: '文章新增' }
      ];
    }

    render() {
      return (
        <BasicLayout>
          <CustomBreadcrumb config={this.config} />
        </BasicLayout>
      );
    }
  }
```
