/*
 * @Description: 个人-我的工资条(令牌验证)
 * @Author: danding
 * @Date: 2019-02-13 17:08:22
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-28 10:35:02
 */

const { message } = window.antd;

export default {
  namespace: 'salaryOperateWeixinTokenValidate',

  state: {

  },

  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
    }
  },

  effects: {
    *onValid({ payload }, { call, put }) {
      try {
        yield call(T.post, '/salary/salaryOperateWeixinTokenValidate.json', { token: payload });
        message.success('验证成功');
        T.tool.redirectTo(`${CONFIG.frontPath}/salary/salarySend.htm`);
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
