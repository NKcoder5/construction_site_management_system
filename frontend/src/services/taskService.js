import db from '../utils/localDb';

/**
 * Task Management Service
 * Handles all task-related operations including CRUD, status updates, and filtering
 */

class TaskService {
    /**
     * Get all tasks with optional filtering
     */
    async getAllTasks(filters = {}) {
        try {
            let query = db.tasks.toCollection();

            // Apply filters
            if (filters.status) {
                query = query.filter(task => task.status === filters.status);
            }
            if (filters.priority) {
                query = query.filter(task => task.priority === filters.priority);
            }
            if (filters.assignedTo) {
                query = query.filter(task => task.assignedTo === filters.assignedTo);
            }
            if (filters.projectId) {
                query = query.filter(task => task.projectId === filters.projectId);
            }

            const tasks = await query.toArray();

            // Enrich tasks with employee information
            const enrichedTasks = await Promise.all(
                tasks.map(async (task) => {
                    if (task.assignedTo) {
                        const employee = await db.employees.get(task.assignedTo);
                        return { ...task, assignedEmployee: employee };
                    }
                    return task;
                })
            );

            return enrichedTasks;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }

    /**
     * Get task by ID
     */
    async getTaskById(id) {
        try {
            const task = await db.tasks.get(id);
            if (task && task.assignedTo) {
                const employee = await db.employees.get(task.assignedTo);
                return { ...task, assignedEmployee: employee };
            }
            return task;
        } catch (error) {
            console.error('Error fetching task:', error);
            throw error;
        }
    }

    /**
     * Create a new task
     */
    async createTask(taskData) {
        try {
            const newTask = {
                ...taskData,
                createdAt: new Date(),
                status: taskData.status || 'pending',
                priority: taskData.priority || 'medium'
            };

            const id = await db.tasks.add(newTask);
            return await this.getTaskById(id);
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    /**
     * Update task
     */
    async updateTask(id, updates) {
        try {
            await db.tasks.update(id, {
                ...updates,
                updatedAt: new Date()
            });
            return await this.getTaskById(id);
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    /**
     * Update task status
     */
    async updateTaskStatus(id, status) {
        try {
            const updates = { status, updatedAt: new Date() };

            // If marking as done, add completion timestamp
            if (status === 'done' || status === 'completed') {
                updates.completedAt = new Date();
            }

            await db.tasks.update(id, updates);
            return await this.getTaskById(id);
        } catch (error) {
            console.error('Error updating task status:', error);
            throw error;
        }
    }

    /**
     * Delete task
     */
    async deleteTask(id) {
        try {
            await db.tasks.delete(id);
            return { success: true, id };
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

    /**
     * Get tasks by status (for Kanban view)
     */
    async getTasksByStatus() {
        try {
            const allTasks = await this.getAllTasks();

            return {
                pending: allTasks.filter(t => t.status === 'pending'),
                active: allTasks.filter(t => t.status === 'in-progress' || t.status === 'active'),
                scheduled: allTasks.filter(t => t.status === 'scheduled'),
                done: allTasks.filter(t => t.status === 'done' || t.status === 'completed')
            };
        } catch (error) {
            console.error('Error fetching tasks by status:', error);
            throw error;
        }
    }

    /**
     * Get task statistics
     */
    async getTaskStats() {
        try {
            const tasks = await db.tasks.toArray();

            return {
                total: tasks.length,
                pending: tasks.filter(t => t.status === 'pending').length,
                active: tasks.filter(t => t.status === 'in-progress' || t.status === 'active').length,
                scheduled: tasks.filter(t => t.status === 'scheduled').length,
                completed: tasks.filter(t => t.status === 'done' || t.status === 'completed').length,
                overdue: tasks.filter(t => {
                    return t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done';
                }).length,
                completionRate: tasks.length > 0
                    ? Math.round((tasks.filter(t => t.status === 'done' || t.status === 'completed').length / tasks.length) * 100)
                    : 0
            };
        } catch (error) {
            console.error('Error fetching task stats:', error);
            throw error;
        }
    }

    /**
     * Assign task to employee
     */
    async assignTask(taskId, employeeId) {
        try {
            await db.tasks.update(taskId, {
                assignedTo: employeeId,
                updatedAt: new Date()
            });
            return await this.getTaskById(taskId);
        } catch (error) {
            console.error('Error assigning task:', error);
            throw error;
        }
    }

    /**
     * Get tasks assigned to specific employee
     */
    async getEmployeeTasks(employeeId) {
        try {
            return await this.getAllTasks({ assignedTo: employeeId });
        } catch (error) {
            console.error('Error fetching employee tasks:', error);
            throw error;
        }
    }
}

export default new TaskService();
