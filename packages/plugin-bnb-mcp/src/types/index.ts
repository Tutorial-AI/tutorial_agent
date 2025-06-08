export interface BNBMCPTransaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    blockNumber: number;
    timestamp: number;
    gasPrice?: string;
    gasUsed?: string;
}

export interface BNBMCPTokenTransfer {
    hash: string;
    from: string;
    to: string;
    value: string;
    tokenAddress: string;
    tokenSymbol?: string;
    tokenName?: string;
    blockNumber: number;
    timestamp: number;
}

export interface BNBMCPContractCreation {
    hash: string;
    creator: string;
    contractAddress: string;
    blockNumber: number;
    timestamp: number;
    gasUsed?: string;
}

export interface BNBMCPInsight {
    type: 'large_transfer' | 'new_contract' | 'token_launch' | 'whale_activity';
    title: string;
    description: string;
    data: BNBMCPTransaction | BNBMCPTokenTransfer | BNBMCPContractCreation;
    timestamp: number;
    severity: 'low' | 'medium' | 'high';
}

export interface MCPClientConfig {
    command?: string;
    args?: string[];
    env?: Record<string, string>;
}