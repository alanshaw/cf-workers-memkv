import { KV } from 'cf-workers-kv'

export class MemKV extends KV {
  constructor () {
    super(new Map())
  }
}
