import React, { useState } from 'react';
import { Wallet, Plus, TrendingUp, TrendingDown, Truck, Download, CheckCircle } from 'lucide-react';
import StatusBadge from '../shared/StatusBadge';

const FinanceHub = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'allocations', 'ledger'

    const transactions = [
        {
            id: 1,
            description: 'Fuel for Excavator',
            category: 'LOGISTICS',
            amount: -1200,
            date: '2/5/2026',
            icon: 'down'
        },
        {
            id: 2,
            description: 'Cement Purchase (50 Bags)',
            category: 'MATERIALS',
            amount: -5000,
            date: '2/4/2026',
            icon: 'down'
        },
        {
            id: 3,
            description: 'Sector 7 Milestone Payment',
            category: 'ADVANCE',
            amount: 50000,
            date: '2/1/2026',
            icon: 'up'
        }
    ];

    const payloads = [
        {
            id: 1,
            type: 'Cash Advance',
            amount: '2000',
            site: 'SECTOR A-1',
            assignedTo: 'John Foreman',
            status: 'PENDING',
            icon: 'J'
        },
        {
            id: 2,
            type: 'Cement Bags',
            amount: '50 BAGS',
            site: 'EAST BRIDGE',
            assignedTo: 'Nandha Kumar',
            status: 'UTILIZED',
            icon: 'N'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-[1600px] mx-auto px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Wallet className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tight leading-none">
                                TREASURY & LOGISTICS
                            </h1>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                                FINANCIAL COMMAND CENTER
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-8 border-b border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-3 font-bold text-sm uppercase tracking-wide transition-all ${activeTab === 'dashboard'
                            ? 'text-slate-900 dark:text-white border-b-2 border-orange-500'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        DASHBOARD
                    </button>
                    <button
                        onClick={() => setActiveTab('allocations')}
                        className={`px-6 py-3 font-bold text-sm uppercase tracking-wide transition-all ${activeTab === 'allocations'
                            ? 'text-slate-900 dark:text-white border-b-2 border-orange-500'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        ALLOCATIONS
                    </button>
                    <button
                        onClick={() => setActiveTab('ledger')}
                        className={`px-6 py-3 font-bold text-sm uppercase tracking-wide transition-all ${activeTab === 'ledger'
                            ? 'text-slate-900 dark:text-white border-b-2 border-orange-500'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                    >
                        LEDGER
                    </button>
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        {/* Metric Cards */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                                        <Wallet className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        AVAILABLE BUDGET
                                    </p>
                                </div>
                                <p className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                                    ₹43,800
                                </p>
                                <div className="flex items-center gap-1 text-emerald-500">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs font-bold">12% vs last month</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                                        <TrendingDown className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        PROJECT SPEND
                                    </p>
                                </div>
                                <p className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                                    ₹6,200
                                </p>
                                <div className="flex items-center gap-1 text-red-500">
                                    <TrendingDown className="w-4 h-4" />
                                    <span className="text-xs font-bold">5% vs last month</span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                                        <Truck className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        PENDING PAYLOADS
                                    </p>
                                </div>
                                <p className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                                    1
                                </p>
                                <div className="flex items-center gap-1 text-emerald-500">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs font-bold">2 vs last month</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-12 gap-8">
                            {/* Recent Transactions */}
                            <div className="col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                        RECENT TRANSACTIONS
                                    </h2>
                                    <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all">
                                        <Plus className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {transactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.icon === 'down'
                                                    ? 'bg-red-50 dark:bg-red-900/20'
                                                    : 'bg-emerald-50 dark:bg-emerald-900/20'
                                                    }`}>
                                                    {transaction.icon === 'down' ? (
                                                        <TrendingDown className="w-5 h-5 text-red-500" />
                                                    ) : (
                                                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                        {transaction.description}
                                                    </p>
                                                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                                                        {transaction.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-lg font-black ${transaction.amount > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                                                }`}>
                                                {transaction.amount > 0 ? '+' : ''} ₹{Math.abs(transaction.amount).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Active Payloads */}
                            <div className="col-span-5 bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 text-white">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black uppercase tracking-tight">
                                        ACTIVE PAYLOADS
                                    </h2>
                                    <button className="text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-all">
                                        ASSIGN NEW
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {payloads.map((payload) => (
                                        <div
                                            key={payload.id}
                                            className="p-4 bg-slate-800 dark:bg-slate-900 rounded-xl"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                                        <span className="text-sm font-black">{payload.icon}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black">{payload.type}</p>
                                                        <p className="text-xs text-slate-400">{payload.amount} • {payload.site}</p>
                                                    </div>
                                                </div>
                                                <StatusBadge status={payload.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Allocations Tab */}
                {activeTab === 'allocations' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    RESOURCE PAYLOAD DISPATCH
                                </h2>
                                <p className="text-sm text-slate-400 uppercase tracking-wide mt-1">
                                    ASSIGN MATERIALS OR CASH TO SITE RUNNERS
                                </p>
                            </div>
                            <button className="px-6 py-3 bg-slate-900 dark:bg-slate-950 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-slate-800 dark:hover:bg-slate-900 transition-all">
                                NEW ASSIGNMENT
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {payloads.map((payload) => (
                                <div
                                    key={payload.id}
                                    className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                                                <Wallet className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    PAYLOAD
                                                </p>
                                                <p className="text-lg font-black text-slate-900 dark:text-white">
                                                    {payload.type}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={payload.status} />
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                Amount
                                            </span>
                                            <span className="text-sm font-black text-slate-900 dark:text-white">
                                                {payload.amount}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                Site
                                            </span>
                                            <span className="text-sm font-black text-slate-900 dark:text-white">
                                                {payload.site}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                Assigned To
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                                    <span className="text-[10px] font-black text-white">{payload.icon}</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {payload.assignedTo}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <button className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-slate-100 dark:hover:bg-slate-600 transition-all">
                                            CANCEL
                                        </button>
                                        <button className="flex-1 px-4 py-2 bg-slate-900 dark:bg-slate-950 text-white rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-slate-800 dark:hover:bg-slate-900 transition-all">
                                            MARK DONE
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Ledger Tab */}
                {activeTab === 'ledger' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    TRANSACTION LEDGER
                                </h2>
                                <p className="text-sm text-slate-400 uppercase tracking-wide mt-1">
                                    ALL PROJECT EXPENSES AND INCOME
                                </p>
                            </div>
                            <button className="px-6 py-3 bg-orange-500 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                                RECORD TRANSACTION
                            </button>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
                                            DATE
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
                                            DESCRIPTION
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
                                            CATEGORY
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-wider">
                                            AMOUNT
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                                        {transaction.date}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {transaction.description}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] font-black uppercase tracking-wider">
                                                    {transaction.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`text-base font-black ${transaction.amount > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                                                    }`}>
                                                    {transaction.amount > 0 ? '+' : ''} ₹{Math.abs(transaction.amount).toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinanceHub;
