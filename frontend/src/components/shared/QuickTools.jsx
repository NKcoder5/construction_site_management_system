import React from 'react';
import { Calculator, FolderOpen, Shield, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickTools = () => {
    const tools = [
        {
            icon: Calculator,
            title: 'CALCULATOR',
            subtitle: 'SOLVE MATH & SAVE WORK',
            link: '/calculator',
            color: 'orange'
        },
        {
            icon: FolderOpen,
            title: 'DRAWING FILES',
            subtitle: 'FIND SITE DRAWINGS',
            link: '/drawings',
            color: 'orange'
        },
        {
            icon: Shield,
            title: 'SAFETY MANUAL',
            subtitle: 'SAFETY RULES & HELP',
            link: '/safety',
            color: 'orange'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Quick Tools Header */}
            <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    QUICK TOOLS
                </h2>
            </div>

            {/* Tools List */}
            <div className="space-y-4">
                {tools.map((tool, index) => (
                    <Link
                        key={index}
                        to={tool.link}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-900 transition-all group"
                    >
                        <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                            <tool.icon className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                {tool.title}
                            </div>
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                                {tool.subtitle}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Environment Settings */}
            <Link
                to="/settings"
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-900 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-orange-500 transition-colors">
                        ENVIRONMENT SETTINGS
                    </span>
                </div>
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">
                    V3.0A-61
                </span>
            </Link>
        </div>
    );
};

export default QuickTools;
