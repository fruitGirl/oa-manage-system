/*
 * @Description: 系统-授予员工权限
 * @Author: qianqian
 * @Date: 2019-02-18 15:19:21
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-18 15:20:19
 */
export default {
  namespace: 'grantUserAuthority',

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
    },

    pictureWall(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
