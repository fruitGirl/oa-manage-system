/*
 * @Description: 个人-工资条发放（查看/编辑）
 * @Author: danding
 * @Date: 2019-02-13 17:08:22
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-09 14:46:18
 */
import { SEND_STATUS, RECALL, } from 'constants/salary/salaryManage';

const { message } = window.antd;

export default {
  namespace: 'salaryManage',

  state: {
    list: [], // 工资列表
    userSalary: {}, // 用户工资详情
    showModal: false, // 显示修改用户工资弹框
    paginator: {}
  },

  effects: {
    *queryList({ payload }, { call, put }) { // 获取工资列表
      try {
        const res = yield call(T.post, '/salary/salaryPageQuery.json', payload);
        const { pageQueryResult, userIdAndStatusMap, } = res;
        const { paginator, userSalaryList,  } = pageQueryResult;
        const list = userSalaryList.map(i => {
          const { nickName, status, userId } = i;
          return {
            ...i,
            sendStatus: status.name,
            realNickName: nickName,
            jobStatus: userIdAndStatusMap[userId].message,
          };
        });
        yield put({ type: 'updateList', payload: list, paginator, });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *sendSalary({ payload }, { call, put, select }) { // 发送工资
      try {
        yield call(T.post, '/salary/salarySend.json', payload);
        message.success('发送成功');
        let list = yield select(state => state.salaryManage.list);
        payload.ids.forEach(i => {
          const matchedIdx = list.findIndex(j => j.id === i);
          list[matchedIdx].sendStatus = SEND_STATUS; // 修改工资发放状态
        });
        yield put({ type: 'updateList', payload: list });
      } catch(err) {
        T.showErrorMessage(err);
      }
    },
    *sendAllSalary({ payload }, { call, put, select }) { // 发送全部工资
      try {
        yield call(T.post, '/salary/salaryBatchSend.json', payload);
        message.success('发送成功');
        let list = yield select(state => state.salaryManage.list);
        list = list.map(i => ({
          ...i,
          sendStatus: SEND_STATUS, // 修改工资发放状态
        }));
        yield put({ type: 'updateList', payload: list });
      } catch(err) {
        T.showErrorMessage(err);
      }
    },
    *withdrawSalary({ payload }, { call, put, select }) { // 撤回工资
      try {
        yield call(T.post, '/salary/salaryRecall.json', payload);
        message.success('撤回成功');
        let list = yield select(state => state.salaryManage.list);
        const matchedIdx = list.findIndex(i => i.id === payload.id);
        list[matchedIdx].sendStatus = RECALL;
        yield put({ type: 'updateList', payload: list });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *queryUserSalary({ payload }, { call, put, select }) { // 获取用户信息
      try {
        const res = yield call(T.post, '/salary/userSalaryQueryById.json', payload);
        yield put({ type: 'updateUserSalary', payload: res.userSalary });
      } catch(err) {
        T.showErrorMessage(err);
      }
    },
    *submitSalary({ payload }, { call, put, select }) { // 修改用户工资详情
      try {
        const state = yield select(state => state.salaryManage);
        const { list, userSalary } = state;
        yield call(T.post, '/salary/userSalaryModify.json', { ...userSalary, ...payload });
        message.success('修改成功');
        const matchedIdex = list.findIndex(i => i.id === userSalary.id);
        const { realAmount } = userSalary;
        const realAmountValue = payload[realAmount] || '';
        list[matchedIdex] = { ...list[matchedIdex], ...payload, realAmountValue };
        yield put({ type: 'updateSalarySuc', payload: list });
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    updateList(state, { payload, paginator }) { // 更新工资列表
      return {
        ...state,
        list: payload,
        paginator: paginator || state.paginator
      };
    },
    updateUserSalary(state, { payload }) { // 更新用户工资详情
      return { ...state, userSalary: payload, showModal: true };
    },
    changeFields(state, { payload }) { // 修改用户工资字段
      return { ...state, userSalary: { ...payload }};
    },
    hideModal(state, { payload }) { // 隐藏工资详情弹窗
      return { ...state, showModal: false };
    },
    updateSalarySuc(state, { payload }) { // 提交修改用户工资成功
      return { ...state, showModal: false, userSalary: {}, list: payload };
    },
  }
};
