import db from '../utils/localDb';

/**
 * Finance Service
 * Handles all financial operations including transactions, allocations, and budget tracking
 */

class FinanceService {
    /**
     * Get all transactions with optional filtering
     */
    async getAllTransactions(filters = {}) {
        try {
            let query = db.finance.toCollection();

            if (filters.type) {
                query = query.filter(t => t.type === filters.type);
            }
            if (filters.category) {
                query = query.filter(t => t.category === filters.category);
            }
            if (filters.startDate && filters.endDate) {
                query = query.filter(t => {
                    const date = new Date(t.date);
                    return date >= new Date(filters.startDate) && date <= new Date(filters.endDate);
                });
            }

            return await query.reverse().sortBy('date');
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    }

    /**
     * Create a new transaction
     */
    async createTransaction(transactionData) {
        try {
            const newTransaction = {
                ...transactionData,
                date: transactionData.date || new Date(),
                type: transactionData.type || 'expense' // 'expense' or 'income'
            };

            const id = await db.finance.add(newTransaction);

            // Update project spent if projectId is provided
            if (newTransaction.projectId && newTransaction.type === 'expense') {
                const project = await db.projects.get(newTransaction.projectId);
                if (project) {
                    await db.projects.update(newTransaction.projectId, {
                        spent: (project.spent || 0) + Math.abs(newTransaction.amount)
                    });
                }
            }

            return await db.finance.get(id);
        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    }

    /**
     * Update transaction
     */
    async updateTransaction(id, updates) {
        try {
            await db.finance.update(id, updates);
            return await db.finance.get(id);
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    }

    /**
     * Delete transaction
     */
    async deleteTransaction(id) {
        try {
            const transaction = await db.finance.get(id);

            // Update project spent if needed
            if (transaction && transaction.projectId && transaction.type === 'expense') {
                const project = await db.projects.get(transaction.projectId);
                if (project) {
                    await db.projects.update(transaction.projectId, {
                        spent: Math.max(0, (project.spent || 0) - Math.abs(transaction.amount))
                    });
                }
            }

            await db.finance.delete(id);
            return { success: true, id };
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    }

    /**
     * Get financial summary
     */
    async getFinancialSummary(projectId = null) {
        try {
            let transactions = await db.finance.toArray();

            if (projectId) {
                transactions = transactions.filter(t => t.projectId === projectId);
            }

            const income = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

            const expenses = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

            return {
                totalIncome: income,
                totalExpenses: expenses,
                balance: income - expenses,
                transactionCount: transactions.length
            };
        } catch (error) {
            console.error('Error fetching financial summary:', error);
            throw error;
        }
    }

    /**
     * Get expenses by category
     */
    async getExpensesByCategory() {
        try {
            const expenses = await db.finance
                .where('type')
                .equals('expense')
                .toArray();

            const categoryTotals = {};

            expenses.forEach(expense => {
                const category = expense.category || 'Uncategorized';
                categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(expense.amount);
            });

            return Object.entries(categoryTotals).map(([category, amount]) => ({
                category,
                amount,
                percentage: 0 // Will be calculated by caller if needed
            }));
        } catch (error) {
            console.error('Error fetching expenses by category:', error);
            throw error;
        }
    }

    // ============ ALLOCATIONS ============

    /**
     * Get all allocations
     */
    async getAllAllocations(filters = {}) {
        try {
            let query = db.allocations.toCollection();

            if (filters.status) {
                query = query.filter(a => a.status === filters.status);
            }
            if (filters.assignedTo) {
                query = query.filter(a => a.assignedTo === filters.assignedTo);
            }

            const allocations = await query.reverse().sortBy('date');

            // Enrich with employee info
            return await Promise.all(
                allocations.map(async (allocation) => {
                    if (allocation.assignedTo) {
                        const employee = await db.employees.get(allocation.assignedTo);
                        return { ...allocation, employee };
                    }
                    return allocation;
                })
            );
        } catch (error) {
            console.error('Error fetching allocations:', error);
            throw error;
        }
    }

    /**
     * Create allocation
     */
    async createAllocation(allocationData) {
        try {
            const newAllocation = {
                ...allocationData,
                date: allocationData.date || new Date(),
                status: allocationData.status || 'pending'
            };

            const id = await db.allocations.add(newAllocation);
            return await db.allocations.get(id);
        } catch (error) {
            console.error('Error creating allocation:', error);
            throw error;
        }
    }

    /**
     * Update allocation status
     */
    async updateAllocationStatus(id, status) {
        try {
            await db.allocations.update(id, {
                status,
                updatedAt: new Date()
            });

            // If marking as utilized, create expense transaction
            if (status === 'utilized') {
                const allocation = await db.allocations.get(id);
                if (allocation && allocation.resource === 'Cash Advance') {
                    await this.createTransaction({
                        type: 'expense',
                        amount: -Math.abs(parseFloat(allocation.amount)),
                        category: 'ALLOCATIONS',
                        description: `Allocation utilized: ${allocation.resource} - ${allocation.site}`,
                        date: new Date()
                    });
                }
            }

            return await db.allocations.get(id);
        } catch (error) {
            console.error('Error updating allocation status:', error);
            throw error;
        }
    }

    /**
     * Delete allocation
     */
    async deleteAllocation(id) {
        try {
            await db.allocations.delete(id);
            return { success: true, id };
        } catch (error) {
            console.error('Error deleting allocation:', error);
            throw error;
        }
    }

    /**
     * Get allocation statistics
     */
    async getAllocationStats() {
        try {
            const allocations = await db.allocations.toArray();

            return {
                total: allocations.length,
                pending: allocations.filter(a => a.status === 'pending').length,
                utilized: allocations.filter(a => a.status === 'utilized').length,
                cancelled: allocations.filter(a => a.status === 'cancelled').length
            };
        } catch (error) {
            console.error('Error fetching allocation stats:', error);
            throw error;
        }
    }

    /**
     * Get budget vs spent for project
     */
    async getProjectBudgetStatus(projectId) {
        try {
            const project = await db.projects.get(projectId);
            if (!project) {
                throw new Error('Project not found');
            }

            const spent = project.spent || 0;
            const budget = project.budget || 0;
            const remaining = budget - spent;
            const percentageUsed = budget > 0 ? Math.round((spent / budget) * 100) : 0;

            return {
                budget,
                spent,
                remaining,
                percentageUsed,
                isOverBudget: spent > budget
            };
        } catch (error) {
            console.error('Error fetching project budget status:', error);
            throw error;
        }
    }
}

export default new FinanceService();
