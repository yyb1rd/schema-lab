import { Database, DataValue } from './database';
import { EN_PUNCTUATIONS, UNI_PUNCTUATIONS } from '../code';

export type ParticipleType = 'chinese' | 'english' | 'universal' | 'lack'
export type ParticipleResultItem = { words: string[], code: string, collision: number, type: ParticipleType }
export type ParticipleResult = ParticipleResultItem[]

export type Algorithm = {
    lack: number
    run(article: string[]): ParticipleResult
}

export class TrieTreeAlgorithm implements Algorithm {
    public lack: number = 0
    protected tempWords: string[] = []
    protected validWordsLength = 1
    protected article: string[] = []
    protected result: ParticipleResult = []

    constructor(public readonly database: Database) { }

    run(article: string[]): ParticipleResult {
        this.article = article
        for (let i = 0; i < article.length;) {
            i += this.pushFirstWords(i)
        }
        return this.result
    }

    protected pushFirstWords(startPosition: number): number {
        const firstCharacter = this.article[startPosition]
        if (this.isEnglishCharacter(firstCharacter)) {
            return this.pushFirstEnglishWords(startPosition)
        } else if (this.isUniversalCharacter(firstCharacter)) {
            return this.pushFirstUniversalPunc(startPosition)
        } else {
            return this.pushFirstChineseWords(startPosition)
        }
    }

    protected pushFirstUniversalPunc(startPosition: number) {
        this.tempWords.push(this.article[startPosition])
        for (let i = startPosition + 1; i < this.article.length; i++) {
            const ch = this.article[i];
            if (this.isUniversalCharacter(ch)) {
                this.tempWords.push(ch)
            } else { // 通用标点段结束
                const l = this.tempWords.length
                this.pushUniversalPunc()
                return l // 此时 i 处的字符不是英文
            }
        }
        this.pushUniversalPunc() 
        return this.article.length - startPosition
    }

    protected pushFirstEnglishWords(startPosition: number) {
        this.tempWords.push(this.article[startPosition])
        for (let i = startPosition + 1; i < this.article.length; i++) {
            const ch = this.article[i];
            if (this.isEnglishCharacter(ch) || this.isUniversalCharacter(ch)) {
                this.tempWords.push(ch)
            } else { // 英文字母段结束
                const l = this.tempWords.length
                this.pushEnglishWords()
                return l // 此时 i 处的字符不是英文
            }
        }
        this.pushEnglishWords() // 有可能到了结尾全是英文
        return this.article.length - startPosition
    }

    protected pushFirstChineseWords(startPosition: number): number {
        this.validWordsLength = 1
        for (let i = startPosition; i < this.article.length; i++) {
            const ch = this.article[i];
            if (this.isEnglishCharacter(ch)) {
                this.pushChineseWords()
                return this.validWordsLength
            }
            this.tempWords.push(ch)
            const getValue = this.database.get(this.tempWords.join(''))
            if (getValue) {
                // 找到的词条是个前缀空穴，有效长度不能变
                if (!getValue.code.length) continue;
                this.validWordsLength = this.tempWords.length
                continue
            } else if (this.tempWords.length === 1) {
                this.pushLack()
                return 1
            } else { // 匹配不到长词，只能找有效的前缀词
                this.pushChineseWords()
                return this.validWordsLength
            }
        }
        // 到结尾了还是空穴，那就提交有效
        this.pushChineseWords()
        return this.validWordsLength
    }

    protected pushLack() {
        this.lack++
        this.result.push({ words: [...this.tempWords], code: '', collision: 0, type: 'lack' })
        this.tempWords.length = 0
    }

    protected pushEnglishWords() {
        const code = this.tempWords.map(e => EN_PUNCTUATIONS.get(e) || UNI_PUNCTUATIONS.get(e) || '_').join('')
        this.result.push({ words: [...this.tempWords], code: code, collision: 0, type: 'english' })
        this.tempWords.length = 0
    }
    protected pushUniversalPunc() {
        const code = this.tempWords.map(e => UNI_PUNCTUATIONS.get(e) || '_').join('')
        this.result.push({ words: [...this.tempWords], code: code, collision: 0, type: 'universal' })
        this.tempWords.length = 0
    }

    protected pushChineseWords() {
        this.tempWords.length = this.validWordsLength
        const r = (this.database.get(this.tempWords.join('')) as DataValue)
        this.result.push({ words: [...this.tempWords], code: r.code, collision: r.collision, type: 'chinese' })
        this.tempWords.length = 0
    }

    protected isEnglishCharacter(ch: string) {
        return EN_PUNCTUATIONS.has(ch)
    }

    protected isUniversalCharacter(ch: string) {
        return UNI_PUNCTUATIONS.has(ch)
    }
}

export class LineFirstAlgorithm extends TrieTreeAlgorithm {
    constructor(public readonly database: Database) {
        super(database)
    }
    protected updateValidWordsLength(data: DataValue): void {
        if (!data.code.length) return; // 空穴词不理会
        if (data.line < this.validLine) { // 只在意最短码表的词
            const validString = this.tempWords.slice(0, this.validWordsLength).join('')
            const tempLine = (this.database.get(validString)?.line as number)
            this.validLine = tempLine
            this.validWordsLength = this.tempWords.length
        }
    }

    private validLine = Infinity
    protected pushFirstChineseWords(startPosition: number): number {
        this.validWordsLength = 1
        this.validLine = Infinity
        for (let i = startPosition; i < this.article.length; i++) {
            const ch = this.article[i];
            if (this.isEnglishCharacter(ch)) {
                this.pushChineseWords()
                return this.validWordsLength
            }
            this.tempWords.push(ch)
            const getValue = this.database.get(this.tempWords.join(''))
            if (getValue) {
                this.updateValidWordsLength(getValue)
                continue
            } else if (this.tempWords.length === 1) {
                this.pushLack()
                return 1
            } else { // 匹配不到长词，只能找有效的前缀词
                this.pushChineseWords()
                return this.validWordsLength
            }
        }
        // 到结尾了还是空穴，那就提交有效
        this.pushChineseWords()
        return this.validWordsLength
    }
}

