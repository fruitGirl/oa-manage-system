/*
 * @Description:
 * @Author: juyang
 * @Date: 2019-05-17 17:24:15
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-30 10:05:17
 */
import { WEEK_REPORT } from 'constants/workReport/statusNav';

const { message } = window.antd;

export default {
  namespace: 'userWeekReportForCommonQuery',

  state: {
    list: [],
    isLoading: true,
    selectedNavKey: WEEK_REPORT,
    userInfo: {},
    workReport: {},
    nowList: [],
    nextList: [],
    commitList: [], // 评论列表
    paginator: {}, // 评论分页
  },

  reducers: {
    updateLoadState(state, {payload}){
      return {...state, ...payload};

    },
    updateList(state, {payload}){
      return {...state, ...payload};
    },
    updateCommitList(state, { payload }) {
      return { ...state, ...payload };
    }
  },

  effects: {
    *getInfo({ payload }, { call, put }) {
      try {
        const data = yield call(T.get, '/workReport/userWorkReportQueryForCommon.json', payload);
        let { nowWorkReportContentList, nextWorkReportContentList } = data;

        // 过滤普通周报内容
        nowWorkReportContentList = nowWorkReportContentList.filter(i => i.moduleCode === 'WORK_CONTENT');
        nextWorkReportContentList = nextWorkReportContentList.filter(i => i.moduleCode === 'WORK_CONTENT');

        const nowList = [];
        const nextList = [];
        nowWorkReportContentList.forEach(item => {
          const supply = item.nowWorkReportContentSupplyList[0] || {
            expectedCompletionPercentage: -1,
            actualCompletionPercentage: -1
          };

          nowList.push({
            id:item.id,
            content:item.content,
            expectRate:supply.expectedCompletionPercentage,
            actualRate:supply.actualCompletionPercentage,
            memo: supply.memo
          });

        });

        nextWorkReportContentList.forEach(item => {
          const supply = item.nextWorkReportContentSupplyList[0] || {
            expectedCompletionPercentage: -1
          };

          nextList.push({
            id:item.id,
            content:item.content,
            expectRate:supply.expectedCompletionPercentage,
            memo: supply.memo
          });

        });

        const userInfo = data.user;
        const workReport = data.workReport;

        yield put({ type: 'updateList', payload: {
          nowList,
          nextList,
          userInfo: {
            nickName: userInfo.nickName,
            userId: userInfo.userId
          },
          workReport :{
            reportTime: workReport.reportTime,
            startTime: workReport.gmtStart,
            endTime: workReport.gmtEnd
          }
        }});

      } catch (err) {
        T.showErrorMessage(err);
      }
      yield put({type: 'updateLoadState', payload: {
        isLoading: false
      }});
    },
    *getCommitList({ payload }, { call, put }) {
      try {
        const data = yield call(
          T.get,
          '/workReport/workReportCommentsQuery.json',
          {
            objectId: CONFIG.pageData.workReportId,
            objectType: 'WEEK_REPORT_COMMON_TEMPLATE',
            ...payload
          }
        );
        const { queryResult, userIdAndLoginNameMap } = data;
        let { paginator, workReportCommentList = [], } = queryResult;
        workReportCommentList = workReportCommentList.map(i => {
          const commentUser = userIdAndLoginNameMap[i.commentUser];
          return { ...i, commentUser };
        });
        yield put({
          type: 'updateCommitList',
          payload: { paginator, commitList: workReportCommentList }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *submitCommit({ payload }, { call, put }) {
      try {
        const data = {
          content: T.return2Br(payload),
          objectId: CONFIG.pageData.workReportId,
          objectType: 'WEEK_REPORT_COMMON_TEMPLATE', // 普通模板
        };
        yield call(
          T.post,
          '/workReport/workReportCommentsCreate.json',
          data
        );
        message.success('评论成功');
        yield put({
          type: 'getCommitList',
          payload: { currentPage: 1 }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  }
};
