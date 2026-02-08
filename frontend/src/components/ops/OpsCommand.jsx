import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Clock,
    CheckCircle2,
    AlertCircle,
    Calendar,
    Filter,
    MoreHorizontal,
    ChevronRight,
    TrendingUp,
    Briefcase,
    PlayCircle,
    CheckSquare,
    ArrowUpRight,
    Plus,
    Trash2,
    LayoutDashboard,
    ListTodo,
    Download,
    X,
    Save,
    Bell,
    Users,
    Package,
    IndianRupee,
    FileText,
    ExternalLink,
    RefreshCw
} from 'lucide-react';
import {
    taskService,
    reportService,
    employeeService,
    materialService,
    financeService
} from '../../services';
import { useNavigate } from 'react-router-dom';

const OpsCommand = () => {
    const [tasks, setTasks] = useState([]);
    const [reports, setReports] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [finances, setFinances] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    // Stats
    const [stats, setStats] = useState({
        taskCompletion: 0,
        activeTasks: 0,
        reportHealth: 0, // % of locations reported today
        teamLoad: 0, // % of employees 'busy'
        budgetStatus: 'healthy',
        lowStockItems: 0
    });

    const [alerts, setAlerts] = useState([]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Load all data in parallel
            const [
                allTasks,
                allReports,
                employeeStats,
                allMaterials,
                financeSummary
            ] = await Promise.all([
                taskService.getAllTasks(),
                reportService.getAllReports(),
                employeeService.getEmployeeStats(),
                materialService.getAllMaterials(),
                financeService.getFinancialSummary()
            ]);

            setTasks(allTasks);
            setReports(allReports.slice(0, 5)); // Only show recent 5 for abstract view
            setEmployees(employeeStats);
            setMaterials(allMaterials);
            setFinances(financeSummary);

            // Calculate Metrics
            const completedTasks = allTasks.filter(t => t.status === 'done' || t.status === 'completed').length;
            const completionRate = allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 0;
            const activeCount = allTasks.filter(t => t.status === 'active' || t.status === 'in-progress').length;

            // Report Health
            const locations = ['North Gate', 'Structure A', 'Sector 9', 'Main Office', 'Drainage Area'];
            const reportedLocations = [...new Set(allReports.filter(r => {
                const today = new Date().toISOString().split('T')[0];
                const reportDate = new Date(r.createdAt).toISOString().split('T')[0];
                return today === reportDate;
            }).map(r => r.location))];

            const health = (reportedLocations.length / locations.length) * 100;

            const busyRate = employeeStats.total > 0 ? ((employeeStats.total - employeeStats.available) / employeeStats.total) * 100 : 0;

            const lowStock = allMaterials.filter(m => m.stock <= (m.minStock || 5)).length;

            setStats({
                taskCompletion: completionRate,
                activeTasks: activeCount,
                reportHealth: Math.min(100, health || 0),
                teamLoad: busyRate,
                budgetStatus: financeSummary?.isOverBudget ? 'critical' : 'healthy',
                lowStockItems: lowStock
            });

            // Generate Alerts
            const newAlerts = [];

            // Critical: Unacknowledged high priority reports
            const criticalReports = allReports.filter(r => r.priority === 'High' && !r.acknowledged);
            criticalReports.forEach(r => {
                newAlerts.push({
                    id: `report-${r.id}`,
                    type: 'CRITICAL',
                    title: 'High Priority Report',
                    message: r.caption,
                    time: r.createdAt,
                    link: '/feed'
                });
            });

            // Warning: Overdue tasks
            const overdueTasks = allTasks.filter(t => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date());
            overdueTasks.forEach(t => {
                newAlerts.push({
                    id: `task-${t.id}`,
                    type: 'WARNING',
                    title: 'Overdue Task',
                    message: t.title,
                    time: t.dueDate,
                    link: '/ops'
                });
            });

            // Info: Low stock
            if (lowStock > 0) {
                newAlerts.push({
                    id: 'material-low',
                    type: 'INFO',
                    title: 'Inventory Alert',
                    message: `${lowStock} items are below minimum stock level`,
                    time: new Date(),
                    link: '/finance'
                });
            }

            setAlerts(newAlerts.sort((a, b) => new Date(b.time) - new Date(a.time)));

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleUpdateTask = async (id, status) => {
        try {
            await taskService.updateTask(id, { status });
            loadDashboardData();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-[1600px] mx-auto px-8 py-8">

                {/* Header */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-900/20">
                            <LayoutDashboard className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter leading-none">
                                OPS COMMAND
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    SITE OPERATIONS HUB
                                </p>
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    <Clock className="w-3 h-3" />
                                    {currentTime.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={loadDashboardData}
                            className={`p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-orange-600 transition-all ${loading ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/create')}
                            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            NEW OPERATION
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* Left Column: Command Summary & Tasks */}
                    <div className="xl:col-span-8 space-y-8">

                        {/* Summary Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm group">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TASK COMPLETION</p>
                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">{stats.taskCompletion.toFixed(0)}%</span>
                                </div>
                                <div className="mt-4 w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full transition-all duration-1000"
                                        style={{ width: `${stats.taskCompletion}%` }}
                                    />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">REPORT HEALTH</p>
                                    <div className={`w-2 h-2 rounded-full ${stats.reportHealth > 80 ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                </div>
                                <span className="text-4xl font-black text-slate-900 dark:text-white">{stats.reportHealth.toFixed(0)}%</span>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">LOCATIONS COVERED</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TEAM LOAD</p>
                                    <Users className="w-4 h-4 text-blue-500" />
                                </div>
                                <span className="text-4xl font-black text-slate-900 dark:text-white">{stats.teamLoad.toFixed(0)}%</span>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">PERSONNEL ENGAGED</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BUDGET</p>
                                    <IndianRupee className={`w-4 h-4 ${stats.budgetStatus === 'critical' ? 'text-red-500' : 'text-emerald-500'}`} />
                                </div>
                                <span className={`text-3xl font-black uppercase ${stats.budgetStatus === 'critical' ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {stats.budgetStatus}
                                </span>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">FINANCIAL HEALTH</p>
                            </div>
                        </div>

                        {/* Recent Highlights (Abstract Reports) */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Daily Highlights</h3>
                                </div>
                                <button
                                    onClick={() => navigate('/feed')}
                                    className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-600 transition-colors flex items-center gap-1"
                                >
                                    View Full Feed <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reports.length > 0 ? reports.map(report => (
                                    <div key={report.id} className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-100/5 hover:border-orange-200 dark:hover:border-orange-900 transition-all group">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${report.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                {report.location}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400">{new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 mb-3">{report.caption}</p>
                                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                                            <Briefcase className="w-3 h-3" />
                                            <span>{report.status || 'LOGGED'}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 text-center py-12">
                                        <p className="text-slate-400 font-bold text-xs uppercase">No reports for today yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Top Priority Tasks */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                        <ListTodo className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Current Pipeline</h3>
                                </div>
                                <button
                                    onClick={() => navigate('/ops')}
                                    className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-1"
                                >
                                    Manager View <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {tasks.filter(t => t.status !== 'completed').slice(0, 5).map(task => (
                                    <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-100/5 hover:bg-white dark:hover:bg-slate-900 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleUpdateTask(task.id, 'completed')}
                                                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-transparent hover:text-orange-500 hover:border-orange-500 transition-all"
                                            >
                                                <CheckSquare className="w-4 h-4" />
                                            </button>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-none mb-1.5">{task.title}</h4>
                                                <div className="flex items-center gap-3 text-[9px] font-black uppercase text-slate-400">
                                                    <span className={`flex items-center gap-1 ${task.priority === 'High' ? 'text-red-500' : ''}`}>
                                                        <TrendingUp className="w-3 h-3" /> {task.priority}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{task.category || 'SITEWORK'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {task.dueDate && (
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">DUE DATE</p>
                                                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase">{new Date(task.dueDate).toLocaleDateString()}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Alerts & Side Panels */}
                    <div className="xl:col-span-4 space-y-8">

                        {/* Alert Engine */}
                        <div className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2" />

                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-orange-500" />
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Ops Alerts</h3>
                                </div>
                                {alerts.length > 0 && (
                                    <span className="bg-orange-600 text-[10px] font-black px-2 py-0.5 rounded-full">{alerts.length}</span>
                                )}
                            </div>

                            <div className="space-y-4 relative z-10">
                                {alerts.length > 0 ? alerts.slice(0, 5).map(alert => (
                                    <div key={alert.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group" onClick={() => navigate(alert.link)}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${alert.type === 'CRITICAL' ? 'bg-red-500' : alert.type === 'WARNING' ? 'bg-orange-500' : 'bg-blue-500'
                                                }`}>
                                                {alert.type}
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-500">{new Date(alert.time).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs font-black uppercase mb-1">{alert.title}</p>
                                        <p className="text-[10px] text-slate-400 line-clamp-2">{alert.message}</p>
                                    </div>
                                )) : (
                                    <div className="text-center py-8">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500/20 mx-auto mb-3" />
                                        <p className="text-xs font-bold text-slate-500 uppercase">System Status: All Clear</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick View Panels */}
                        <div className="space-y-4">
                            {/* Inventory Pulse */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Pulse</span>
                                    </div>
                                    {stats.lowStockItems > 0 && (
                                        <span className="text-[8px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase">LOW STOCK</span>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {materials.slice(0, 3).map(mat => (
                                        <div key={mat.id} className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase truncate pr-4">{mat.name}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-slate-100 dark:bg-slate-900 rounded-full h-1">
                                                    <div
                                                        className={`h-full rounded-full ${mat.stock < (mat.minStock || 5) ? 'bg-red-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${Math.min(100, (mat.stock / (mat.maxStock || 100)) * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white">{mat.stock} {mat.unit}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => navigate('/finance')}
                                    className="w-full mt-6 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-[10px] font-black text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest"
                                >
                                    Manage Logistics
                                </button>
                            </div>

                            {/* Rapid Action Menu */}
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Rapid Actions</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => navigate('/create')}
                                        className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all border border-transparent hover:border-orange-100"
                                    >
                                        <Plus className="w-5 h-5 text-orange-500" />
                                        <span className="text-[8px] font-black uppercase text-slate-500">Quick Log</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('/employees')}
                                        className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all border border-transparent hover:border-blue-100"
                                    >
                                        <Users className="w-5 h-5 text-blue-500" />
                                        <span className="text-[8px] font-black uppercase text-slate-500">Call Team</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] animate-pulse">Syncing Ops Database</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpsCommand;
