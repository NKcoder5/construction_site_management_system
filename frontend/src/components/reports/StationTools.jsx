import React from 'react';
import { Calculator, FileSearch, ShieldCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StationTools = () => {
    const navigate = useNavigate();

    const tools = [
        {
            name: 'CALCULATOR',
            desc: 'SOLVE MATH & SAVE WORK',
            icon: Calculator,
            color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600',
            action: () => window.dispatchEvent(new CustomEvent('open-calculator'))
        },
        {
            name: 'DRAWING FILES',
            desc: 'FIND SITE DRAWINGS',
            icon: FileSearch,
            color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
            action: () => navigate('/blueprints')
        },
        {
            name: 'SAFETY MANUAL',
            desc: 'SAFETY RULES & HELP',
            icon: ShieldCheck,
            color: 'bg-green-50 dark:bg-green-900/20 text-green-600',
            action: () => navigate('/safety')
        },
    ];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-6 bg-orange-600 rounded-full"></div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase italic tracking-tighter text-2xl">Quick Tools</h3>
            </div>

            <div className="space-y-4">
                {tools.map((tool) => (
                    <button
                        key={tool.name}
                        onClick={tool.action}
                        className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/5 transition-all group overflow-hidden relative"
                    >
                        {/* Hover accent */}
                        <div className="absolute left-0 top-0 w-1 h-full bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <tool.icon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{tool.name}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{tool.desc}</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-orange-600 transition-all transform group-hover:translate-x-1" />
                    </button>
                ))}
            </div>

            {/* Bottom Version/Sync Pill */}
            <div className="mt-10 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <FileSearch className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Environment Settings</span>
                </div>
                <div className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full text-[9px] font-black tracking-widest">
                    V3.0.0-SYNC
                </div>
            </div>
        </div>
    );
};

export default StationTools;
