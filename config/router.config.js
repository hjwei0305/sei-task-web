export default [
  {
    path: '/user',
    title: '用户登录',
    component: '../layouts/LoginLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { title: '登录', path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    title: '业务页面',
    routes: [
      { path: '/', redirect: '/dashboard' },
      { title: 'dashboard', path: '/dashboard', component: './Dashboard' },
      { title: '后台作业', path: '/job', component: './Job' },
    ],
  },
];
