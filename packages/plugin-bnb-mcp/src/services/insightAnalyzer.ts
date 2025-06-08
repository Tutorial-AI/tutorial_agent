import { elizaLogger } from "@elizaos/core";
import type { BNBMCPTransaction, BNBMCPTokenTransfer, BNBMCPContractCreation, BNBMCPInsight } from "../types";

export class InsightAnalyzer {
    private readonly WHALE_THRESHOLD_BNB = 1000; // 1000 BNB
    private readonly HIGH_GAS_CONTRACT_THRESHOLD = 5000000; // 5M gas units
    
    /**
     * Analyze transactions to find interesting insights
     */
    analyzeTransactions(transactions: BNBMCPTransaction[]): BNBMCPInsight[] {
        const insights: BNBMCPInsight[] = [];
        
        for (const tx of transactions) {
            const valueBNB = parseFloat(tx.value) / 1e18; // Convert from wei to BNB
            
            if (valueBNB >= this.WHALE_THRESHOLD_BNB) {
                insights.push({
                    type: 'whale_activity',
                    title: `🐋 Whale Alert: ${valueBNB.toFixed(2)} BNB Transfer`,
                    description: `A massive transfer of ${valueBNB.toFixed(2)} BNB (~$${(valueBNB * 600).toLocaleString()}) was detected`,
                    data: tx,
                    timestamp: tx.timestamp,
                    severity: valueBNB >= this.WHALE_THRESHOLD_BNB * 5 ? 'high' : 'medium'
                });
            }
        }
        
        return insights;
    }
    
    /**
     * Analyze token transfers to find interesting patterns
     */
    analyzeTokenTransfers(transfers: BNBMCPTokenTransfer[]): BNBMCPInsight[] {
        const insights: BNBMCPInsight[] = [];
        
        // Group transfers by token
        const tokenGroups = new Map<string, BNBMCPTokenTransfer[]>();
        for (const transfer of transfers) {
            const key = transfer.tokenAddress;
            if (!tokenGroups.has(key)) {
                tokenGroups.set(key, []);
            }
            tokenGroups.get(key)!.push(transfer);
        }
        
        // Find tokens with high activity
        for (const [tokenAddress, tokenTransfers] of tokenGroups) {
            if (tokenTransfers.length >= 10) {
                const tokenSymbol = tokenTransfers[0].tokenSymbol || 'Unknown';
                insights.push({
                    type: 'large_transfer',
                    title: `📈 High Activity: ${tokenSymbol} Token`,
                    description: `${tokenTransfers.length} transfers detected for ${tokenSymbol} in recent blocks`,
                    data: tokenTransfers[0],
                    timestamp: Date.now(),
                    severity: tokenTransfers.length >= 20 ? 'high' : 'medium'
                });
            }
        }
        
        return insights;
    }
    
    /**
     * Analyze new contracts to find potential token launches
     */
    analyzeNewContracts(contracts: BNBMCPContractCreation[]): BNBMCPInsight[] {
        const insights: BNBMCPInsight[] = [];
        
        for (const contract of contracts) {
            const gasUsed = parseInt(contract.gasUsed || '0');
            
            // High gas usage often indicates complex contracts like tokens or DeFi protocols
            if (gasUsed >= this.HIGH_GAS_CONTRACT_THRESHOLD) {
                insights.push({
                    type: 'token_launch',
                    title: `🚀 Potential Token Launch Detected`,
                    description: `New contract deployed with high gas usage (${(gasUsed / 1e6).toFixed(2)}M gas)`,
                    data: contract,
                    timestamp: contract.timestamp,
                    severity: 'medium'
                });
            } else {
                insights.push({
                    type: 'new_contract',
                    title: `📝 New Smart Contract Deployed`,
                    description: `Contract deployed at ${contract.contractAddress.slice(0, 10)}...`,
                    data: contract,
                    timestamp: contract.timestamp,
                    severity: 'low'
                });
            }
        }
        
        return insights;
    }
    
    /**
     * Filter insights by severity and uniqueness
     */
    filterInsights(insights: BNBMCPInsight[], minSeverity: 'low' | 'medium' | 'high' = 'medium'): BNBMCPInsight[] {
        const severityOrder = { low: 0, medium: 1, high: 2 };
        
        // Filter by severity
        const filtered = insights.filter(insight => 
            severityOrder[insight.severity] >= severityOrder[minSeverity]
        );
        
        // Remove duplicates based on title
        const unique = new Map<string, BNBMCPInsight>();
        for (const insight of filtered) {
            if (!unique.has(insight.title) || insight.severity === 'high') {
                unique.set(insight.title, insight);
            }
        }
        
        // Sort by severity and timestamp
        return Array.from(unique.values()).sort((a, b) => {
            const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
            if (severityDiff !== 0) return severityDiff;
            return b.timestamp - a.timestamp;
        });
    }
}