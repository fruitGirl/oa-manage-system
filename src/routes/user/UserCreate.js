/*
 * @Description: 系统-员工创建
 * @Author: qianqian
 * @Date: 2019-02-15 18:43:00
 * @Last Modified by: moran
 * @Last Modified time: 2019-09-26 18:38:39
 */
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import BasicLayout from 'layouts/BasicLayout';
import { parseDepartmentTreeData, parseCompanyTreeData } from 'constants/performance';
import RemoteTreeSelect from 'components/common/RemoteTreeSelect';
import { URL_COMPANY_DATA, URL_DEPARTMENT_DATA,  } from 'constants/performance/userQuery';

const {
  Form,
  Select,
  Input,
  DatePicker,
  Steps,
  Button,
  Checkbox,
  Radio,
  message,
  Row,
  Col,
  Modal,
} = window.antd;

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;
const Step = Steps.Step;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TextArea = Input.TextArea;
const getTypeOption = (list) => {
  return (
    list &&
    list.map((i) => (
      <Option key={i.id} value={i.id}>
        {i.value}
      </Option>
    ))
  );
};
// 员工性质
const getJobNatureOption = getTypeOption(CONFIG.jobNatureList);
// 菜单角色
const getRoleIdsOption = getTypeOption(CONFIG.roleList);
// 职位
const getPostionNameTypeOption = getTypeOption(CONFIG.jobPositionTypeList);
// 层级
const getJobLevelIdOption = getTypeOption(CONFIG.jobLevelIdsList);
// 职级
const getCompetenceLevelOption = getTypeOption(CONFIG.competenceLevelList);
// 文化程度
const getCultureDegreeOption = getTypeOption(CONFIG.cultureDegreeList);
// 政治面貌
const getPoliticalStatusOption = getTypeOption(CONFIG.politicalStatusList);
// 婚否
const getMarriedOption = getTypeOption(CONFIG.marriedList);
// 星座
const getConstellationOption = getTypeOption(CONFIG.constellationList);
// 户籍
const getCensusRegisterOption = getTypeOption(CONFIG.censusRegisterList);
// 健康状况
const getHealthConditionOption = getTypeOption(CONFIG.healthConditionList);
// 民族
const getNationalityOption = getTypeOption(CONFIG.nationList);
// 血型
const getBloodTypeOption = getTypeOption(CONFIG.bloodTypeList);

const steps = [
  {
    title: '基本信息',
    content: 'First-content'
  },
  {
    title: '组织关系',
    content: 'Second-content'
  },
  {
    title: '档案信息',
    content: 'Last-content'
  }
];
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 17 }
  }
};
const secondFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 9 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
};
// 职位类型
let jobPositionTypeValue = {};
// 员工性质
let jobNatureValue = {};

// 基本信息
const FirstForm = Form.create()((props) => {
  const { getFieldDecorator } = props.form;
  const { realName, cell, nickName, sex, validateLoginTypes, email, roleIds, certNo, gmtEntry, status } = props.params;

  // 验证手机号
  const handleCellChange = (e) => {
    const value = e.target.value;
    let params = {
      cell: value
    };
    if (CONFIG.modifyPage) {
      params.userId = CONFIG.curEditUserId;
    }
    //请求查询接口
    T.get(CONFIG.cellValidateUrl, params)
      .then((data) => {})
      .catch((err) => {
        if (
          err
          && (typeof err.success === 'boolean')
          && !err.success
        ) {
          props.form.setFields({
            cell: {
              value: value,
              errors: [new Error(err.errorMessage || '出错了')]
            }
          });
        } else {
          T.showErrorMessage(err);
        }
      });
  };

  // 验证花名
  const handleNickNameChange = (e) => {
    const value = e.target.value;
    let params = {
      nickName: value
    };
    if (CONFIG.modifyPage) {
      params.userId = CONFIG.curEditUserId;
    }
    //请求查询接口
    T.get(CONFIG.nickNameValidateUrl, params)
      .then((data) => {})
      .catch((err) => {
        if (
          err
          && (typeof err.success === 'boolean')
          && !err.success
        ) {
          props.form.setFields({
            nickName: {
              value: value,
              errors: [new Error(err.errorMessage || '出错了')]
            }
          });
        } else {
          T.showErrorMessage(err);
        }
      });
  };
  return (
    <Form className="first-form" onSubmit={props.submitHandler} id="firstForm">
      <FormItem {...formItemLayout} label="姓名" colon={false}>
        {getFieldDecorator('realName', {
          initialValue: realName,
          rules: [
            {
              required: true,
              message: '请填写姓名'
            },
            {
              max: 20,
              message: '至多为20位!'
            },
            {
              pattern: T.validator.userName,
              message: '只能包括中英文和·!'
            }
          ]
        })(<Input placeholder="请输入姓名" className="input_width" maxLength={20} minLength={2} />)}
      </FormItem>
      <FormItem {...formItemLayout} label="手机号" colon={false}>
        {getFieldDecorator('cell', {
          initialValue: cell,
          rules: [
            {
              required: true,
              message: '请填写手机号'
            },
            {
              pattern: T.validator.cell,
              message: '请填写正确的手机号'
            }
          ]
        })(
          <Input
            className="input_width"
            placeholder="请输入手机号码"
            maxLength={11}
            onBlur={(e) => handleCellChange(e)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="身份证" key="certNo" colon={false}>
        {getFieldDecorator('certNo', {
          initialValue: certNo,
          rules: [
            {
              required: true,
              message: '请填写身份证'
            },
            {
              pattern: T.validator.idCard,
              message: '请填写正确的身份证号码'
            }
          ]
        })(<Input className="input_width" placeholder="请输入身份证号码" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="入职时间" key="gmtEntry" colon={false}>
        {gmtEntry
          ? getFieldDecorator('gmtEntry', {
              initialValue: moment(gmtEntry, 'YYYY-MM-DD'),
              rules: [{ required: true, message: '请填写入职时间' }]
            })(<DatePicker style={{ width: 176 }} placeholder="选择时间" />)
          : getFieldDecorator('gmtEntry', {
              rules: [{ required: true, message: '请填写入职时间' }]
            })(<DatePicker style={{ width: 176 }} placeholder="选择时间" />)}
      </FormItem>
      <FormItem {...formItemLayout} label="花名" colon={false}>
        {getFieldDecorator('nickName', {
          initialValue: nickName,
          rules: [
            {
              required: true,
              message: '请填写花名'
            }
          ]
        })(
          <Input
            className="input_width"
            placeholder="请输入花名"
            maxLength={20}
            minLength={2}
            onBlur={(e) => handleNickNameChange(e)}
          />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="员工性质" key="jobNature" colon={false}>
        {getFieldDecorator('jobNature', {
          ...jobNatureValue,
          rules: [{ required: true, message: '请选择员工性质' }]
        })(
          <Select className="input_width" placeholder="请选择">
            {getJobNatureOption}
          </Select>
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="员工状态" key="status" colon={false}>
          {
            CONFIG.modifyPage
              ? getFieldDecorator('status', {
                  initialValue: status,
                  rules: [{ required: true, message: '请选择' }]
                })(
                  <Select className="input_width" placeholder="请选择">
                    {Object.keys(CONFIG.userStatusMap).map(i => {
                      return <Option value={i}>{CONFIG.userStatusMap[i]}</Option>;
                    })}
                  </Select>
                )
              : (
                  <span>{CONFIG.userStatusMap && CONFIG.userStatusMap[status]}</span>
                )
          }
      </FormItem>

      <FormItem {...formItemLayout} label="性别" colon={false} key="sex">
        {getFieldDecorator('sex', {
          initialValue: sex,
          rules: [{ required: true, message: '请选择性别' }]
        })(
          <RadioGroup>
            {CONFIG.sexList &&
              CONFIG.sexList.map((item, index) => {
                return (
                  <Radio key={index} value={item.id}>
                    {item.value}
                  </Radio>
                );
              })}
          </RadioGroup>
        )}
      </FormItem>

      <FormItem {...formItemLayout} label="登录方式" colon={false} key="validateLoginTypes">
        {getFieldDecorator('validateLoginTypes', {
          initialValue: validateLoginTypes.indexOf('NONE') !== -1 ? [] : validateLoginTypes
          // rules: [{ required: true, message: "请选择登录方式" }]
        })(
          <CheckboxGroup>
            {CONFIG.userValidateLoginTypeList &&
              CONFIG.userValidateLoginTypeList.map((item, index) => {
                  return (item.id !== 'NONE' ?
                    (
                      <Checkbox key={index} value={item.id}>
                        {item.value}
                      </Checkbox>
                    ) : null

                  );
              })}
          </CheckboxGroup>
        )}
      </FormItem>

      <FormItem {...formItemLayout} label="邮箱" colon={false}>
        {getFieldDecorator('email', {
          initialValue: email,
          rules: [
            {
              type: 'email',
              message: '请正确填写邮箱地址'
            }
          ]
        })(<Input className="input_width" placeholder="请输入邮箱地址" />)}
      </FormItem>

      <FormItem {...formItemLayout} label="菜单角色" key="roleIds" colon={false}>
        {getFieldDecorator('roleIds', {
          initialValue: roleIds
        })(
          <Select placeholder="请选择" mode="multiple" style={{ maxWidth: 430 }}>
            {getRoleIdsOption}
          </Select>
        )}
      </FormItem>
      <div className="avatar-uploader">
        {getFieldDecorator('imageContent')(
          <Input
            className="file"
            type="file"
            name="imageContent"
            accept="img/gif,img/png,img/jpeg"
            onChange={props.handleChange}
            id="imageContent"
          />
        )}

        {props.imageUrl ? (
          <img src={props.imageUrl} alt="" className="avatar_img" />
        ) : (
          <div>
            <i className="icon-camera" />
            <div className="ant-upload-text">点击上传照片</div>
          </div>
        )}
      </div>

      <FormItem {...formItemLayout} label=" " colon={false}>
        <Button type="primary" htmlType="submit" className="find-btn" style={{ width: '92px' }}>
          下一步
        </Button>
      </FormItem>
    </Form>
  );
});
// ================== 基本信息end

// 组织关系
class SecondFormClass extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      companyId: props.params.companyId
    };
  }

  changeCompany = (val) => {
    this.setState({
      companyId: val
    });
    this.props.form.setFieldsValue({ 'departmentId' : '' });
  }

  render() {
    const { props } = this;
    const { getFieldDecorator } = props.form;
    let getPostionNameOption = getTypeOption(props.postionNameList);
    const { jobLevelId, competenceLevelId, postionName, departmentId, companyId } = props.params;

    return (
      <Form className="second-form" onSubmit={props.submitHandler}>
        <FormItem {...secondFormItemLayout} colon={false} label="公司">
          {getFieldDecorator('companyId', {
            initialValue: companyId,
            rules: [{ required: true, message: '请选择公司' }]
          })(
            <RemoteTreeSelect
              onChangeVal={this.changeCompany}
              action={URL_COMPANY_DATA}
              parseStructure={parseCompanyTreeData}
            />
          )}
        </FormItem>
        <FormItem {...secondFormItemLayout} colon={false} label="部门">
          {getFieldDecorator('departmentId',  {
            initialValue: departmentId,
            rules: [{ required: true, message: '请选择部门' }]
          })(
            <RemoteTreeSelect
              action={this.state.companyId
                ? `${URL_DEPARTMENT_DATA}${this.state.companyId}`
                : ''
              }
              parseStructure={parseDepartmentTreeData}
            />
          )}
        </FormItem>

        <Row>
          <Col span={9} className="ant-form-item-label ant-form-item-no-colon">
            <label className="ant-form-item-required">职位</label>
          </Col>
          <Col className="pull_left">
            <FormItem>
              {getFieldDecorator('postionNameType', {
                ...jobPositionTypeValue,
                rules: [{ required: true, message: '请选择职位类型' }]
              })(
                <Select className="input_width" placeholder="职位类型" onChange={props.handleChangePositionType}>
                  {getPostionNameTypeOption}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col className="pull_left icon_wave">~</Col>
          <Col className="pull_left">
            <FormItem>
              {getFieldDecorator('postionName', {
                initialValue: postionName || (props.postionNameList[0] ? props.postionNameList[0]['id'] : ''),
                rules: [{ required: true, message: '请选择具体职位' }]
              })(
                <Select className="input_width" placeholder="请选择">
                  {getPostionNameOption}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem {...secondFormItemLayout} label="职级" key="competenceLevelId" colon={false}>
          {getFieldDecorator('competenceLevelId', {
            initialValue: competenceLevelId,
            rules: [{ required: true, message: '请选择职级' }]
          })(
            <Select placeholder="请选择" style={{ width: 176 }}>
              {getCompetenceLevelOption}
            </Select>
          )}
        </FormItem>

        <FormItem {...secondFormItemLayout} label="层级" key="jobLevelId" colon={false}>
          {getFieldDecorator('jobLevelId', {
            initialValue: jobLevelId
          })(
            <Select placeholder="请选择" style={{ width: 176 }}>
              {getJobLevelIdOption}
            </Select>
          )}
        </FormItem>

        <FormItem {...secondFormItemLayout} label=" " colon={false}>
          <Button onClick={() => props.prev()}>上一步</Button>
          <Button type="primary" htmlType="submit" className="pwd-btn" style={{ marginLeft: 8 }}>
            下一步
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const SecondForm = Form.create()(SecondFormClass);

// ================== 组织关系end

// 档案信息
class OriginLastForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: ['month', 'month'],
      values: []
    };
  }
  handlePanelChange = (value, mode, field, data) => {
    this.props.params[data][field] = value;
    this.setState({
      values: value
    });
  }
  handleChange = value => {
    this.setState({ values: value });
  };
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const {
      cultureDegree,
      politicalStatus,
      married,
      constellation,
      censusRegister,
      healthCondition,
      nationality,
      gmtEntry,
      gmtBecomeRegular,
      trialMonth,
      censusRegisterAddress,
      bloodType,
      cardNo,
      gmtBirthday,
      presentAddress,
      educationData,
      workExperienceData,
      familyMemberData,
      content
    } = this.props.params;

    const timeConfig = {
      showTime: true,
      placeholder: '选择时间'
    };
    // 验证银行卡
    const handleCardNoChange = (e) => {
      const value = e.target.value;
      //请求接口
      T.get(CONFIG.getBankNameUrl, {
        cardNo: value
      })
        .then((data) => {
          if (!data.name) {
            this.props.form.setFields({
              cardNo: {
                value: value.cardNo,
                errors: [new Error('银行卡号有误')]
              }
            });
          }
        })
        .catch(() => {});
    };
    //添加一个住宿时间
    const add = (e, type) => {
      e.preventDefault();
      const keys = this.props.form.getFieldValue(`${type}Keys`);

      if (keys.length > 4) {
        Modal.error({
          title: '提示',
          content: '最多添加5条！'
        });
      } else {
        CONFIG[`${type}Uuid`]++;
        const nextKeys = keys.concat(CONFIG[`${type}Uuid`]);
        this.props.form.setFieldsValue({
          [`${type}Keys`]: nextKeys
        });
      }
    };
    //删除一个住宿时间
    const remove = (e, k, type) => {
      e.preventDefault();
      // uuid --;
      const keys = this.props.form.getFieldValue(`${type}Keys`);
      const deleteUrl = {
        education: CONFIG.EducationDeleteUrl,
        familyMember: CONFIG.FamilyMemberDeleteUrl,
        workExperience: CONFIG.WorkExperienceDeleteUrl
      };
      const id = {
        education: educationData[`id-${k}`],
        familyMember: familyMemberData[`id-${k}`],
        workExperience: workExperienceData[`id-${k}`]
      };
      if (CONFIG.modifyPage && id[`${type}`]) {
        //请求接口
        axios(deleteUrl[type], {
          method: 'GET',
          params: {
            id: id[`${type}`]
          }
        })
          .then((response) => {
            const data = response.data;

            if (data['success']) {
              message.success('修改成功！');
              this.props.form.setFieldsValue({
                [`${type}Keys`]: keys.filter((key) => key !== k)
              });
            } else {
              Modal.error({
                title: '提示',
                content: data.errorMessage
              });
            }
          })
          .catch(() => {});
      } else {
        this.props.form.setFieldsValue({
          [`${type}Keys`]: keys.filter((key) => key !== k)
        });
      }
    };
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';

    getFieldDecorator('educationKeys', { initialValue: CONFIG.educationKeys });
    const educationKeys = getFieldValue('educationKeys');

    getFieldDecorator('workExperienceKeys', {
      initialValue: CONFIG.workExperienceKeys
    });
    const workExperienceKeys = getFieldValue('workExperienceKeys');

    getFieldDecorator('familyMemberKeys', {
      initialValue: CONFIG.familyMemberKeys
    });
    const familyMemberKeys = getFieldValue('familyMemberKeys');

    //教育情况
    const educationBox =
      educationKeys &&
      educationKeys.map((k, index) => {
        return (
          <div className="add-box" key={k} data-id={educationData[`id-${k}`]}>
            {getFieldDecorator(`educationId-${k}`, {
              initialValue: educationData[`id-${k}`] || ''
            })(<Input type="hidden" />)}
            <Row>
              <Col span={2} className="ant-form-item-label ant-form-item-no-colon">
                {index === 0 ? <label>教育情况</label> : ''}
              </Col>
              <Col span={18} className="box_default_background_color">
                <ul className="clearfix form_ul_item">
                  <li>
                    <FormItem label="起止时间" key={`educationTime-${k}`} style={{ width: 400 }}>
                      {getFieldDecorator(`educationTime-${k}`, {
                        initialValue: educationData[`educationTime-${k}`]
                          ? educationData[`educationTime-${k}`][0] !== '' && educationData[`educationTime-${k}`][1] !== ''
                            ? [
                                moment(educationData[`educationTime-${k}`][0], 'YYYY-MM'),
                                moment(educationData[`educationTime-${k}`][1], 'YYYY-MM')
                              ]
                            : []
                          : null
                      })(<RangePicker mode={this.state.mode} onChange={this.handleChange} onPanelChange={(e, mode) => this.handlePanelChange(e, mode, `educationTime-${k}`, 'educationData')} format="YYYY-MM" style={{ width: 300 }} />)}
                    </FormItem>
                  </li>
                  <li>
                    <FormItem label="就读学校" key={`studySchool-${k}`}>
                      {getFieldDecorator(`studySchool-${k}`, {
                        initialValue: educationData[`studySchool-${k}`] || ''
                      })(<Input placeholder="请输入就读学校" style={{ width: 176 }} maxLength={20} />)}
                    </FormItem>
                  </li>
                  <li>
                    <FormItem label="专业" key={`major-${k}`}>
                      {getFieldDecorator(`major-${k}`, {
                        initialValue: educationData[`major-${k}`] || ''
                      })(<Input placeholder="请输入专业" style={{ width: 176 }} maxLength={20} />)}
                    </FormItem>
                  </li>
                  <li>
                    <FormItem label="是否毕业" key={`graduate-${k}`}>
                      {getFieldDecorator(`graduate-${k}`, {
                        initialValue: educationData[`graduate-${k}`] || ''
                      })(
                        <Select placeholder="请选择" style={{ width: 176 }}>
                          <Option value="true">是</Option>
                          <Option value="false">否</Option>
                        </Select>
                      )}
                    </FormItem>
                  </li>
                </ul>
              </Col>
              <Col span={2} className="add_btn_wrapper">
                {educationKeys.length === 1 ? (
                  <a href="javascript:;" onClick={(e) => add(e, 'education')} className="mr10">
                    添加
                  </a>
                ) : index === 0 ? (
                  <a href="javascript:;" onClick={(e) => add(e, 'education')} style={{ marginRight: 10 }}>
                    添加
                  </a>
                ) : (
                  <a href="javascript:;" onClick={(e) => remove(e, k, 'education')} style={{ marginRight: 10 }}>
                    删除
                  </a>
                )}
                {educationKeys.length === 1 ? (
                  ''
                ) : index === 0 ? (
                  <a href="javascript:;" onClick={(e) => remove(e, k, 'education')} className="mr10">
                    删除
                  </a>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </div>
        );
      });

    // 工作经历
    const workExperienceBox =
      workExperienceKeys &&
      workExperienceKeys.map((k, index) => {
        return (
          <div className="add-box" key={k} data-id={workExperienceData[`id-${k}`]}>
            {getFieldDecorator(`workExperienceId-${k}`, {
              initialValue: workExperienceData[`id-${k}`] || ''
            })(<Input type="hidden" />)}
            <Row>
              <Col span={2} className="ant-form-item-label ant-form-item-no-colon">
                {index === 0 ? <label>工作经历</label> : ''}
              </Col>
              <Col span={18} className="box_default_background_color">
                <ul className="clearfix form_ul_item">
                  <li>
                    <FormItem label="起止时间" key={`workTime-${k}`} style={{ width: 400 }}>
                      {getFieldDecorator(`workTime-${k}`, {
                        initialValue: workExperienceData[`workTime-${k}`]
                          ? workExperienceData[`workTime-${k}`][0] !== '' && workExperienceData[`workTime-${k}`][1] !== ''
                            ? [
                                moment(workExperienceData[`workTime-${k}`][0], "YYYY-MM"),
                                moment(workExperienceData[`workTime-${k}`][1], 'YYYY-MM')
                              ]
                            : []
                          : []
                      })(<RangePicker mode={this.state.mode} onChange={this.handleChange} onPanelChange={(e, mode) => this.handlePanelChange(e, mode, `workTime-${k}`, 'workExperienceData')} format="YYYY-MM" style={{ width: 300 }} />)}
                    </FormItem>
                  </li>
                  <li>
                    <FormItem label="工作单位" key={`workAddr-${k}`}>
                      {getFieldDecorator(`workAddr-${k}`, {
                        initialValue: workExperienceData[`workAddr-${k}`] || ''
                      })(<Input placeholder="请输入工作单位" style={{ width: 176 }} maxLength={20} />)}
                    </FormItem>
                  </li>
                  <li>
                    <FormItem label="职位" key={`position-${k}`}>
                      {getFieldDecorator(`position-${k}`, {
                        initialValue: workExperienceData[`position-${k}`] || ''
                      })(<Input placeholder="请输入职位" style={{ width: 176 }} maxLength={20} />)}
                    </FormItem>
                  </li>
                  <li>
                    <FormItem label="离职原因" key={`dimissionReason-${k}`}>
                      {getFieldDecorator(`dimissionReason-${k}`, {
                        initialValue: workExperienceData[`dimissionReason-${k}`] || ''
                      })(<Input placeholder="请输入离职原因" style={{ width: 176 }} maxLength={20} />)}
                    </FormItem>
                  </li>
                </ul>
              </Col>
              <Col span={2} className="add_btn_wrapper">
                {workExperienceKeys.length === 1 ? (
                  <a href="javascript:;" onClick={(e) => add(e, 'workExperience')} className="mr10">
                    添加
                  </a>
                ) : index === 0 ? (
                  <a href="javascript:;" onClick={(e) => add(e, 'workExperience')} style={{ marginRight: 10 }}>
                    添加
                  </a>
                ) : (
                  <a href="javascript:;" onClick={(e) => remove(e, k, 'workExperience')} style={{ marginRight: 10 }}>
                    删除
                  </a>
                )}
                {workExperienceKeys.length === 1 ? (
                  ''
                ) : index === 0 ? (
                  <a href="javascript:;" onClick={(e) => remove(e, k, 'workExperience')} className="mr10">
                    删除
                  </a>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </div>
        );
      });
    // 家庭成员
    const familyMemberBox =
      familyMemberKeys &&
      familyMemberKeys.map((k, index) => {
        return (
          <div className="add-box" key={k} data-id={familyMemberData[`id-${k}`]}>
            {getFieldDecorator(`familyMemberId-${k}`, {
              initialValue: familyMemberData[`id-${k}`] || ''
            })(<Input type="hidden" />)}
            <Row>
              <Col span={2} className="ant-form-item-label ant-form-item-no-colon">
                {index === 0 ? <label className="ant-form-item-required">家庭成员</label> : ''}
              </Col>
              <Col span={18} className="box_default_background_color">
                <ul className="clearfix form_ul_item">
                  <li>
                    <FormItem label="姓名" key={`familyName-${k}`}>
                      {getFieldDecorator(`familyName-${k}`, {
                        initialValue: familyMemberData[`familyName-${k}`] || '',
                        rules: [
                          {
                            required: true,
                            message: '请填写姓名'
                          },
                          {
                            max: 20,
                            message: '至多为20位!'
                          },
                          {
                            pattern: T.validator.userName,
                            message: '只能包括中英文和·!'
                          }
                        ]
                      })(<Input placeholder="请输入姓名" style={{ width: 176 }} />)}
                    </FormItem>
                  </li>
                  <li>
                    <FormItem label="关系" key={`relation-${k}`}>
                      {getFieldDecorator(`relation-${k}`, {
                        initialValue: familyMemberData[`relation-${k}`] || ''
                      })(<Input placeholder="请输入关系" style={{ width: 176 }} maxLength={20} />)}
                    </FormItem>
                  </li>
                  <li>
                    <FormItem label="联系方式" key={`contactInf-${k}`}>
                      {getFieldDecorator(`contactInf-${k}`, {
                        initialValue: familyMemberData[`contactInf-${k}`] || '',
                        rules: [
                          {
                            pattern: T.validator.cell,
                            message: '请填写正确的手机号'
                          }
                        ]
                      })(<Input placeholder="请输入联系方式" style={{ width: 176 }} />)}
                    </FormItem>
                  </li>
                  <li>
                    <FormItem className="lg-label" label="是否是紧急联系人" key={`emergency-${k}`}>
                      {getFieldDecorator(`emergency-${k}`, {
                        initialValue: familyMemberData[`emergency-${k}`] || 'false'
                      })(
                        <RadioGroup>
                          <Radio key={0} value="true">
                            是
                          </Radio>
                          <Radio key={1} value="false">
                            否
                          </Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </li>
                </ul>
              </Col>
              <Col span={2} className="add_btn_wrapper">
                {familyMemberKeys.length === 1 ? (
                  <a href="javascript:;" onClick={(e) => add(e, 'familyMember')} className="mr10">
                    添加
                  </a>
                ) : index === 0 ? (
                  <a href="javascript:;" onClick={(e) => add(e, 'familyMember')} style={{ marginRight: 10 }}>
                    添加
                  </a>
                ) : (
                  <a href="javascript:;" onClick={(e) => remove(e, k, 'familyMember')} style={{ marginRight: 10 }}>
                    删除
                  </a>
                )}
                {familyMemberKeys.length === 1 ? (
                  ''
                ) : index === 0 ? (
                  <a href="javascript:;" onClick={(e) => remove(e, k, 'familyMember')} className="mr10">
                    删除
                  </a>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          </div>
        );
      });

    return (
      <Form className="last-form" onSubmit={this.props.submitHandler} layout="inline">
        <FormItem label="试用时间" key="trialMonth" colon={false}>
          {getFieldDecorator('trialMonth', {
            initialValue: trialMonth
          })(<Input placeholder="请输入试用时间" className="input_width" />)}
        </FormItem>

        <FormItem label="转正日期" key="gmtBecomeRegular" colon={false}>
          {gmtBecomeRegular
            ? getFieldDecorator('gmtBecomeRegular', {
                initialValue: moment(gmtEntry, 'YYYY-MM-DD')
              })(<DatePicker style={{ width: 176 }} />)
            : getFieldDecorator('gmtBecomeRegular')(<DatePicker style={{ width: 176 }} />)}
        </FormItem>

        <FormItem label="银行卡号" key="cardNo" colon={false}>
          {getFieldDecorator('cardNo', {
            initialValue: cardNo,
            rules: [{ validator: T.checkCardNo }]
          })(<Input placeholder="请输入银行卡号" className="input_width" onBlur={(e) => handleCardNoChange(e)} />)}
        </FormItem>

        <FormItem label="生日" key="gmtBirthday" colon={false}>
          {gmtBirthday
            ? getFieldDecorator('gmtBirthday', {
                initialValue: moment(gmtBirthday, dateFormat)
              })(<DatePicker style={{ width: 176 }} {...timeConfig} />)
            : getFieldDecorator('gmtBirthday')(<DatePicker style={{ width: 176 }} {...timeConfig} />)}
        </FormItem>

        <FormItem label="星座" key="constellation" colon={false}>
          {getFieldDecorator('constellation', {
            initialValue: constellation
          })(
            <Select placeholder="请选择" style={{ width: 176 }}>
              {getConstellationOption}
            </Select>
          )}
        </FormItem>

        <FormItem label="血型" key="bloodType" colon={false}>
          {getFieldDecorator('bloodType', {
            initialValue: bloodType
          })(
            <Select placeholder="请选择" style={{ width: 176 }}>
              {getBloodTypeOption}
            </Select>
          )}
        </FormItem>

        <FormItem label="文化程度" key="cultureDegree" colon={false}>
          {getFieldDecorator('cultureDegree', {
            initialValue: cultureDegree
          })(
            <Select placeholder="请选择" style={{ width: 176 }}>
              {getCultureDegreeOption}
            </Select>
          )}
        </FormItem>

        <FormItem label="政治面貌" key="politicalStatus" colon={false}>
          {getFieldDecorator('politicalStatus', {
            initialValue: politicalStatus
          })(
            <Select placeholder="请选择" style={{ width: 176 }}>
              {getPoliticalStatusOption}
            </Select>
          )}
        </FormItem>

        <FormItem label="婚否" key="married" colon={false}>
          {getFieldDecorator('married', {
            initialValue: married
          })(
            <Select placeholder="请选择" style={{ width: 176 }}>
              {getMarriedOption}
            </Select>
          )}
        </FormItem>

        <FormItem label="户籍" key="censusRegister" colon={false}>
          {getFieldDecorator('censusRegister', {
            initialValue: censusRegister
          })(
            <Select placeholder="请选择" style={{ width: 176 }}>
              {getCensusRegisterOption}
            </Select>
          )}
        </FormItem>

        <FormItem label="健康状况" key="healthCondition" colon={false}>
          {getFieldDecorator('healthCondition', {
            initialValue: healthCondition
          })(
            <Select placeholder="请选择" style={{ width: 176 }}>
              {getHealthConditionOption}
            </Select>
          )}
        </FormItem>

        <FormItem label="民族" key="nationality" colon={false}>
          {getFieldDecorator('nationality', {
            initialValue: nationality
          })(
            <Select placeholder="请选择" style={{ width: 176 }}>
              {getNationalityOption}
            </Select>
          )}
        </FormItem>

        <FormItem label="户籍所在地" key="censusRegisterAddress" colon={false}>
          {getFieldDecorator('censusRegisterAddress', {
            initialValue: censusRegisterAddress
          })(<Input placeholder="请输入户籍所在地" className="input_width" maxLength={100} />)}
        </FormItem>
        <FormItem label="现住址" colon={false}>
          {getFieldDecorator('presentAddress', {
            initialValue: presentAddress
          })(<Input placeholder="请输入现住址" style={{ maxWidth: 518, width: 518 }} maxLength={100} />)}
        </FormItem>
        {educationBox}
        {workExperienceBox}
        {familyMemberBox}

        <Row>
          <Col span={24}>
            <FormItem label="职业规划(1-3年)" key="content" colon={false}>
              {getFieldDecorator('content', {
                initialValue: content
              })(
                <TextArea
                  placeholder="请输入职业规划"
                  autosize={{ minRows: 10 }}
                  style={{ minWidth: 430, width: 780 }}
                  maxLength={500}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <FormItem label=" " colon={false}>
          <Button onClick={() => this.props.prev()}>上一步</Button>
          <Button
            type="primary"
            htmlType="submit"
            className="pwd-btn"
            style={{ marginLeft: 8 }}
            loading={this.props.createLoading}
          >
            {CONFIG.modifyPage ? '修改' : '创建'}
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const LastForm = Form.create()(OriginLastForm);

// ================== 档案信息end

class UserCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      params: {
        realName: '',
        cell: '',
        status: 'INCUMBENCY',
        nickName: '',
        sex: '',
        validateLoginTypes: [],
        gmtBirthday: '',
        email: '',
        presentAddress: '',
        roleIds: [],
        educationData: {},
        workExperienceData: {},
        familyMemberData: {},
        ...CONFIG.backfillData,
        content: T.return2n(T.escape2Html((CONFIG.backfillData && CONFIG.backfillData.content) || ''))
      },
      loading: false,
      postionNameList: CONFIG.postionNameList || [],
      imageUrl: CONFIG.imageUrl,
      createLoading: false
    };
  }
  // 进入页面要运行的函数
  componentDidMount() {
    // 是修改页面
    if (CONFIG.modifyPage) {
      // 回填数据
      this.backfillData();
    }
  }
  // 回填数据
  backfillData() {
    // 职位
    jobPositionTypeValue = T.getSelectInitialValue({
      data: this.state.params,
      key: 'postionNameType'
    });
    jobNatureValue = T.getSelectInitialValue({
      data: this.state.params,
      key: 'jobNature'
    });

    this.setState({});
  }
  getPositionByPositionType({ params, callback }) {
    const url = `${T['userPath']}/getPositionByPositionTypeId.json`;

    T.get(url, params)
      .then((data) => {
        const list = data.jobPositionList;
        const map = {};
        const postionNameList = [];
        list &&
          list.forEach((i) => {
            i.name = i.positionName;
            map[i.id] = i.positionName;
            postionNameList.push({
              id: i.id,
              value: i.positionName
            });
          });

        this.setState({
          postionNameList: postionNameList
        });
        if (callback && T.isFunction(callback)) {
          callback(data);
        }
      })
      .catch((err) => {
        T.showError(err);
      });
  }
  // 职位类型变化是具体职位列表
  handleChangePositionType(value) {
    const params = {
      positionTypeId: value
    };
    this.getPositionByPositionType({
      params,
      callback: () => {
        const postionNameValue = this.state.postionNameList[0] ? this.state.postionNameList[0]['id'] : '';

        this.SecondForm.setFieldsValue({ postionName: postionNameValue });
      }
    });
  }
  firstSubmitHandler = (e) => {
    e.preventDefault();
    this.FirstForm.validateFields((errors, values) => {
      if (errors) {
        return;
      }

      const params = {
        ...this.state.params,
        realName: values['realName'],
        cell: values['cell'],
        certNo: values['certNo'],
        gmtEntry: values['gmtEntry'] ? values['gmtEntry'].format('YYYY-MM-DD HH:mm:ss') : '',
        nickName: values['nickName'],
        sex: values['sex'],
        validateLoginTypes: values['validateLoginTypes'].length === 0 ? 'NONE' : values['validateLoginTypes'],
        email: values['email'],
        roleIds: values['roleIds'],
        jobNature: values['jobNature'],
        status: CONFIG.modifyPage
          ? values['status']
          : this.state.params.status
      };

      this.setState({
        params: params
      });

      this.next();
    });
  };

  secondSubmitHandler = (e) => {
    e.preventDefault();
    this.SecondForm.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const params = {
        ...this.state.params,
        ...values,
        postionNameType: values['postionNameType'],
        positionId: values['postionName'],
        competenceLevelId: values['competenceLevelId'],
        jobLevelId: values['jobLevelId'] ? values['jobLevelId'] : ''
      };

      this.setState({
        params: params
      });
      this.next();
    });
  };

  // 获得教育情况的数据
  getEducationParam = ({ values, form }) => {
    let userEducation = [];
    const educationKeys = form.getFieldValue('educationKeys');
    educationKeys.forEach((index) => {
      let msgArr = [];

      // 起止时间
      const time = values[`educationTime-${index}`] ? values[`educationTime-${index}`] : '';
      const minGmtTime = time.length !== 0 ? time[0].format('YYYY-MM-DD HH:mm:ss') : '';
      const maxGmtTime = time.length !== 0 ? time[1].format('YYYY-MM-DD HH:mm:ss') : '';

      const studySchool = values[`studySchool-${index}`] ? values[`studySchool-${index}`] : '';
      const major = values[`major-${index}`] ? values[`major-${index}`] : '';
      const graduate = values[`graduate-${index}`] ? values[`graduate-${index}`] : '';

      if (minGmtTime || maxGmtTime || studySchool || major || graduate) {
        msgArr.push(minGmtTime, maxGmtTime, studySchool, major, graduate);
      }

      // console.log(values[`id-${index}`]);
      if (values[`educationId-${index}`]) {
        msgArr.push(values[`educationId-${index}`]);
      }

      userEducation.push(msgArr.join(','));
      // console.log(msgArr,userEducation);
    });
    return userEducation.join(';');
  };
  // 获得工作经历的数据
  getWorkExperienceParam = ({ values, form }) => {
    let userEducation = [];
    const workExperienceKeys = form.getFieldValue('workExperienceKeys');
    workExperienceKeys.forEach((index) => {
      let msgArr = [];

      // 起止时间
      const time = values[`workTime-${index}`] ? values[`workTime-${index}`] : '';
      const minGmtTime = time.length !== 0 ? time[0].format('YYYY-MM-DD HH:mm:ss') : '';
      const maxGmtTime = time.length !== 0 ? time[1].format('YYYY-MM-DD HH:mm:ss') : '';

      const workAddr = values[`workAddr-${index}`] ? values[`workAddr-${index}`] : '';
      const position = values[`position-${index}`] ? values[`position-${index}`] : '';
      const dimissionReason = values[`dimissionReason-${index}`] ? values[`dimissionReason-${index}`] : '';

      if (minGmtTime || maxGmtTime || workAddr || position || dimissionReason) {
        msgArr.push(minGmtTime, maxGmtTime, workAddr, position, dimissionReason);
      }
      if (values[`workExperienceId-${index}`]) {
        msgArr.push(values[`workExperienceId-${index}`]);
      }
      userEducation.push(msgArr.join(','));
    });
    return userEducation.join(';');
  };
  // 获得家庭成员的数据
  getFamilyMemberParam = ({ values, form }) => {
    let userEducation = [];
    const familyMemberKeys = form.getFieldValue('familyMemberKeys');
    familyMemberKeys.forEach((index) => {
      let msgArr = [];
      const familyName = values[`familyName-${index}`] ? values[`familyName-${index}`] : '';
      const relation = values[`relation-${index}`] ? values[`relation-${index}`] : '';
      const contactInf = values[`contactInf-${index}`] ? values[`contactInf-${index}`] : '';
      const emergency = values[`emergency-${index}`];

      if (familyName || relation || contactInf || emergency) {
        msgArr.push(familyName, relation, contactInf, emergency);
      }
      if (values[`familyMemberId-${index}`]) {
        msgArr.push(values[`familyMemberId-${index}`]);
      }
      userEducation.push(msgArr.join(','));
    });
    return userEducation.join(';');
  };

  // 表单提交
  lastSubmitHandler = (e) => {
    if (e) {
      e.preventDefault();
    }

    this.LastForm.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      this.setState({
        createLoading: true
      });
      const url = CONFIG.modifyPage ? CONFIG.userModifyUrl : CONFIG.creatFormUrl;

      const userEducation = this.getEducationParam({
        values,
        form: this.LastForm
      });
      const userWorkExperience = this.getWorkExperienceParam({
        values,
        form: this.LastForm
      });
      const userFamilyMember = this.getFamilyMemberParam({
        values,
        form: this.LastForm
      });

      const params = {
        ...this.state.params,
        trialMonth: values['trialMonth'] || '',
        gmtBecomeRegular: values['gmtBecomeRegular'] ? values['gmtBecomeRegular'].format('YYYY-MM-DD HH:mm:ss') : '',
        cardNo: values['cardNo'] || '',
        gmtBirthday: values['gmtBirthday'] ? values['gmtBirthday'].format('YYYY-MM-DD') : '',
        'userArchive.constellation': values['constellation'] || '',
        'userArchive.bloodType': values['bloodType'] || '',
        'userArchive.cultureDegree': values['cultureDegree'] || '',
        'userArchive.politicalStatus': values['politicalStatus'] || '',
        'userArchive.married': values['married'] || '',
        'userArchive.censusRegister': values['censusRegister'] || '',
        'userArchive.healthCondition': values['healthCondition'] || '',
        'userArchive.nationality': values['nationality'] || '',
        'userArchive.censusRegisterAddress': values['censusRegisterAddress'] || '',
        presentAddress: values['presentAddress'] || '',
        content: T.return2Br(values['content'] || '') || '',
        userEducation: userEducation,
        userWorkExperience: userWorkExperience,
        userFamilyMember: userFamilyMember
      };
      let formdate = new FormData(document.getElementById('firstForm'));

      for (let i in params) {
        formdate.append(i, params[i]);
      }
      if (CONFIG.modifyPage) {
        formdate.append('userId', CONFIG.curEditUserId);
      }

      // 请求查询接口
      T.upload(url, formdate)
        .then((data) => {
          //请求成功
          if (data.success) {
            if (CONFIG.modifyPage) {
              message.success('员工修改成功!');
              setTimeout(() => {
                window.location.href = `${T.userPath}/userQuery.htm`;
              },1000);
              // setTimeout(() => {
              //   window.location.reload();
              // }, 1000);
            } else {
              message.success('员工创建成功!');
              setTimeout(() => {
                window.location.href = `${T.userPath}/userQuery.htm`;
              },1000);
            }
            this.setState({
              createLoading: false
            });
          } else {
            this.setState({
              createLoading: false
            });
            Modal.error({
              title: '提示',
              content: data.errorMessage
            });
          }
        })
        .catch((err) => {
          this.setState({
            createLoading: false
          });
          T.showError(err);
          throw err;
        });
    });
  };
  next() {
    const current = this.state.current;
    this.setState({
      current: current + 1
    });
  }
  prev() {
    const current = this.state.current;
    this.setState({
      current: current - 1
    });
  }

  firstFormRef(form) {
    this.FirstForm = form;
  }
  secondFormRef(form) {
    this.SecondForm = form;
  }
  lastFormRef(form) {
    this.LastForm = form;
  }

  // 上传头像
  handleChange = (info) => {
    const _val = info.target.value.toLowerCase(); //把上传的图片格式变成小写

    if (!/\.(gif|jpg|jpeg|png)$/.test(_val)) {
      message.error('只支持JPG、PNG、GIF图片格式');
    } else {
      //可不可以上传
      var _canUpLoad = true;

      //如果支持\html5读取图片的体积
      if (info.target.files) {
        const isLt2M = info.target.files[0].size / 1024 / 1024 < 2;
        if (!isLt2M) {
          _canUpLoad = false;
          message.error('对不起！上传的图片大小不能超过2M！');
        }
      }
      //如果可以上传
      if (_canUpLoad) {
        //请求接口
        if (CONFIG.modifyPage) {
          let formdate = new FormData(document.getElementById('firstForm'));
          formdate.append('userId', CONFIG.curEditUserId);
          // 请求查询接口
          T.upload(CONFIG.modifyUserImageUrl, formdate)
            .then((data) => {
              message.success('上传头像成功!');
            })
            .catch((err) => {
              T.getError(err);
            });
        }

        // 如果支持 FileReader
        if (typeof FileReader !== 'undefined') {
          var _read = new FileReader();

          _read.onload = (e) => {
            //图片上传
            this.setState({
              imageUrl: e.target.result,
              loading: false
            });
          };
          _read.readAsDataURL(info.target.files[0]);
        }
      }
    }
  };
  render() {
    const { current, params, imageUrl, loading, postionNameList, postionNameValue } = this.state;
    const { dispatch, userCreate } = this.props;
    return (
        <BasicLayout>
          <div className="bg-white antd_form_horizontal clearfix">
            <Steps className="user-create-steps" current={current}>
              {steps && steps.map((item, index) => <Step key={index} title={item.title} />)}
            </Steps>
            <div className="steps-content">
              <div className={this.state.current === 0 ? '' : 'hide'}>
                <FirstForm
                  params={params}
                  submitHandler={this.firstSubmitHandler.bind(this)}
                  ref={(form) => this.firstFormRef(form)}
                  handleChange={this.handleChange}
                  imageUrl={imageUrl}
                  loading={loading}
                />
              </div>
              <div className={this.state.current === 1 ? '' : 'hide'}>
                <SecondForm
                  dispatch={dispatch}
                  userCreate={userCreate}
                  params={params}
                  submitHandler={this.secondSubmitHandler.bind(this)}
                  ref={(form) => this.secondFormRef(form)}
                  handleChangePositionType={this.handleChangePositionType.bind(this)}
                  postionNameList={postionNameList}
                  postionNameValue={postionNameValue}
                  prev={() => this.prev()}
                />
              </div>
              <div className={this.state.current === 2 ? '' : 'hide'}>
                <LastForm
                  params={params}
                  ref={(form) => this.lastFormRef(form)}
                  submitHandler={this.lastSubmitHandler.bind(this)}
                  prev={() => this.prev()}
                  createLoading={this.state.createLoading}
                />
              </div>
            </div>
          </div>
        </BasicLayout>
    );
  }
}

export default connect(({ userCreate }) => ({ userCreate }))(UserCreate);
