import config from './typeConfig';
const { Button } = window.antd;
export default ({ className, linkElement = 'a', type, title, desc, img, actions, ...rest }) => {
  const pageType = type in config ? type : 'normal';
  return (
    <div className="exception" {...rest}>
      <div className="imgBlock">
        <div className="imgEle" style={{ backgroundImage: `url(${img || config[pageType].img})` }} />
      </div>
      <div className="content">
        <h1>{title || config[pageType].title}</h1>
        <div className="desc">{desc || config[pageType].desc}</div>
        <div className="actions">
          {actions ||
            React.createElement(
              linkElement,
              {
                to: `${T['userPath']}/userLogin.htm`,
                href: `${T['userPath']}/userLogin.htm`
              },
              <Button type="primary">返回首页</Button>
            )}
        </div>
      </div>
    </div>
  );
};
