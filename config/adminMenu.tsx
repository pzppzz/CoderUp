import { BarsOutlined, EditOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons'
export const adminMenuList = [
  {
    path: '/op/index',
    name: '首页',
    icon: <HomeOutlined />
  },
  /** 创作中心页 */
  {
    path: '/op/creator',
    name: '创作中心',
    icon: <EditOutlined />,
    routes: [
      {
        path: '/op/creator/analysis',
        name: '数据分析'
      },
      {
        path: '/op/creator/edit/new',
        layout: 'top',
        name: '写文章',
        rep: true
      }, {
        path: '/op/creator/edit/:articleId',
        layout: 'top',
        menuRender: false
      },
      {
        path: '/op/creator/posts?status=1',
        name: '我的文章'
      }
    ]
  },
  /** 管理页 */
  {
    path: '/op/manage',
    name: '管理',
    auth: 'canAdmin',
    icon: <BarsOutlined />,
    routes: [
      {
        path: '/op/manage/tag',
        name: '标签管理',
      }, {
        path: '/op/manage/user',
        name: '用户管理',
      }, {
        path: '/op/manage/article',
        name: '文章管理',
      }
    ]
  },
  {
    path: '/op/account',
    name: '个人中心',
    icon: <UserOutlined />,
    routes: [
      {
        path: '/op/account/settings',
        name: '账号设置'
      },
      {
        path: '/op/account/profile',
        name: '个人资料'
      }
    ]
  },
]