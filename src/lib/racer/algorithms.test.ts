import { TrieTreeAlgorithm, LineFirstAlgorithm } from './algorithms';
import { Database } from './database';

import {describe, it, expect} from 'vitest';

describe('字典树', () => {
    it('正常', () => {
        let t = new Database()
        t.addByLength([...'我们'], 'aabb', 1)
        t.addByLength([...'是'], 'c', 2)
        t.addByLength([...'我'], 'a', 3)
        let a = new TrieTreeAlgorithm(t)
        let article = '我是我们的'
        let r = a.run([...article])
        expect(r).toEqual([
            {
                words: ['我'],
                code: 'a',
                collision: 1,
                type: 'chinese'
            },
            {
                words: ['是'],
                code: 'c',
                collision: 1,
                type: 'chinese'

            },
            {
                words: ['我', '们'],
                code: 'aabb',
                type: 'chinese',
                collision: 0,
            },
            {
                words: ['的'],
                code: '',
                type: 'lack',
                collision: 0,
            }
        ])
    })

    it('正常 带英文', () => {
        let t = new Database()
        t.addByLength([...'我们'], 'aabb', 1)
        t.addByLength([...'是'], 'c', 2)
        t.addByLength([...'我'], 'a', 3)
        let a = new TrieTreeAlgorithm(t)
        let article = '我是 I\'m ours 我们的'
        let r = a.run([...article])
        expect(r).toEqual([
            {
                words: ['我'],
                code: 'a',
                collision: 1,
                type: 'chinese',
            },
            {
                words: ['是'],
                code: 'c',
                collision: 1,
                type: 'chinese',
            },
            {
                words: [' '],
                code: '_',
                collision: 0,
                type: 'universal',
            },
            {
                words: [..."I'm ours "],
                code: "↑i'm_ours_",
                collision: 0,
                type: 'english',
            },
            {
                words: ['我', '们'],
                code: 'aabb',
                collision: 0,
                type: 'chinese'
            },
            {
                words: ['的'],
                code: '',
                collision: 0,
                type: 'lack',

            }
        ])
    })

    it('正常 空穴结尾', () => {
        let t = new Database()
        t.addByLength([...'我们的'], 'aabb', 1)
        t.addByLength([...'我'], 'a', 2)
        let a = new TrieTreeAlgorithm(t)
        let article = '我是我们'
        let r = a.run([...article])
        expect(r).toEqual([
            {
                words: ['我'],
                code: 'a',
                collision: 1,
                type: 'chinese',
            },
            {
                words: ['是'],
                code: '',
                collision: 0,
                type: 'lack',
            },
            {
                words: ['我'],
                code: 'a',
                collision: 1,
                type: 'chinese',
            },
            {
                words: ['们'],
                code: '',
                collision: 0,
                type: 'lack',
            }
        ])
    })
})

describe('码表顺序优先', () => {
    it('正常', () => {
        let t = new Database()

        t.addByLine([...'我'], 'a', 1)
        t.addByLine([...'们'], 'c', 2)
        t.addByLine([...'我们'], 'aabb', 3)
        let a = new LineFirstAlgorithm(t)
        let r = a.run([...'我们'])
        expect(r).toEqual([
            {
                words: ['我'],
                code: 'a',
                collision: 1,
                type: 'chinese',
            },
            {
                words: ['们'],
                code: 'c',
                collision: 1,
                type: 'chinese',
            }
        ])
    })
})