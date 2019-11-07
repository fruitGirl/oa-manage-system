/*
 * @Description: 会议室-我的预定列表
 * @Author: danding
 * @Date: 2019-04-26 18:36:12
 * @Last Modified by: danding
 * @Last Modified time: 2019-04-29 09:44:43
 */

import React from 'react';
import 'styles/components/system/myMeetingRoomQuery/list.less';
import { EVEN_RESERVE } from 'constants/components/system/statusNav';

const { Pagination, Empty } = window.antd;

class List extends React.PureComponent {
  render() {
    const {
      list,
      onChange,
      activeNavVal,
      paginator = {},
      cancelReserve,
      endReserve,
    } = this.props;
    const { items } = paginator;

    return (
      <div>
        { list.length
          ? (
              <div>
                <div className="list clearfix">
                  {
                    list.map(i => {
                      let { name, location, gmtStart, gmtEnd, purpose, id } = i;

                      let gmtDate = gmtStart.slice(0, 11);
                      gmtDate = gmtDate.replace('-', "年");
                      gmtDate = gmtDate.replace('-', "月");
                      gmtDate = gmtDate.replace(' ', "日");

                      gmtEnd = gmtEnd.slice(0, 16);
                      gmtEnd = gmtEnd.slice(10);

                      let gmtTime = gmtStart.slice(0, 16);
                      gmtTime = gmtTime.slice(10);

                      const isStarting = new Date(gmtStart).getTime() <= Date.now();
                      const enable = activeNavVal === EVEN_RESERVE;

                      return (
                        <div className="pull-left list-item">
                          <p>
                            <span className="title">{name}（{location}）</span>
                            {
                              enable && isStarting
                              ? <span className="pending-status">进行中</span>
                              : null
                            }
                          </p>
                          <p className="time">时间：{gmtDate} {gmtTime} - {gmtEnd}</p>
                          <p className="usage" dangerouslySetInnerHTML={{ __html: `原因：${purpose}` }}></p>
                          { enable && !isStarting
                              ? (
                                  <a
                                    onClick={() => cancelReserve({ id })}
                                    className="operate"
                                    href="javascript:;"
                                  >取消预订</a>
                                )
                              : null
                          }
                          { enable && isStarting
                            ? (
                                <a
                                  onClick={() => endReserve({ id })}
                                  className="operate"
                                  href="javascript:;"
                                >结束会议</a>
                              )
                            : null
                          }
                        </div>
                      );
                    })
                  }
                </div>
                { ((activeNavVal !== EVEN_RESERVE) && items)
                  ? (
                    <div className="pagination">
                      <Pagination
                        showTotal={(total) => `总共${total}条`}
                        showQuickJumper
                        total={items}
                        onChange={onChange}
                      />
                    </div>
                  )
                  : null
                }
              </div>
            )
          : <div className="empty-wrapper"><Empty /></div>
        }
      </div>
    );
  }
}

export default List;
