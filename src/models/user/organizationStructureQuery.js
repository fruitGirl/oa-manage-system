/*
 * @Description: 组织架构管理
 * @Author: danding
 * @Date: 2019-05-13 15:04:55
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-13 18:31:36
 */

import { ADD_MODE, EDIT_MODE } from 'constants/components/common/editDepaModal';

export default {
  namespace: 'organizationStructureQuery',

  state: {
    depaModalMode: ADD_MODE, // 弹窗模式
    showDepaModal: false, // 显示部门编辑弹窗
    addDepaLevel: '', // 新增部门的层级（部门/子部门）
    editDepaData: {}, // 当前编辑的部门数据
  },

  reducers: {
    hideDepaModal(state) {
      return {
        ...state,
        showDepaModal: false,
        depaModalMode: '',
        addDepaLevel: ''
      };
    },
    showDepaModal(state, action) {
      const { payload: { mode, level } } = action;
      return {
        ...state,
        showDepaModal: true,
        depaModalMode: mode,
        addDepaLevel: level,
        editDepaData: {}
      };
    },
    editDepa(state, { payload }) {
      return {
        ...state,
        mode: EDIT_MODE,
        showDepaModal: true,
        depaModalMode: EDIT_MODE,
        editDepaData: payload
      };
    }
  }
};

