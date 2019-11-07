import React from 'react';
import Separate from 'components/common/Separate';
import 'styles/components/performance/historyList.less';

const { Pagination } = window.antd;

export default class HistoryList extends React.PureComponent {
  render() {
    const { HistoryListMsg = [], onChangePage, } = this.props;
    const { list = [], paginator = {} } = HistoryListMsg;
    const { items, page } = paginator;

    return list.length
      ? (
        <div className="history-list">
          <h2 className="title">操作历史</h2>
          {
            list.map(i => {
              const { operator, gmtCreate, memo, actionType } = i;
              const content = (actionType.name.indexOf('REFUSE') !== -1)
                ? `<span>
                <span style='color: #999'>打回原因：</span>
                <span>${memo}</span>
                </span>`
                : memo;
              return (
                <div className="record-wrapper">
                  <p className="normal-msg">
                    <span>{operator}</span>
                    <Separate isVertical={false} />
                    <span>{gmtCreate}</span>
                    <Separate isVertical={false} />
                    <span>{actionType.message}</span>
                  </p>
                  <p
                    style={{wordBreak: 'break-all'}}dangerouslySetInnerHTML={{ __html: content || ''}}
                  />
                </div>
              );
            })
          }
          <div style={{textAlign: 'right'}}>
            <Separate />
            <Pagination
              size="small"
              current={page || 1}
              total={items}
              showTotal={() => `总共${items}条`}
              onChange={onChangePage}
            />
          </div>
        </div>
      )
      : null;
  }
}



