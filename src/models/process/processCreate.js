/*
 * @Description: 发起审批
 * @Author: moran 
 * @Date: 2019-09-10 12:23:21 
 * @Last Modified by: moran
 * @Last Modified time: 2019-10-15 15:21:20
 */
const { message } = window.antd;
export default {
  namespace: 'processCreate',

  state: {
    formDataConfigList: [], // 流程配置
    formConfigName: '', // 表单配置名称
    needToSelect: false, // 是否需要自选
    processNodeInstance: [], // 审批流程节点数据
    showProcessNode: false, // 显示审批流程节点
    namesData: {}, // 用户信息
    imgRules: {} // 上传图片校验信息
  },

  effects: {
     // 流程发起列表
     *getFormConfig({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/formConfigQuery.json', payload);
        const { formDataConfigList, formConfigName } = res.outputParameters;
        const needFormDataConfigList = formDataConfigList.map(i => {
          const { props='{}', type } = i;
          i.props = JSON.parse(props);
          i.type = type.name;
          return i;
        });
        yield put({
          type: 'setFormConfig',
          payload: { formDataConfigList: needFormDataConfigList, formConfigName }
        });
        
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 流程创建
    *createProcess({ payload }, { call, put }) {
      try {
        yield call(T.post, '/process/processCreate.json', payload);
        message.success('流程创建成功');
        window.location.href = `${CONFIG.frontPath}/process/processStartInit.htm`;
        yield put({
          type: 'displayProcessModal',
          payload: false
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 自选人员结果查询
    *getSelfSelectUserNode({ payload }, { call, put }) {
      try {
        const res = yield call(T.post, '/process/selfSelectUserNodeQuery.json', payload);
        const { needToSelect } = res.outputParameters;
        if (!needToSelect) { // 如果没有自选，直接提交数据
          yield put({
            type: 'createProcess',
            payload
          });
        } else { // 需要自选时
          yield put({
            type: 'previewProcessNode',
            payload
          });
        }
        yield put({
          type: 'setSelfSelectUserNode',
          payload: { needToSelect }
        });
        
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 流程预览
    *previewProcessNode({ payload }, { call, put }) {
      try {
        // 审批流程弹窗
        yield put({
          type: 'displayProcessModal',
          payload: true
        });
        const res = yield call(T.post, '/process/processNodePreviewQuery.json', payload);
        const { processNodeInstance } = res.outputParameters;
        yield put({
          type: 'setPreviewProcessNode',
          payload: { processNodeInstance }
        });
        
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 根据花名查询用户信息
    *getUserInfoQueryByNickName({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/userInfoQueryByNickName.json', payload);
        const { jobPositionName, departmentName, companyName, realName } = res.outputParameters;
        yield put({
          type: 'setUserInfoQueryByNickName',
          payload: { jobPositionName, departmentName, companyName, realName }
        });
        
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 上传图片格式
    *getImgRules({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/fileConfigQuery.json');
        const { imageType, imageLength, imageNums } = res.outputParameters;
        yield put({
          type: 'setImgRules',
          payload: { imageType, imageLength, imageNums }
        });
        
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    // 流程发起列表
    setFormConfig(state, { payload }) {
      const { formDataConfigList, formConfigName } = payload;
      return { ...state, formDataConfigList, formConfigName };
    },

    // 自选人员结果查询
    setSelfSelectUserNode(state, { payload }) {
      const { needToSelect } = payload;
      return { ...state, needToSelect };
    },

    // 流程预览
    setPreviewProcessNode(state, { payload }) {
      const { processNodeInstance } = payload;
      return { ...state, processNodeInstance };
    },

    // 审批流程弹窗显示
    displayProcessModal(state, { payload }) {
      return { ...state, showProcessNode: payload };
    },

    // 根据花名查询用户信息
    setUserInfoQueryByNickName(state, { payload }) {
      return { ...state, namesData: payload };
    },

    // 图片校验信息
    setImgRules(state, { payload }) {
      return { ...state, imgRules: payload };
    },
  }
};
