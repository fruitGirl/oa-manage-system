/*
 * @Description: 绩效管理
 * @Author: moran
 * @Date: 2019-08-09 11:55:00
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-12 17:10:28
 */

const { message } = window.antd;

export default {
  namespace: 'performanceManage',

  state: {
    showModal: false, // 显示弹框
    performancePlanLists: [], // 绩效管理
    paginator: {}, // 分页
    performancePlanInfos: {}, // 回填绩效信息
    teamLists: [], // 团队列表
  },

  effects: {
    // 获取绩效管理列表
    *getPerformancePlanLists({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/performance/performancePlanPageQuery.json', payload);
        const { pageQueryResult, userIdAndNickNameMap } = res.outputParameters;
        const { list = [], paginator = {} } = pageQueryResult;

        // 转换列表数据
        const combineLists = list.map((res) => {
          return {
            ...res,
            openPerson: userIdAndNickNameMap[res.initiator] // 开启人
          };
        });
        yield put({
          type: 'updatePerformancePlanLists',
          payload: {
            list: combineLists,
            paginator
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 创建绩效/编辑绩效
    *savePerformancePlan({ payload }, { call, put }) {
      try {
        const url = payload.id ? '/performance/performancePlanModify.json' : '/performance/performancePlanCreate.json';
        yield call(T.post, url, payload);
        yield put({
          type: 'getPerformancePlanLists',
          payload: { currentPage: 1 }
        });
        message.success('保存成功');
        yield put({ type: 'displayModal', payload: false });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

     // 编辑绩效回填
    *getPerformancePlanInfos({ payload }, { call, put }) {
      try {
        yield put({ type: 'displayModal', payload: true });
        const res = yield call(T.get, '/performance/performancePlanQuery.json', payload);
        const { performancePlan = {} } = res.outputParameters;
        yield put({
          type: 'updatePerformancePlanInfos',
          payload: performancePlan
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 开启
    *openPerformancePlan({ payload }, { call, put }) {
      try {
        yield call(T.post, '/performance/performancePlanStart.json', payload);
        yield put({ type: 'getPerformancePlanLists', payload: { currentPage: 1 }});
        message.success('开启成功');
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 团队列表
    *getTeamLists({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/performance/performanceTeamQuery.json', payload);
        const { teamList = [] } = res.outputParameters;
        const teamLists = T.tool.transArrs(teamList, 'name' , 'id');
        yield put({ type: 'updateTeamLists', payload: teamLists });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },


  reducers: {
    // 绩效管理列表
    updatePerformancePlanLists(state, { payload }) {
      const { list, paginator } = payload;
      return { ...state, performancePlanLists: list, paginator };
    },

    // 回填绩效
    updatePerformancePlanInfos(state, { payload }) {
      return { ...state, performancePlanInfos: payload  };
    },

    // 团队列表
    updateTeamLists(state, { payload }) {
      return { ...state, teamLists: payload  };
    },

    // 展示开启绩效弹窗
    displayModal(state, { payload }) {
      return {
        ...state,
        showModal: payload,
        performancePlanInfos: payload
          ? state.performancePlanInfos
          : {
            ...state.performancePlanInfos,
            id: undefined,
            assessRange: {name: 'ALL_TEAM'}
          }, // 弹窗隐藏，重置存储的开启绩效信息
      };
    },
  }
};
