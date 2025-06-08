[@elizaos/core v0.1.9](../index.md) / ICacheManager

# Interface: ICacheManager

## Methods

### get()

> **get**\<`T`\>(`key`): `Promise`\<`T`\>

#### Type Parameters

• **T** = `unknown`

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`T`\>

#### Defined in

[packages/core/src/types.ts:1243](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1243)

***

### set()

> **set**\<`T`\>(`key`, `value`, `options`?): `Promise`\<`void`\>

#### Type Parameters

• **T**

#### Parameters

• **key**: `string`

• **value**: `T`

• **options?**: [`CacheOptions`](../type-aliases/CacheOptions.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1244](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1244)

***

### delete()

> **delete**(`key`): `Promise`\<`void`\>

#### Parameters

• **key**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1245](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1245)
