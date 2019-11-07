/*
 * @Description: 表单配置-来源
 * @Author: danding
 * @Date: 2019-09-05 16:08:49
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-17 19:26:10
 */

import React from 'react';
import Sortable from 'react-sortablejs';
import Separate from 'components/common/Separate';

class SourcePane extends React.PureComponent {
  render() {
    const { configs, addItem } = this.props;

    return (
      <div>
        <Separate size={15}/>
        <div className="source-items-tip">
          <i className="triangle-icon" />
          &nbsp;
          <span>可作为流程配置条件</span>
        </div>
        <Sortable
          className="source-items-wrapper"
          options={{
            group: {
              name: 'shared',
              pull: 'clone',
            },
            sort: false
          }}
          onChange={addItem}
        >
          {
            configs.map(i => (
              <div
                key={i.type}
                data-id={i.type}
                className="source-item"
              >
                { i.isCondition && <i className="condition-icon"></i> }
                { i.props.label }
              </div>
            ))
          }
        </Sortable>
      </div>
    );
  }
}

export default SourcePane;
