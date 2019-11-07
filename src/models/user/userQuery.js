/*
 * @Description: 系统-员工查询
 * @Author: qianqian
 * @Date: 2019-02-15 18:24:19
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-15 18:27:08
 */
export default {
  namespace: 'userQuery',

  state: {
    curHandleRecord: {}, // 当前操作的人员信息
    showQuitJobModal: false, // 显示离职弹窗
  },

  effects: {
    *submitQuitJob({ payload }, { call, put }) {
      try {
        yield call(T.post, '/user/userResign.json', payload);
        yield put({ type: 'hideQuitJobModal' });
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    showQuitJobModal(state, { payload }) {
      return {
        ...state,
        showQuitJobModal: true,
        curHandleRecord: payload
      };
    },
    hideQuitJobModal(state) {
      return {
        ...state,
        showQuitJobModal: false,
        curHandleRecord: {}
      };
    }
  }
};
