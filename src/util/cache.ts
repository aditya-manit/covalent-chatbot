const cache = require('memory-cache')

export const clean = (key: string) => {
    cache.put(key, JSON.stringify({}), 1000 * 60 * 60)
}
export const set = (key: string, data: any) => {
    const payload = { ...get(key), ...data }
    cache.put(key, JSON.stringify(payload), 1000 * 60 * 60)
}

export const get = (key: string) => {
    const data = cache.get(key)
    if (data)
        return JSON.parse(data)
    else return {}
}