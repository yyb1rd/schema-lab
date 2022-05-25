export interface SchemaOptions {
    src?: string  // 原始文件
    srcFormat?: string  // 原始文件的码表格式
    name?: string // 方案名称
    author?: string // 作者
    description?: string // 方案简介
    selectKeys?: string  // 选重键
    commitLength?: number // 上屏码长
}

// 数组的每个元素包含：词语，编码，行数，辅助信息
export type DefaultSchema = {
    words: string,
    code: string,
    line: number,
    meta?: {
        freq?: number, // 词频
        fixed ?: boolean, // 固顶
        class ?: number, // 码表分类
        [etc: string]: unknown
    }
}[]

// 字符串或二进制码表数据转成默认的格式
export interface LoadSchemaFunction {
    (src: string | Blob): DefaultSchema
}

// 默认码表数据 转回 字符串或特定的二进制数据
export interface DumpSchemaFunction {
    (src: DefaultSchema): string | Blob
}

// 方案包含码表数据和配置参数
export interface Schema {
    dict: DefaultSchema,
    options?: SchemaOptions
}
