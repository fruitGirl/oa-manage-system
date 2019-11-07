import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const { Input } = window.antd;

class HeaderSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchMode: props.defaultOpen,
      value: '',
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onKeyDown = e => {
    if (e.key === 'Enter') {
      const { onPressEnter } = this.props;
      const { value } = this.state;
      this.timeout = setTimeout(() => {
        value && onPressEnter(value);
      }, 0);
    }
  }

  onChange = e => {
    this.setState({ value: e.target.value });
  }

  enterSearchMode = () => {
    const { onVisibleChange } = this.props;
    onVisibleChange(true);
    this.setState({ searchMode: true }, () => {
      const { searchMode } = this.state;
      if (searchMode) {
        this.input.focus();
      }
    });
  }

  leaveSearchMode = () => {
    this.setState({
      searchMode: false,
      value: '',
    });
  }

  render() {
    const { open, ...restProps } = this.props;
    const { searchMode, value } = this.state;
    delete restProps.defaultOpen;

    return (
      <span
        className="header-search"
        onClick={this.enterSearchMode}
        onTransitionEnd={({ propertyName }) => {
          if (propertyName === 'width' && !searchMode) {
            const { onVisibleChange } = this.props;
            onVisibleChange(searchMode);
          }
        }}
      >
        <i className="search-icon" />
        <span className={`input ${searchMode ? 'show' : ''}`}>
          <Input
            ref={node => {
              this.input = node;
            }}
            onChange={this.onChange}
            placeholder="输入花名或姓名，查询员工信息"
            onKeyDown={this.onKeyDown}
            onBlur={this.leaveSearchMode}
            value={value}
          />
        </span>
      </span>
    );
  }
}

HeaderSearch.propTypes = {
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
  onPressEnter: PropTypes.func,
  defaultOpen: PropTypes.bool,
  onVisibleChange: PropTypes.func,
};

HeaderSearch.defaultProps = {
  onPressEnter: () => {},
  onSearch: () => {},
  onChange: () => {},
  defaultOpen: false,
  onVisibleChange: () => {},
};


export default HeaderSearch;
