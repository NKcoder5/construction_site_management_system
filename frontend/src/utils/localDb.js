import Dexie from 'dexie';

/**
 * YogeshConstructionsDB - Local First Database
 * Using singleton pattern to handle HMR and double-initialization
 */
const db = new Dexie('YogeshConstructionsDB');

// Define schema - Only one version should be active per session
// We use version 3 to force update from any previous inconsistent states
db.version(3).stores({
    // Core Operations
    siteLogs: '++id, caption, status, priority, createdAt, acknowledged, location, tags, notes, bookmarked',
    contacts: '++id, name, role, email, phone',

    // Finance Management
    finance: '++id, type, amount, category, description, date, projectId',
    allocations: '++id, resource, amount, assignedTo, site, status, date',

    // Document Management
    blueprints: '++id, name, version, uploadedAt, size, path, projectId',

    // Employee Management
    employees: '++id, name, role, skills, phone, email, availability, joinedDate, status, salary',
    tasks: '++id, title, description, assignedTo, projectId, status, priority, dueDate, createdAt, completedAt',

    // Materials & Inventory
    materials: '++id, name, quantity, unit, category, supplier, cost, lastUpdated, projectId',

    // Projects
    projects: '++id, name, location, startDate, endDate, status, budget, spent',

    // Reports
    reports: '++id, title, type, content, generatedAt, generatedBy, projectId, period',

    // AI & Intelligence
    ai_conversations: '++id, userId, messages, context, createdAt, updatedAt',
    ai_insights: '++id, type, data, insight, confidence, generatedAt',

    // Weather Cache (for offline)
    weather_cache: 'location, temperature, condition, humidity, windSpeed, forecast, timestamp',

    // Settings
    settings: 'key, value',
    calculations: '++id, expression, result, title, createdAt'
});

// Seed data for fresh installations
db.on('populate', async () => {
    console.log('🌱 Seeding initial database state...');
    try {
        // Seed contacts
        await db.contacts.bulkAdd([
            { name: 'Nandha Kumar', role: 'Lead Supervisor', email: 'nandha@yc.com', phone: '555-0101' },
            { name: 'Ravi Singh', role: 'Site Engineer', email: 'ravi@yc.com', phone: '555-0102' },
            { name: 'Yogesh Kumar', role: 'Project Manager', email: 'yogesh@yc.com', phone: '555-0100' }
        ]);

        // Seed employees
        await db.employees.bulkAdd([
            {
                name: 'Nandha Kumar',
                role: 'Lead Supervisor',
                skills: ['Project Management', 'Safety', 'Quality Control'],
                phone: '555-0101',
                email: 'nandha@yc.com',
                availability: 'available',
                joinedDate: new Date('2024-01-15'),
                status: 'active',
                salary: 75000
            },
            {
                name: 'Ravi Singh',
                role: 'Site Engineer',
                skills: ['Structural Design', 'CAD', 'Site Planning'],
                phone: '555-0102',
                email: 'ravi@yc.com',
                availability: 'available',
                joinedDate: new Date('2024-02-01'),
                status: 'active',
                salary: 65000
            },
            {
                name: 'Priya Sharma',
                role: 'Mason',
                skills: ['Bricklaying', 'Plastering', 'Foundation Work'],
                phone: '555-0103',
                email: 'priya@yc.com',
                availability: 'available',
                joinedDate: new Date('2024-03-10'),
                status: 'active',
                salary: 45000
            },
            {
                name: 'Arjun Patel',
                role: 'Electrician',
                skills: ['Wiring', 'Panel Installation', 'Troubleshooting'],
                phone: '555-0104',
                email: 'arjun@yc.com',
                availability: 'on-leave',
                joinedDate: new Date('2024-01-20'),
                status: 'active',
                salary: 50000
            },
            {
                name: 'Lakshmi Iyer',
                role: 'Plumber',
                skills: ['Pipe Fitting', 'Drainage', 'Water Systems'],
                phone: '555-0105',
                email: 'lakshmi@yc.com',
                availability: 'available',
                joinedDate: new Date('2024-02-15'),
                status: 'active',
                salary: 48000
            }
        ]);

        // Seed a sample project
        const projectId = await db.projects.add({
            name: 'Residential Complex - Phase 1',
            location: 'North Wing Construction Site',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            status: 'in-progress',
            budget: 5000000,
            spent: 1250000
        });

        // Seed some materials
        await db.materials.bulkAdd([
            {
                name: 'Cement',
                quantity: 500,
                unit: 'bags',
                category: 'Building Materials',
                supplier: 'ABC Suppliers',
                cost: 350,
                lastUpdated: new Date(),
                projectId: projectId
            },
            {
                name: 'Steel Rods (12mm)',
                quantity: 2000,
                unit: 'kg',
                category: 'Structural',
                supplier: 'Steel Works Ltd',
                cost: 45,
                lastUpdated: new Date(),
                projectId: projectId
            },
            {
                name: 'Bricks',
                quantity: 10000,
                unit: 'pieces',
                category: 'Building Materials',
                supplier: 'Local Brick Factory',
                cost: 8,
                lastUpdated: new Date(),
                projectId: projectId
            }
        ]);

        // Seed some tasks
        await db.tasks.bulkAdd([
            {
                title: 'Foundation Inspection',
                description: 'Inspect foundation work for quality and compliance',
                assignedTo: 2, // Ravi Singh
                projectId: projectId,
                status: 'in-progress',
                priority: 'high',
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                createdAt: new Date()
            },
            {
                title: 'Electrical Wiring - 1st Floor',
                description: 'Complete electrical wiring for first floor apartments',
                assignedTo: 4, // Arjun Patel
                projectId: projectId,
                status: 'pending',
                priority: 'medium',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                createdAt: new Date()
            },
            {
                title: 'Plumbing Installation',
                description: 'Install water supply and drainage systems',
                assignedTo: 5, // Lakshmi Iyer
                projectId: projectId,
                status: 'pending',
                priority: 'medium',
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                createdAt: new Date()
            }
        ]);

        // Seed settings
        await db.settings.bulkAdd([
            { key: 'theme', value: 'dark' },
            { key: 'ai_model', value: 'phi3' },
            { key: 'auto_backup', value: 'true' },
            { key: 'site_location', value: 'Mumbai, Maharashtra' }
        ]);

        console.log('✅ Database populated with seed data');
    } catch (error) {
        console.error('❌ Failed to seed database:', error);
    }
});

// Open database with robust error handling
/**
 * Note: db.open() is not strictly required as Dexie opens on first transaction,
 * but explicit opening helps catch SchemaErrors and VersionErrors early.
 */
const initDb = async () => {
    try {
        if (!db.isOpen()) {
            await db.open();
            console.log('✅ YogeshConstructionsDB connected');
        }
    } catch (err) {
        console.error("💥 Failed to open YogeshConstructionsDB:", err.stack || err);
        if (err.name === 'VersionError') {
            console.warn("Database version mismatch. You might need to clear browser data.");
        }
    }
};

// Initialize
initDb();

export default db;
