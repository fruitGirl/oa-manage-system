const { Upload, Icon, Modal, message } = window.antd;

const PicturesWall = ({ leave, dispatch }) => {
  const { previewVisible, previewImage, active, fileList, imageNames } = leave;
  const handleCancel = () => {
    dispatch({
      type: 'leave/pictureWall',
      payload: {
        previewVisible: false
      }
    });
  };

  const handlePreview = (file) => {
    dispatch({
      type: 'leave/pictureWall',
      payload: {
        previewImage: file.url || file.thumbUrl,
        previewVisible: true,
        active: file.index
      }
    });
  };

  const handleChange = ({ file, fileList }) => {
    let list = [];
    const isLt2M = file.originFileObj.size / 1024 / 1024 < 2;

    if (!isLt2M && file.status !== 'removed') {
      message.error('图片文件超过2MB!');
    } else {
      // 上传校验成功
      if (file.status === 'done') {
        const data = file.response;
        if (data.success) {
          imageNames.push(`${data.imageName}`);
        } else {
          // 删除这个文件
          fileList.splice(file.index, 1);
          T.showError(data);
        }
      } else if (file.status === 'removed') {
        imageNames.splice(file.index, 1);
      }

      fileList.map((item, index) => {
        item.index = index;
        list.push(item);
        return list;
      });
      dispatch({
        type: 'leave/pictureWall',
        payload: {
          fileList: list,
          imageNames: imageNames
        }
      });
    }
  };

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const imgThumbnail = (active) => {
    return fileList.map((item, index) => {
      const isActive = active == index; // eslint-disable-line

      return (
        <span key={index} className={isActive ? 'active img_wrapper' : 'img_wrapper'}>
          <img src={item.url || item.thumbUrl} className="img_item" data-index={index} alt="" />
        </span>
      );
    });
  };
  const showPreview = (e) => {
    let thisDom = e.target;
    let src = thisDom.getAttribute('src');
    let active = thisDom.getAttribute('data-index');
    if (e.target.nodeName === 'IMG') {
      dispatch({
        type: 'leave/pictureWall',
        payload: {
          previewImage: src,
          active: active
        }
      });
    }
  };

  return (
    <div className="clearfix">
      <Upload
        accept="image/jpg,image/jpeg,image/gif,image/png"
        action={`${T['processPath']}/imageUpload.json`}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 5 ? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={handleCancel} width={600}>
        <div className="img_box">
          <div className="img_preview">
            <img alt="example" style={{ maxWidth: '100%' }} src={previewImage} />
          </div>
        </div>
        <div onClick={showPreview} className="thumbnail_footer clearfix">
          {imgThumbnail(active)}
        </div>
      </Modal>
    </div>
  );
};

export default PicturesWall;
