/*
 * @Description: 会议室-预定面板
 * @Author: danding
 * @Date: 2019-04-26 18:30:10
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 15:35:36
 */

import React from 'react';
import PropTypes from 'prop-types';
import 'styles/components/system/meetingRoomReserve/reservePane.less';
import { dayHours, countPerItem, countItem, INTERVAL_STAMP, itemMin } from 'constants/system/meetingRoomReserve';
import Separate from 'components/common/Separate';

const { Popconfirm, Tooltip, Icon, } = window.antd;
const INIT_STATE = {
  startMarkIdx: '', // 第一次点击的索引值
  endMarkIdx: '', // 第二次点击的索引值
  endHoverIdx: '', // 滑动的最后一个块的索引值
};

class ReservePane extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = INIT_STATE;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 会议室数据更新，状态重置
    if (this.props.dataProvider !== nextProps.dataProvider) {
      this.setState(INIT_STATE);
    }

    // 选择非当前会议室，重置选择项
    if (!nextProps.curMarking
      && (this.props.restartTime
      !== nextProps.restartTime)
    ) {
      this.setState(INIT_STATE);
    }
  }

  clickItem = (idx) => {
    const { startMarkIdx, endMarkIdx } = this.state;
    if (typeof endMarkIdx === 'number') { // 第三次点击
      !this.isDisable(idx, idx) && this.setState({
        endMarkIdx: '',
        startMarkIdx: idx,
        endHoverIdx: ''
      });
      return;
    }
    if (typeof startMarkIdx === 'number') { // 第二次点击
      !this.isDisable(startMarkIdx, idx)
        && this.setState({
          endMarkIdx: idx,
          endHoverIdx: ''
        });
    } else { // 第一次点击
      if (!this.isDisable(idx, idx)) {
        const { dataProvider } = this.props;
        this.setState({ startMarkIdx: idx });
        this.props.startMark(dataProvider.id);
      }
    }
  }

  hoverItem = (idx) => {
    const { startMarkIdx, endMarkIdx } = this.state;
    if (
      (typeof startMarkIdx === 'number')
      && (typeof endMarkIdx !== 'number')
    ) { // 只点击一次下记录
      !this.isDisable(startMarkIdx, idx)
        && this.setState({ endHoverIdx: idx });
    }
  }

  // 禁止选择
  isDisable = (startIdx, endIdx) => {
    const { disabledIdxArr = [] } = this.props;
    let disabled = false;
    if (startIdx < endIdx) { // 顺序
      // 筛选出最近的不可预订的最小索引
      let rightArr = disabledIdxArr.filter(i => {
        return i.startIdx >= startIdx;
      });
      rightArr = rightArr.map(i => i.startIdx);
      if (rightArr.length) {
        const minLeftIdx = Math.min.apply(null, rightArr);
        disabled = (endIdx >= minLeftIdx);
      }
    } else { // 逆序
      // 是否点击在不可预订的范围内
      const isSelectedDisable = disabledIdxArr.some(i => {
        return (i.startIdx <= startIdx)
          && (i.endIdx >= startIdx);
      });
      if (isSelectedDisable) return true;

      // 筛选出最近的不可预订的最大索引
      let leftArr = disabledIdxArr.filter(i => {
        return i.endIdx <= startIdx;
      });

      if (leftArr.length) {
        leftArr = leftArr.map(i => i.endIdx);
        const maxRightIdx = Math.max.apply(null, leftArr);
        disabled = (endIdx <= maxRightIdx);
      }
    }
    return disabled;
  }

  // 计算标记时间段
  calculateMark = (idx, countPerItem, countItem) => {
    let mark;
    if ((idx % countPerItem) === 0) { // 是否遇到了标注点
      mark = (idx) / countPerItem;
    }
    if (idx === (countItem - 1)) { // 最后一个标注点
      mark = dayHours;
    }
    return mark;
  }

  // 是否被选中
  isMarkSelected = (idx) => {
    let isMark = false;
    const { startMarkIdx, endMarkIdx, } = this.state;
    if (typeof endMarkIdx === 'number') { // 两次选中
      if (startMarkIdx > endMarkIdx) { // 逆序选择
        isMark = (startMarkIdx > idx) && (idx > endMarkIdx);
      } else { // 顺序选择
        isMark = (startMarkIdx < idx) && (idx < endMarkIdx);
      }
    }
    return isMark;
  }

  // 是否移动选中
  isHoverMarkSelected = (idx) => {
    const { startMarkIdx, endHoverIdx, } = this.state;
    let isHoverMark = false;
    if (typeof endHoverIdx === 'number') { // 滑动选中
      if (endHoverIdx > startMarkIdx) { // 顺序滑动
        isHoverMark = (idx <= endHoverIdx) && (idx > startMarkIdx);
      } else { // 逆序滑动
        isHoverMark = (idx >= endHoverIdx) && (idx < startMarkIdx);
      }
    }
    return isHoverMark;
  }

  // 是否是他们选中
  otherMarkSelected = (idx) => {
    const { disabledIdxArr = [] } = this.props;
    const matchItem = disabledIdxArr.find(i => {
      const { startIdx, endIdx, isSelf, isExpire } = i;
      return (startIdx <= idx)
        && (endIdx >= idx)
        && !isSelf
        && !isExpire;
    });
    return {
      isMark: !!matchItem,
      nickName: matchItem && matchItem.nickName,
      purpose: matchItem ? matchItem.purpose : ""
    };
  }

  doReserve = () => {
    const { startMarkIdx, endMarkIdx } = this.state;
    this.props.doReserve({ startMarkIdx, endMarkIdx });
  }

  selfMarkSelected = (idx) => {
    const { disabledIdxArr = [] } = this.props;
    const matchItem = disabledIdxArr.find(i => {
      const { startIdx, endIdx, isSelf, isExpire, } = i;
      return (startIdx <= idx)
        && (endIdx >= idx)
        && isSelf
        && !isExpire;
    });
    return {
      isMark: !!matchItem,
      nickName: matchItem && '我',
      purpose: matchItem ? matchItem.purpose : ""
    };
  }

  isExpireMark = (idx) => {
    const { disabledIdxArr = [] } = this.props;
    return disabledIdxArr.some(i => {
      const { startIdx, endIdx, isExpire } = i;
      return (startIdx <= idx)
        && (endIdx >= idx)
        && isExpire;
    });
  }

  // 格式化弹窗的时间展示
  parseTime = ({ startMarkIdx, endMarkIdx, endHoverIdx }) => {
    endMarkIdx = (typeof endHoverIdx === 'number') ? endHoverIdx : endMarkIdx;
    endMarkIdx = (typeof endMarkIdx === 'number') ? endMarkIdx : startMarkIdx;
    if (endMarkIdx < startMarkIdx) {
      const wrapperIdx = startMarkIdx;
      startMarkIdx = endMarkIdx;
      endMarkIdx = wrapperIdx;
    }
    const { reserve } = this.props;
    const timeStramp = T.date.toDate(reserve).getTime();
    const startStamp = timeStramp + INTERVAL_STAMP * startMarkIdx;
    const endStamp = timeStramp + INTERVAL_STAMP * (endMarkIdx + 1);
    const diffMin = ((endMarkIdx + 1) - startMarkIdx) * itemMin;

    return {
      diffMin,
      gmtStart: T.date.format(new Date(startStamp), 'hh:mm'),
      gmtEnd: T.date.format(new Date(endStamp), 'hh:mm'),
    };
  }

  cancelReserve = () => {
    this.setState(INIT_STATE);
  }

  // 创建时间块
  createItems = (countItem, countPerItem) => {
    const { startMarkIdx, endMarkIdx, endHoverIdx } = this.state;
    return [...new Array(countItem).keys()].map((i, idx) => {
      const isStartMark = startMarkIdx === idx; // 第一次点击
      const isEndMark = endMarkIdx === idx; // 第二次点击
      let mark = this.calculateMark(idx, countPerItem, countItem);
      let isMark = this.isMarkSelected(idx);
      let isHoverMark = this.isHoverMarkSelected(idx);
      let otherMark = this.otherMarkSelected(idx);
      let selfMark = this.selfMarkSelected(idx);
      let isExpireMark = this.isExpireMark(idx);


      const childNode = (
        <div
          onClick={() => this.clickItem(idx)}
          onMouseEnter={() => this.hoverItem(idx)}
          className={
            `pull-left
              item
              ${isStartMark ? 'cur-selected-status' : ''}
              ${isHoverMark ? 'cur-hover-status' : ''}
              ${isEndMark ? 'cur-selected-status' : ''}
              ${isMark ? 'cur-selected-status' : ''}
              ${isExpireMark ? 'expire-status' : ''}
              ${otherMark.isMark ? 'other-even-status' : ''}
              ${selfMark.isMark ? 'self-even-status' : ''}
            `
          }
        >
          { (typeof mark === 'number')
            ? <span className="mark">{mark}</span>
            : null
          }
        </div>
      );
      if (otherMark.isMark || selfMark.isMark) { // 已预订
        const purpose = otherMark.purpose || selfMark.purpose;

        return (
          <Tooltip
            overlayClassName="tooltip-card"
            title={
              (
                <div>
                  <Icon style={{color: '#52c41a'}} type="check-circle" />
                  <Separate size={5} isVertical={false} />
                  <span>{`已被${otherMark.nickName || selfMark.nickName}预订`}</span>
                  <Separate size={5} />
                  <p className="usage" dangerouslySetInnerHTML={{ __html: `原因：${purpose}` }}></p>
                </div>
              )
            }
          >
            { childNode }
          </Tooltip>
        );
      } else if (isExpireMark) { // 已过期
        return (
          <Tooltip
            overlayClassName="tooltip-card"
            title={
              (
                <div>
                  <Icon style={{color: '#f5222d'}} type="info-circle" />
                  <Separate size={5} isVertical={false} />
                  <span>不可预订</span>
                </div>
              )
            }
          >
            { childNode }
          </Tooltip>
        );
      } else if ( // 已选择初始后，跨时间段无法选择
        startMarkIdx
        && endHoverIdx
        && this.isDisable(startMarkIdx, idx)
      ) {
        return childNode;
      } else {
        const {
          diffMin,
          gmtStart,
          gmtEnd
        } = this.parseTime({ startMarkIdx, endMarkIdx, endHoverIdx });
        return (
          <Popconfirm
            onCancel={this.cancelReserve}
            title={(
              <div>
                <p>{gmtStart} ~ {gmtEnd} {diffMin}分钟</p>
                {
                  (isStartMark && !endHoverIdx)
                    ? <p>(移动光标选择更多时段)</p>
                    : null
                }
                { endHoverIdx
                  ? <p>(再次点击确认时段)</p>
                  : null
                }
              </div>
            )}
            onConfirm={this.doReserve}
          >
            { childNode }
          </Popconfirm>
        );
      }
    });
  }

  render() {
    const { name, location } = this.props.dataProvider;
    return (
      <div className="reserve-pane">
        <h3 className="title">{ name }（{ location }）</h3>
        <div className="item-wraper clearfix">
          {
            this.createItems(countItem, countPerItem)
          }
        </div>
      </div>
    );
  }
}

ReservePane.propTypes = {
  name: PropTypes.string,
  dataProvider: PropTypes.object,
  disabledIdxArr: PropTypes.array,
  doReserve: PropTypes.func,
  reserve: PropTypes.string
};

ReservePane.defaultProps = {
  name: '',
  dataProvider: {},
  disabledIdxArr: [],
  doReserve: () => {},
  reserve: ''
};

export default ReservePane;
