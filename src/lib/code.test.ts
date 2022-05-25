import * as c from './code'
import {describe, it, expect} from 'vitest';

describe('编码验证', () => {
    it('常规', () => {
        expect(c.validate('abcd')).toBeTruthy()
    })
    it('中文不行', () => {
        expect(c.validate('我们')).toBeFalsy()
    })
    it('大写字母不行', () => {
        expect(c.validate('ABC')).toBeFalsy()
    })
    it('全角不行', () => {
        expect(c.validate('　１２３')).toBeFalsy()
    })
    it('多次shift', () => {
        expect(c.validate('↑↑')).toBeFalsy()
    })
    it('单次shift', () => {
        expect(c.validate('↑a')).toBeTruthy()
    })
})


