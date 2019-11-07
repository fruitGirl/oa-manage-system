const config = {
  403: {
    img: T.getImg('appImg/403.svg'),
    title: '403',
    desc: '抱歉，你无权访问该页面'
  },
  404: {
    img: T.getImg('appImg/404.svg'),
    title: '404',
    desc: '抱歉，你访问的页面不存在'
  },
  500: {
    img: T.getImg('appImg/500.svg'),
    title: '500',
    desc: '抱歉，服务器出错了'
  },
  normal: {
    img: T.getImg('appImg/500.svg'),
    title: 'error',
    desc: '抱歉，页面出现了错误'
  }
};

export default config;
