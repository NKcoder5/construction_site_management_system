import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Users,
    FolderOpen,
    Briefcase,
    Wallet,
    Plus,
    Globe,
    Sun,
    Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);

    useEffect(() => {
        const handleStatus = () => setIsOnline(window.navigator.onLine);
        window.addEventListener('online', handleStatus);
        window.addEventListener('offline', handleStatus);
        return () => {
            window.removeEventListener('online', handleStatus);
            window.removeEventListener('offline', handleStatus);
        };
    }, []);

    const menuItems = [
        {
            name: 'Work Reports',
            path: '/feed',
            icon: Home,
        },
        {
            name: 'Team List',
            path: '/employees',
            icon: Users,
        },
        {
            name: 'Drawing Files',
            path: '/drawings',
            icon: FolderOpen,
        },
        {
            name: 'Work Manager',
            path: '/ops',
            icon: Briefcase,
        },
        {
            name: 'Finance & Logistics',
            path: '/finance',
            icon: Wallet,
        },
        {
            name: 'New Report',
            path: '/create',
            icon: Plus,
        },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col">
            {/* Logo Section */}
            <div className="px-8 py-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-black text-white">YC</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight leading-none">
                            YOGESH
                        </h1>
                        <span className="block text-orange-500 text-[10px] tracking-[0.3em] not-italic font-black mt-0.5">
                            CONSTRUCTIONS
                        </span>
                    </div>
                </div>

                {/* Network Status */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOnline ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                            <Globe className={`w-4 h-4 ${isOnline ? 'text-orange-500' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-wider leading-none">
                                {isOnline ? 'NETWORK ONLINE' : 'OFFLINE MODE'}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></span>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                                    {isOnline ? 'CLOUD SYNC ACTIVE' : 'DATABASE LOCAL ONLY'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-200 ${isActive
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                            <span className={`text-sm font-bold ${isActive ? 'text-white' : ''}`}>
                                {item.name}
                            </span>
                            {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Profile & Theme Toggle */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/settings')}
                        className="flex-1 flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group"
                    >
                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                            <span className="text-sm font-black text-slate-600 dark:text-slate-300">NK</span>
                        </div>
                        <div className="flex-1 text-left">
                            <span className="block text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-wider leading-none">
                                NANDHA KUMAR
                            </span>
                            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mt-1">
                                LEAD SUPERVISOR
                            </span>
                        </div>
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="w-11 h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                    >
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
