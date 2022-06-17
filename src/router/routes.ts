import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/racer',
    component: () => import('layouts/RacerLayout.vue'),
    children: [
      { path: '', component: () => import('pages/racer/OptionsPage.vue') },
      {
        path: 'report',
        component: () => import('layouts/RacerReportLayout.vue'),
        children: [
          { path: '', component: () => import('pages/racer/GeneralPage.vue') },
          { path: 'general', component: () => import('pages/racer/GeneralPage.vue') },
          { path: 'speed', component: () => import('pages/racer/GeneralPage.vue') },
          { path: 'feel', component: () => import('pages/racer/GeneralPage.vue') },
        ],
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
