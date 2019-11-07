### UploadFile
根据业务封装的上传组件

#### 属性
参数 | 说明 | 类型 | 默认值
-|-|-|-|-
fileList | 文件集合 | array[object] | []
size | 单个文件的最大大小(M) | number | 5
accept | 接收的文件格式 | string | -
count | 上传的文件最大数量 | number | -
action | 接口 | string | -
onRemove | 删除 | function(file) | () => {}
resFileName | 接口返回的参数名 | string | -
