### SearchBar组件
用于表单查询或者表单提交 

#### 属性
参数 | 说明 | 类型 | 可选值 | 默认值 
-|-|-|-|-
configs | 表单配置 | array | - | []
buttonComponent | 按钮组件 | string | - | null
showBtn | 是否显示整个按钮部分 | boolean | - | true
showSearchBtn | 是否显示查询按钮 | boolean | - | true

#### 方法
方法名 | 说明  | 参数
-|-|-
search | 表单提交 | -

#### demo
```
  <!-- 表单配置 -->
  const configs = [
    {
      label: '输入框',
      field: 'field1',
      type: 'input',
      propsComponent: {
        placeholder: '请选择',
      }
    },
    {
      label: '选择框',
      field: 'field2',
      type: 'select',
      propsComponent: {
        placeholder: '选择框',
        dataProvider: [
          {
            label: '55555',
            value: '1'
          },
          {
            label: 'hhhh',
            value: '2'
          }
        ]
      }
    },
    {
      label: '时间选择框',
      field: 'field3',
      type: 'datePick',
      propsComponent: {
        placeholder: 'datepick',
        format: 'YYYY-MM-DD'
      }
    },
    {
      label: '数字输入款',
      field: 'field4',
      type: 'inputNumber',
      propsComponent: {
        placeholder: '数字input',
      }
    },
    {
      label: 'rangePick',
      field: 'field5',
      type: 'rangePicker',
      propsComponent: {
        format: 'YYYY-MM-DD'
      }
    },
  ];
  <!-- 按钮 -->
  const buttonComponent = <Button type="primary"> 查看</Button>;
  <SearchBar
    configs={configs}
    search={() => {}}
    buttonComponent={buttonComponent}
  />
```
