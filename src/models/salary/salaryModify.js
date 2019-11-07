/*
 * @Description: 个人-工资条发放（工资项配置）
 * @Author: danding
 * @Date: 2019-02-13 17:08:22
 * @Last Modified by: danding
 * @Last Modified time: 2019-03-28 14:11:14
 */
const { message } = window.antd;

export default {
  namespace: 'salaryModify',

  state: {
    checkList: []
  },

  effects: {
    *saveColumns({ payload }, { call, put }) {
      try {
        yield call(T.post, '/salary/salaryModify.json', payload);
        message.success('保存成功');
        T.tool.redirectTo(`${CONFIG.frontPath}/salary/salarySend.htm`);
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    initPage(state, action) {
      return { ...state, ...action.payload };
    }
  }
};
