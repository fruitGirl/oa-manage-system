/*
 * @Description: 流程创建/编辑
 * @Author: danding
 * @Date: 2019-09-10 13:02:04
 * @Last Modified by: danding
 * @Last Modified time: 2019-09-27 19:06:23
 */
import { NORMAL_INFO_STEP } from 'constants/process/stepsNavConfig';
import cloneDeep from 'lodash.clonedeep';
import { ALL_USER_URL } from 'constants/common';
import { DEFAULT_APPROVAL_LOGO, VISIBLE_RANGE_ALL_USER, VISIBLE_RANGE_CUSTOM_COMPANY, VISIBLE_RANGE_CUSTOM_DEPART } from 'constants/process/processConfigEdit';
import { NEW_START_PROCESS } from 'constants/components/process/processConfigEdit';

const { message } = window.antd;

// 筛选部门树，递归删选children
function combineDepartmentData(data = [], companyName) {
  return data.map(i => {
    const { name, id, directSubDepartment = [] } = i;
    const children = combineDepartmentData(directSubDepartment, companyName);
    return {
      title: name,
      value: id,
      key: id,
      children,
      companyName
    };
  });
}

// 重组人员分类树
function combineGroupData(data = []) {
  return data.map(i => {
    const { name, id, groupInfoList = [] } = i;
    const children = combineGroupData(groupInfoList);
    return {
      title: name,
      value: id,
      key: id,
      children,
    };
  });
}

// 重组流程的key
function combineProcessTree(config = []) {
  return config.map(i => {
    const { childNodes = [] } = i;
    const children = combineProcessTree(childNodes);
    return {
      ...i,
      key: T.tool.createUuid('process'),
      childNodes: children
    };
  });
}

export default {
  namespace: 'processConfigEdit',

  state: {
    normalInfo: { // 基本信息
      logo: DEFAULT_APPROVAL_LOGO,
    },
    processVisibleConfig: { // 基本信息-流程可见性配置
      visibleObjectType: VISIBLE_RANGE_ALL_USER,
      visibleObjectIds: []
    },
    id: '', // 流程id
    activeNavKey: NORMAL_INFO_STEP, // 当前选择的nav
    showClassifMsgModal: false, // 分类新增弹窗显示与否
    classifiList: [], // 分类列表
    allUsers: [], // 所有的用户枚举
    allDepts: [], // 所有的部门树
    allGroups: [], // 所有人员分类树
    targetConfigs: [], // 当前展示的表单项配置
    selectedTargetItem: {}, // 当前选中的表单项
    startNodeConfig: [NEW_START_PROCESS], // 流程总配置
    selectedProcessCard: NEW_START_PROCESS, // 选中的流程卡片信息
    selectedConditionChildCard: {}, // 选中的条件下流程卡片
    isSaveSuc: false, // 是否保存成功
  },

  effects: {
    // 获取详情数据
    *getDetailMsg({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/processConfigDetailQuery.json', payload);
        const {
          outputParameters: {
            processConfig,
            processVisibleConfig,
            formDataConfigList,
            startNodeConfig
          }
        } = res;
        const { logo, name, typeId, description, id } = processConfig;
        const normalInfo = { logo, name, typeId, description, id };
        const { childNodes, ...rest } = startNodeConfig;
        const combineChildNodes = combineProcessTree(childNodes);
        const startKey = T.tool.createUuid('start');
        const newStartNodeConfig = [
          {
            ...rest,
            key: startKey,
            processVisibleConfig,
            childNodes: combineChildNodes
          }
        ];

        yield put({
          type: 'setInitialState',
          payload: {
            normalInfo,
            processVisibleConfig,
            targetConfigs: formDataConfigList,
            startNodeConfig: newStartNodeConfig,
            selectedProcessCard: {
              ...rest,
              key: startKey,
            }
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 保存审批分类名称
    *saveClassifMsg({ payload }, { call, put }) {
      try {
        yield call(T.post, '/process/processTypeCreate.json', payload);
        yield put({
          type: 'displayClassifMsgModal',
          payload: false
        });
        message.success('新增成功');

        // 刷新分类集合数据
        yield put({
          type: 'getClassifList'
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 获取审批分类名称
    *getClassifList({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/processTypeQueryAllEnabled.json', payload);
        const { outputParameters: { processTypeList = [] } } = res;
        const combineList = processTypeList.map(i => ({
          label: i.name,
          value: i.id
        }));
        yield put({
          type: 'setClassifiList',
          payload: combineList
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 获取所有用户枚举值
    *getAllUsers({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, ALL_USER_URL, payload);
        const { outputParameters: { userList = [] } } = res;
        const combineList = userList.map(i => ({
          label: i.nickName,
          value: i.userId
        }));
        yield put({
          type: 'setAllUsers',
          payload: combineList
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 获取部门树数据
    *getAllDepts({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/user/wholeCompanyDepartmentTreeQuery.json', payload);
        const { outputParameters: { companySimpleList = [] } } = res;

         // 重组部门树的数据结构
         const departmentData = companySimpleList.map(i => {
          const { shortName, id, directDepartment = [] } = i;
          const children = combineDepartmentData(directDepartment, shortName);
          return {
            title: shortName,
            value: id,
            key: id,
            children,
          };
        });

        yield put({
          type: 'setAllDepts',
          payload: departmentData
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 获取所有用户分类枚举
    *getAllGroups({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/process/groupInfoQuery.json', payload);
        const { outputParameters: { groupInfoList = [] } } = res;
        const combineList = combineGroupData(groupInfoList);
        yield put({
          type: 'setAllGroups',
          payload: combineList
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 提交流程配置
    *submitProcessConfig({ payload }, { call, put, select }) {
      try {
        const state = yield select(state => state.processConfigEdit);
        let { allDepts, normalInfo, processVisibleConfig, targetConfigs, startNodeConfig } = cloneDeep(state);
        let { visibleObjectType, visibleObjectIds } = processVisibleConfig;
        let processVisibleCompany;

        // 选择自定义部门
        if (visibleObjectType === VISIBLE_RANGE_CUSTOM_DEPART) {
          const selectedCompany = allDepts.filter(i => {
            return visibleObjectIds.includes(i.key);
          });

          const selectedCompanyIds = selectedCompany.map(i => i.value) || [];

          // 重组公司负责人
          processVisibleCompany = {
            visibleObjectType: VISIBLE_RANGE_CUSTOM_COMPANY,
            visibleObjectIds: selectedCompanyIds
          };

          // 部门ids容器去除公司id
          selectedCompanyIds.forEach(j => {
            const matchIdx = visibleObjectIds.indexOf(j);
            if (matchIdx !== -1) {
              visibleObjectIds.splice(matchIdx, 1);
            }
          });

          processVisibleCompany = (selectedCompanyIds.length)
            ? processVisibleCompany
            : null;
        }

        // 重组基本信息内的可见性
        let processVisibleConfigInfo = {
          ...processVisibleConfig,
          visibleObjectIds
        };

        // 部门没有选择
        if (
          (visibleObjectType === VISIBLE_RANGE_CUSTOM_DEPART)
          && (!visibleObjectIds || !visibleObjectIds.length)
        ) {
          processVisibleConfigInfo = null;
        }

        processVisibleConfig = {
          processVisibleConfigInfo,
          processVisibleCompany
        };

        // 修改/新增
        const url = normalInfo.id
          ? '/process/processConfigModify.json'
          : '/process/processConfigCreate.json';
        yield call(T.post, url, {
          ...normalInfo,
          processVisibleConfigStr: JSON.stringify(processVisibleConfig),
          processFormDataConfigStr: JSON.stringify({ formDataConfigList: targetConfigs }),
          processNodeConfigStr: JSON.stringify(startNodeConfig[0])
        });
        yield put({
          type: 'setSaveStatus',
          payload: true
        });
        message.success('保存成功');
        T.tool.redirectTo(`/process/processConfigQuery.htm`);
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    // 设置分类信息弹窗显示与隐藏
    displayClassifMsgModal(state, { payload }) {
      return {
        ...state,
        showClassifMsgModal: payload,
      };
    },

    // 切换顶部步骤
    changeNavStey(state, { payload }) {
      return { ...state, activeNavKey: payload };
    },

    // 更新审批分类数据
    setClassifiList(state, { payload }) {
      return { ...state, classifiList: payload };
    },

    // 更新所有用户枚举
    setAllUsers(state, { payload }) {
      return { ...state, allUsers: payload };
    },

    // 更新所有用户枚举
    setAllDepts(state, { payload }) {
      return { ...state, allDepts: payload };
    },

    // 更新所有用户枚举
    setAllGroups(state, { payload }) {
      return { ...state, allGroups: payload };
    },

    // 设置选中的表单项
    setSelectTargetItem(state, { payload }) {
      return { ...state, selectedTargetItem: payload };
    },

    // 删除表单项
    removeTargetItem(state, { payload }) {
      let targetConfigs = cloneDeep(state.targetConfigs);
      targetConfigs.splice(payload, 1);
      return { ...state, targetConfigs, selectedTargetItem: {} };
    },

    // 更新表单项
    updateTargetconfigs(state, { payload }) {
      return { ...state, targetConfigs: payload };
    },

    // 设置左侧选中的流程卡片
    setSelectedSiderProcessCard(state, { payload }) {
      return { ...state, selectedProcessCard: payload };
    },

    // 设置条件下的流程卡片
    setSelectedConditionChildCard(state, { payload }) {
      return { ...state, selectedConditionChildCard: payload };
    },

    // 修改基本信息字段(同步发起流程数据)
    changeNormaInfo(state, { payload }) {
      let cloneNodeConfig =  cloneDeep(state.startNodeConfig);
      cloneNodeConfig[0] = { ...cloneNodeConfig[0], ...payload };

      return {
        ...state,
        normalInfo: { ...state.normalInfo, ...payload },
        startNodeConfig: cloneNodeConfig
      };
    },

    // 修改可见范围类型(同步发起流程数据)
    changeVisibleType(state, { payload }) {
      let cloneNodeConfig =  cloneDeep(state.startNodeConfig);
      const processVisibleConfig = {
        visibleObjectType: payload,
        visibleObjectIds: []
      };
      cloneNodeConfig[0] = { ...cloneNodeConfig[0], processVisibleConfig };

      return {
        ...state,
        processVisibleConfig,
        startNodeConfig: cloneNodeConfig
      };
    },

    // 修改可见范围的值(同步发起流程数据)
    changeVisibleIds(state, { payload }) {
      let cloneNodeConfig =  cloneDeep(state.startNodeConfig);
      const processVisibleConfig = {
        ...state.processVisibleConfig,
        visibleObjectIds: payload
      };
      cloneNodeConfig[0] = { ...cloneNodeConfig[0], processVisibleConfig };

      return {
        ...state,
        processVisibleConfig,
        startNodeConfig: cloneNodeConfig
      };
    },

    // 更新流程配置
    updateProcessLine(state, { payload }) {
      return { ...state, startNodeConfig: payload };
    },

    // 查看详情时，state赋值
    setInitialState(state, { payload }) {
      return { ...state, ...payload };
    },

    // 保存信息的情况
    setSaveStatus(state, { payload }) {
      return { ...state, isSaveSuc: payload };
    }
  }
};
