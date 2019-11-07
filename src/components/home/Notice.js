/*
 * @Description: 新闻通知
 * @Author: danding
 * @Date: 2019-04-23 09:41:10
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 18:05:08
 */

import React from 'react';
import InfoCard from 'components/common/InfoCard';
import 'styles/components/home/notice.less';

const { Spin } = window.antd;

const Menu = ({ menuData = [], selectedMenu = {}, shiftMenu }) => {
  return (
    <div className="clearfix menu-wrapper">
      {
        menuData.map(i => (
          <div
            className={`
              pull-left
              menu-item
              ${selectedMenu.value === i.value ? 'active': ''}
            `}
            onClick={() => shiftMenu(i)}
          >{i.label}</div>
        ))
      }
      { menuData.length
        ? <a
          href={`/system/infoPageQuery.htm?channelId=${selectedMenu.value}&channel=${selectedMenu.label}`}
          className="pull-right more-icon"
        >more&#62;</a>
        : null
      }
    </div>
  );
};

const List = ({ list = [], channel, }) => {
  return (
    <div className="list-wrapper">
      {
        list.map(i => (
          <div className="clearfix list-item">
            <a
              href={`/system/infoDetailQuery.htm?id=${i.id}&channel=${channel}`}
              className="pull-left article-title ellipsis"
              title={i.title}
            >{i.title}</a>
            <span className="time pull-right">{i.gmtPublish}</span>
          </div>
        ))
      }
    </div>
  );
};

const Notice = (props) => {
  const {
    selectedMenu = {},
    list,
    menuData,
    shiftMenu,
    loading
  } = props;

  return list.length
    ? (
      <InfoCard wrapperClass="notice-wrapper">
        <Menu
          menuData={menuData}
          shiftMenu={shiftMenu}
          selectedMenu={selectedMenu}
        />
        <Spin spinning={loading}>
          <List list={list} channel={selectedMenu.label} />
        </Spin>
      </InfoCard>
    )
    : null;
};

Notice.propTypes = {

};

Notice.defaultProps = {

};

export default Notice;
