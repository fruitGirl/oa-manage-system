import React from 'react';
import PropTypes from 'prop-types';
import Separate from 'components/common/Separate';
import 'styles/components/performance/historyList.less';

export default class HistoryList extends React.PureComponent {
  render() {
    const { list = [] } = this.props;

    return list.length
      ? (
        <div className="history-list" style={{margin: 0}}>
          <h2 className="title">操作历史</h2>
          {
            list.map(i => {
              const { operator, gmtCreate, content = '', action, teamName } = i;
              const refuseContent = (action.name.indexOf('REFUSE') !== -1)
                ? `<span>
                <span style='color: #999'>打回原因：</span>
                <span>${content || '无'}</span>
                </span>`
                : content;
              return (
                <div className="record-wrapper">
                  <p className="normal-msg">
                    <span>{operator}</span>
                    <Separate isVertical={false} />
                    <span>{gmtCreate}</span>
                    <Separate isVertical={false} />
                    <span>{action.message}  {teamName}</span>
                  </p>
                  <p
                    style={{wordBreak: 'break-all'}}dangerouslySetInnerHTML={{ __html: refuseContent || ''}}
                  />
                </div>
              );
            })
          }
        </div>
      )
      : null;
  }
}

HistoryList.propTypes = {
  list: PropTypes.array
};

HistoryList.defaultProps = {
  list: []
};



