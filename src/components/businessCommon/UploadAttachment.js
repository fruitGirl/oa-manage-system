const { Upload, message } = window.antd;

const MAXFILESIZE = 10 * 1024 * 1025;
const UploadAttachment = ({
  uploadAttachmentState,
  dispatch,
  action,
  nameSpace,
  data = {},
  uploadName, // 存储提交后台的文件的fileName
  fileListName, // 前端显示的文件列表
  showUploadList = true,
  isRequire = false
}) => {
  const fileList = uploadAttachmentState[fileListName] || [];
  const fileNameList = uploadAttachmentState[uploadName] || [];

  const props = {
    action,
    data,
    showUploadList,
    fileList,
    key: fileListName,
    beforeUpload(file, fileList) {
      const name = file.name.toLowerCase();
      if (!/\.(gif|jpg|jpeg|png|bmp|zip|rar|doc|docx|xlsx|xls|pdf)$/.test(name)) {
        message.error('仅支持上传后缀名为jpg,jpeg,png,gif,bmp,zip,rar,doc,docx,xlsx,xls,pdf的文件');
        return false;
      }
      if (file.size > MAXFILESIZE) {
        message.error('上传的文件不能大于10M');
        return false;
      }

      return true;
    },
    onSuccess(result, file, xhr) {
      if (result.success) {
        const fileName = result.fileName;
        dispatch({
          type: `${nameSpace}/save`,
          payload: {
            [fileListName]: [
              ...fileList,
              {
                uid: file.uid,
                name: file.name,
                status: 'done',
                fileName,
                url: `${T.processPath}/fileDownload.resource?fileName=${fileName}`
              }
            ],
            [uploadName]: [...fileNameList, fileName]
          }
        });
      } else {
        message.error(T.getError(result));
      }
    },
    onError() {
      message.error('系统错误');
    },
    onRemove(file) {
      const fileNameRemove = file.fileName;
      const newFileList = fileList.filter(({ uid, name, status, fileName }) => fileName !== fileNameRemove);
      const newFileNameList = fileNameList.filter((key) => key !== fileNameRemove);
      dispatch({
        type: `${nameSpace}/save`,
        payload: {
          [uploadName]: [...newFileNameList],
          [fileListName]: [...newFileList]
        }
      });
    }
  };
  return (
    <Upload {...props}>
      <span style={{ color: '#2299ee', cursor: 'pointer', marginRight: '20' }}>添加附件</span>
      {isRequire && fileNameList.length === 0 && <span className="text-primary">请上传附件</span>}
    </Upload>
  );
};
export default UploadAttachment;
