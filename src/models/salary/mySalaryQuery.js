/*
 * @Description: 个人-我的工资条
 * @Author: danding
 * @Date: 2019-02-13 17:08:22
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-28 10:31:12
 */
const { message } = window.antd;
export default {
  namespace: 'mySalaryQuery',

  state: {
    userSalary: {}, // 单条工资详情
    showSalaryModal: false, // 显示工资详情弹窗
    showValidModal: false, // 显示微信令牌弹窗
    curLookSalaryIdx: '', // 当前查看的工资条索引值
    visibleFields: [], // 工资项可见字段
  },

  effects: {
    *lookDetail({ payload }, { call, put }) { // 获取工资详情
      try {
        const res = yield call(T.post, '/salary/mySalaryQuery.json', payload);
        const { userSalary, visibleFields } = res;
        const curLookSalaryIdx = CONFIG.userSalaryList.findIndex(i => i.id === userSalary.id);
        yield put({ type: 'querySalarySuc', payload: { userSalary, curLookSalaryIdx, visibleFields }});
      } catch(err) {
        // 令牌验证失效
        if (err.error && (err.error.code === 'USER_TIMEOUT')) {
          yield put({ type: 'showValidModal' });
        } else {
          T.showErrorMessage(err);
        }
      }
    },
    *onValid({ payload }, { call, put }) { // 微信令牌验证
      try {
        yield call(T.post, '/salary/mySalaryOperateWeixinTokenValidate.json', { token: payload });
        message.success('验证成功');
        yield put({ type: 'hideValidModal' });
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    querySalarySuc(state, { payload }) {
      const { visibleFields, userSalary, curLookSalaryIdx } = payload;
      return {
        ...state,
        userSalary,
        visibleFields,
        curLookSalaryIdx,
        showSalaryModal: true,
      };
    },
    showValidModal(state, action) {
      return { ...state, showValidModal: true };
    },
    hideValidModal(state, action) {
      return { ...state, showValidModal: false };
    },
    hideSalaryModal(state, action) {
      return { ...state, showSalaryModal: false };
    }
  }
};
