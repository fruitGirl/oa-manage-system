const { message } = window.antd;

export default {
  namespace: 'weekReportForManageQuery',

  state: {
    nextWeekList: [], // 下周工作要点列表
    projectAnalyse: {}, // 项目复盘
    teamThinking: {}, // 团队思考
    projectPlan: {}, // 项目计划
    fileList: [], // 图片
    user: {}, // 用户信息
    workReport: {}, // 周报信息
    commitList: [], // 评论列表
    paginator: {}, // 评论分页
  },

  effects: {
    *getInfo({ payload }, { call, put }) {
      try {
        const data = yield call(T.get, '/workReport/userWorkReportQueryForManage.json', payload);
        let {
          nextWorkReportContentList,
          nowWorkReportContentList,
          user = {},
          workReport,
          imageList,
          userList
        } = data;
        let projectAnalyse = {};
        let teamThinking = {};
        let projectPlan = {};
        let fileList = [];

        nowWorkReportContentList.forEach(i => {
          const { moduleCode } = i;
          switch (moduleCode) {
            case 'PROJECT_ANALYSE': { // 项目复盘
              projectAnalyse = i;
              break;
            }
            case 'TEAM_THINKING': { // 团队思考
              teamThinking = i;
              break;
            }
            default:
              break;
          }
        });

        nextWorkReportContentList.forEach(i => {
          const { moduleCode } = i;
          switch (moduleCode) {
            case 'PROJECT_PLAN': { // 项目计划
              projectPlan = i;
              break;
            }
            default:
              break;
          }
        });

        // 执行要点
        nextWorkReportContentList = nextWorkReportContentList.filter(i => {
          return i.moduleCode === 'EXECUTE_POINT';
        });

        // 转换用户id类型为string
        nextWorkReportContentList = nextWorkReportContentList.map(i => {
          let { userId } = i;
          userId = userId || [];
          let userNames = userId.map(j => {
            const matchItem = userList.find(k => k.userId === j);
            return matchItem.nickName;
          });
          userNames = userNames.join('，');
          return {
            ...i,
            userNames
          };
        });

        fileList = imageList.map(i => {
          const { resourceId } = i;
          return  `/workReport/workReportImage.resource?resourceId=${resourceId}`;
        });

        yield put({
          type: 'initInfo',
          payload: {
            nextWeekList: nextWorkReportContentList,
            projectAnalyse,
            teamThinking,
            projectPlan,
            fileList,
            user,
            workReport
          }
        });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *getCommitList({ payload }, { call, put }) {
      try {
        const data = yield call(
          T.get,
          '/workReport/workReportCommentsQuery.json',
          {
            objectId: CONFIG.pageData.workReportId,
            objectType: 'WEEK_REPORT_MANAGE_TEMPLATE',
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
          objectType: 'WEEK_REPORT_MANAGE_TEMPLATE', // 普通模板
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
  },

  reducers: {
    initInfo(state, action) {
      return { ...state, ...action.payload };
    },
    updateCommitList(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
