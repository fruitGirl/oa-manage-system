import * as processConst from 'constants/process/processConfigEdit';

export const LAUNCH_PROCESS_TYPE = 'START'; // 开始节点
export const APPROVE_PROCESS_TYPE = 'APPROVE'; // 审批节点
export const NOTICE_PROCESS_TYPE = 'NOTICE'; // 抄送节点
export const CONDITION_PROCESS_TYPE = 'CONDITION'; // 条件节点

// 初始的开始流程节点
export const NEW_START_PROCESS = {
  key: T.tool.createUuid('start'),
  type: LAUNCH_PROCESS_TYPE,
  childNodes: [],
  priority: 1,
  processVisibleConfig: {
    visibleObjectType: processConst.VISIBLE_RANGE_ALL_USER,
    visibleObjectIds: []
  }
};

// 新增审批流程
export const createApprovalProcess = () => {
  return {
    name: '审批',
    key: T.tool.createUuid('approval'),
    type: APPROVE_PROCESS_TYPE,
    processApproveNodePropertiesConfig: { // 属性配置
      approverObjectType: processConst.APPROVE_USER_MANAGEER, // 审批人类型
      approveWay: processConst.ALL_APPROVE_PASS_WAY, // 审批方式
      autoPass: true, // 自动通过
      approverObjectIds: [], // 审批人ids
      autoForwardObjectType: '', // 审批人为空时的类型
      autoForwardObjectId: '', // 审批认为空时，选定的对象
      selfSelectedNumber: 0, // 自选人数
      selfSelectedRangeType: processConst.VISIBLE_RANGE_ALL_USER, // 自选类型
      selfSelectedRangeIds: [], // 自选ids
    },
    childNodes: [],
    priority: 1,
  };
};

// 条件的类型：发起人，范围，多选
export const CUSTOM_STARTER_CONDITION = 'CUSTOM_STARTER';
export const RANGE_CONDITION = 'RANGE';
export const MULTI_SELECT_CONDITION = 'MULTI_SELECT';

// 新增条件流程
export const createConditionProcess = () => {
  return {
    name: '条件',
    key: T.tool.createUuid('condition'),
    type: CONDITION_PROCESS_TYPE,
    priority: 1, // 优先级
    processConditionNodePropertiesList: [],
    childNodes: []
  };
};

// 发起人条件
export const LAUNCH_CONDITION = { label: '发起人', value: 'launchUser' };

// 新增抄送流程
export const createNoticeProcess = () => {
  return {
    name: '抄送',
    key: T.tool.createUuid('notice'),
    type: NOTICE_PROCESS_TYPE,
    childNodes: [],
    priority: 1,
    processNoticeNodePropertiesConfig: { // 抄送人
      noticeObjectType: processConst.NOTICE_TO_GROUP
    }
  };
};

// 筛选出当前选择的用户信息
export const getSelectedUserEnum = (selectedIds = [], dataProvider = []) => {
  const configs = selectedIds.map(i => {
    return dataProvider.find(j => j.value === i);
  });
  return configs.filter(Boolean);
};

// 从树形结构中（指定部门/指定分类数据），筛选出当前选中的用户组或者部门的信息
export const getSelectedGroupOrDeptEnum = (selectedIds = [], dataProvider = []) => {
  let configs = selectedIds.map(i => {
    const matchItem = filterTreeKey(dataProvider, i);
    return matchItem;
  });
  configs = configs.filter(Boolean);
  return configs.map(i => {
    const { title, value } = i;
    return {
      label: title,
      value
    };
  });
};

// 匹配出树下的某一节点
const filterTreeKey = (config = [], compareVal) => {
  for (let i = 0; i < config.length; i++) {
    if (config[i].value === compareVal) {
      return config[i];
    }
    if (config[i].children) {
      const matchItem = filterTreeKey(config[i].children, compareVal);
      if (matchItem) return matchItem;
    }
  }
};

// 传入修改的数据，更新整体的config，存在副作用（修改原始数据）
export const updateProcessConfig = (updateData, config = []) => {
  for (let i = 0; i < config.length; i++) {
    const { childNodes = [], key } = config[i];

    // 匹配到当前的选中项
    if (key === updateData.key) {
      config[i] = { ...config[i], ...updateData };
      return;
    } else if (childNodes && childNodes.length) {
      updateProcessConfig(updateData, childNodes);
    }
  }
};
