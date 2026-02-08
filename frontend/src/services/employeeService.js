import db from '../utils/localDb';

/**
 * Employee Service
 * Handles all employee-related operations including CRUD, availability, and performance tracking
 */

class EmployeeService {
    /**
     * Get all employees with optional filtering
     */
    async getAllEmployees(filters = {}) {
        try {
            let query = db.employees.toCollection();

            if (filters.role) {
                query = query.filter(emp => emp.role === filters.role);
            }
            if (filters.status) {
                query = query.filter(emp => emp.status === filters.status);
            }
            if (filters.availability) {
                query = query.filter(emp => emp.availability === filters.availability);
            }

            return await query.toArray();
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    /**
     * Get employee by ID
     */
    async getEmployeeById(id) {
        try {
            const employee = await db.employees.get(id);

            if (employee) {
                // Get assigned tasks
                const tasks = await db.tasks.where('assignedTo').equals(id).toArray();
                return { ...employee, tasks };
            }

            return employee;
        } catch (error) {
            console.error('Error fetching employee:', error);
            throw error;
        }
    }

    /**
     * Create new employee
     */
    async createEmployee(employeeData) {
        try {
            const newEmployee = {
                ...employeeData,
                joinedDate: employeeData.joinedDate || new Date(),
                status: employeeData.status || 'active',
                availability: employeeData.availability || 'available'
            };

            const id = await db.employees.add(newEmployee);
            return await this.getEmployeeById(id);
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    }

    /**
     * Update employee
     */
    async updateEmployee(id, updates) {
        try {
            await db.employees.update(id, {
                ...updates,
                updatedAt: new Date()
            });
            return await this.getEmployeeById(id);
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    }

    /**
     * Delete employee
     */
    async deleteEmployee(id) {
        try {
            // Check if employee has assigned tasks
            const tasks = await db.tasks.where('assignedTo').equals(id).toArray();

            if (tasks.length > 0) {
                // Unassign tasks before deleting
                await Promise.all(
                    tasks.map(task => db.tasks.update(task.id, { assignedTo: null }))
                );
            }

            await db.employees.delete(id);
            return { success: true, id };
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }

    /**
     * Update employee availability
     */
    async updateAvailability(id, availability) {
        try {
            await db.employees.update(id, {
                availability,
                updatedAt: new Date()
            });
            return await this.getEmployeeById(id);
        } catch (error) {
            console.error('Error updating availability:', error);
            throw error;
        }
    }

    /**
     * Get employee statistics
     */
    async getEmployeeStats() {
        try {
            const employees = await db.employees.toArray();

            return {
                total: employees.length,
                active: employees.filter(e => e.status === 'active').length,
                onLeave: employees.filter(e => e.availability === 'on-leave').length,
                available: employees.filter(e => e.availability === 'available').length,
                byRole: this.groupByRole(employees)
            };
        } catch (error) {
            console.error('Error fetching employee stats:', error);
            throw error;
        }
    }

    /**
     * Group employees by role
     */
    groupByRole(employees) {
        const roleGroups = {};

        employees.forEach(emp => {
            const role = emp.role || 'Unassigned';
            roleGroups[role] = (roleGroups[role] || 0) + 1;
        });

        return roleGroups;
    }

    /**
     * Search employees
     */
    async searchEmployees(searchTerm) {
        try {
            const allEmployees = await db.employees.toArray();
            const term = searchTerm.toLowerCase();

            return allEmployees.filter(emp =>
                emp.name?.toLowerCase().includes(term) ||
                emp.role?.toLowerCase().includes(term) ||
                emp.email?.toLowerCase().includes(term) ||
                emp.phone?.includes(term)
            );
        } catch (error) {
            console.error('Error searching employees:', error);
            throw error;
        }
    }

    /**
     * Get employee performance metrics
     */
    async getEmployeePerformance(employeeId) {
        try {
            const tasks = await db.tasks.where('assignedTo').equals(employeeId).toArray();

            const completed = tasks.filter(t => t.status === 'done' || t.status === 'completed');
            const pending = tasks.filter(t => t.status === 'pending');
            const inProgress = tasks.filter(t => t.status === 'in-progress' || t.status === 'active');

            // Calculate average completion time
            const completedWithDates = completed.filter(t => t.createdAt && t.completedAt);
            const avgCompletionTime = completedWithDates.length > 0
                ? completedWithDates.reduce((sum, t) => {
                    const duration = new Date(t.completedAt) - new Date(t.createdAt);
                    return sum + duration;
                }, 0) / completedWithDates.length
                : 0;

            return {
                totalTasks: tasks.length,
                completed: completed.length,
                pending: pending.length,
                inProgress: inProgress.length,
                completionRate: tasks.length > 0
                    ? Math.round((completed.length / tasks.length) * 100)
                    : 0,
                avgCompletionDays: Math.round(avgCompletionTime / (1000 * 60 * 60 * 24))
            };
        } catch (error) {
            console.error('Error fetching employee performance:', error);
            throw error;
        }
    }

    /**
     * Get available employees for task assignment
     */
    async getAvailableEmployees() {
        try {
            return await db.employees
                .where('availability')
                .equals('available')
                .and(emp => emp.status === 'active')
                .toArray();
        } catch (error) {
            console.error('Error fetching available employees:', error);
            throw error;
        }
    }
}

export default new EmployeeService();
