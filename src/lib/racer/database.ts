import { EN_PUNCTUATIONS, CN_PUNCTUATIONS, UNI_PUNCTUATIONS } from '../code';

export type DataValue = { code: string, line: number, collision: number }
export type Data = Map<string, DataValue>

// 每个词只保留一个编码的数据库
export class Database {

    public database: Data = new Map()
    public get(words:string){
        return this.database.get(words)
    }

    constructor(
        private readonly isJisu: boolean = false,
        selectKeys: string = "_;'456",
        private readonly commitLength: number = 4,
        // 比较同一个词的两种编码，是否采用新的编码？返回true则放弃老编码，采用新编码
    ) {
        this.selectKeysObj = Object.fromEntries([...selectKeys].map((v, i) => [v, i + 1]))

    }

    // 没有进入数据库，会返回 false
    public addByLength(words: string[], code: string, line: number): boolean {
        const newValue = this.preprocess(words, code, line)
        const wordsStr = words.join('')
        const rawValue = this.database.get(wordsStr)
        if (rawValue && rawValue.code.length && rawValue.code.length <= newValue.code.length) {
            return false
        }
        this.database.set(wordsStr, { ...newValue })
        return true
    }

    public addByLine(words: string[], code: string, line: number) {
        let newValue = this.preprocess(words, code, line)
        const wordsStr = words.join('')
        const rawValue = this.database.get(wordsStr)
        if (rawValue && rawValue.code.length && rawValue.line <= newValue.line) {
            return false
        }
        this.database.set(wordsStr, { ...newValue })
        return true
    }

    private preprocess(words: string[], code: string, line: number): DataValue {
        checkParams()
        this.injectPunctuations()
        this.addPrefixWords(words)

        let collision = 0
        if (this.isJisu) { // 极速本身有重码信息
            collision = this.getJisuCollision(code)
            // 删除多余的选重符号
            if (collision && code.length >= this.commitLength) {
                code = code.substring(0, code.length - 2)
            }
        } else { // 没有重码信息的，自己补充
            if (code.length < this.commitLength) {
                collision = this.getCollision(code)
            }
        }
        return { code, line, collision }

        function checkParams() {
            if (!words.length) {
                throw new TypeError(`第 ${line} 行的词条是空的`)
            }
            if (!code.length) {
                throw new TypeError(`第 ${line} 行的编码是空的`)
            }
        }
    }


    // 工具方法 码表里添加标点符号
    private injectPunctuations() {
        EN_PUNCTUATIONS.forEach((code, punc) => {
            this.database.set(punc, { code: code, line: 0, collision: 0 })
        })
        CN_PUNCTUATIONS.forEach((code, punc) => {
            this.database.set(punc, { code: code, line: 0, collision: 0 })
        })
        UNI_PUNCTUATIONS.forEach((code, punc) => {
            this.database.set(punc, { code: code, line: 0, collision: 0 })
        })
    }

    private usedCodes: Map<string, number> = new Map()
    // 获取重码位，注意，顶字上屏应该跳过本函数，极速赛码表不可用
    private getCollision(code: string) {
        let oldCollision = this.usedCodes.get(code)
        if (oldCollision) {
            oldCollision++
            this.usedCodes.set(code, oldCollision)
            return oldCollision
        } else {
            this.usedCodes.set(code, 1)
            return 1
        }
    }

    private selectKeysObj: { [k: string]: number }

    // 极速赛码表本身有选重信息了，直接拆出来，如果返回的结果不是0，请去除最后的字母 
    private getJisuCollision(code: string) {
        const lastKey = code[code.length - 1]
        if (lastKey ?? this.selectKeysObj[lastKey]) {
            return this.selectKeysObj[lastKey]
        }
        return 0
    }

    // 添加空穴的前缀词，编码为空就是空穴词
    private addPrefixWords(words: string[]) {
        if (words.length === 1) return;
        const prefix: string[] = []
        for (let i = 0; i < words.length - 1; i++) {
            prefix.push(words[i])
            if (this.database.has(prefix.join(''))) continue;
            this.database.set(prefix.join(''), { code: '', line: 0, collision: 0 })
        }
    }
}