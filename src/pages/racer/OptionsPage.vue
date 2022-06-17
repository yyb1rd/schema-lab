<template>
  <q-page padding class="row justify-center">
    <div class="col-xs-12 col-sm-8 col-lg-4">
      <q-list>
        <q-item clickable @click="showDict = !showDict">
          <q-item-section avatar><q-icon name="summarize" /></q-item-section>
          <q-item-section>
            <q-item-label>码表</q-item-label>
            <q-item-label caption> {{ dictHint }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-dialog v-model="showDict">
          <get-data title="设置码表" dict-mode @result="getDict" />
        </q-dialog>

        <q-item clickable @click="showSecendaryDict = !showSecendaryDict">
          <q-item-section avatar><q-icon name="summarize" /></q-item-section>
          <q-item-section>
            <q-item-label>副码表</q-item-label>
            <q-item-label caption>{{ secondaryDictHint }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-dialog v-model="showSecendaryDict">
          <get-data title="设置副码表" dict-mode @result="getSecondaryDict" />
        </q-dialog>

        <q-item clickable @click="showArticle = !showArticle">
          <q-item-section avatar><q-icon name="subject" /></q-item-section>
          <q-item-section>
            <q-item-label>赛文</q-item-label>
            <q-item-label caption>{{ articleHint }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-dialog v-model="showArticle">
          <get-data title="设置赛文" @result="getArticle" />
        </q-dialog>

        <q-item>
          <q-item-section>
            <q-select
              label="算法"
              :options="['贪婪', '码表顺序', '最短码长']"
              options-dense
              v-model="algorithm" /></q-item-section
        ></q-item>
        <q-item class="q-mb-sm">
          <q-space /><q-btn
              label="计算"
              color="accent"
              align="center"
              @click="commit"
            /> </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GetData from 'components/GetData.vue';
import { useRacerStore } from 'stores/racer';
import { useRouter } from 'vue-router';

const algorithm = ref('码表顺序');
const showDict = ref(false);
const dictHint = ref('未设置');
const showSecendaryDict = ref(false);
const secondaryDictHint = ref('未设置');
const showArticle = ref(false);
const articleHint = ref('未设置');
const store = useRacerStore();

function getDict(result: any) {
  showDict.value = false;
  store.schema.name = result.name;
  store.schema.commitLength = result.commitLength;
  store.schema.format = result.format;
  store.schema.content = result.content;
  dictHint.value = result.name;
}
function getSecondaryDict(result: any) {
  showSecendaryDict.value = false;
  store.secondarySchema.name = result.name;
  store.secondarySchema.commitLength = result.commitLength;
  store.secondarySchema.format = result.format;
  store.secondarySchema.content = result.content;
  secondaryDictHint.value = result.name;
}

function getArticle(result: any) {
  showArticle.value = false;
  store.article.name = result.name;
  store.article.content = result.content;
  articleHint.value = result.name;
}

const router = useRouter();

function commit() {
  router.push('/racer/report');
}
</script>
<style scoped></style>
