import { describe, it, expect } from 'vitest';
import * as dd from './DuoDuo';

describe('转换多多格式', () => {
  it('正确', () => {
    const d = dd.loadDuoDuo(`
        上	e
        地	tm#固
        `);
    expect(d[0]).toMatchObject({ words: '上', code: 'e', line: 1 });
    expect(d[1]).toMatchObject({ words: '地', code: 'tm', line: 2 });
  });
});
