import { defineStore } from 'pinia';

export const useRacerStore = defineStore('racer', {
  state: () => ({
    schema: {
      name: '',
      content: [],
      format: 'jisu',
      commitLength: 4,
      singleMode: false,
    },
    secondarySchema: {
      name: '',
      content: [],
      format: 'jisu',
      commitLength: 4,
      singleMode: false,
    },
    article: {
      name: '',
      content: [],
    },
    global: {
      algorithm: 'order',
    },

  }),
  getters: {
  },
  actions: {
  },
});
