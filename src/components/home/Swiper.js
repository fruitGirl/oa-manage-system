/*
 * @Description: 轮播图
 * @Author: danding
 * @Date: 2019-04-23 09:41:32
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-14 10:59:48
 */

import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import 'styles/components/home/swiper.less';
import Dots from 'components/home/Dots';

const { Spin } = window.antd;
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

class Swiper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
  }

  handleChangeIndex = index => {
    this.setState({
      index,
    });
  }

  handleShift(mode) {
    let newIndex;
    const { index } = this.state;
    const { dataProvider } = this.props;
    const len = dataProvider.length;
    if (len <= 1) return;
    if (mode === 'left') {
      if (index === 0) {
        newIndex = len - 1;
      } else {
        newIndex = index - 1;
      }
    } else {
      if (index === (len - 1)) {
        newIndex = 0;
      } else {
        newIndex = index + 1;
      }
    }
    this.setState({ index: newIndex });
  }

  render() {
    const { dataProvider, loading } = this.props;
    const { index } = this.state;
    const selectItem = dataProvider[index];
    const title = selectItem && selectItem.title;

    return dataProvider.length
      ? (
        <Spin spinning={loading}>
          <div className="swiper-wrapper">
            <AutoPlaySwipeableViews
              index={index}
              onChangeIndex={this.handleChangeIndex}
            >
              {
                dataProvider.map(i => (
                  <a href={`/system/infoDetailQuery.htm?id=${i.id}&channel=轮播栏目`} className="img-wrapper">
                    <img
                      className="img-content"
                      src={`/system/indexCarouselImage.resource?ownerId=${i.id}&ownerType=INFO`}
                      alt="新闻图片"
                    />
                  </a>
                ))
              }
            </AutoPlaySwipeableViews>
            <div className="bottom-wrapper">
              <div className="pull-left">{title}</div>
              <div className="pull-right">
                <Dots
                  selectIdx={index}
                  dataProvider={dataProvider}
                  changeDot={this.handleChangeIndex} />
              </div>
            </div>
            <i onClick={() => this.handleShift('left') } className="arrow-shift left"/>
            <i onClick={() => this.handleShift('right') } className="arrow-shift right"/>
          </div>
        </Spin>
      )
      : null;
  }
}

Swiper.propTypes = {
  dataProvider: PropTypes.array.isRequired, // 数据源
};

Swiper.defaultProps = {
  dataProvider: []
};

export default Swiper;
