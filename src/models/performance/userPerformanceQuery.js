/*
 * @Description: 绩效查询
 * @Author: qianqian
 * @Date: 2019-02-15 18:24:19
 * @Last Modified by: danding
 * @Last Modified time: 2019-08-16 12:07:56
 */
import { QUARTER_PERFORMANCE } from 'constants/performance';

export default {
  namespace: 'userPerformanceQuery',

  state: {
    userSearchParams: {
      currentPage: 1
    }, // 人员查询条件
    userPaginator: {}, // 人员列表分页
    userList: [], // 人员列表
    teamSearchParams: {
      pageSize: 9,
      currentPage: 1,
    }, // 团队查询条件
    teamPaginator: {}, // 团队列表分页
    teamList: [], // 团队列表
    showPerformanceModal: false, // 显示绩效详情弹窗
    performanceDetail: {}, // 绩效详情
  },

  effects: {
    *getUserList({ payload }, { call, put, select, }) {
      try {
        const userSearchParams = yield select(state => state.userPerformanceQuery.userSearchParams);
        const searchParams = { ...userSearchParams, ...payload };
        const url = T.getFrontPath('/performance/userPerformanceQuery.json');
        const res = yield call(T.get, url, searchParams);
        const {
          userIdAndDeptIdMap = {},
          userIdAndLoginNameMap = {},
          deptIdAndDeptNameByDeptIds = {},
          authorityResult = {},
          pageResult: { list = [], paginator = {} }
        } = res;

        const userList = list.map((item) => {
          const {
            assessObjectId,
            id,
            name,
            gmtModified,
            status: { name: statusName, message: statusMsg },
            superiorTotalScore,
            performanceTypeCode,
            year,
            timeRange
          } = item;
          const departmentName = deptIdAndDeptNameByDeptIds[userIdAndDeptIdMap[assessObjectId]];
          const nickName = userIdAndLoginNameMap[assessObjectId];
          const superiorScore = superiorTotalScore ? superiorTotalScore['value'] : '';
          const href = `${CONFIG.frontPath}/performance/performanceReviewEdit.htm?id=${id}&status=${statusName}`;

          return {
            id,
            departmentName,
            nickName,
            name,
            gmtModified,
            objectTypeMsg: '正式版', // 版本
            statusMsg,
            superiorScore,
            href,
            year,
            hasReadRole: authorityResult[assessObjectId],
            timeRange: performanceTypeCode === QUARTER_PERFORMANCE
              ? timeRange
              : '-'
          };
        });

        yield put({
          type: 'setUserList',
          payload: {
            userList,
            userPaginator: paginator,
            userSearchParams: searchParams
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    *getTeamList({ payload }, { call, put, select, }) {
      try {
        const { teamSearchParams } = yield select(state => state.userPerformanceQuery);
        const searchParams = {
          ...teamSearchParams,
          ...payload
        };
        const res = yield call(T.get, '/performance/departmentUserPerformancePageQuery.json', searchParams);
        const { list = [], paginator } = res.outputParameters.pageResult;
        yield put({
          type: 'setTeamList',
          payload: {
            teamList: list,
            teamPaginator: paginator,
            teamSearchParams: searchParams
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },

    // 获取团队内成员的绩效详情
    *getPerformanceDetail({ payload }, { call, put }) {
      try {
        const res = yield call(T.get, '/performance/departmentUserPerformanceDetailQuery.json', payload);
        const { name } = payload;
        yield put({ type: 'displayPerformanceModal', payload: true });
        const { unSubmitNickNameList = [], submitUserNum, unSubmitUserNum, performanceScoreStatistics, allUserNum, authorityResult = {} } = res.outputParameters;

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
    }
  },

  reducers: {
    setUserList(state, { payload }) {
      const { userList, userPaginator, userSearchParams } = payload;
      return { ...state, userList, userPaginator, userSearchParams };
    },
    setTeamList(state, { payload }) {
      const { teamList, teamPaginator, teamSearchParams } = payload;
      return { ...state, teamList, teamPaginator, teamSearchParams };
    },
    displayPerformanceModal(state, { payload }) {
      return {
        ...state,
        showPerformanceModal: payload,
        performanceDetail: payload ? state.performanceDetail : {}
      };
    },

    // 存储团队提交绩效的详情信息
    setTeamPerformanceDetail(state, { payload }) {
      return { ...state, performanceDetail: payload };
    }
  }
};
