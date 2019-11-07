/*
 * @Description: 周报-普通模板
 * @Author: danding
 * @Date: 2019-05-15 19:22:20
 * @Last Modified by: moran
 * @Last Modified time: 2019-08-09 16:03:42
 */

import cloneDeep from 'lodash.clonedeep';

import { delay } from 'dva/saga';

const { message } = window.antd;

// 初始化三条本周空白行
const INIT_CUR_LIST = [
  { key: "cur_week_key_1" },
  { key: "cur_week_key_2" },
  { key: "cur_week_key_3" }
];

// 初始化三条下周空白行
const INIT_NEXT_LIST = [
  { key: "next_week_key_1" },
  { key: "next_week_key_2" },
  { key: "next_week_key_3" }
];

export default {
  namespace: 'weekReportForCommonEdit',

  state: {
    currentWeekList: INIT_CUR_LIST, // 当前周数据
    nextWeekList: INIT_NEXT_LIST, // 下周数据
  },

  effects: {
    *saveCurrentItem({ payload }, { call, put, select }) {
      try {
        let { content = '', memo = '', actualCompletionPercentage, expectedCompletionPercentage } = payload;
        payload.actualCompletionPercentage = actualCompletionPercentage === ''
          ? undefined
          : actualCompletionPercentage;
        payload.expectedCompletionPercentage = expectedCompletionPercentage === ''
          ? undefined
          : expectedCompletionPercentage;
        content = content && T.return2Br(content);
        memo = memo && T.return2Br(memo);
        const data = yield call(T.post, '/workReport/workReportNowContentTimeSave.json', {
          ...payload,
          content,
          memo
        });

        // 更新id值（新增）
        let { id, supplyId, } = payload;
        const { operateResult } = data || {};
        id = id || (operateResult && operateResult.id);
        supplyId = supplyId || (operateResult && operateResult.supplyId);

        // 编辑实际进度，回填下周计划
        if (
          (payload.editField === 'actualCompletionPercentage')
          && (payload.actualCompletionPercentage !== 100)
          && (!payload.isHandleAdded)
        ) {
          const addNextItem = {
            moduleCode: 'WORK_CONTENT',
            workReportId: payload.workReportId,
            content: payload.content,
            key: `next_week_key_${Date.now()}`,
            isAutoAdd: true, // 是否是回填数据
          };

          yield put({
            type: 'saveNextItem',
            payload: addNextItem
          });

          payload.isHandleAdded = true; // 是否已经回填过数据
        }

        delete payload.editField;

        // 更新列表
        let { currentWeekList } = yield select(state => state.weekReportForCommonEdit);
        currentWeekList = cloneDeep(currentWeekList);
        const matchIdx = currentWeekList.findIndex(i => i.key === payload.key);
        currentWeekList[matchIdx] = { ...payload, id, supplyId };

        yield put({
          type: 'updateCurrentList',
          payload: currentWeekList
        });
      } catch (err) {
        T.showErrorMessage(err);

        // 重置数据
        let { currentWeekList } = yield select(state => state.weekReportForCommonEdit);
        yield put({
          type: 'updateCurrentList',
          payload: currentWeekList
        });
      }
    },
    *deleteCurrentItem({ payload }, { call, put, select }) {
      try {
        // 删除意义行数据
        if (payload.contentId) {
          yield call(T.post, '/workReport/workReportContentDelete.json', payload);
        }

         // 删除行，更新列表
         let { currentWeekList } = yield select(state => state.weekReportForCommonEdit);
         currentWeekList = cloneDeep(currentWeekList);
         const matchIdx = currentWeekList.findIndex(i => i.key === payload.key);
         currentWeekList.splice(matchIdx, 1);

         yield put({
            type: 'updateCurrentList',
            payload: currentWeekList
         });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *saveNextItem({ payload }, { call, put, select }) {
      try {
        let { content = '', memo = '', expectedCompletionPercentage } = payload;
        memo = memo && T.return2Br(memo);
        content = content && T.return2Br(content);

        payload.expectedCompletionPercentage = expectedCompletionPercentage === ''
          ? undefined
          : expectedCompletionPercentage;

        const data = yield call(T.post, '/workReport/workReportNextContentTimeSave.json', { ...payload, content, memo });

        // 更新id值（新增）
        let { id, supplyId, } = payload;
        const { operateResult } = data || {};
        id = id || (operateResult && operateResult.id);
        supplyId = supplyId || (operateResult && operateResult.supplyId);

        // 更新列表
        let { nextWeekList } = yield select(state => state.weekReportForCommonEdit);
        nextWeekList = cloneDeep(nextWeekList);
        if (payload.isAutoAdd) { // 回填数据
          delete payload.isAutoAdd;
          nextWeekList.unshift({
            ...payload,
            id,
            supplyId,
         });
        } else { // 修改数据
          const matchIdx = nextWeekList.findIndex(i => i.key === payload.key);
          nextWeekList[matchIdx] = { ...payload, id, supplyId };
        }

        yield put({
          type: 'updateNextList',
          payload: nextWeekList
        });
      } catch (err) {
        T.showErrorMessage(err);

        // 重置数据
        let { nextWeekList } = yield select(state => state.weekReportForCommonEdit);
        yield put({
          type: 'updateNextList',
          payload: nextWeekList
        });
      }
    },
    *deleteNextItem({ payload }, { call, put, select }) {
      try {
        // 删除意义行数据
        if (payload.contentId) {
          yield call(T.post, '/workReport/workReportContentDelete.json', payload);
        }

         // 删除行，更新列表
         let { nextWeekList } = yield select(state => state.weekReportForCommonEdit);
         nextWeekList = cloneDeep(nextWeekList);
         const matchIdx = nextWeekList.findIndex(i => i.key === payload.key);
         nextWeekList.splice(matchIdx, 1);

         yield put({
            type: 'updateNextList',
            payload: nextWeekList
         });
      } catch (err) {
        T.showErrorMessage(err);
      }
    },
    *submitPage({ payload }, { call, select, }) {
      try {
        const { currentWeekList, nextWeekList } = yield select(state => state.weekReportForCommonEdit);
        if (!currentWeekList || !nextWeekList) {
          message.warn('请填写本周内容和下周计划');
          return;
        }

        const hasCurrentList = currentWeekList.some(i => i.id);
        if (!hasCurrentList) {
          message.warn('请填写本周内容');
          return;
        }

        const hasNextList = nextWeekList.some(i => i.id);
        if (!hasNextList) {
          message.warn('请填写下周计划');
          return;
        }

        yield call(T.post, '/workReport/workReportSubmit.json', payload);
        message.success("提交成功");
        yield delay(500);
        T.tool.redirectTo('/workReport/myWorkReportQuery.htm');
      } catch (err) {
        T.showErrorMessage(err);
      }
    }
  },

  reducers: {
    addCurrentItem(state) {
      const currentWeekList = cloneDeep(state.currentWeekList);
      currentWeekList.push({
        key: `cur_week_key_${Date.now()}`, // 主键
      });
      return { ...state, currentWeekList };
    },
    addNextItem(state) {
      const nextWeekList = cloneDeep(state.nextWeekList);
      nextWeekList.push({
        key: `next_week_key_${Date.now()}`
      });
      return { ...state, nextWeekList };
    },
    updateCurrentList(state, { payload }) {
      return { ...state, currentWeekList: payload };
    },
    updateNextList(state, { payload }) {
      return { ...state, nextWeekList: payload };
    },
    initList(state, { payload }) {
      let { currentWeekList, nextWeekList, } = payload;
      currentWeekList = currentWeekList.filter(i => {
        return i.moduleCode === 'WORK_CONTENT';
      });
      nextWeekList = nextWeekList.filter(i => {
        return i.moduleCode === 'WORK_CONTENT';
      });

      // 本周计划
      currentWeekList = currentWeekList.map((i, idx) => {
        // 字符串转换成数字
        let { expectedCompletionPercentage, actualCompletionPercentage, content = '', memo = '' } = i;
        expectedCompletionPercentage = expectedCompletionPercentage === '0'
          ? undefined
          : expectedCompletionPercentage;
        expectedCompletionPercentage = expectedCompletionPercentage
          ? Number(expectedCompletionPercentage)
          : undefined;

        actualCompletionPercentage = actualCompletionPercentage === '0'
          ? undefined
          : actualCompletionPercentage;
        actualCompletionPercentage = actualCompletionPercentage
          ? Number(actualCompletionPercentage)
          : undefined;
        return {
          ...i,
          expectedCompletionPercentage,
          actualCompletionPercentage,
          key: `cur_week_key_${idx}`,
          content: T.return2n(T.escape2Html(content)),
          memo: T.return2n(T.escape2Html(memo))
        };
      });
      currentWeekList = currentWeekList.length
        ? currentWeekList
        : INIT_CUR_LIST;

      // 下周计划
      nextWeekList = nextWeekList.map((i, idx) => {
        let { expectedCompletionPercentage, content = '', memo = '' } = i;
        expectedCompletionPercentage = expectedCompletionPercentage === '0'
          ? undefined
          : expectedCompletionPercentage;
        expectedCompletionPercentage = expectedCompletionPercentage
        ? Number(expectedCompletionPercentage)
        : undefined;
        return {
          ...i,
          expectedCompletionPercentage,
          key: `next_week_key_${idx}`,
          content: T.return2n(T.escape2Html(content)),
          memo: T.return2n(T.escape2Html(memo))
        };
      });
      nextWeekList = nextWeekList.length
        ? nextWeekList
        : INIT_NEXT_LIST;
      return { ...state, nextWeekList, currentWeekList };
    }
  }
};
