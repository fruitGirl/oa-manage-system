/*
 * @Description: 系统-权限类型管理
 * @Author: qianqian
 * @Date: 2019-02-18 11:58:16
 * @Last Modified by: qianqian
 * @Last Modified time: 2019-02-18 11:58:36
 */
export default {
  namespace: 'authorityTypeQuery',

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
