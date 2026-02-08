import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../utils/localDb';
import {
    LayoutDashboard,
    Clock,
    AlertCircle,
    PlayCircle,
    Calendar,
    CheckCircle2,
    Plus,
    Maximize2,
    Trash2,
    Download,
    Check,
    X,
    FileText
} from 'lucide-react';

const SafetyOps = () => {
    const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
    const employees = useLiveQuery(() => db.employees.toArray()) || [];
    const blueprints = useLiveQuery(() => db.blueprints.toArray()) || [];
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', priority: 'Normal', assignedTo: '', blueprintId: '' });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await db.tasks.add({
                ...newTask,
                status: 'pending',
                createdAt: new Date(),
                assignedTo: 'Unassigned',
                projectId: 1
            });
            setShowAddForm(false);
            setNewTask({ title: '', priority: 'Normal' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Delete this operational task?')) {
            await db.tasks.delete(id);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === 'pending' ? 'active' : (currentStatus === 'active' ? 'completed' : 'pending');
        await db.tasks.update(id, { status: nextStatus });
    };

    const stats = {
        pending: tasks.filter(t => t.status === 'pending').length,
        active: tasks.filter(t => t.status === 'active').length,
        scheduled: tasks.filter(t => t.status === 'scheduled').length,
        done: tasks.filter(t => t.status === 'completed').length,
    };

    const completionRate = tasks.length > 0
        ? Math.round((stats.done / tasks.length) * 100)
        : 0;

    return (
        <div className="p-10 max-w-[1700px] mx-auto pb-24">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-600/20">
                        <LayoutDashboard className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                            Work Orders
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            Mandatory Directive Center
                        </p>
                        <div className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit border border-slate-200 dark:border-slate-800">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white mb-0.5">{currentTime}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className={`btn-primary h-14 ${showAddForm ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-none' : ''}`}
                    >
                        {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {showAddForm ? 'Close Editor' : 'Issue Binding Order'}
                    </button>
                </div>
            </div>

            {/* Quick Task Editor */}
            {showAddForm && (
                <div className="mb-12 p-8 premium-card bg-slate-900 border-none animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Directive Description</label>
                            <input
                                required
                                value={newTask.title}
                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 font-bold text-white outline-none focus:border-orange-500 transition-all"
                                placeholder="e.g. Mandatory column inspection"
                            />
                        </div>
                        <div className="w-full md:w-48 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Official Assigned</label>
                            <select
                                required
                                value={newTask.assignedTo}
                                onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 font-bold text-white outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Select Official</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-48 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Technical Authority</label>
                            <select
                                required
                                value={newTask.blueprintId}
                                onChange={e => setNewTask({ ...newTask, blueprintId: e.target.value })}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 font-bold text-white outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Select Authority</option>
                                {blueprints.map(bp => (
                                    <option key={bp.id} value={bp.id}>{bp.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-32 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Urgency</label>
                            <select
                                value={newTask.priority}
                                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 font-bold text-white outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                            >
                                <option value="Normal">Normal</option>
                                <option value="Urgent">Urgent</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="h-14 px-10 bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-orange-600/20 active:scale-95 transition-all">
                                Cement Order
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Metric Pills */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {[
                    { label: 'Idle (Blocker)', count: stats.pending, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
                    { label: 'Execution', count: stats.active, icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                    { label: 'Mobilizing', count: stats.scheduled, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
                    { label: 'Verified Truth', count: stats.done, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
                ].map((pill) => (
                    <div key={pill.label} className="premium-card flex items-center justify-between group overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{pill.label}</h3>
                            <span className="text-5xl font-black italic text-slate-900 dark:text-white">{pill.count}</span>
                        </div>
                        <div className={`w-14 h-14 ${pill.bg} ${pill.color} rounded-2xl flex items-center justify-center relative z-10 transition-transform group-hover:scale-110`}>
                            <pill.icon className="w-6 h-6" />
                        </div>
                        {/* Glow accent */}
                        <div className={`absolute top-0 right-0 w-24 h-24 ${pill.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity -mr-12 -mt-12`}></div>
                    </div>
                ))}
            </div>

            {/* Main Workspace */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Task List */}
                <div className="xl:col-span-8 space-y-6">
                    {tasks.length > 0 ? tasks.map((task) => (
                        <div key={task.id} className="premium-card premium-card-hover flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${task.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            {task.status === 'pending' ? 'IDLE' : task.status === 'active' ? 'ACTIVE' : 'VERIFIED'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-300">ORDER #{task.id}</span>
                                    </div>
                                    <h4 className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white leading-tight">
                                        {task.title}
                                    </h4>
                                    <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                                        <div className="flex items-center gap-1.5 ">
                                            <TrendingUp className="w-3 h-3 text-orange-500" />
                                            <span>{task.priority || 'NORMAL'}</span>
                                        </div>
                                        <span className="text-slate-200">|</span>
                                        <span>Assigned Official: {employees.find(e => e.id === parseInt(task.assignedTo))?.name || 'Unassigned'}</span>
                                        {task.blueprintId && (
                                            <>
                                                <span className="text-slate-200">|</span>
                                                <div className="flex items-center gap-1.5 text-blue-500">
                                                    <FileText className="w-3 h-3" />
                                                    <span>Authority Ref: REV.02</span>
                                                </div>
                                            </>
                                        )}
                                        <span className="text-slate-200">|</span>
                                        <div className="flex items-center gap-1.5 text-red-500 font-black">
                                            <span>DELAY BURDEN: ₹{(Math.random() * 50000 + 10000).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleToggleStatus(task.id, task.status)}
                                    className={`p-3 rounded-xl transition-all ${task.status === 'completed'
                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-orange-500'
                                        }`}
                                >
                                    <Check className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="premium-card text-center py-20 border-dashed opacity-40">
                            <LayoutDashboard className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-black uppercase italic">No Binding Orders Found</h3>
                        </div>
                    )}
                </div>

                {/* Performance Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Efficiency Gauge */}
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16"></div>
                        <h3 className="text-xl font-black uppercase italic mb-8 relative z-10">Site Efficiency</h3>

                        <div className="flex items-end gap-4 mb-10 relative z-10">
                            <span className="text-7xl font-black italic tracking-tighter text-white">
                                {completionRate}%
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-40">Completion Rate</span>
                        </div>

                        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden relative z-10">
                            <div
                                className="bg-orange-600 h-full transition-all duration-1000 shadow-[0_0_20px_rgba(234,88,12,0.5)]"
                                style={{ width: `${completionRate}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="premium-card">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:border-orange-500/50 border border-transparent transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                        <Download className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-tight">Generate Audit</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Download Report</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-200" />
                            </button>

                            <button className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:border-orange-500/50 border border-transparent transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                        <Check className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-tight">Batch Finalize</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Close Active Tasks</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-200" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple internal icon helper missing from imports
const TrendingUp = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);
const Edit3 = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
);
const ChevronRight = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>
);

export default SafetyOps;
