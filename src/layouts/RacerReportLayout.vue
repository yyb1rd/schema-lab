<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="router.back()" title="返回设置页"/>
        <q-toolbar-title>
          <q-icon :name="fasHorseHead" />
          赛码器报告
        </q-toolbar-title>
      </q-toolbar>
      <q-tabs align="center" class="q-mr-xl" dense inline-label>
        <q-route-tab
          to="/racer/report/general"
          label="概要"
          replace
          icon="blur_on"
        />
        <q-route-tab
          to="/racer/report/speed"
          label="效率"
          replace
          icon="flash_on"
        />
        <q-route-tab
          to="/racer/report/feel"
          label="手感"
          replace
          icon="back_hand"
        />
      </q-tabs>
    </q-header>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { fasHorseHead } from '@quasar/extras/fontawesome-v6';
import { useRouter } from 'vue-router';
import { useMeta } from 'quasar';

const router = useRouter();
useMeta({
  title: '赛码器报告',
});
</script>
