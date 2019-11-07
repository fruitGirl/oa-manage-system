/*
 * @Description: 周报-普通模板-尾部
 * @Author: danding
 * @Date: 2019-05-15 19:25:32
 * @Last Modified by: danding
 * @Last Modified time: 2019-05-16 20:47:23
 */

import Separate from 'components/common/Separate';
import 'styles/components/workReport/weekReportForCommonEdit/footer.less';

const { Button } = window.antd;

const Footer = ({ submit }) => {
  return (
    <div className="footer-btns">
      <div className="content">
        <Button onClick={submit} type="primary">提交</Button>
        <Separate isVertical={false} />
      </div>
    </div>
  );
};

export default Footer;
