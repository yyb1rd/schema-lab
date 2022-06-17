<template>
  <q-card style="min-width: 20em; ">
    <q-card-section>
      <div class="column q-gutter-md">
        <div class="text-h6 col">{{ p.title }}</div>
        <q-select
        filled
          class="col"
          v-model="srcopt"
          label="数据来源"
          :options="srcOptions"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-icon :name="scope.opt.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption>{{ scope.opt.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="col column" v-if="(srcopt as any)?.value === 'open'">
          <q-file
            class="col"
            label="点此打开本地文件"
            v-model="file"
            bottom-slots
          >
            <template #before> <q-icon name="folder_open" /></template>
            <template #hint>必须是 utf-8 编码的纯文本</template>
          </q-file>
        </div>
        <div class="col" v-else-if="(srcopt as any)?.value === 'clipboard'">
          <q-btn
            outline
            color="primary"
            label="读取剪切板"
            @click="readClipboard"
          />
          <div v-show="content" class="q-mt-sm text-grey-6">
            已读取「{{[...content].slice(0,8).join('')}}……」 共 {{[...content].length}} 字
          </div>
        </div>
        <div class="col" v-else-if="(srcopt as any)?.value === 'textarea'">
          <q-input
            outlined
            v-model="content"
            type="textarea"
            :label="p.dictMode ? '码表内容' : '赛文内容'"
          />
        </div>
        <div v-else-if="(srcopt as any)?.value  === 'preset'">
          <q-select
            v-model="presetOpt"
            label="选择预置赛文"
            :options="[
              '冰灯',
              '心的出口',
              '心情决定事情',
              '常用字 1~1500',
              '常用字 1~500',
              '常用字 500~1000',
              '常用字 1000~1500',
            ]"
          />
        </div>
        <div v-if="(srcopt as any)?.value && content">
          <div class="column q-gutter-md">
            <q-input
            outlined
              class="col"
              :label="p.dictMode ? '码表名称' : '赛文名称'"
              v-model="name"
            />
            <div class="col" v-if="p.dictMode">
              <div class="column q-gutter-md">
                <q-select
                  class="col"
                  v-model="dictFormat"
                  label="码表格式"
                  :options="dictFormats"
                  options-dense
                />
                <q-input
                  class="col"
                  type="number"
                  v-model.number="commitLength"
                  label="顶屏码长"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn :disable="!(showComfirmBtn)"
      label="确定" class="text-primary"
      @click="confirm"
      color="primary"
       />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts" setup>
import {
  onMounted, ref, watch, watchEffect,
} from 'vue';

const p = defineProps({
  nullable: {
    type: Boolean,
    default: false,
  },

  title: String,

  dictMode: {
    type: Boolean,
    default: false,
  },

  presetOptions: {
    type: Object,
    require: false,
  },
});
const e = defineEmits<{(e:'result', value:{
name:string,
content:string[],
commitLength?:number,
format?:string,
}):void}>();

const dictFormats = [
  {
    label: '极速赛码表',
    value: 'jisu',
  },
  {
    label: 'Rime / 多多',
    value: 'rime',
  },
  {
    label: '小小 / 极点',
    value: 'yong',
  },
];

const srcOptions = [
  // {
  //   label: '无',
  //   value: 'null',
  //   description: '不设置本项',
  //   icon: 'remove_circle',
  // },

  {
    label: '文件',
    value: 'open',
    description: '打开本地的赛文文件',
    icon: 'file_open',
  },
  {
    label: '系统剪切板',
    value: 'clipboard',
    description: '一键读取剪切板，性能好',
    icon: 'file_copy',
  },
  {
    label: '粘贴',
    value: 'textarea',
    description: '手动填写，可能会卡顿',
    icon: 'text_snippet',
  },
  // {
  //   label: '预置',
  //   value: 'preset',
  //   description: '预装的7则文章',
  //   icon: 'settings_system_daydream',
  // },
];
const srcopt = ref(null);
const presetOpt = ref(null);
const file = ref<File | null>(null);
const name = ref('');
const content = ref('');
const dictFormat = ref(dictFormats[0]);
const commitLength = ref(4);
const showComfirmBtn = ref(false);

watch([name, content], () => {
  if (name.value.length && content.value.length) {
    showComfirmBtn.value = true;
  } else {
    showComfirmBtn.value = false;
  }
});

watchEffect(async () => {
  if (file.value) {
    content.value = await file.value.text();
    const tn = file.value.name;
    const lastDotIndex = tn.lastIndexOf('.');
    if (lastDotIndex !== -1 && lastDotIndex !== 0) {
      name.value = tn.substring(0, lastDotIndex);
    } else {
      name.value = tn;
    }
  }
});

function shiftOptions() {
  if (p.nullable) {
    srcOptions.shift();
  }
}

onMounted(() => {
  shiftOptions();
});

function readClipboard() {
  (async () => {
    const text = await navigator.clipboard.readText();
    content.value = text;
  })();
}

function confirm() {
  if (p.dictMode) {
    e('result', {
      name: name.value,
      content: [...content.value],
      format: dictFormat.value.value as string,
      commitLength: commitLength.value,
    });
  } else {
    e('result', {
      name: name.value,
      content: [...content.value],
    });
  }
}
</script>
