import { describe, it, expect } from 'vitest';
import { Database, DataValue } from './database';

describe('无容错的字典树', () => {
  it('正常', () => {
    const d = new Database();
    d.addByLine([...'我们'], 'aa', 1);
    d.addByLine([...'不'], 'aa', 3);
    d.addByLine([...'不'], 'b', 2);
    const r = (d.database.get('不') as DataValue);
    expect(r.code).toBe('b');
    expect(r.collision).toBe(1);
  });

  it('正常 最短编码', () => {
    const d = new Database();
    d.addByLength([...'我们'], 'b', 1);
    d.addByLength([...'不'], 'aa', 2);
    d.addByLength([...'不'], 'b', 3);
    const r = (d.database.get('不') as DataValue);
    expect(r.code).toBe('b');
    expect(r.collision).toBe(2);
  });

  it('正常 有空穴', () => {
    const d = new Database();
    d.addByLength([...'我们会'], 'abcb', 1);
    d.addByLength([...'我'], 'aa', 2);
    d.addByLength([...'会'], 'b', 3);
    const r = (d.database.get('我们') as DataValue);
    expect(r.code).toBe('');
    expect(r.collision).toBe(0);
  });
});
