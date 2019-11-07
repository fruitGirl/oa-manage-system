/*
 * @Description: 人员信息组件
 * @Author: moran 
 * @Date: 2019-09-17 09:46:51 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-12 17:37:11
 */
 import { connect } from 'dva';
 import React from 'react';
 import SearchSelect from 'components/common/SearchSelect';
 import { USER_BY_NICKNAME } from 'constants/process/processCreate';
 import 'styles/components/process/processCreate/userInfo.less';
 const { Input } = window.antd;

 class UserInfo extends React.PureComponent {
   constructor(props) {
     super(props);
     this.state = {
      nickName: undefined // 花名
     };
   }

  handleChange = async (value) => {
    this.setState({
      nickName: value
    });
    await this.props.dispatch({
      type: 'processCreate/getUserInfoQueryByNickName',
      payload: { nickName: value }
    });
    const {
      jobPositionName,
      departmentName = '',
      companyName = '',
      realName
    } = this.props.namesData;
    const arr = [value, realName, `${companyName}-${departmentName}`, jobPositionName]; // 需要传给后端的值
    this.props.onChange(arr);
  }

   render() {
     const {
       formProps,
       namesData
      } = this.props;

     const {
       jobPositionName,
        departmentName = '',
        companyName = '',
        realName
      } = namesData;

     const { nickName } = this.state;
     const { required = false } = formProps;
     const departmentValues = nickName ? `${companyName}-${departmentName}` : undefined; // 部门展示
     return (
       <div className="user-info-box">
         <div className="row-box">
          <label className="label">
            {required && <span className="required">*</span>}
            花名
          </label>
          <SearchSelect
            parseFunc={(data) => {
              const { userList = [] } = data.outputParameters;
              return userList.map(i => {
                const { nickName } = i;
                return {
                  label: nickName,
                  value: nickName
                };
              });
            }}
            value={nickName}
            onChange={this.handleChange}
            action={USER_BY_NICKNAME}
            placeholder='请输入花名'
            param="nickName"/>
         </div>
         <div className="row-box">
          <label className="label">姓名</label>
          <Input
            placeholder="请输入花名，自动回填不可修改"
            value={realName}
            disabled />
         </div>
         <div className="row-box">
          <label className="label">部门</label>
          <Input
            placeholder="请输入花名，自动回填不可修改"
            value={departmentValues}
            disabled/>
         </div>
         <div>
          <label className="label">职位</label>
          <Input
            placeholder="请输入花名，自动回填不可修改"
            value={jobPositionName}
            disabled />
         </div>
       </div>
     );
   }
 }

UserInfo.propTypes = {
  formProps: PropTypes.object // 人员信息数据源
};

UserInfo.defaultProps = {
  formProps: {}
};

export default connect(({ processCreate }) => ({ ...processCreate }))(UserInfo);
