[@elizaos/core v0.1.9](../index.md) / IDatabaseAdapter

# Interface: IDatabaseAdapter

Interface for database operations

## Properties

### db

> **db**: `any`

Database instance

#### Defined in

[packages/core/src/types.ts:971](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L971)

## Methods

### init()

> **init**(): `Promise`\<`void`\>

Optional initialization

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:974](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L974)

***

### close()

> **close**(): `Promise`\<`void`\>

Close database connection

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:977](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L977)

***

### getAccountById()

> **getAccountById**(`userId`): `Promise`\<[`Account`](Account.md)\>

Get account by ID

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Account`](Account.md)\>

#### Defined in

[packages/core/src/types.ts:980](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L980)

***

### createAccount()

> **createAccount**(`account`): `Promise`\<`boolean`\>

Create new account

#### Parameters

• **account**: [`Account`](Account.md)

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/core/src/types.ts:983](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L983)

***

### getMemories()

> **getMemories**(`params`): `Promise`\<[`Memory`](Memory.md)[]\>

Get memories matching criteria

#### Parameters

• **params**

• **params.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.count?**: `number`

• **params.unique?**: `boolean`

• **params.tableName**: `string`

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.start?**: `number`

• **params.end?**: `number`

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

#### Defined in

[packages/core/src/types.ts:986](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L986)

***

### getMemoryById()

> **getMemoryById**(`id`): `Promise`\<[`Memory`](Memory.md)\>

#### Parameters

• **id**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Memory`](Memory.md)\>

#### Defined in

[packages/core/src/types.ts:996](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L996)

***

### getMemoriesByIds()

> **getMemoriesByIds**(`ids`, `tableName`?): `Promise`\<[`Memory`](Memory.md)[]\>

#### Parameters

• **ids**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]

• **tableName?**: `string`

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

#### Defined in

[packages/core/src/types.ts:998](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L998)

***

### getMemoriesByRoomIds()

> **getMemoriesByRoomIds**(`params`): `Promise`\<[`Memory`](Memory.md)[]\>

#### Parameters

• **params**

• **params.tableName**: `string`

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.roomIds**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]

• **params.limit?**: `number`

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

#### Defined in

[packages/core/src/types.ts:1000](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1000)

***

### getCachedEmbeddings()

> **getCachedEmbeddings**(`params`): `Promise`\<`object`[]\>

#### Parameters

• **params**

• **params.query\_table\_name**: `string`

• **params.query\_threshold**: `number`

• **params.query\_input**: `string`

• **params.query\_field\_name**: `string`

• **params.query\_field\_sub\_name**: `string`

• **params.query\_match\_count**: `number`

#### Returns

`Promise`\<`object`[]\>

#### Defined in

[packages/core/src/types.ts:1007](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1007)

***

### log()

> **log**(`params`): `Promise`\<`void`\>

#### Parameters

• **params**

• **params.body**

• **params.userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.type**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1016](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1016)

***

### getActorDetails()

> **getActorDetails**(`params`): `Promise`\<[`Actor`](Actor.md)[]\>

#### Parameters

• **params**

• **params.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Actor`](Actor.md)[]\>

#### Defined in

[packages/core/src/types.ts:1023](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1023)

***

### searchMemories()

> **searchMemories**(`params`): `Promise`\<[`Memory`](Memory.md)[]\>

#### Parameters

• **params**

• **params.tableName**: `string`

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.embedding**: `number`[]

• **params.match\_threshold**: `number`

• **params.match\_count**: `number`

• **params.unique**: `boolean`

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

#### Defined in

[packages/core/src/types.ts:1025](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1025)

***

### updateGoalStatus()

> **updateGoalStatus**(`params`): `Promise`\<`void`\>

#### Parameters

• **params**

• **params.goalId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.status**: [`GoalStatus`](../enumerations/GoalStatus.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1035](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1035)

***

### searchMemoriesByEmbedding()

> **searchMemoriesByEmbedding**(`embedding`, `params`): `Promise`\<[`Memory`](Memory.md)[]\>

#### Parameters

• **embedding**: `number`[]

• **params**

• **params.match\_threshold?**: `number`

• **params.count?**: `number`

• **params.roomId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.agentId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.unique?**: `boolean`

• **params.tableName**: `string`

#### Returns

`Promise`\<[`Memory`](Memory.md)[]\>

#### Defined in

[packages/core/src/types.ts:1040](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1040)

***

### createMemory()

> **createMemory**(`memory`, `tableName`, `unique`?): `Promise`\<`void`\>

#### Parameters

• **memory**: [`Memory`](Memory.md)

• **tableName**: `string`

• **unique?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1052](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1052)

***

### removeMemory()

> **removeMemory**(`memoryId`, `tableName`): `Promise`\<`void`\>

#### Parameters

• **memoryId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **tableName**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1058](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1058)

***

### removeAllMemories()

> **removeAllMemories**(`roomId`, `tableName`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **tableName**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1060](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1060)

***

### countMemories()

> **countMemories**(`roomId`, `unique`?, `tableName`?): `Promise`\<`number`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **unique?**: `boolean`

• **tableName?**: `string`

#### Returns

`Promise`\<`number`\>

#### Defined in

[packages/core/src/types.ts:1062](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1062)

***

### getGoals()

> **getGoals**(`params`): `Promise`\<[`Goal`](Goal.md)[]\>

#### Parameters

• **params**

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.userId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.onlyInProgress?**: `boolean`

• **params.count?**: `number`

#### Returns

`Promise`\<[`Goal`](Goal.md)[]\>

#### Defined in

[packages/core/src/types.ts:1068](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1068)

***

### updateGoal()

> **updateGoal**(`goal`): `Promise`\<`void`\>

#### Parameters

• **goal**: [`Goal`](Goal.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1076](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1076)

***

### createGoal()

> **createGoal**(`goal`): `Promise`\<`void`\>

#### Parameters

• **goal**: [`Goal`](Goal.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1078](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1078)

***

### removeGoal()

> **removeGoal**(`goalId`): `Promise`\<`void`\>

#### Parameters

• **goalId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1080](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1080)

***

### removeAllGoals()

> **removeAllGoals**(`roomId`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1082](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1082)

***

### getRoom()

> **getRoom**(`roomId`): `Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`\>

#### Defined in

[packages/core/src/types.ts:1084](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1084)

***

### createRoom()

> **createRoom**(`roomId`?): `Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`\>

#### Parameters

• **roomId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`\>

#### Defined in

[packages/core/src/types.ts:1086](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1086)

***

### removeRoom()

> **removeRoom**(`roomId`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1088](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1088)

***

### getRoomsForParticipant()

> **getRoomsForParticipant**(`userId`): `Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

#### Defined in

[packages/core/src/types.ts:1090](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1090)

***

### getRoomsForParticipants()

> **getRoomsForParticipants**(`userIds`): `Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

#### Parameters

• **userIds**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]

#### Returns

`Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

#### Defined in

[packages/core/src/types.ts:1092](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1092)

***

### addParticipant()

> **addParticipant**(`userId`, `roomId`): `Promise`\<`boolean`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/core/src/types.ts:1094](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1094)

***

### removeParticipant()

> **removeParticipant**(`userId`, `roomId`): `Promise`\<`boolean`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/core/src/types.ts:1096](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1096)

***

### getParticipantsForAccount()

> **getParticipantsForAccount**(`userId`): `Promise`\<[`Participant`](Participant.md)[]\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Participant`](Participant.md)[]\>

#### Defined in

[packages/core/src/types.ts:1098](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1098)

***

### getParticipantsForRoom()

> **getParticipantsForRoom**(`roomId`): `Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

#### Defined in

[packages/core/src/types.ts:1100](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1100)

***

### getParticipantUserState()

> **getParticipantUserState**(`roomId`, `userId`): `Promise`\<`"FOLLOWED"` \| `"MUTED"`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`"FOLLOWED"` \| `"MUTED"`\>

#### Defined in

[packages/core/src/types.ts:1102](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1102)

***

### setParticipantUserState()

> **setParticipantUserState**(`roomId`, `userId`, `state`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **state**: `"FOLLOWED"` \| `"MUTED"`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1107](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1107)

***

### createRelationship()

> **createRelationship**(`params`): `Promise`\<`boolean`\>

#### Parameters

• **params**

• **params.userA**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.userB**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/core/src/types.ts:1113](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1113)

***

### getRelationship()

> **getRelationship**(`params`): `Promise`\<[`Relationship`](Relationship.md)\>

#### Parameters

• **params**

• **params.userA**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.userB**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Relationship`](Relationship.md)\>

#### Defined in

[packages/core/src/types.ts:1115](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1115)

***

### getRelationships()

> **getRelationships**(`params`): `Promise`\<[`Relationship`](Relationship.md)[]\>

#### Parameters

• **params**

• **params.userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Relationship`](Relationship.md)[]\>

#### Defined in

[packages/core/src/types.ts:1120](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1120)

***

### getKnowledge()

> **getKnowledge**(`params`): `Promise`\<[`RAGKnowledgeItem`](RAGKnowledgeItem.md)[]\>

#### Parameters

• **params**

• **params.id?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.limit?**: `number`

• **params.query?**: `string`

• **params.conversationContext?**: `string`

#### Returns

`Promise`\<[`RAGKnowledgeItem`](RAGKnowledgeItem.md)[]\>

#### Defined in

[packages/core/src/types.ts:1122](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1122)

***

### searchKnowledge()

> **searchKnowledge**(`params`): `Promise`\<[`RAGKnowledgeItem`](RAGKnowledgeItem.md)[]\>

#### Parameters

• **params**

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.embedding**: `Float32Array`

• **params.match\_threshold**: `number`

• **params.match\_count**: `number`

• **params.searchText?**: `string`

#### Returns

`Promise`\<[`RAGKnowledgeItem`](RAGKnowledgeItem.md)[]\>

#### Defined in

[packages/core/src/types.ts:1130](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1130)

***

### createKnowledge()

> **createKnowledge**(`knowledge`): `Promise`\<`void`\>

#### Parameters

• **knowledge**: [`RAGKnowledgeItem`](RAGKnowledgeItem.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1138](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1138)

***

### removeKnowledge()

> **removeKnowledge**(`id`): `Promise`\<`void`\>

#### Parameters

• **id**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1139](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1139)

***

### clearKnowledge()

> **clearKnowledge**(`agentId`, `shared`?): `Promise`\<`void`\>

#### Parameters

• **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **shared?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1140](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/types.ts#L1140)
