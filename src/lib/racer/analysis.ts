// 由于分析的时候，多要懒计算，只能拆成一堆函数
import type { ParticipleResult, ParticipleResultItem } from './algorithms';
import { CN_PUNCTUATIONS } from '../code';

function insertArray<T>(a: T[], index: number, value: T, emptyValue: T) {
    if (index > a.length) {
        for (let i = a.length; i <= index; i++) {
            a.push(emptyValue)
        }
    }
    a[index] = value
}

export function words(r: ParticipleResult) {
    let commits = 0
        , characters = 0
        , totalCommits = 0
        , totalCharacters = 0
        , wordsDist: number[] = []
        , collision = 0
        ,
    for (let i = 0; i < r.length; i++) {
        const e = r[i]
        if (e.type === 'chinese') {
            totalCommits++
            totalCharacters += e.words.length
            if (e.words.length > 1) {
                commits += 1
                characters += e.words.length
            }
        }
    }
    return { commits, characters, dist }
}

