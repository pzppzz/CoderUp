export default [
  {
    path: '/',
    layout: false,
    routes: [
      {
        path: '/user',
        layout: false,
        routes: [
          {
            path: '/user/login',
            component: './user/Login'
          },
          {
            path: '/user/register',
            component: './user/Register'
          }, {
            component: './404'
          }
        ],
      },
      {
        path: '/op',
        access: "['canAdmin', 'canUser']",
        component: '../layouts/AdminLayout',
        wrappers: [
          '@/wrappers/auth',
        ],
        routes: [
          {
            path: '/op',
            exact: true,
            redirect: '/op/index'
          },
          {
            path: '/op/index',
            component: './admin/Index',
            access: 'canAdmin',
            wrappers: [
              '@/wrappers/auth',
            ],
          },
          {
            path: '/op/creator',
            redirect: '/op/creator/analysis'
          },
          {
            path: '/op/creator/analysis',
            component: './creator/Analysis'
          },
          {
            path: '/op/creator/edit',
            component: './creator/Write',
            routes: [
              // 新文章
              {
                path: './new'
              },
              // 修改文章
              {
                path: './:articleId',
              }
            ]
          },
          {
            path: '/op/creator/posts',
            component: './creator/Post'
          },
          {
            path: '/op/manage',
            redirect: '/op/manage/tag',
          },
          {
            path: '/op/manage/tag',
            component: './admin/Tag',
            access: 'canAdmin',
            wrappers: [
              '@/wrappers/auth',
            ],
          },
          {
            path: '/op/manage/user',
            component: './admin/User',
            access: 'canAdmin',
            wrappers: [
              '@/wrappers/auth',
            ],
          },
          {
            path: '/op/manage/article',
            component: './admin/Article',
            access: 'canAdmin',
            wrappers: [
              '@/wrappers/auth',
            ],
          },
          {
            path: '/op/account',
            redirect: '/op/account/settings'
          },
          {
            path: '/op/account/settings',
            component: './user/Settings'
          },
          {
            path: '/op/account/profile',
            component: './user/Profile'
          },
          {
            component: './404'
          }
        ]
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            exact: true,
            component: './Index',
          },
          {
            path: '/search',
            component: './Search',
          },
          {
            path: '/coder/:userId',
            component: './UserPage',
            routes: [
              {
                path: './',
                redirect: './posts',
              },
              {
                path: './posts',
                component: './UserPage/ListPage'
              },
              {
                path: './likes',
                component: './UserPage/ListPage'
              },
              {
                path: './collects',
                component: './UserPage/ListPage'
              },
              {
                path: './follows',
                component: './UserPage/ListPage'
              }
            ]
          },
          {
            path: '/post/:articleId',
            component: './PostDetail',
            exact: false,
          },
          {
            path: '/published',
            component: './Published'
          },
          {
            component: './404'
          }
        ]
      },
    ]
  }
];
