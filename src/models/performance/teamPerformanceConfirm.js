/*
 * @Description: 团队绩效管理详情
 * @Author: danding
 * @Date: 2019-07-09 14:52:17
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-16 12:09:58
 */

const { message } = window.antd;

export default {
  namespace: 'teamPerformanceConfirm',

  state: {
    otherTeamList: [], // 其他团队绩效数据
    history: [], // 历史记录
    disabledSubmitAll: true, // 是否禁用提交绩效
    selfTeamInfo: {}, // 自己团队绩效信息
    performanceDetail: { // 团队绩效详情
      submitNum: 0,
      unSubmitNum: 0,
      submitDetail: [],
      unSubmitDetail: []
    },
    showPerformanceModal: false, // 显示绩效详情弹窗
  },

  effects: {
    // 获取团队绩效信息
    *getTeamPerformanceInfo({ payload }, { call, put }) {
      try {
        const data = yield call(T.get, '/performance/teamManagerPerformanceConfirmDetail.json', payload);
        const { confirmDetailList = [], team, allUserNum, submitUserNum, unSubmitUserNum, teamConfirmResult, performanceFinish, teamStatisticMap = {} } = data;
        const disabledSubmitAll = confirmDetailList.some(i => i.unSubmitUserNum);
        const scopes = Object.keys(teamStatisticMap) || [];
        const performanceScoreStatistics = scopes.map(i => {
          const userNum = teamStatisticMap[i].userNum;
          return {
            userNum,
            score: i,
          };
        });

        yield put({ type: 'getHistory', payload: team.id });

        yield put({
          type: 'setTeamPerformanceInfo',
          payload: {
            otherTeamList: confirmDetailList,
            disabledSubmitAll,
            selfTeamInfo: {
              ...team,
              performanceScoreStatistics, // 绩效分数
              allUserNum, // 所有成员数
              submitUserNum, // 已提交人数
              unSubmitUserNum, // 未提交人数
              teamConfirmResult, // 是否已确认过绩效
              performanceFinish, // 是否结束绩效
            }
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 获取历史记录
    *getHistory({ payload }, { call, put }) {
      try {
        const { timeRange } = T.tool.getSearchParams();
        const res = yield call(T.get, '/user/managerConfirmOperateLogQuery.json', {
          operateObjectType: 'PERFORMANCE',
          prop: 'TIME_RANGE',
          teamId: payload,
          propValue: timeRange
        });
        const { teamOperateLogList = [] } = res.outputParameters;
        yield put({ type: 'setHistory', payload: teamOperateLogList });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 全部打回
    *refuse({ payload }, { call, put }) {
      try {
        yield call(T.post, '/performance/teamManagerPerformanceRefuse.json', payload);
        message.success('打回成功');
        const { timeRange, performanceTypeCode, teamId, year } = T.tool.getSearchParams();
        yield put({
          type: 'getTeamPerformanceInfo',
          payload: {
            timeRange,
            year,
            performanceAssessmentTypeCode: performanceTypeCode,
            teamId
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 确认绩效考核
    *confirm({ payload }, { call, put }) {
      try {
        yield call(T.post, '/performance/teamManagerPerformanceConfirm.json', payload);
        message.success('提交成功');
        const { timeRange, performanceTypeCode, teamId, year } = T.tool.getSearchParams();
        yield put({
          type: 'getTeamPerformanceInfo',
          payload: {
            timeRange,
            year,
            performanceAssessmentTypeCode: performanceTypeCode,
            teamId
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 获取其他部门的团队内成员的数据
    *getOtherPerformanceDetail({ payload }, { call, put }) {
      try {
        const data = yield call(T.get, '/performance/departmentPerformanceDetailQuery.json', payload);
        const { name } = payload;
        yield put({ type: 'displayPerformanceModal', payload: true });
        const { unSubmitNickNameList = [], submitUserNum, unSubmitUserNum, performanceScoreStatistics, allUserNum, authorityResult = {} } = data;

        const scopes = Object.keys(performanceScoreStatistics) || [];
        const submitDetail = scopes.map(i => {
          const data = performanceScoreStatistics[i];
          const { userNum, userInfoSimpleList = [] } = data;
          return {
            scope: i, // 评分
            userNum, // 人数
            percent: T.tool.getPercent(userNum, allUserNum), // 百分比
            userInfoSimpleList,  // 人员信息
          };
        });

        yield put({
          type: 'setTeamPerformanceDetail',
          payload: {
            submitNum: submitUserNum,
            unSubmitNum: unSubmitUserNum,
            submitDetail,
            unSubmitDetail: unSubmitNickNameList,
            name,
            authorityResult, // 可访问详情权限的名单
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 获取自己管辖的所有部门成员信息
    *getSelfPerformanceDetail({ payload }, { call, put }) {
      try {
        const data = yield call(T.get, '/performance/teamPerformanceDetailQuery.json', payload);
        const { name } = payload;
        yield put({ type: 'displayPerformanceModal', payload: true });
        const { unSubmitNickNameList = [], submitUserNum, unSubmitUserNum, performanceScoreStatistics = {}, allUserNum, authorityResult = {} } = data;

        const scopes = Object.keys(performanceScoreStatistics) || [];
        const submitDetail = scopes.map(i => {
          const data = performanceScoreStatistics[i];
          const { userNum, userInfoSimpleList = [] } = data;
          return {
            scope: i, // 评分
            userNum, // 人数
            percent: T.tool.getPercent(userNum, allUserNum), // 百分比
            userInfoSimpleList, // 人员信息
          };
        });

        yield put({
          type: 'setTeamPerformanceDetail',
          payload: {
            name,
            submitNum: submitUserNum,
            unSubmitNum: unSubmitUserNum,
            submitDetail,
            unSubmitDetail: unSubmitNickNameList,
            authorityResult, // 可访问详情权限的名单
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
  },

  reducers: {
    // 设置团队绩效数据
    setTeamPerformanceInfo(state, { payload }) {
      return { ...state, ...payload };
    },

    // 设置历史数据
    setHistory(state, { payload }) {
      return { ...state, history: payload };
    },

    displayPerformanceModal(state, { payload }) {
      return {
        ...state,
        showPerformanceModal: payload,
        performanceDetail: payload ? state.performanceDetail : {}, // 弹窗隐藏，重置存储的团队提交绩效的详情信息
      };
    },

    // 存储团队提交绩效的详情信息
    setTeamPerformanceDetail(state, { payload }) {
      return { ...state, performanceDetail: payload };
    }
  }
};
