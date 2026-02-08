import db from '../utils/localDb';

/**
 * Material Service
 * Handles inventory management, material tracking, and stock operations
 */

class MaterialService {
    /**
     * Get all materials with optional filtering
     */
    async getAllMaterials(filters = {}) {
        try {
            let query = db.materials.toCollection();

            if (filters.category) {
                query = query.filter(m => m.category === filters.category);
            }
            if (filters.projectId) {
                query = query.filter(m => m.projectId === filters.projectId);
            }
            if (filters.lowStock) {
                query = query.filter(m => m.quantity < (m.minQuantity || 100));
            }

            return await query.toArray();
        } catch (error) {
            console.error('Error fetching materials:', error);
            throw error;
        }
    }

    /**
     * Get material by ID
     */
    async getMaterialById(id) {
        try {
            return await db.materials.get(id);
        } catch (error) {
            console.error('Error fetching material:', error);
            throw error;
        }
    }

    /**
     * Add new material
     */
    async addMaterial(materialData) {
        try {
            const newMaterial = {
                ...materialData,
                lastUpdated: new Date()
            };

            const id = await db.materials.add(newMaterial);
            return await this.getMaterialById(id);
        } catch (error) {
            console.error('Error adding material:', error);
            throw error;
        }
    }

    /**
     * Update material
     */
    async updateMaterial(id, updates) {
        try {
            await db.materials.update(id, {
                ...updates,
                lastUpdated: new Date()
            });
            return await this.getMaterialById(id);
        } catch (error) {
            console.error('Error updating material:', error);
            throw error;
        }
    }

    /**
     * Delete material
     */
    async deleteMaterial(id) {
        try {
            await db.materials.delete(id);
            return { success: true, id };
        } catch (error) {
            console.error('Error deleting material:', error);
            throw error;
        }
    }

    /**
     * Update stock quantity
     */
    async updateStock(id, quantityChange, reason = '') {
        try {
            const material = await db.materials.get(id);
            if (!material) {
                throw new Error('Material not found');
            }

            const newQuantity = material.quantity + quantityChange;

            await db.materials.update(id, {
                quantity: Math.max(0, newQuantity),
                lastUpdated: new Date()
            });

            // Log the stock change
            await db.siteLogs.add({
                caption: `Stock Update: ${material.name}`,
                description: `${quantityChange > 0 ? 'Added' : 'Removed'} ${Math.abs(quantityChange)} ${material.unit}. Reason: ${reason}`,
                priority: 'Normal',
                status: 'active',
                location: 'Inventory',
                createdAt: new Date(),
                tags: ['inventory', 'stock-update']
            });

            return await this.getMaterialById(id);
        } catch (error) {
            console.error('Error updating stock:', error);
            throw error;
        }
    }

    /**
     * Get inventory statistics
     */
    async getInventoryStats() {
        try {
            const materials = await db.materials.toArray();

            const totalValue = materials.reduce((sum, m) =>
                sum + (m.quantity * m.cost), 0
            );

            const lowStockItems = materials.filter(m =>
                m.quantity < (m.minQuantity || 100)
            );

            const byCategory = {};
            materials.forEach(m => {
                const cat = m.category || 'Uncategorized';
                if (!byCategory[cat]) {
                    byCategory[cat] = { count: 0, value: 0 };
                }
                byCategory[cat].count++;
                byCategory[cat].value += m.quantity * m.cost;
            });

            return {
                totalItems: materials.length,
                totalValue,
                lowStockCount: lowStockItems.length,
                byCategory
            };
        } catch (error) {
            console.error('Error fetching inventory stats:', error);
            throw error;
        }
    }

    /**
     * Get low stock alerts
     */
    async getLowStockAlerts() {
        try {
            const materials = await db.materials.toArray();

            return materials.filter(m =>
                m.quantity < (m.minQuantity || 100)
            ).map(m => ({
                ...m,
                deficit: (m.minQuantity || 100) - m.quantity
            }));
        } catch (error) {
            console.error('Error fetching low stock alerts:', error);
            throw error;
        }
    }

    /**
     * Search materials
     */
    async searchMaterials(searchTerm) {
        try {
            const allMaterials = await db.materials.toArray();
            const term = searchTerm.toLowerCase();

            return allMaterials.filter(m =>
                m.name?.toLowerCase().includes(term) ||
                m.category?.toLowerCase().includes(term) ||
                m.supplier?.toLowerCase().includes(term)
            );
        } catch (error) {
            console.error('Error searching materials:', error);
            throw error;
        }
    }

    /**
     * Get materials by category
     */
    async getMaterialsByCategory(category) {
        try {
            return await db.materials
                .where('category')
                .equals(category)
                .toArray();
        } catch (error) {
            console.error('Error fetching materials by category:', error);
            throw error;
        }
    }

    /**
     * Calculate material cost for project
     */
    async getProjectMaterialCost(projectId) {
        try {
            const materials = await db.materials
                .where('projectId')
                .equals(projectId)
                .toArray();

            return materials.reduce((sum, m) =>
                sum + (m.quantity * m.cost), 0
            );
        } catch (error) {
            console.error('Error calculating project material cost:', error);
            throw error;
        }
    }
}

export default new MaterialService();
