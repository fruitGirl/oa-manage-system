/*
 * @Description: 系统-角色管理
 * @Author: qianqian
 * @Date: 2019-02-18 11:38:09
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-18 11:38:46
 */
export default {
  namespace: 'roleQuery',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // eslint-disable-line
      yield put({ type: 'save' });
      yield call({ type: 'save' });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
