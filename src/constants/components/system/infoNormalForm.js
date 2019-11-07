import regex from 'utils/regex';

const { Icon } = window.antd;

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 15 },
};

const fileLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 12 },
};

const uploadButton = (
  <div>
    <Icon type="plus" />
  </div>
);

// 编辑器的配置
const EDITOR_CONTROLS = [
  'undo', 'redo','font-size', 'line-height', 'letter-spacing','text-color', 'bold', 'italic', 'underline', 'strike-through','text-indent', 'text-align','headings', 'list-ul', 'list-ol', 'blockquote','hr', 'link', 'media'
];
const requireRule = [{ required: true, message: '必填项' }];
const posIntRule = [{ pattern: regex.positiveInteger, message: '请填写正整数' }];

// 编辑器上传图片接口，图片地址前缀
const UPLOAD_SERVER = '/system/infoImageUpload.json';
const IMG_PREFIX = `${window.location.origin}/system`;

// 编辑器图片上传
const editorUpload = async (param) => {
  let formData = new FormData();
  formData.append("fileData", param.file);

  // 请求查询接口
  try {
    const res = await T.upload(UPLOAD_SERVER, formData);
    param.success({
      url: `${IMG_PREFIX}${res.url}`
    });
  } catch (err) {
    param.error({
      msg: '上传失败'
    });
    T.showErrorMessage('上传失败');
  }
};

export { formItemLayout, uploadButton, EDITOR_CONTROLS, requireRule, fileLayout, posIntRule, editorUpload };
