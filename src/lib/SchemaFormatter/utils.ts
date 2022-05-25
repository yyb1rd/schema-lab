export function splitAndTrim(src: string, seg: string) {
    let r = src.split(seg)
    for (let i = 0; i < r.length; i++) {
        r[i] = r[i].trim()
    }
    return r
}

