type Key = { name: string; expiration?: number | undefined; metadata?: unknown; }

export class MemKV implements KVNamespace {
  private readonly data: Map<string, { value: string, metadata: any | null }>

  constructor () {
    this.data = new Map<string, { value: string, metadata: any | null }>()
  }

  get(key: string): KVValue<string>
  get(key: string, type: 'text'): KVValue<string>
  get<ExpectedValue = unknown>(key: string, type: 'json'): KVValue<ExpectedValue>
  get(key: string, type: 'arrayBuffer'): KVValue<ArrayBuffer>
  get(key: string, type: 'stream'): KVValue<ReadableStream<any>>
  async get(key: string, type?: 'text'|'json'|'arrayBuffer'|'stream'): KVValue<any> {
    const data = this.data.get(key)
    if (!data) return null
    const { value } = data
    type = type || 'text'
    if (type === 'text') return value
    if (type === 'json') return JSON.parse(value)
    throw new Error(`type not supported: ${type}`)
  }

  getWithMetadata<Metadata = unknown>(key: string): KVValueWithMetadata<string, Metadata>
  getWithMetadata<Metadata = unknown>(key: string, type: 'text'): KVValueWithMetadata<string, Metadata>
  getWithMetadata<ExpectedValue = unknown, Metadata = unknown>(key: string, type: 'json'): KVValueWithMetadata<ExpectedValue, Metadata>
  getWithMetadata<Metadata = unknown>(key: string, type: 'arrayBuffer'): KVValueWithMetadata<ArrayBuffer, Metadata>
  getWithMetadata<Metadata = unknown>(key: string, type: 'stream'): KVValueWithMetadata<ReadableStream<any>, Metadata>
  async getWithMetadata<Metadata = unknown> (key: string, type?: 'text'|'json'|'arrayBuffer'|'stream'): KVValueWithMetadata<any, Metadata> {
    const data = this.data.get(key)
    if (!data) return { value: null, metadata: null }
    const { value, metadata } = data
    type = type || 'text'
    if (type === 'text') return { value, metadata }
    if (type === 'json') return { value: JSON.parse(value), metadata }
    throw new Error(`type not supported: ${type}`)
  }

  async put (key: string, value: string | ArrayBuffer | ReadableStream<any> | FormData, options?: { expiration?: string | number | undefined; expirationTtl?: string | number | undefined; metadata?: any; }): Promise<void> {
    if (typeof value !== 'string') throw new Error('value type not supported')
    if (options != null && (options.expiration != null || options.expirationTtl != null)) {
      throw new Error('expiration and TTL not supported')
    }
    this.data.set(key, { value, metadata: options && options.metadata ? options.metadata : null })
  }

  async delete (key: string): Promise<void> {
    this.data.delete(key)
  }

  async list (options?: { prefix?: string | undefined; limit?: number | undefined; cursor?: string | undefined; }): Promise<{ keys: Key[]; list_complete: boolean; cursor?: string | undefined; }> {
    options = options || {}
    const prefix = options.prefix || ''
    const limit = options.limit == null ? 1000 : options.limit
    const skip = options.cursor ? parseInt(options.cursor) : 0
    let complete = true
    let i = 0
    const keys: Key[] = []
    for (const [k, v] of this.data.entries()) {
      if (i < skip) {
        i++
        continue
      }
      if (i >= skip + limit) {
        complete = false
        break
      }
      if (!prefix || k.startsWith(prefix)) {
        keys.push({ name: k, metadata: v.metadata })
      }
      i++
    }
    const cursor = complete ? undefined : `${i}`
    return { keys, list_complete: complete, cursor }
  }
}
