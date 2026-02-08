import axios from 'axios';
import db from './localDb';

const OLLAMA_BASE_URL = 'http://localhost:11434';

/**
 * Enhanced AI Service for Construction Management
 * Integrates Mistral 7B (via Ollama) with specialized agents for different domains
 */
class AIService {
    constructor() {
        this.isConnected = false;
        this.model = 'phi3'; // Default to Phi-3 Mini (Lighter for site laptops)
        this.currentAgent = 'general';
    }

    /**
     * Check if Ollama is running and detect available models
     */
    async checkConnection() {
        try {
            const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 3000 });
            if (response.status === 200 && response.data.models) {
                this.isConnected = true;
                const models = response.data.models.map(m => m.name);

                // Prioritize lightweight, memory-efficient models for low-RAM systems
                const preferredModels = ['phi3', 'llama3.2', 'tinyllama', 'mistral', 'llama3'];
                const found = preferredModels.find(p => models.some(m => m.includes(p)));

                if (found) {
                    this.model = models.find(m => m.includes(found));
                } else if (models.length > 0) {
                    this.model = models[0];
                }

                console.log(`✅ AI Connected: Using ${this.model}`);
                return true;
            }
            return false;
        } catch (error) {
            console.warn('⚠️ Ollama not detected. AI features will use fallback mode.');
            this.isConnected = false;
            return false;
        }
    }

    /**
     * Get database context for AI queries
     */
    async getDatabaseContext() {
        try {
            if (!db.isOpen()) {
                await db.open();
            }
            const [employees, tasks, finance, materials, projects] = await Promise.all([
                db.employees.toArray(),
                db.tasks.toArray(),
                db.finance.orderBy('date').reverse().limit(20).toArray(),
                db.materials.toArray(),
                db.projects.toArray()
            ]);

            return {
                employees: employees.map(e => ({
                    id: e.id,
                    name: e.name,
                    role: e.role,
                    skills: e.skills,
                    availability: e.availability,
                    status: e.status
                })),
                tasks: tasks.map(t => ({
                    id: t.id,
                    title: t.title,
                    assignedTo: t.assignedTo,
                    status: t.status,
                    priority: t.priority,
                    dueDate: t.dueDate
                })),
                financeSummary: {
                    totalIncome: finance.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0),
                    totalExpense: finance.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0),
                    recentTransactions: finance.slice(0, 5).map(f => ({
                        type: f.type,
                        amount: f.amount,
                        category: f.category,
                        description: f.description,
                        date: f.date
                    }))
                },
                materials: materials.map(m => ({
                    name: m.name,
                    quantity: m.quantity,
                    unit: m.unit,
                    category: m.category
                })),
                projects: projects.map(p => ({
                    name: p.name,
                    status: p.status,
                    budget: p.budget,
                    spent: p.spent,
                    location: p.location
                }))
            };
        } catch (error) {
            console.error('Error getting database context:', error);
            return {};
        }
    }

    /**
     * Generate system prompts for specialized agents
     */
    getSystemPrompt(agentType = 'general', context = {}) {
        const baseContext = `You are the 'Site Brain' (AI Auditor) for Yogesh Constructions. You speak with authority, ground truth expertise, and operational gravity.`;

        const agentPrompts = {
            finance: `${baseContext}

You are the **Ledger Auditor**. You handle site expenses, site balance, and money out (burn rate).

Current Ledger Context:
- Site Balance: ₹${(context.financeSummary?.totalIncome || 0) - (context.financeSummary?.totalExpense || 0)}
- Money Out: ₹${context.financeSummary?.totalExpense || 0}
- Recent Ledger Entries: ${JSON.stringify(context.financeSummary?.recentTransactions || [])}

Your role:
1. Audit expenditures against the site balance.
2. Flag potential money leaks or burn rate issues.
3. Validate "Reality Checks" for payments.
4. Ensure every rupee spent is linked to a Work Order.

Be precise, authoritative, and focused on site solvency.`,

            hr: `${baseContext}

You are the **Roster Official**. You manage the Site Roster, assigned officials, and current responsibilities.

Current Roster Context:
- Officials on Site: ${context.employees?.length || 0}
- Available for Deployment: ${context.employees?.filter(e => e.availability === 'available').length || 0} / ${context.employees?.length || 0}

Roster Details: ${JSON.stringify(context.employees || [])}
Active Work Orders: ${JSON.stringify(context.tasks || [])}

Your role:
1. Deploy officials to Work Orders based on their specific case files.
2. Monitor site responsibility distribution.
3. Identify gaps in technical authority assignments.
4. Ensure every binding order has a lead official.

Be disciplined and focused on operational accountability.`,

            reports: `${baseContext}

You are the **Briefing Auditor**. You monitor Site Status, Ground Truth, and Operational Realities.

Available Site Stories:
- Ongoing Orders: ${JSON.stringify(context.tasks || [])}
- Ledger Status: ${JSON.stringify(context.financeSummary || {})}

Your role:
1. Synthesize Site Diaries into "Site Stories" (narrative briefings).
2. Highlight unverified realities and "Immediate Blockers".
3. Provide a clear cause-and-effect "Decision Tunnel".
4. Ensure ground truth from the field is correctly reflected in the Morning Briefing.

Use site-native language (Ground Truth, Reality Verified, Site Diary).`,

            materials: `${baseContext}

You are the **Logistics Auditor**. You handle Material Realities and site constraints.

Material Inventory:
${JSON.stringify(context.materials || [])}

Your role:
1. Track material usage against physical site progress.
2. Alert the supervisor to "Material Constraints".
3. Verify that payloads arrived on site (Material Reality).
4. Predict bottlenecks in the procurement cycle.

Focus on physical existence and logistical truth.`,

            general: `${baseContext}

You are the **Site Auditor**. You coordinate the 'Site Brain'. 

Current Site Context:
- Active Sites: ${context.projects?.length || 0}
- Roster Strength: ${context.employees?.length || 0}
- Total Work Orders: ${context.tasks?.length || 0}

You provide:
1. Quick access to Technical Authority (blueprints).
2. Verification of Site Diary entries.
3. Auditing of Site Expenses.
4. Deployment status of the Roster.

Officials currently on Roster: ${context.employees?.map(e => e.name).join(', ') || 'None'}
Active Site Locations: ${context.projects?.map(p => p.name).join(', ') || 'None'}

Always refer to "Work Orders", "Site Roster", and "Technical Authority". Avoid software jargon.`
        };

        return agentPrompts[agentType] || agentPrompts.general;
    }

    /**
     * Detect which specialized agent should handle the query
     */
    detectAgent(query) {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.match(/budget|cost|expense|income|money|financial|spend|price|payment/)) {
            return 'finance';
        }
        if (lowerQuery.match(/employee|worker|staff|team|assign|task|who can|availability|hire|schedule/)) {
            return 'hr';
        }
        if (lowerQuery.match(/report|summary|generate|document|progress|weekly|monthly|daily report/)) {
            return 'reports';
        }
        if (lowerQuery.match(/material|inventory|stock|cement|steel|brick|supplier|order|procurement/)) {
            return 'materials';
        }

        return 'general';
    }

    /**
     * Main method to generate AI responses
     */
    async generateResponse(prompt, chatHistory = [], forceAgent = null) {
        if (!this.isConnected) {
            return this.getFallbackResponse(prompt);
        }

        try {
            // Get database context
            const context = await this.getDatabaseContext();

            // Detect appropriate agent
            const agent = forceAgent || this.detectAgent(prompt);
            this.currentAgent = agent;

            // Get system prompt for the agent
            const systemPrompt = this.getSystemPrompt(agent, context);

            // Prepare messages
            const messages = [
                { role: 'system', content: systemPrompt },
                ...chatHistory.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
                { role: 'user', content: prompt }
            ];

            // Call Ollama API
            const response = await axios.post(`${OLLAMA_BASE_URL}/api/chat`, {
                model: this.model,
                messages: messages,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9
                }
            }, {
                timeout: 30000 // 30 second timeout
            });

            if (response.data && response.data.message) {
                // Store AI insight if it's significant
                if (agent !== 'general') {
                    await this.storeInsight(agent, prompt, response.data.message.content);
                }

                return response.data.message.content;
            }

            return "I couldn't generate a response. Please try again.";
        } catch (error) {
            console.error('AI Generation Error:', error.message);
            return this.getFallbackResponse(prompt);
        }
    }

    /**
     * Store AI insights for future reference
     */
    async storeInsight(type, query, insight) {
        try {
            await db.ai_insights.add({
                type,
                data: query,
                insight: insight.substring(0, 500), // Store first 500 chars
                confidence: 0.8,
                generatedAt: new Date()
            });
        } catch (error) {
            console.error('Failed to store insight:', error);
        }
    }

    /**
     * Fallback responses when AI is not available
     */
    getFallbackResponse(query) {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('finance') || lowerQuery.includes('budget')) {
            return "Site Brain is offline. Open 'Site Expenses' for the ledger (Solvency Status).";
        }
        if (lowerQuery.includes('employee') || lowerQuery.includes('staff') || lowerQuery.includes('roster')) {
            return "Site Brain is offline. Check the 'Site Roster' for official assignments.";
        }
        if (lowerQuery.includes('report') || lowerQuery.includes('briefing')) {
            return "Site Brain is offline. Check 'Site Status' for the Morning Briefing.";
        }

        return "The Site Brain (AI) is currently offline. Ensure the site server is running. All manual modules (Diary, Roster, Authority) remain active.";
    }

    /**
     * Quick answer generation for simple queries (no AI needed)
     */
    async getQuickAnswer(query) {
        const lowerQuery = query.toLowerCase();

        // Number queries
        const match = lowerQuery.match(/calculate|compute|what is (\d+[\s\d+\-*/().]+)/);
        if (match) {
            try {
                const expr = match[1] || lowerQuery.replace(/calculate|compute|what is/g, '').trim();
                if (/^[\d+\-*/().\s]+$/.test(expr)) {
                    // eslint-disable-next-line no-eval
                    const result = eval(expr);
                    return `The result is: ${result}`;
                }
            } catch (e) {
                return "I couldn't calculate that. Please check your expression.";
            }
        }

        return null; // No quick answer available
    }

    /**
     * Generate financial analysis report
     */
    async generateFinancialReport(period = 'month') {
        const context = await this.getDatabaseContext();
        const prompt = `Generate a comprehensive financial analysis report for this ${period}. Include:
1. Total income and expenses
2. Category-wise breakdown
3. Spending trends
4. Budget utilization
5. Recommendations for cost optimization

Keep it professional and actionable.`;

        return await this.generateResponse(prompt, [], 'finance');
    }

    /**
     * Suggest task assignment
     */
    async suggestTaskAssignment(taskDescription) {
        const prompt = `I need to assign a task: "${taskDescription}". 
Which employee should I assign this to? Consider their skills, current workload, and availability.
Provide your recommendation with reasoning.`;

        return await this.generateResponse(prompt, [], 'hr');
    }

    /**
     * Generate daily site report
     */
    async generateDailyReport(siteLogs = []) {
        const logsText = siteLogs.map(log => `- ${log.caption} (${log.location})`).join('\n');
        const prompt = `Generate a professional daily site report based on these activities:\n${logsText}\n\nInclude progress summary, issues, and recommendations.`;

        return await this.generateResponse(prompt, [], 'reports');
    }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;

