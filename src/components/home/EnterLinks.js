/*
 * @Description: 快捷入口
 * @Author: danding
 * @Date: 2019-04-23 09:40:58
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 18:05:13
 */

import React from 'react';
import PropTypes from 'prop-types';
import InfoCard from 'components/common/InfoCard';
import 'styles/components/home/enterLinks.less';

const { Spin } = window.antd;

const createItem = (item) => {
  if (!item) return null;
  const { entryName, resourceId, entryUrl, openNewPage } = item;
  return (
    <a
      href={entryUrl}
      target={openNewPage ? '_blank' : '_self'}
      className="item-card clearfix"
    >
      <img
        src={`/system/quickEntryImage.resource?resourceId=${resourceId}`}
        alt="链接"
        className="entry-logo pull-left"
      />
      <span className="entry-name pull-left">{ entryName }</span>
    </a>
  );
};

const EnterLinks = (props) => {
  const { dataProvider, loading } = props;

  return dataProvider.length
    ? (
      <InfoCard wrapperClass="entry-wrapper" title="快捷入口">
        <Spin spinning={loading}>
          <div className="entry-content clearfix">
            {
              [...new Array(15).keys()].map((i, index) => {
                return (
                  <div className="item pull-left">
                      { createItem(dataProvider[index]) }
                  </div>
                );
              })
            }
          </div>
        </Spin>
      </InfoCard>
    )
    : null;
};

EnterLinks.propTypes = {
  dataProvider: PropTypes.array.isRequired, // 数据源
};

EnterLinks.defaultProps = {
  dataProvider: []
};

export default EnterLinks;
