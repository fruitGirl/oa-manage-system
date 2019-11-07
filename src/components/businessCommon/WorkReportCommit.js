/*
 * @Description: 查看周报的评论功能
 * @Author: danding
 * @Date: 2019-05-30 10:03:40
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-30 10:09:48
 */

import React from 'react';
import "styles/components/common/workReportCommit.less";
import Separate from 'components/common/Separate';

const { Input, Button, Pagination } = window.antd;

class WorkReportCommit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  focusInput = () => {
    setTimeout(() => {
      this.inputRef.focus();
    });
  }

  changePage = (page, pageSize) => {
    this.props.changePage({ currentPage: page });
  }

  changeVal = (e) => {
    this.setState({ value: e.target.value });
  }

  submitCommit = () => {
    const { value } = this.state;
    this.props.submitCommit(value);
    setTimeout(() => {
      this.setState({ value: '' });
    }, 500);
  }

  render() {
    const { list = [], paginator, isSubmiting } = this.props;
    const { value } = this.state;
    const { page, items } = paginator;
    const disabled = (value && value.trim()) ? false : true;

    return (
      <div id="commit-wrapper">
        <a
          onClick={this.focusInput}
          href="#commit-wrapper"
          className="commit-icon"
        >
          <img
            width={28}
            height={28}
            src={T.getImg('commit.png')}
            alt="评论"
          />
          <div>去评论</div>
        </a>
        <p className="week-title">评论</p>
        <Separate size={20} />
        <div>
          <Input.TextArea
            value={this.state.value}
            placeholder="请输入，最多1000字"
            ref={(ref) => this.inputRef = ref }
            autosize={{ minRows: 3 }}
            style={{width: '500px'}}
            onChange={this.changeVal}
            maxLength={1000}
          />
          <Separate size={20} />
          <Button
            loading={isSubmiting}
            disabled={disabled}
            onClick={this.submitCommit}
            type="primary"
          >评论</Button>
        </div>
        <div>
          <Separate size={30} />
          {
            list.map(i => {
              const { commentUser, gmtCreate, content } = i;
              return (
                <div className="commit-msg">
                  <p className="user">
                    <span>{commentUser}</span>
                    <Separate isVertical={false} />
                    <span>{gmtCreate}</span>
                  </p>
                  <p className="commit-content" dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              );
            })
          }
          <Separate size={20} />
          {
            items
              ? <div style={{textAlign: 'right'}}>
                  <Pagination
                  size="small"
                  current={page}
                  total={items}
                  onChange={this.changePage}
                  showTotal={(total) => `总共 ${total} 条`}
                />
              </div>
              : null
          }
        </div>
      </div>
    );
  }
}

export default WorkReportCommit;
