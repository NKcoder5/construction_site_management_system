import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../utils/localDb';
import {
    LayoutDashboard,
    Zap,
    Brain,
    BarChart3,
    MessageCircle,
    ArrowRight,
    Sparkles,
    FileText,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import aiService from '../../utils/aiService';

const ReportsDashboard = () => {
    const navigate = useNavigate();
    const [generating, setGenerating] = useState(false);
    const [activeReport, setActiveReport] = useState(null);

    const logs = useLiveQuery(() => db.siteLogs.toArray()) || [];
    const tasks = useLiveQuery(() => db.tasks.toArray()) || [];
    const finance = useLiveQuery(() => db.finance.toArray()) || [];
    const insights = useLiveQuery(() => db.ai_insights.orderBy('generatedAt').reverse().limit(5).toArray()) || [];

    const unverifiedLogs = logs.filter(l => !l.acknowledged).length;

    const handleReportClick = (category) => {
        setGenerating(true);
        setActiveReport(null);
        setTimeout(() => {
            setGenerating(false);
            const reportData = {
                'Safety': {
                    title: 'Authority Discrepancy',
                    content: 'Mistral-7B found a mismatch between the current Technical Authority (Revision 02) and recent site diary entries. Work in Sector B-3 may be following obsolete specs.',
                    actionLabel: 'Check Work Orders',
                    route: '/safety'
                },
                'Money': {
                    title: 'Constraint Alert',
                    content: 'Recent ledger activity indicates a potential budget leak in material procurement. Spend is trending 8% above the site balance cap.',
                    actionLabel: 'Open Site Ledger',
                    route: '/finance'
                },
                'Team': {
                    title: 'Accountability Gap',
                    content: `${unverifiedLogs} site diary entries remain unverified. Continuing without acknowledgement creates a "Ghost Site" effect where ground truth is lost.`,
                    actionLabel: 'Verify Site Diary',
                    route: '/feed'
                }
            }[category];
            setActiveReport(reportData);
        }, 1500);
    };

    return (
        <div className="p-10 max-w-[1600px] mx-auto pb-24">
            {/* Page Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 mb-12">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-3xl flex items-center justify-center shadow-xl">
                        <LayoutDashboard className="w-8 h-8 text-white dark:text-slate-900" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                            Site Status
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            Morning Site Briefing
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="premium-card py-4 px-8 border-none bg-orange-600 text-white flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Unverified Realities</p>
                            <p className="text-2xl font-black italic tracking-tighter">{unverifiedLogs}</p>
                        </div>
                        <ShieldCheck className="w-8 h-8 opacity-20" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Left: Intelligence Hub Mini-Nav */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Brain className="w-48 h-48" />
                        </div>

                        <div className="relative z-10 mb-12">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Mistral Auditor</h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Ground Truth Analysis</p>
                        </div>

                        <div className="space-y-3 relative z-10">
                            {[
                                { name: 'Safety Check', icon: ShieldCheck, type: 'Safety' },
                                { name: 'Money Check', icon: TrendingUp, type: 'Money' },
                                { name: 'Team Check', icon: BarChart3, type: 'Team' }
                            ].map((btn) => (
                                <button
                                    key={btn.type}
                                    onClick={() => handleReportClick(btn.type)}
                                    disabled={generating}
                                    className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/5 rounded-2xl transition-all group/btn disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <btn.icon className="w-4 h-4 text-white" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{btn.name}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/40 group-hover/btn:translate-x-1" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="premium-card">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-8">Recent Briefings</h3>
                        <div className="space-y-6">
                            {insights.map((insight, idx) => (
                                <div key={idx} className="flex gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-xl transition-all" onClick={() => setActiveReport(insight)}>
                                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                                        <MessageCircle className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-slate-800 dark:text-white line-clamp-2 leading-tight mb-1">
                                            {insight.title || 'SITE REPORT'}
                                        </p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(insight.generatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                            {insights.length === 0 && (
                                <p className="text-center text-slate-400 text-[10px] font-bold uppercase py-4">No stories yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Visualization & Active Report */}
                <div className="xl:col-span-8 space-y-8">
                    {generating ? (
                        <div className="premium-card h-[600px] flex flex-col items-center justify-center border-dashed">
                            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-950 rounded-full flex items-center justify-center mb-8 relative">
                                <Sparkles className="w-10 h-10 text-orange-600 animate-pulse" />
                                <div className="absolute inset-0 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h3 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white mb-2">Scanning Site for Stories...</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Mistral Intelligence Active</p>
                        </div>
                    ) : activeReport ? (
                        <div className="premium-card h-full min-h-[600px] bg-white dark:bg-slate-900 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">{activeReport.title}</h2>
                                </div>
                                <button onClick={() => setActiveReport(null)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-orange-600"><FileText className="w-5 h-5" /></button>
                            </div>

                            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wide text-sm leading-loose whitespace-pre-wrap px-4 italic">
                                "{activeReport.content}"
                            </div>

                            <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Briefing Verified by AI Foreperson</span>
                                </div>
                                <div className="flex gap-4">
                                    {activeReport.route && (
                                        <button
                                            onClick={() => navigate(activeReport.route)}
                                            className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-lg"
                                        >
                                            {activeReport.actionLabel || 'Enter Tunnel'}
                                        </button>
                                    )}
                                    <button onClick={() => setActiveReport(null)} className="text-[9px] font-black uppercase tracking-widest text-slate-400">Dismiss Briefing</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-8 h-full">
                            <div className="premium-card bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-12 group">
                                <FileText className="w-16 h-16 text-slate-200 mb-8 group-hover:text-orange-600 transition-colors duration-500" />
                                <h3 className="text-xl font-black italic uppercase italic text-slate-300">Select Intelligence Module</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">Run an audit to view live site health</p>
                            </div>

                            <div className="space-y-8">
                                <div className="premium-card p-10 bg-slate-900 text-white group overflow-hidden">
                                    <Zap className="w-8 h-8 text-orange-500 mb-6 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-xl font-black uppercase italic italic mb-2">Live Efficiency</h4>
                                    <div className="text-5xl font-black italic tracking-tighter text-orange-500 mb-6">72%</div>
                                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                        <div className="bg-orange-500 h-full w-[72%]"></div>
                                    </div>
                                </div>
                                <div className="premium-card p-10 bg-white dark:bg-slate-800 group">
                                    <Sparkles className="w-8 h-8 text-blue-500 mb-6 group-hover:rotate-12 transition-transform" />
                                    <h4 className="text-xl font-black uppercase italic italic mb-2">Auto-Scaling</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team availability prediction active.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportsDashboard;
