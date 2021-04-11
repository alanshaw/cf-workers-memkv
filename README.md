# cf-workers-memkv

[![Build Status](https://travis-ci.org/alanshaw/cf-workers-memkv.svg?branch=main)](https://travis-ci.org/alanshaw/cf-workers-memkv)
[![dependencies Status](https://status.david-dm.org/gh/alanshaw/cf-workers-memkv.svg)](https://david-dm.org/alanshaw/cf-workers-memkv)

In memory Cloudflare workers KV store for testing.

## Install

```sh
npm install cf-workers-memkv
```

## Usage

```js
import { MemKV } from 'cf-workers-memkv'

const fruits = new MemKV()

const key = 'apple:grannysmith'
const value = { name: 'Granny Smith', type: 'apple', color: 'green' }
const metadata = { name: 'Granny Smith' }

await fruits.put(key, JSON.stringify(value), { metadata })

const apple = await fruits.get(key, 'json')
console.log(apple) // { name: 'Granny Smith', type: 'apple', color: 'green' }

const apples = await fruits.list({ prefix: 'apple:' })
console.log(apples) // { keys: [{ name: 'apple:grannysmith', metadata: { name: 'Granny Smith' } }], list_complete: true }

await fruits.delete(key)
```

## API

See [Cloudflare Workers Runtime API docs](https://developers.cloudflare.com/workers/runtime-apis/kv).

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/cf-workers-memkv/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
