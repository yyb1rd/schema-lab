import { LoadSchemaFunction, DefaultSchema } from '../schemaTypes';
import { validate } from "../code";
import { splitAndTrim } from './utils';

const DUODUO_SIG = new Set('序类次辅用固')
const DUODUO_DICT_RULE_URL = 'http://chinput.vninv.com/docs/ddimegen/guifan_mabiaogeshi.htm'

export const loadDuoDuo: LoadSchemaFunction = (src) => {
    if (typeof src !== 'string') {
        throw new TypeError('载入的多多格式必须是 string 类型')
    }
    let linesList = splitAndTrim(src, '\n')
    let result: DefaultSchema = []
    for (let i = 0; i < linesList.length; i++) {
        if (isEmptyLine(i)) continue;
        let [words, code] = getEachLineEntry(i)
        let splittedCode = splitAndTrim(code, '#')
        validateSplittedCode(splittedCode, i)
        result.push({
            words,
            code: splittedCode[0],
            line: i
        })
    }
    return result

    function isEmptyLine(lineIndex: number) {
        return (linesList[lineIndex].trim().length) ? false : true
    }

    function getEachLineEntry(lineIndex: number) {
        let eachLine = splitAndTrim(linesList[lineIndex], '\t')
        if (eachLine.length !== 2) {
            throw new TypeError(`第 ${lineIndex + 1} 行有 ${eachLine.length} 列数据：${linesList[lineIndex]}`)
        }
        return eachLine
    }

    function validateSplittedCode(sc: string[], lineIndex: number) {
        if (!validate(sc[0])) {
            throw new TypeError(`第 ${lineIndex + 1} 行的编码用了非法字符作编码：${linesList[lineIndex]}`)
        }
        if (sc.length === 1) return;
        for (let i = 1; i < sc.length; i++) {
            if (!DUODUO_SIG.has([...sc[i]][0])) {
                throw new TypeError(`第 ${lineIndex + 1} 行的编码用了非法的多多码表标记：${linesList[lineIndex]}\n多多规范请见: ${DUODUO_DICT_RULE_URL}`)
            }
        }
    }

}