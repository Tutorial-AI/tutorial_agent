import { 
    type Service,
    type IAgentRuntime,
    elizaLogger 
} from "@elizaos/core";
import { BNBMCPClient } from "./mcpClient";
import { InsightAnalyzer } from "./insightAnalyzer";
import { TwitterService } from "./twitterService";

export class ScheduledInsightsService implements Service {
    name = "bnbMcpScheduledInsights";
    private runtime: IAgentRuntime;
    private intervalId?: NodeJS.Timeout;
    private mcpClient: BNBMCPClient;
    private analyzer: InsightAnalyzer;
    private twitterService: TwitterService;
    
    constructor(runtime: IAgentRuntime) {
        this.runtime = runtime;
        this.mcpClient = new BNBMCPClient({
            env: {
                PRIVATE_KEY: runtime.getSetting("BNB_PRIVATE_KEY") || "",
            }
        });
        this.analyzer = new InsightAnalyzer();
        this.twitterService = new TwitterService(runtime);
    }
    
    async initialize(): Promise<void> {
        const enabled = this.runtime.getSetting("BNB_MCP_SCHEDULED_INSIGHTS") === "true";
        if (!enabled) {
            elizaLogger.info("BNB MCP scheduled insights are disabled");
            return;
        }
        
        const intervalMinutes = parseInt(this.runtime.getSetting("BNB_MCP_CHECK_INTERVAL") || "30");
        elizaLogger.info(`Starting BNB MCP scheduled insights (interval: ${intervalMinutes} minutes)`);
        
        // Run once on startup
        await this.checkAndPostInsights();
        
        // Schedule periodic checks
        this.intervalId = setInterval(
            () => this.checkAndPostInsights(),
            intervalMinutes * 60 * 1000
        );
    }
    
    async stop(): Promise<void> {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
            elizaLogger.info("BNB MCP scheduled insights stopped");
        }
    }
    
    private async checkAndPostInsights(): Promise<void> {
        elizaLogger.info("Running scheduled BNB Chain insight check...");
        
        try {
            // Fetch data from MCP
            const [transactions, newContracts, tokenTransfers] = await Promise.all([
                this.mcpClient.getLargeTransactions("500", 10), // Higher threshold for auto-posts
                this.mcpClient.getNewContracts(100),
                this.mcpClient.getTokenTransfers(undefined, 30)
            ]);
            
            // Analyze for insights
            const insights = [
                ...this.analyzer.analyzeTransactions(transactions),
                ...this.analyzer.analyzeNewContracts(newContracts),
                ...this.analyzer.analyzeTokenTransfers(tokenTransfers)
            ];
            
            // Filter to only high-quality insights
            const topInsights = this.analyzer.filterInsights(insights, 'high');
            
            if (topInsights.length === 0) {
                elizaLogger.info("No high-severity insights found in this cycle");
                return;
            }
            
            elizaLogger.info(`Found ${topInsights.length} high-quality insights`);
            
            // Post to Twitter (max 1 per cycle to avoid spam)
            const posted = await this.twitterService.postInsights(topInsights, 1);
            
            if (posted > 0) {
                elizaLogger.info(`Successfully posted ${posted} insight(s) to Twitter`);
                
                // Store metrics if available
                if (this.runtime.cacheManager) {
                    const metrics = {
                        timestamp: Date.now(),
                        insightsFound: topInsights.length,
                        tweetsPosted: posted
                    };
                    await this.runtime.cacheManager.set(
                        `bnb-mcp-metrics-${Date.now()}`,
                        metrics
                    );
                }
            }
        } catch (error) {
            elizaLogger.error("Failed to check and post insights:", error);
        }
    }
}

// Factory function to create the service
export const createScheduledInsightsService = (): Service => {
    return {
        name: "bnbMcpScheduledInsights",
        description: "Scheduled service for monitoring BNB Chain and posting insights to Twitter",
        
        async initialize(runtime: IAgentRuntime): Promise<void> {
            const service = new ScheduledInsightsService(runtime);
            await service.initialize();
            
            // Register the service instance for potential cleanup
            runtime.registerService(service);
        }
    };
};