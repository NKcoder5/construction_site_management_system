import db from '../utils/localDb';

/**
 * Report Service
 * Handles site logs, reports generation, and activity tracking
 */

class ReportService {
    /**
     * Get all site logs with optional filtering
     */
    async getAllLogs(filters = {}) {
        try {
            let query = db.siteLogs.toCollection();

            if (filters.priority) {
                query = query.filter(log => log.priority === filters.priority);
            }
            if (filters.status) {
                query = query.filter(log => log.status === filters.status);
            }
            if (filters.location) {
                query = query.filter(log => log.location?.toLowerCase().includes(filters.location.toLowerCase()));
            }
            if (filters.bookmarked) {
                query = query.filter(log => log.bookmarked === true);
            }

            return await query.reverse().sortBy('createdAt');
        } catch (error) {
            console.error('Error fetching logs:', error);
            throw error;
        }
    }

    /**
     * Get log by ID
     */
    async getLogById(id) {
        try {
            return await db.siteLogs.get(id);
        } catch (error) {
            console.error('Error fetching log:', error);
            throw error;
        }
    }

    /**
     * Create new site log
     */
    async createLog(logData) {
        try {
            const newLog = {
                ...logData,
                createdAt: new Date(),
                status: logData.status || 'active',
                priority: logData.priority || 'Normal',
                acknowledged: false,
                bookmarked: false
            };

            const id = await db.siteLogs.add(newLog);

            // Dispatch event for UI updates
            window.dispatchEvent(new Event('refresh-logs'));

            return await this.getLogById(id);
        } catch (error) {
            console.error('Error creating log:', error);
            throw error;
        }
    }

    /**
     * Update log
     */
    async updateLog(id, updates) {
        try {
            await db.siteLogs.update(id, {
                ...updates,
                updatedAt: new Date()
            });

            window.dispatchEvent(new Event('refresh-logs'));
            return await this.getLogById(id);
        } catch (error) {
            console.error('Error updating log:', error);
            throw error;
        }
    }

    /**
     * Delete log
     */
    async deleteLog(id) {
        try {
            await db.siteLogs.delete(id);
            window.dispatchEvent(new Event('refresh-logs'));
            return { success: true, id };
        } catch (error) {
            console.error('Error deleting log:', error);
            throw error;
        }
    }

    /**
     * Toggle bookmark
     */
    async toggleBookmark(id) {
        try {
            const log = await db.siteLogs.get(id);
            if (log) {
                await db.siteLogs.update(id, {
                    bookmarked: !log.bookmarked
                });
                return await this.getLogById(id);
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            throw error;
        }
    }

    /**
     * Acknowledge log
     */
    async acknowledgeLog(id) {
        try {
            await db.siteLogs.update(id, {
                acknowledged: true,
                acknowledgedAt: new Date()
            });
            return await this.getLogById(id);
        } catch (error) {
            console.error('Error acknowledging log:', error);
            throw error;
        }
    }

    /**
     * Get log statistics
     */
    async getLogStats() {
        try {
            const logs = await db.siteLogs.toArray();

            return {
                total: logs.length,
                active: logs.filter(l => l.status === 'active').length,
                acknowledged: logs.filter(l => l.acknowledged).length,
                bookmarked: logs.filter(l => l.bookmarked).length,
                byPriority: {
                    normal: logs.filter(l => l.priority === 'Normal').length,
                    important: logs.filter(l => l.priority === 'Important').length,
                    high: logs.filter(l => l.priority === 'High').length,
                    urgent: logs.filter(l => l.priority === 'Urgent').length
                }
            };
        } catch (error) {
            console.error('Error fetching log stats:', error);
            throw error;
        }
    }

    /**
     * Search logs
     */
    async searchLogs(searchTerm) {
        try {
            const allLogs = await db.siteLogs.toArray();
            const term = searchTerm.toLowerCase();

            return allLogs.filter(log =>
                log.caption?.toLowerCase().includes(term) ||
                log.description?.toLowerCase().includes(term) ||
                log.location?.toLowerCase().includes(term) ||
                log.tags?.some(tag => tag.toLowerCase().includes(term))
            );
        } catch (error) {
            console.error('Error searching logs:', error);
            throw error;
        }
    }

    /**
     * Get recent logs (last N days)
     */
    async getRecentLogs(days = 7) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            const logs = await db.siteLogs
                .where('createdAt')
                .above(cutoffDate)
                .reverse()
                .sortBy('createdAt');

            return logs;
        } catch (error) {
            console.error('Error fetching recent logs:', error);
            throw error;
        }
    }

    /**
     * Generate daily report
     */
    async generateDailyReport(date = new Date()) {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const logs = await db.siteLogs
                .where('createdAt')
                .between(startOfDay, endOfDay)
                .toArray();

            const tasks = await db.tasks
                .where('createdAt')
                .between(startOfDay, endOfDay)
                .toArray();

            const transactions = await db.finance
                .where('date')
                .between(startOfDay, endOfDay)
                .toArray();

            return {
                date: date.toISOString().split('T')[0],
                logs: {
                    total: logs.length,
                    byPriority: {
                        normal: logs.filter(l => l.priority === 'Normal').length,
                        important: logs.filter(l => l.priority === 'Important').length,
                        high: logs.filter(l => l.priority === 'High').length,
                        urgent: logs.filter(l => l.priority === 'Urgent').length
                    }
                },
                tasks: {
                    total: tasks.length,
                    completed: tasks.filter(t => t.status === 'done').length
                },
                finance: {
                    transactions: transactions.length,
                    totalExpenses: transactions
                        .filter(t => t.type === 'expense')
                        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
                    totalIncome: transactions
                        .filter(t => t.type === 'income')
                        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                }
            };
        } catch (error) {
            console.error('Error generating daily report:', error);
            throw error;
        }
    }
}

export default new ReportService();
