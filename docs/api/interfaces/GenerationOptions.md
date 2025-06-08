[@elizaos/core v0.1.9](../index.md) / GenerationOptions

# Interface: GenerationOptions

Configuration options for generating objects with a model.

## Properties

### runtime

> **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Defined in

[packages/core/src/generation.ts:2037](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2037)

***

### context

> **context**: `string`

#### Defined in

[packages/core/src/generation.ts:2038](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2038)

***

### modelClass

> **modelClass**: [`ModelClass`](../enumerations/ModelClass.md)

#### Defined in

[packages/core/src/generation.ts:2039](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2039)

***

### schema?

> `optional` **schema**: `ZodType`\<`any`, `ZodTypeDef`, `any`\>

#### Defined in

[packages/core/src/generation.ts:2040](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2040)

***

### schemaName?

> `optional` **schemaName**: `string`

#### Defined in

[packages/core/src/generation.ts:2041](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2041)

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

#### Defined in

[packages/core/src/generation.ts:2042](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2042)

***

### stop?

> `optional` **stop**: `string`[]

#### Defined in

[packages/core/src/generation.ts:2043](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2043)

***

### mode?

> `optional` **mode**: `"auto"` \| `"json"` \| `"tool"`

#### Defined in

[packages/core/src/generation.ts:2044](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2044)

***

### experimental\_providerMetadata?

> `optional` **experimental\_providerMetadata**: `Record`\<`string`, `unknown`\>

#### Defined in

[packages/core/src/generation.ts:2045](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2045)

***

### verifiableInference?

> `optional` **verifiableInference**: `boolean`

#### Defined in

[packages/core/src/generation.ts:2046](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2046)

***

### verifiableInferenceAdapter?

> `optional` **verifiableInferenceAdapter**: [`IVerifiableInferenceAdapter`](IVerifiableInferenceAdapter.md)

#### Defined in

[packages/core/src/generation.ts:2047](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2047)

***

### verifiableInferenceOptions?

> `optional` **verifiableInferenceOptions**: [`VerifiableInferenceOptions`](VerifiableInferenceOptions.md)

#### Defined in

[packages/core/src/generation.ts:2048](https://github.com/abilmansuryeshmuratov/tutorial_agent/blob/main/packages/core/src/generation.ts#L2048)
