import { elizaLogger } from "@elizaos/core";
import { createPublicClient, http, formatEther, type Address, type Hash } from "viem";
import { bsc } from "viem/chains";
import type { BNBMCPTransaction, BNBMCPTokenTransfer, BNBMCPContractCreation, MCPClientConfig } from "../types";

export class BNBMCPClient {
    private client;
    private config: MCPClientConfig;
    
    constructor(config?: MCPClientConfig) {
        this.config = config || { env: {} };
        
        // Initialize viem client for BSC
        this.client = createPublicClient({
            chain: bsc,
            transport: http(config?.env?.RPC_URL || 'https://bsc-dataseed.binance.org/'),
        });
    }

    /**
     * Convert Wei to BNB string
     */
    private weiToBNB(wei: bigint): string {
        return formatEther(wei);
    }

    /**
     * Fetch recent large transactions
     */
    async getLargeTransactions(minValue: string = "100", limit: number = 10): Promise<BNBMCPTransaction[]> {
        try {
            // Get latest block
            const latestBlock = await this.client.getBlockNumber();
            const fromBlock = latestBlock - 100n; // Check last 100 blocks
            
            // Get recent blocks and their transactions
            const transactions: BNBMCPTransaction[] = [];
            const minValueWei = BigInt(minValue) * 10n ** 18n;
            
            for (let i = 0; i < 5 && transactions.length < limit; i++) {
                const block = await this.client.getBlock({
                    blockNumber: latestBlock - BigInt(i),
                    includeTransactions: true
                });
                
                for (const tx of block.transactions) {
                    if (tx.value && tx.value >= minValueWei) {
                        transactions.push({
                            hash: tx.hash,
                            from: tx.from,
                            to: tx.to || '0x0',
                            value: this.weiToBNB(tx.value),
                            blockNumber: Number(block.number),
                            timestamp: Number(block.timestamp),
                            gasUsed: '0', // Will be updated when tx receipt is available
                            gasPrice: tx.gasPrice ? this.weiToBNB(tx.gasPrice) : '0'
                        });
                        
                        if (transactions.length >= limit) break;
                    }
                }
            }
            
            return transactions;
        } catch (error) {
            elizaLogger.error("Failed to get large transactions:", error);
            return [];
        }
    }

    /**
     * Fetch recent token transfers
     */
    async getTokenTransfers(tokenAddress?: string, limit: number = 20): Promise<BNBMCPTokenTransfer[]> {
        try {
            // Get latest block
            const latestBlock = await this.client.getBlockNumber();
            const fromBlock = latestBlock - 1000n; // Check last 1000 blocks
            
            // ERC20 Transfer event signature
            const transferEventSig = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
            
            // Get transfer logs
            const logs = await this.client.getLogs({
                address: tokenAddress as Address,
                event: {
                    name: 'Transfer',
                    inputs: [
                        { name: 'from', type: 'address', indexed: true },
                        { name: 'to', type: 'address', indexed: true },
                        { name: 'value', type: 'uint256', indexed: false }
                    ],
                    type: 'event'
                },
                fromBlock,
                toBlock: latestBlock
            });
            
            // Convert logs to token transfers
            const transfers: BNBMCPTokenTransfer[] = logs.slice(0, limit).map(log => ({
                hash: log.transactionHash,
                tokenAddress: log.address,
                from: log.args.from as string,
                to: log.args.to as string,
                value: log.args.value.toString(),
                tokenSymbol: 'Unknown', // Would need token contract call to get this
                tokenName: 'Unknown',
                blockNumber: Number(log.blockNumber),
                timestamp: Date.now() // Would need block info for exact timestamp
            }));
            
            return transfers;
        } catch (error) {
            elizaLogger.error("Failed to get token transfers:", error);
            return [];
        }
    }

    /**
     * Fetch new contract deployments
     */
    async getNewContracts(blockRange: number = 100): Promise<BNBMCPContractCreation[]> {
        try {
            // Get latest block
            const latestBlock = await this.client.getBlockNumber();
            const fromBlock = latestBlock - BigInt(blockRange);
            
            const contracts: BNBMCPContractCreation[] = [];
            
            // Check recent blocks for contract creations
            for (let i = 0; i < Math.min(blockRange, 10); i++) {
                const block = await this.client.getBlock({
                    blockNumber: latestBlock - BigInt(i),
                    includeTransactions: true
                });
                
                for (const tx of block.transactions) {
                    // Contract creation has no 'to' address
                    if (!tx.to && tx.input && tx.input.length > 2) {
                        // Calculate contract address
                        const receipt = await this.client.getTransactionReceipt({
                            hash: tx.hash
                        });
                        
                        if (receipt && receipt.contractAddress) {
                            contracts.push({
                                hash: tx.hash,
                                creator: tx.from,
                                contractAddress: receipt.contractAddress,
                                blockNumber: Number(block.number),
                                timestamp: Number(block.timestamp),
                                gasUsed: receipt.gasUsed.toString()
                            });
                        }
                    }
                }
            }
            
            return contracts;
        } catch (error) {
            elizaLogger.error("Failed to get new contracts:", error);
            return [];
        }
    }

    /**
     * Get current gas price
     */
    async getGasPrice(): Promise<string> {
        try {
            const gasPrice = await this.client.getGasPrice();
            return this.weiToBNB(gasPrice);
        } catch (error) {
            elizaLogger.error("Failed to get gas price:", error);
            return "0";
        }
    }

    /**
     * Get token balance for an address
     */
    async getTokenBalance(address: string, tokenAddress?: string): Promise<string> {
        try {
            if (!tokenAddress) {
                // Get BNB balance
                const balance = await this.client.getBalance({
                    address: address as Address
                });
                return this.weiToBNB(balance);
            } else {
                // Get ERC20 token balance
                const balanceResult = await this.client.readContract({
                    address: tokenAddress as Address,
                    abi: [
                        {
                            name: 'balanceOf',
                            type: 'function',
                            stateMutability: 'view',
                            inputs: [{ name: 'account', type: 'address' }],
                            outputs: [{ name: 'balance', type: 'uint256' }]
                        }
                    ],
                    functionName: 'balanceOf',
                    args: [address as Address]
                });
                
                return balanceResult.toString();
            }
        } catch (error) {
            elizaLogger.error("Failed to get token balance:", error);
            return "0";
        }
    }
}