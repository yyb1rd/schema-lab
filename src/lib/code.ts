// 编码只用到主键盘区里用不到shift的字母，数字，符号。还包括 空格键_ 和 shift 引导键，删除键
const ALL_KEYS = "0123456789abcdefghijklmnopqrstuvwxyz-=[];',./\\_↑←→↩"

const ALL_KEYS_SET = new Set(ALL_KEYS)
let ALL_KEYS_Array = [...ALL_KEYS]
let ALL_KEYS_DICT = Object.fromEntries(ALL_KEYS_Array.map((e, i) => [e, i]))

// 验证词条编码 是否都是有效的字母
function validate(code: string) {
    let shiftBefore = false
    for (let i = 0; i < code.length; i++) {
        if (!ALL_KEYS_SET.has(code[i])) {
            return false
        }
        if (code[i] === '↑') {
            if (shiftBefore) { // 连续两次 ↑
                return false
            }
            shiftBefore = true
        } else {
            shiftBefore = false
        }
    }
    return true
}

// 字母组成的编码转换成列表的索引号，不会检查编码是否合法
function encrypt(code: string) {
    return new Uint8Array([...code].map(e => ALL_KEYS_DICT[e]))
}

function decrypt(encryptedCode: Uint8Array) {
    let result: string[] = []
    encryptedCode.forEach(e => result.push(ALL_KEYS_Array[e]))
    return result.join('')
}

const UNI_PUNCTUATIONS = new Map([
    ["0", "0"],
    ["1", "1"],
    ["2", "2"],
    ["3", "3"],
    ["4", "4"],
    ["5", "5"],
    ["6", "6"],
    ["7", "7"],
    ["8", "8"],
    ["9", "9"],
    [" ", "_"],
    ["\n", "↩"],
    ["\t", "→"],

])

const EN_PUNCTUATIONS = new Map([
    ["!", "↑1"],
    ["\"", "↑'"],
    ["#", "↑3"],
    ["$", "↑4"],
    ["%", "↑5"],
    ["&", "↑7"],
    ["'", "'"],
    ["(", "↑9"],
    [")", "↑0"],
    ["*", "↑8"],
    ["+", "↑="],
    [",", ","],
    ["-", "-"],
    [".", "."],
    ["/", "/"],
    ["\\", "\\"],
    [":", "↑;"],
    [";", ";"],
    ["<", "↑,"],
    ["=", "="],
    [">", "↑."],
    ["?", "↑/"],
    ["@", "↑2"],
    ["A", "↑a"],
    ["B", "↑b"],
    ["C", "↑c"],
    ["D", "↑d"],
    ["E", "↑e"],
    ["F", "↑f"],
    ["G", "↑g"],
    ["H", "↑h"],
    ["I", "↑i"],
    ["J", "↑j"],
    ["K", "↑k"],
    ["L", "↑l"],
    ["M", "↑m"],
    ["N", "↑n"],
    ["O", "↑o"],
    ["P", "↑p"],
    ["Q", "↑q"],
    ["R", "↑r"],
    ["S", "↑s"],
    ["T", "↑t"],
    ["U", "↑u"],
    ["V", "↑v"],
    ["W", "↑w"],
    ["X", "↑x"],
    ["Y", "↑y"],
    ["Z", "↑z"],
    ["[", "["],
    ["]", "]"],
    ["^", "↑6"],
    ["_", "↑-"],
    ["`", "`"],
    ["a", "a"],
    ["b", "b"],
    ["c", "c"],
    ["d", "d"],
    ["e", "e"],
    ["f", "f"],
    ["g", "g"],
    ["h", "h"],
    ["i", "i"],
    ["j", "j"],
    ["k", "k"],
    ["l", "l"],
    ["m", "m"],
    ["n", "n"],
    ["o", "o"],
    ["p", "p"],
    ["q", "q"],
    ["r", "r"],
    ["s", "s"],
    ["t", "t"],
    ["u", "u"],
    ["v", "v"],
    ["w", "w"],
    ["x", "x"],
    ["y", "y"],
    ["z", "z"],
    ["{", "↑["],
    ["}", "↑]"],
    ["~", "↑`"],
])

const CN_PUNCTUATIONS = new Map([
    ["·", "`"],
    ["——", "↑-"],
    ["—", "↑-←"],
    ["‘", "'"],
    ["’", "'"],
    ["“", "↑'"],
    ["”", "↑'"],
    ["……", "↑6"],
    ["…", "↑6←"],
    ["、", "/"],
    ["。", "."],
    ["《", "↑,"],
    ["》", "↑."],
    ["【", "["],
    ["】", "]"],
    ["！", "↑1"],
    ["（", "↑9"],
    ["）", "↑0"],
    ["，", ","],
    ["：", "↑;"],
    ["；", ";"],
    ["？", "↑/"],
    ["￥", "↑4"],
])

export { ALL_KEYS_DICT, validate, encrypt, decrypt, EN_PUNCTUATIONS, CN_PUNCTUATIONS ,UNI_PUNCTUATIONS}

