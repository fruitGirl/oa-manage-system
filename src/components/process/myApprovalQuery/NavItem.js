/*
 * @Description: 流程-我的审批-tab切换
 * @Author: moran 
 * @Date: 2019-09-10 17:34:59 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-11 16:13:27
 */

import React from 'react';

class NavItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeNavIndex: this.props.defaultIndex,
    };
  }

  //点击导航栏的切换点击头部导航栏请求的接口
  toggleNav(value, index, e) {
    e.preventDefault();
    this.setState({
      activeNavIndex: index
    });
    this.props.click(value);
  }
  
  render() {
    const {
      activeNavIndex,
    } = this.state;
    const { configs } = this.props;
    
    //主体的导航栏
    const navItem = configs.map((item, index) => {
      const { label, value } = item;
      const cls = index === activeNavIndex ? 'active' : ' ';

      return (
        <li key={index} className={cls} onClick={(e) => this.toggleNav(value, index, e)}>
          <a href="javascript:;">{label}</a>
        </li>
      );
    });

    return (
      <nav className="my_nav">
        <div className="header-box">
          <ul>{navItem}</ul>
        </div>
      </nav>
    );
  }
}

NavItem.propTypes = {
  configs: PropTypes.array.isRequired, // 配置
  defaultIndex: PropTypes.number
};

NavItem.defaultProps = {
  configs: [],
  defaultIndex: 1
};

export default NavItem;
