[@elizaos/core v0.1.9](../index.md) / IMemoryManager

# Interface: IMemoryManager

## Properties

### runtime

> **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Defined in

[packages/core/src/types.ts:1159](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1159)

***

### tableName

> **tableName**: `string`

#### Defined in

[packages/core/src/types.ts:1160](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1160)

***

### constructor

> **constructor**: `Function`

#### Defined in

[packages/core/src/types.ts:1161](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1161)

## Methods

### addEmbeddingToMemory()

> **addEmbeddingToMemory**(`memory`): `Promise`\<[`Memory`](Memory.md)\>

#### Parameters

• **memory**: [`Memory`](Memory.md)

#### Returns

`Promise`\<[`Memory`](Memory.md)\>

#### Defined in

[packages/core/src/types.ts:1163](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1163)

***

### getMemories()

> **getMemories**(`opts`): `Promise`\<[`Memory`](Memory.md)[]\>

#### Parameters

• **opts**

• **opts.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **opts.count?**: `number`

• **opts.unique?**: `boolean`

• **opts.start?**: `number`

• **opts.end?**: `number`

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

#### Defined in

[packages/core/src/types.ts:1165](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1165)

***

### getCachedEmbeddings()

> **getCachedEmbeddings**(`content`): `Promise`\<`object`[]\>

#### Parameters

• **content**: `string`

#### Returns

`Promise`\<`object`[]\>

#### Defined in

[packages/core/src/types.ts:1173](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1173)

***

### getMemoryById()

> **getMemoryById**(`id`): `Promise`\<[`Memory`](Memory.md)\>

#### Parameters

• **id**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Memory`](Memory.md)\>

#### Defined in

[packages/core/src/types.ts:1177](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1177)

***

### getMemoriesByRoomIds()

> **getMemoriesByRoomIds**(`params`): `Promise`\<[`Memory`](Memory.md)[]\>

#### Parameters

• **params**

• **params.roomIds**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]

• **params.limit?**: `number`

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

#### Defined in

[packages/core/src/types.ts:1178](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1178)

***

### searchMemoriesByEmbedding()

> **searchMemoriesByEmbedding**(`embedding`, `opts`): `Promise`\<[`Memory`](Memory.md)[]\>

#### Parameters

• **embedding**: `number`[]

• **opts**

• **opts.match\_threshold?**: `number`

• **opts.count?**: `number`

• **opts.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **opts.unique?**: `boolean`

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

#### Defined in

[packages/core/src/types.ts:1182](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1182)

***

### createMemory()

> **createMemory**(`memory`, `unique`?): `Promise`\<`void`\>

#### Parameters

• **memory**: [`Memory`](Memory.md)

• **unique?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1192](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1192)

***

### removeMemory()

> **removeMemory**(`memoryId`): `Promise`\<`void`\>

#### Parameters

• **memoryId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1194](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1194)

***

### removeAllMemories()

> **removeAllMemories**(`roomId`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1196](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1196)

***

### countMemories()

> **countMemories**(`roomId`, `unique`?): `Promise`\<`number`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **unique?**: `boolean`

#### Returns

`Promise`\<`number`\>

#### Defined in

[packages/core/src/types.ts:1198](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1198)
