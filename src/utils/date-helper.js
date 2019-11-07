// const TIME_DAY = 24 * 60 * 60 * 1000;

/**
 * @description 返回服务器现在的时候
 * @returns
 */
const getNow = () => {
    var _date = new Date();
    if(CONFIG['timeDiff']) {
        _date.setTime(_date.valueOf() - CONFIG['timeDiff']);
    }
    return _date;
};

/**
 * 把 yyyy-mm-dd hh:mm:ss
 * yyyy-mm-dd
 * yyyy/mm/dd
 * 转成 Date 格式
 * @param {String} v 日期字符
 * @returns {Date} 时间
 */
const toDate = (v) => {
    return v ? new Date(Date.parse(v.replace(/-/g, '/'))) : null;
};

/**
 * 格式化时间
 *
 * @param {Date} _date 时间
 * @param {String} _format 格式 默认为 "yyyy-MM-dd hh:mm:ss";
 * @returns {String} 返回字符
 */
const format = (_date, _format) => {
    const _map = {
        'M+': _date.getMonth() + 1, //month
        'd+': _date.getDate(), //day
        'h+': _date.getHours(), //hour
        'm+': _date.getMinutes(), //minute
        's+': _date.getSeconds(), //second
        'q+': Math.floor((_date.getMonth() + 3) / 3), //quarter
        'S': _date.getMilliseconds() //millisecond
    };

    _format = _format || 'yyyy-MM-dd hh:mm:ss';

    if (/(y+)/.test(_format)) {
        _format = _format.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (let k in _map) {
        if (new RegExp('(' + k + ')').test(_format)) {
            _format = _format.replace(RegExp.$1, RegExp.$1.length === 1 ? _map[k] : ('00' + _map[k]).substr(('' + _map[k]).length));
        }
    }

    return _format;
};

const getSubjectTime = function (_dt) {
    if (typeof (_dt) !== 'string') {
        _dt = _dt.toString();
    }

    // var dayTime = _dt.split(' ')[0] + ' 00:00:00';

    // 如果不是日期类型
    if (!(_dt.getDate)) {
        _dt = this.toDate(_dt);
    }
    var _now = this.getNow(),

        _isThisYear = _now.getFullYear() === _dt.getFullYear(),
        _isToday = _now.getDate() === _dt.getDate(),
        _bt = _now.getTime() / 1e3 - _dt.getTime() / 1e3, // 差值
        _hour = _dt.getHours(),
        _min = _dt.getMinutes(),
        // _day = _dt.getDay(),
        _yesterdayBt = 86400 + _now.getHours() * 3600 + _now.getMinutes() * 60 + _now.getSeconds(),
        _rt = '';

    _hour = T.tool.zeropad(_hour, 2);
    _min = T.tool.zeropad(_min, 2);

    switch (!0) {
        case _bt < 60:
            _rt = Math.ceil(_bt) + '秒前';
            break;

        case _bt >= 60 && _bt < 3600:
            _rt = Math.ceil(_bt / 60) + '分钟前';
            break;

        case _bt >= 3600 && _bt < 86400:
            _rt = (_isToday ? (_hour + ':' + _min) : '昨天');
            break;

        case _bt >= 86400 && _bt <= _yesterdayBt:
            _rt = '昨天';
            break;

        case _bt >= _yesterdayBt && _isThisYear:
            _rt = (_dt.getMonth() + 1) + '月' + _dt.getDate() + '日';
            break;

        default:
            _rt = _dt.getFullYear() + '年' + (_dt.getMonth() + 1) + '月' + _dt.getDate() + '日';
            break;
    }
    return _rt;
};


export default {
    getNow,
    toDate,
    format,
    getSubjectTime,
};
