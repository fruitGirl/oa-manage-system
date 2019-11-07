/*
 * @Description: 微信令牌登录控件
 * @Author: danding
 * @Date: 2019-03-20 16:11:23
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-27 14:14:10
 */

import PropTypes from 'prop-types';
import 'styles/components/common/wxCodeValidate.less';
import Separate from 'components/common/Separate';
import { PureComponent } from 'react';

const { Input, Button, } = window.antd;

class WxCodeValidate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: ''
    };
  }

  onChange = (e) => {
    this.setState({ inputVal: e.target.value });
  }

  render() {
    const { onValid } = this.props;
    const { inputVal } = this.state;

    return (
      <div className="wxcode-validate-wrapper">
        <h5 className="title">为安全起见，请先进行微信令牌验证</h5>
        <Separate size={10}/>
        <div>
          <Input
            onChange={this.onChange}
            className="input"
            value={inputVal}
          />
          <Button
            type="primary"
            className="valid-btn"
            disabled={!inputVal}
            onClick={() => { onValid(inputVal); }}
          >验证</Button>
        </div>
      </div>
    );
  }
}

WxCodeValidate.propTypes = {
  onValid: PropTypes.func
};

WxCodeValidate.defaultProps = {
  onValid: () => {}
};

export default WxCodeValidate;
