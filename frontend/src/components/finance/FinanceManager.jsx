import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../utils/localDb';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Truck,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Layers,
    History,
    X,
    Trash2
} from 'lucide-react';

const FinanceManager = () => {
    const transactions = useLiveQuery(() => db.finance.orderBy('date').reverse().toArray()) || [];
    const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
    const [activeTab, setActiveTab] = useState('ledger');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTx, setNewTx] = useState({ description: '', amount: '', type: 'expense', category: 'Materials', taskId: '' });

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await db.finance.add({
                ...newTx,
                amount: parseFloat(newTx.amount),
                date: new Date(),
                projectId: 1,
                taskId: newTx.taskId ? parseInt(newTx.taskId) : null
            });
            setShowAddForm(false);
            setNewTx({ description: '', amount: '', type: 'expense', category: 'Materials', taskId: '' });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTransaction = async (id) => {
        if (window.confirm('Delete this transaction?')) {
            await db.finance.delete(id);
        }
    };

    return (
        <div className="p-10 max-w-[1600px] mx-auto pb-24">
            {/* Page Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 mb-12">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-green-600 rounded-3xl flex items-center justify-center shadow-xl shadow-green-600/20">
                        <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">
                            Site Expenses
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            Constraint & Reality Check
                        </p>
                    </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex items-center">
                    {[
                        { id: 'overview', label: 'Constraint Overview' },
                        { id: 'spending', label: 'Money Out' },
                        { id: 'ledger', label: 'Ledger' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xl'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Available Budget */}
                <div className="premium-card relative overflow-hidden group border-none bg-slate-100 dark:bg-slate-800/50">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="w-24 h-24 text-slate-400" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Site Balance</h3>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">₹{balance.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase tracking-wide">
                        <TrendingUp className="w-4 h-4" />
                        <span>Ready for spend</span>
                    </div>
                </div>

                {/* Project Spend */}
                <div className="premium-card relative overflow-hidden group border-none bg-slate-100 dark:bg-slate-800/50">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingDown className="w-24 h-24 text-slate-400" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Money Out</h3>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">₹{totalExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-500 font-bold text-[10px] uppercase tracking-wide">
                        <TrendingDown className="w-4 h-4" />
                        <span>Burn Rate Active</span>
                    </div>
                </div>

                {/* Material Constraints */}
                <div className="premium-card relative overflow-hidden group border-none bg-slate-100 dark:bg-slate-800/50">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Truck className="w-24 h-24 text-slate-400" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Material Constraints</h3>
                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">0</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-[10px] uppercase tracking-wide">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Logistics Cleared</span>
                    </div>
                </div>
            </div>

            {/* Secondary Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Recent Transactions Table */}
                <div className="xl:col-span-8 premium-card p-0 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <History className="w-5 h-5 text-orange-600" />
                            <h2 className="text-xl font-black italic uppercase tracking-tighter">Site Ledger</h2>
                        </div>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showAddForm ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-orange-600'
                                }`}
                        >
                            {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4">
                            <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="md:col-span-1">
                                    <input
                                        required
                                        className="w-full h-12 bg-white dark:bg-slate-900 px-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 outline-none focus:border-orange-500"
                                        placeholder="Reason (e.g. Cement)"
                                        value={newTx.description}
                                        onChange={e => setNewTx({ ...newTx, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <select
                                        className="w-full h-12 bg-white dark:bg-slate-900 px-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 outline-none appearance-none cursor-pointer"
                                        value={newTx.taskId}
                                        onChange={e => setNewTx({ ...newTx, taskId: e.target.value })}
                                    >
                                        <option value="">Link to Order</option>
                                        {tasks.map(t => (
                                            <option key={t.id} value={t.id}>{t.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                                    <input
                                        required
                                        type="number"
                                        className="w-full h-12 bg-white dark:bg-slate-900 pl-10 pr-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 outline-none focus:border-orange-500"
                                        placeholder="Cost"
                                        value={newTx.amount}
                                        onChange={e => setNewTx({ ...newTx, amount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <select
                                        className="w-full h-12 bg-white dark:bg-slate-900 px-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 outline-none appearance-none cursor-pointer"
                                        value={newTx.type}
                                        onChange={e => setNewTx({ ...newTx, type: e.target.value })}
                                    >
                                        <option value="expense">Paid</option>
                                        <option value="income">Received</option>
                                    </select>
                                </div>
                                <button type="submit" className="h-12 bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-orange-600/20">
                                    Log Payment
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="p-4 overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-6 py-4">Tracking ID</th>
                                    <th className="px-6 py-4">Nature</th>
                                    <th className="px-6 py-4">Cost</th>
                                    <th className="px-6 py-4 text-right">Ledger Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? transactions.map((t, idx) => (
                                    <tr key={idx} className="bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-colors group">
                                        <td className="px-6 py-5 rounded-l-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-green-100/50 text-green-600' : 'bg-orange-100/50 text-orange-600'}`}>
                                                    {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[200px]">{t.description}</span>
                                                    {t.taskId && (
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Linked to Order #{t.taskId}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider bg-slate-200/50 dark:bg-slate-900 px-3 py-1 rounded-lg">{t.category}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-sm font-black italic ${t.type === 'income' ? 'text-green-600' : 'text-orange-600'}`}>
                                                {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 rounded-r-2xl text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg text-[9px] font-black uppercase">Cleared</span>
                                                <button
                                                    onClick={() => handleDeleteTransaction(t.id)}
                                                    className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-20 text-slate-400 font-bold uppercase italic tracking-widest">No recent ledger activity</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Logistics Widget */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden group min-h-[400px]">
                        {/* Abstract BG */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <Truck className="w-96 h-96 absolute -bottom-20 -right-20" />
                        </div>

                        <div className="flex justify-between items-start mb-12 relative z-10">
                            <div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">Material Reality</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Ground Truth Stream</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center py-10 relative z-10">
                            <Truck className="w-16 h-16 text-white/10 mb-6" />
                            <p className="text-white/40 font-black uppercase italic tracking-widest text-sm">No Pending Deliveries</p>
                        </div>
                    </div>

                    <div className="premium-card p-10 bg-orange-600 border-none group">
                        <Layers className="w-10 h-10 text-white mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Site Integrity</h3>
                        <p className="text-white/80 text-sm font-bold mb-8">Audit expenditures against site progress and material usage.</p>
                        <button className="w-full h-12 bg-white text-orange-600 font-black uppercase tracking-widest text-xs rounded-xl hover:shadow-xl transition-all active:scale-95">
                            Audit Site Authority
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceManager;
