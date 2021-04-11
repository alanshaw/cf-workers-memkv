# cf-workers-memkv

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
