[@elizaos/core v0.1.9](../index.md) / IAgentRuntime

# Interface: IAgentRuntime

## Properties

### agentId

> **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Properties

#### Defined in

[packages/core/src/types.ts:1272](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1272)

***

### serverUrl

> **serverUrl**: `string`

#### Defined in

[packages/core/src/types.ts:1273](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1273)

***

### databaseAdapter

> **databaseAdapter**: [`IDatabaseAdapter`](IDatabaseAdapter.md)

#### Defined in

[packages/core/src/types.ts:1274](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1274)

***

### token

> **token**: `string`

#### Defined in

[packages/core/src/types.ts:1275](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1275)

***

### modelProvider

> **modelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

[packages/core/src/types.ts:1276](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1276)

***

### imageModelProvider

> **imageModelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

[packages/core/src/types.ts:1277](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1277)

***

### imageVisionModelProvider

> **imageVisionModelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

[packages/core/src/types.ts:1278](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1278)

***

### character

> **character**: [`Character`](../type-aliases/Character.md)

#### Defined in

[packages/core/src/types.ts:1279](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1279)

***

### providers

> **providers**: [`Provider`](Provider.md)[]

#### Defined in

[packages/core/src/types.ts:1280](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1280)

***

### actions

> **actions**: [`Action`](Action.md)[]

#### Defined in

[packages/core/src/types.ts:1281](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1281)

***

### evaluators

> **evaluators**: [`Evaluator`](Evaluator.md)[]

#### Defined in

[packages/core/src/types.ts:1282](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1282)

***

### plugins

> **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]

#### Defined in

[packages/core/src/types.ts:1283](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1283)

***

### fetch()?

> `optional` **fetch**: (`input`, `init`?) => `Promise`\<`Response`\>(`input`, `init`?) => `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

#### Parameters

• **input**: `RequestInfo` \| `URL`

• **init?**: `RequestInit`

#### Returns

`Promise`\<`Response`\>

#### Parameters

• **input**: `string` \| `Request` \| `URL`

• **init?**: `RequestInit`

#### Returns

`Promise`\<`Response`\>

#### Defined in

[packages/core/src/types.ts:1285](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1285)

***

### messageManager

> **messageManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1287](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1287)

***

### descriptionManager

> **descriptionManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1288](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1288)

***

### documentsManager

> **documentsManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1289](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1289)

***

### knowledgeManager

> **knowledgeManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1290](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1290)

***

### ragKnowledgeManager

> **ragKnowledgeManager**: [`IRAGKnowledgeManager`](IRAGKnowledgeManager.md)

#### Defined in

[packages/core/src/types.ts:1291](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1291)

***

### loreManager

> **loreManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1292](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1292)

***

### cacheManager

> **cacheManager**: [`ICacheManager`](ICacheManager.md)

#### Defined in

[packages/core/src/types.ts:1294](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1294)

***

### services

> **services**: `Map`\<[`ServiceType`](../enumerations/ServiceType.md), [`Service`](../classes/Service.md)\>

#### Defined in

[packages/core/src/types.ts:1296](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1296)

***

### clients

> **clients**: `Record`\<`string`, `any`\>

any could be EventEmitter
but I think the real solution is forthcoming as a base client interface

#### Defined in

[packages/core/src/types.ts:1299](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1299)

***

### verifiableInferenceAdapter?

> `optional` **verifiableInferenceAdapter**: [`IVerifiableInferenceAdapter`](IVerifiableInferenceAdapter.md)

#### Defined in

[packages/core/src/types.ts:1301](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1301)

## Methods

### initialize()

> **initialize**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1303](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1303)

***

### registerMemoryManager()

> **registerMemoryManager**(`manager`): `void`

#### Parameters

• **manager**: [`IMemoryManager`](IMemoryManager.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1305](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1305)

***

### getMemoryManager()

> **getMemoryManager**(`name`): [`IMemoryManager`](IMemoryManager.md)

#### Parameters

• **name**: `string`

#### Returns

[`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1307](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1307)

***

### getService()

> **getService**\<`T`\>(`service`): `T`

#### Type Parameters

• **T** *extends* [`Service`](../classes/Service.md)

#### Parameters

• **service**: [`ServiceType`](../enumerations/ServiceType.md)

#### Returns

`T`

#### Defined in

[packages/core/src/types.ts:1309](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1309)

***

### registerService()

> **registerService**(`service`): `void`

#### Parameters

• **service**: [`Service`](../classes/Service.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1311](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1311)

***

### getSetting()

> **getSetting**(`key`): `string`

#### Parameters

• **key**: `string`

#### Returns

`string`

#### Defined in

[packages/core/src/types.ts:1313](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1313)

***

### getConversationLength()

> **getConversationLength**(): `number`

Methods

#### Returns

`number`

#### Defined in

[packages/core/src/types.ts:1316](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1316)

***

### processActions()

> **processActions**(`message`, `responses`, `state`?, `callback`?): `Promise`\<`void`\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **responses**: [`Memory`](Memory.md)[]

• **state?**: [`State`](State.md)

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1318](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1318)

***

### evaluate()

> **evaluate**(`message`, `state`?, `didRespond`?, `callback`?): `Promise`\<`string`[]\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **state?**: [`State`](State.md)

• **didRespond?**: `boolean`

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[packages/core/src/types.ts:1325](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1325)

***

### ensureParticipantExists()

> **ensureParticipantExists**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1332](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1332)

***

### ensureUserExists()

> **ensureUserExists**(`userId`, `userName`, `name`, `source`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userName**: `string`

• **name**: `string`

• **source**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1334](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1334)

***

### registerAction()

> **registerAction**(`action`): `void`

#### Parameters

• **action**: [`Action`](Action.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1341](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1341)

***

### ensureConnection()

> **ensureConnection**(`userId`, `roomId`, `userName`?, `userScreenName`?, `source`?): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userName?**: `string`

• **userScreenName?**: `string`

• **source?**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1343](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1343)

***

### ensureParticipantInRoom()

> **ensureParticipantInRoom**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1351](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1351)

***

### ensureRoomExists()

> **ensureRoomExists**(`roomId`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1353](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1353)

***

### composeState()

> **composeState**(`message`, `additionalKeys`?): `Promise`\<[`State`](State.md)\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **additionalKeys?**

#### Returns

`Promise`\<[`State`](State.md)\>

#### Defined in

[packages/core/src/types.ts:1355](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1355)

***

### updateRecentMessageState()

> **updateRecentMessageState**(`state`): `Promise`\<[`State`](State.md)\>

#### Parameters

• **state**: [`State`](State.md)

#### Returns

`Promise`\<[`State`](State.md)\>

#### Defined in

[packages/core/src/types.ts:1360](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1360)
