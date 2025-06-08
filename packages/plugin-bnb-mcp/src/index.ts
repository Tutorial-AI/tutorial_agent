import type { Plugin } from "@elizaos/core";
import { bnbMcpInsightsAction } from "./actions/bnbMcpInsights";
import { createScheduledInsightsService } from "./services/scheduledInsights";

export * from "./types";
export * from "./services/mcpClient";
export * from "./services/insightAnalyzer";
export * from "./services/twitterService";

export const bnbMcpPlugin: Plugin = {
    name: "bnb-mcp",
    description: "BNB Chain MCP integration for automated blockchain insights and Twitter updates",
    actions: [bnbMcpInsightsAction],
    services: [createScheduledInsightsService()],
    evaluators: [],
    providers: [],
};

export default bnbMcpPlugin;