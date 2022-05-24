// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'es-ES',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  define: {
    REACT_APP_API_URL: 'http://localhost:3001',
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      icon: 'dashboard',
      path: '/dashboard/analysis',
      component: './dashboard/analysis',
    },
    {
      path: '/go-out',
      name: 'go-out',
      icon: 'car',
      path: '/got-out',
      component: './vehicleExit',
    },
    {
      path: '/payment-record',
      name: 'payment-record',
      icon: 'creditCard',
      path: '/payment-record',
    },
    {
      name: 'report',
      icon: 'file',
      path: '/report',
      routes: [
        {
          name: 'debts',
          path: '/report/debts',
        },
        {
          name: 'incomes',
          path: '/report/incomes',
        },
      ]
    },
    {
      name: 'managment',
      icon: 'setting',
      path: '/managment',
      routes: [
        {
          name: 'carriers',
          path: '/managment/carriers',
          component: './managment/carriers',
        },
        {
          name: 'vehicles',
          path: '/managment/vehicles',
          component: './managment/vehicles',
        },
        {
          name: 'services',
          path: '/managment/services',
          component: './managment/services',
        },
      ]
    },
    {
      name: 'account',
      icon: 'user',
      path: '/account',
      routes: [
        // {
        //   name: 'center',
        //   icon: 'smile',
        //   path: '/account/center',
        //   component: './account/center',
        // },
        {
          name: 'settings',
          icon: 'smile',
          path: '/account/settings',
          component: './account/settings',
        },
      ],
    },
    {
      path: '/',
      redirect: '/dashboard/analysis',
    },
    {
      component: '404',
    },
  ],
  access: {},
  theme: {
    'root-entry-name': 'variable',
  },
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh
  fastRefresh: {},
  // openAPI: [
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
  //     schemaPath: join(__dirname, 'oneapi.json'),
  //     mock: false,
  //   },
  //   {
  //     requestLibPath: "import { request } from 'umi'",
  //     schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
  //     projectName: 'swagger',
  //   },
  // ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
