/*
 * @Description: 新闻-更多
 * @Author: danding
 * @Date: 2019-04-23 09:43:17
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-26 18:12:06
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/system/infoPageQuery/list.less';
import Separate from 'components/common/Separate';

const { Pagination } = window.antd;

const List = (props) => {
  const { list, onChange, channel, paginator } = props;
  const { items, page, itemsPerPage } = paginator;

  return (
    <div className="info-list clearfix">
      {
        list.map(i => (
          <div className="info-list-item clearfix">
            <a href={`/system/infoDetailQuery.htm?id=${i.id}&channel=${channel}`} className="title pull-left">{i.title}</a>
            <span className="pull-right time">{i.gmtPublish}</span>
          </div>
        ))
      }
      <Separate size={30} />
      <div className="pull-right">
        <Pagination
          showTotal={(total) => `总共${total}条`}
          current={page}
          pageSize={itemsPerPage}
          showQuickJumper
          total={items}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

List.propTypes = {
  list: PropTypes.array,
  onChange: PropTypes.func,
  channel: PropTypes.string, // 栏目名称
  paginator: PropTypes.object
};

List.defaultProps = {
  list: [],
  onChange: () => {},
  channel: '',
  paginator: {}
};

export default List;
