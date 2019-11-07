const itemMin = 30; // 每块的时间（分钟）
const INTERVAL_STAMP = itemMin * 60 * 1000; // 间隔的秒数
const dayHours = 23; // 一天的总小时数
const countPerItem = 2; // 每个小时分隔块数
const interval = 1 / countPerItem; // 每块占用一个小时的占比
const countItem = dayHours / interval; // 总分隔块数

export { INTERVAL_STAMP, dayHours, countPerItem, interval, countItem, itemMin };
