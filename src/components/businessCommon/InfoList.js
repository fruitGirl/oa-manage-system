/*
 * @Description: 基本信息展示
 * @Author: moran 
 * @Date: 2019-09-11 10:29:26 
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-29 14:07:10
 */

import React from 'react';
import 'styles/components/businessCommon/infoList.less';
const { Modal } = window.antd;

class InfoList extends React.PureComponent {
  previewImg = (imgUrl) => {
    Modal.info({
      title: '预览图片',
      width: 600,
      content: (
        <img src={imgUrl} style={{ maxWidth: '100%' }} alt="图片显示"/>
      )
    });
  }

  render() {
    const { configs, isVertical } = this.props;
    return(
      <ul className="info-list-box">
        {
          configs.map((i, index) => {
            const { label, value, imgLists = [], userInfoLists, fileDatas } = i;
            return (
              <div>
                {/* 用户信息 */}
                {
                  userInfoLists.length ? (
                    userInfoLists.map((item) => {
                      return (
                        <li class={`row ${isVertical ? '' : 'horizontal'}`} key={`user-${index}`}>
                          <span className="label">{item.label}</span>
                          <span className="value">{item.value}</span>
                        </li>
                      );
                    })
                    
                  ) : (
                    <li class={`row ${isVertical ? '' : 'horizontal'}`} key={index}>
                      <span className="label">{label}</span>
                      {!(imgLists.length || fileDatas) ? <span className="value">{value}</span> : null}
                      {/* 图片 */}
                      { imgLists.length ?  
                        <span className="img-box">
                          {
                            imgLists.map((item, index) => {
                              return (
                                <img src={item}
                                  alt="图片显示"
                                  className="img-style"
                                  key={`img${index}`}
                                  onClick={() => this.previewImg(item)}/>
                              );
                            })
                          }
                        </span> : null
                      }
                      {/* 附件 */}
                      {
                        fileDatas ? (
                          <div className="value">{
                            Object.keys(fileDatas).map(key => {
                              return (
                                      <a className='file-block'
                                        href={`/process/fileDownload.resource?resourceId=${key}`}>
                                        {fileDatas[key]}
                                      </a>
                              );
                            })
                          }
                          </div>) : null
                      }
                    </li>
                    
                  )
                }
              </div>
            );
          })
        }
      </ul>
    );
  }
}

InfoList.propTypes = {
  configs: PropTypes.array.isRequired, // 基本信息配置
  isVertical: PropTypes.bool // 是否按列显示
};

InfoList.defaultProps = {
  configs: [],
  isVertical: true
};

export default InfoList;
