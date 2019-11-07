import React from 'react';
import HeaderSearch from 'components/layouts/HeaderSearch';
import SearchResult from 'components/layouts/SearchResult';

const  { zh_CN , Layout, Menu, Icon, Dropdown, Badge, ConfigProvider } = window.antd;

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const applayImgUrl = T.getImg('appImg/wait_apply_icon.png');
const informImgUrl = T.getImg('appImg/inform_icon.png');
const noticeImgUrl = T.getImg('appImg/notice_icon.png');
const HOME_INDEX = 'homeIndex'; // 首页的主键

let cancel;
class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: (CONFIG.showSidebar === false) ? true : false, // 侧边栏是否收起状态
      activeIndex: CONFIG.topMainMenu || HOME_INDEX,
      siderMenuData: {},
      bntShow: false,
      msgImgArr: [applayImgUrl, informImgUrl, noticeImgUrl],
      msgName: ['审批', '抄送', '通知'],
      msgQueryArr: [],
      oldMsgQueryArr: [],
      msgTatoal: null, //未读消息的个数
      hideMessge: true, //一开始不让消息显示接口没有请求之前
      changeStyle: true,
      avatarColor: '#9090e6',
      searchResultList: [],
      searchResultLoading: false,
      showSearchResult: false,
      openKeys: (CONFIG.showSidebar && CONFIG.openKeys)
        ? [CONFIG.openKeys]
        : []
    };
  }

  componentDidMount() {
    this.getSystemData();
    this.getMsgNoticeQuery();
    this.time = setInterval(() => {
      this.getMsgNoticeQuery();
    }, 5000);
    const colorArray = ['#9090e6', '#5fccd6', '#ff8a73'];
    const index = Math.ceil(Math.random() * 3);
    this.setState({
      avatarColor: colorArray[index]
    });
    window.history.replaceState(null, '', window.location.pathname + window.location.search); //去掉链接后面的#
  }

  //一进来请求一遍接口是系统的
  getSystemData = (index = 1) => {
    const params = {
      topMenuId: CONFIG.topMainMenu || index
    };
    // 如果是流程菜单
    if (CONFIG.topMainMenu === CONFIG.processTopMenuId) {
      this.setState({ bntShow: true });
    }
    // 获取侧边栏导航数据
    this.getSiderMenuData(params);
  };

  getDate = (params, isAutoJumpUrl) => {
    T.get(`${CONFIG['frontPath']}/system/menuQuery.json`, params)
      .then((data) => {
        sessionStorage.setItem([`topMainMenu${params.topMenuId}`], JSON.stringify(data));
        let { mainMenuList } = data;
        const curOpenKey = (mainMenuList && mainMenuList[0])
          ? mainMenuList[0].id
          : [];
        const openKeys = CONFIG.showSidebar
          ? [...new Set(this.state.openKeys.concat(curOpenKey))]
          : [];
          if (isAutoJumpUrl) {
            this.redirectFirstUrl(data);
            return;
          } else {
            this.setState({ siderMenuData: data, openKeys: openKeys });
          }
      })
      .catch((err) => {
        T.showError(err);
      });
  };
  // 获取侧边栏缓存数据
  getSiderMenuData = (params, isAutoJumpUrl) => {
    let siderMenuData = sessionStorage.getItem([`topMainMenu${params.topMenuId}`]);
    siderMenuData = JSON.parse(siderMenuData);
    if (siderMenuData) {
      if (isAutoJumpUrl) {
        this.redirectFirstUrl(siderMenuData);
        return;
      }
      let { mainMenuList } = siderMenuData;
      const curOpenKey = (mainMenuList && mainMenuList[0])
        ? mainMenuList[0].id
        : [];
      const openKeys = CONFIG.showSidebar ? [...new Set(this.state.openKeys.concat(curOpenKey))] : [];
      this.setState({ siderMenuData: siderMenuData, openKeys: openKeys });
    } else {
      this.getDate(params, isAutoJumpUrl);
    }
  };

  // 点击顶部菜单，跳转侧边栏首个页面
  redirectFirstUrl = (data) => {
    try {
      let { mainMenuList = [], mainMenuIdAndSortMenuMap = {} } = data;
      if (mainMenuList && mainMenuList[0]) {
        const sliderMenus = mainMenuIdAndSortMenuMap[mainMenuList[0].id];
        if (sliderMenus && sliderMenus.length) {
          const isHideMenu = sliderMenus[0].sortMenuAuthority === "INDEX_DATA";
          const jumpUrl = isHideMenu
            ? (sliderMenus[1] && sliderMenus[1].sortMenuHref)
            : sliderMenus[0].sortMenuHref;
          window.location.href = window.location.origin + jumpUrl;
        }
      }
    } catch (err) {
      // console.log('err=', err)
    }
  }

  //请求消息的接口(5秒轮训一次)
  getMsgNoticeQuery = () => {
    const url = `${T['processPath']}/messageNoticeQuery.json`;

    if (cancel) {
      cancel();
    }
    T.get(url, {}, false, (c) => {
      cancel = c;
    })
      .then((data) => {
        const acssCodeAndNewCoutMap = data['accessCodeAndNewCountMap'];
        let msgQueryArr = [];
        let oldMsgQueryArr = this.state.oldMsgQueryArr;

        msgQueryArr[0] = acssCodeAndNewCoutMap['APPROVING'] ? acssCodeAndNewCoutMap['APPROVING'] : 0; // 审批
        msgQueryArr[1] = acssCodeAndNewCoutMap['CARBON_COPY'] ? acssCodeAndNewCoutMap['CARBON_COPY'] : 0; // 抄送
        msgQueryArr[2] = acssCodeAndNewCoutMap['NOTICE'] ? acssCodeAndNewCoutMap['NOTICE'] : 0; // 通知
        // 比较数据是否有变化
        const isChange = this.isChange({ nowData: msgQueryArr, oldData: oldMsgQueryArr });
        // 第一次请求并且数据发生变化的时候
        if (oldMsgQueryArr.length === 0 || isChange) {
          oldMsgQueryArr[0] = msgQueryArr[0];
          oldMsgQueryArr[1] = msgQueryArr[1];
          // oldMsgQueryArr[2] = msgQueryArr[2];
          oldMsgQueryArr[2] = msgQueryArr[2];
          const sum = msgQueryArr[0] + msgQueryArr[1] + msgQueryArr[2];
          this.setState({
            msgQueryArr,
            oldMsgQueryArr,
            msgTatoal: sum,
            hideMessge: false
          });
        }
      })
      .catch((err) => {
        clearInterval(this.time);
      });
  };

  // 比较数据是否有变化
  isChange = (options) => {
    const { nowData, oldData } = options;
    let isChange = false;
    nowData.forEach((item, index) => {
      if (item !== oldData[index]) {
        isChange = true;
      }
    });
    return isChange;
  };
  //请求侧边栏的接口
  getSliderData = ({ key }) => {
    this.setState({
      activeIndex: key
    });
    const params = {
      topMenuId: key
    };

    this.setState({ bntShow: CONFIG.processTopMenuId === key });
    // 获取侧边栏导航数据
    this.getSiderMenuData(params, true);
  };

  // 收起侧边栏
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      changeStyle: !this.state.changeStyle
    });
  };

  //刷新权限
  refresAuthority = () => {
    const url = `${T['userPath']}/refreshAuthority.json`;
    T.get(url)
      .then((data) => {
        // 要清楚缓存
        sessionStorage.clear();
        window.location.reload();
      })
      .catch((err) => {
        T.showError(err);
      });
  };

  // 创建侧边栏菜单
  creatSiderMenu = () => {
    const data = this.state.siderMenuData;
    const { mainMenuList = [], mainMenuIdAndSortMenuMap = {} } = data;
    return mainMenuList.map((item) => {
      const arr = item.mainMenuLogo.split('/');
      const classArr = arr[2].split('.');
      const mainIdAndSortMenuItem = mainMenuIdAndSortMenuMap[item.id];
      const menuItem = mainIdAndSortMenuItem.map((item, i) => {
        const cls = item.sortMenuAuthority === 'INDEX_DATA' ? 'hide' : '';
        const array = item.sortMenuHref.replace('.htm', '').split('/');
        const len = array.length;
        const keyValue = array[len - 1];
        const hrefUrl = `${CONFIG['frontPath']}${item.sortMenuHref}`;

        return (
          <Menu.Item key={keyValue} className={cls}>
            <a href={hrefUrl}>{item.sortMenuName}</a>
          </Menu.Item>
        );
      });

      return (
        <SubMenu
          key={item.id}
          title={
            <span>
              <img src={`${T.getImg(`${arr[2]}`)}`} className={`anticon ${classArr[0]}`} alt="" />
              <img src={`${T.getImg(`${classArr[0]}_hover.png`)}`} className={`anticon ${classArr[0]}_hover`} alt="" />
              <span>{item.mainMenuName}</span>
            </span>
          }
        >
          {menuItem}
        </SubMenu>
      );
    });
  };
  // 创建消息的下拉
  creatMessageDropdown = () => {
    const menu = this.state.msgImgArr.map((item, index) => {
      const msgItemArr = [];
      msgItemArr.push('APPROVING', 'CARBON_COPY', 'NOTICE');
      const textArr = ['等待您的审批', '有抄送您的审批', '您的审批已被处理'];
      const indexMsg = msgItemArr[index];
      const hrefUrl = `${T['processPath']}${CONFIG.urlMap[indexMsg]}`;
      const itemMsgCount = this.state.msgQueryArr[index];
      const menuMsg = (
        <Menu.Item key={index}>
          <a rel="noopener noreferrer" href={hrefUrl}>
            <img className="v_middle" src={item} alt="" />
            <span className="message_text">
              [{this.state.msgName[index]}]{textArr[index]}
            </span>
            <Badge count={itemMsgCount} />
          </a>
        </Menu.Item>
      );
      return menuMsg;
    });
    return <Menu>{menu}</Menu>;
  };

  async onSearch (value) {
    this.setState({
      searchResultList: [],
      searchResultLoading: true
    });
    try {
      const res = await T.post('/user/userPersonalHomePageQuery.json', { user: value });
      const { userList, deptIdAndCompanyNameDeptName, userIdAndDeptIdMap } = res;
      const list = userList
        ? userList.map(i => {
            const descArr = deptIdAndCompanyNameDeptName[userIdAndDeptIdMap[i.userId]];
            const descStr = descArr.split('-');
            return { ...i, department: descStr[1], company: descStr[0] };
          })
        : [];
      this.setState({
        searchResultList: list,
        searchResultLoading: false,
        showSearchResult: true
      });
    } catch (err) {
      T.showError(err);
      this.setState({
        searchResultLoading: false
      });
    }
  }

  hideSearchResult = () => {
    this.setState({
      showSearchResult: false
    });
  }

  onOpenChange = (openKeys) => {
    this.setState({ openKeys });
  }

  render() {
    const { activeIndex, msgTatoal, hideMessge, bntShow, searchResultList, searchResultLoading, showSearchResult, msgQueryArr, } = this.state;
    const defaultOpenKeys = (CONFIG.showSidebar && CONFIG.openKeys)
      ? [CONFIG.openKeys]
      : [];

    const menu = (
      <Menu>
        <Menu.Item>
          <a href="javascript:;" onClick={this.refresAuthority} className="text-default">
            刷新权限
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            rel="noopener noreferrer"
            className="text-default"
            href={`${CONFIG.frontPath}/user/changeLoginPassword.htm`}
          >
            修改密码
          </a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" className="text-default" href={`${CONFIG.frontPath}/user/logout.htm`}>
            退出
          </a>
        </Menu.Item>
      </Menu>
    );

    return (

    <ConfigProvider locale={zh_CN}>
      <Layout className="layout J-layout">
        <Sider trigger={null} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="sider-top clearfix">
            <a href="/index.htm" className="logo">
              <img className="logo-img" src={`${T.getImg('user/logo.png')}`} alt="我们是传奇" />
              {this.state.collapsed ? null : <img className="logo-name" src={`${T.getImg('user/logo_name.png')}`} alt="我们是传奇" />}
            </a>
            <Icon className="trigger" type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
          </div>
          {!this.state.collapsed ? (
            <a href={`${T['processPath']}/processStartInit.htm`} className={bntShow === true ? 'send_apply' : 'hide'}>
              <Icon type="plus" />
              发起申请
            </a>
          ) : (
            <a
              href={`${T['processPath']}/processStartInit.htm`}
              className={bntShow === true ? 'send_apply change_send' : 'hide'}
            >
              <Icon type="plus" />
            </a>
          )}
          <Menu
            defaultSelectedKeys={[CONFIG.selectedKeys]}
            defaultOpenKeys={defaultOpenKeys}
            onOpenChange={this.onOpenChange}
            mode="inline"
            theme="dark"
          >
            {this.creatSiderMenu()}
          </Menu>
          {/* </div> */}
        </Sider>
        <Layout>
          <Header className="layout-header">
            <Menu
              className="layout-menu pull-left"
              theme="light"
              mode="horizontal"
              onClick={({ key }) => this.getSliderData({ key })}
              selectedKeys={[activeIndex]}
            >
              {CONFIG.headerMenuData.map((item) => {
                return <Menu.Item key={item['id']}>{item['name']}</Menu.Item>;
              })}
            </Menu>

            <div className="nav_right">
              <a href="/index.htm" className={`home-link ${activeIndex === HOME_INDEX ? 'selected' : ''}`}>首页</a>
              <HeaderSearch onPressEnter={this.onSearch.bind(this) } />
              <Dropdown className="i_block" overlay={this.creatMessageDropdown()} placement="bottomCenter">
                <div className="message_box">
                  <i className="message_icon" />
                  {hideMessge ? '' : <Badge className="mail-badge" count={msgTatoal} />}
                  <span className="hide J-APPROVING">{msgQueryArr[0]}</span>
                  <span className="hide J-HANDLING">{msgQueryArr[2]}</span>
                </div>
              </Dropdown>

              <Dropdown className="i_block" overlay={menu} placement="bottomRight">
                <div>
                  <img className="login_headerImg i_block" src={`/user/userLogoQuery.resource?userId=${CONFIG.userId}`} alt="头像"/>
                  <span className="J-nickname login_name i_block">{CONFIG.username}</span>
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content className="layout-content-wrapper">
            <div className="main">
              <div className="main-body">{this.props.children}</div>
            </div>
          </Content>
          <SearchResult
            hideModal={this.hideSearchResult}
            visible={showSearchResult}
            list={searchResultList}
            pageLoading={searchResultLoading}
          />
        </Layout>
      </Layout>
      </ConfigProvider>
    );
  }
}
export default BasicLayout;
