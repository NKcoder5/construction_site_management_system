import React, { useState } from 'react';
import { Settings as SettingsIcon, Database, Shield, Palette, Download, Upload, Trash2, RefreshCw } from 'lucide-react';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('terminal');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-[1200px] mx-auto px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-slate-900 dark:bg-slate-950 rounded-2xl flex items-center justify-center shadow-lg">
                        <SettingsIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tight leading-none">
                            APP SETTINGS
                        </h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                            SYSTEM CONFIGURATION & PREFERENCES
                        </p>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="col-span-3 space-y-2">
                        <button
                            onClick={() => setActiveSection('terminal')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${activeSection === 'terminal'
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                        >
                            TERMINAL CONFIG
                        </button>
                        <button
                            onClick={() => setActiveSection('data')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${activeSection === 'data'
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                        >
                            DATA MANAGEMENT
                        </button>
                        <button
                            onClick={() => setActiveSection('safety')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${activeSection === 'safety'
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                        >
                            SAFETY PROTOCOLS
                        </button>
                        <button
                            onClick={() => setActiveSection('ui')}
                            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${activeSection === 'ui'
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                        >
                            UI PRESETS
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="col-span-9">
                        {/* Terminal Config */}
                        {activeSection === 'terminal' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">
                                        TERMINAL CONFIGURATION
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                                STATION ID
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="YC-CONTROL-01"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                                PRIMARY SITE LOCATION
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="ERODE, TAMIL NADU"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                                SUPERVISOR NAME
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="NANDHA KUMAR"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    ENABLE OFFLINE MODE
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Allow local database operations without network
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Data Management */}
                        {activeSection === 'data' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">
                                        DATA MANAGEMENT
                                    </h2>

                                    <div className="space-y-4">
                                        <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                                                    <Download className="w-6 h-6 text-blue-500" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                        EXPORT DATABASE
                                                    </p>
                                                    <p className="text-xs text-slate-400 uppercase tracking-wide mt-0.5">
                                                        DOWNLOAD ALL SITE DATA AS JSON
                                                    </p>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                                                    <Upload className="w-6 h-6 text-emerald-500" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                        IMPORT DATABASE
                                                    </p>
                                                    <p className="text-xs text-slate-400 uppercase tracking-wide mt-0.5">
                                                        RESTORE FROM BACKUP FILE
                                                    </p>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                                                    <RefreshCw className="w-6 h-6 text-orange-500" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                        SYNC WITH CLOUD
                                                    </p>
                                                    <p className="text-xs text-slate-400 uppercase tracking-wide mt-0.5">
                                                        UPLOAD LOCAL CHANGES TO SERVER
                                                    </p>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        <button className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/60 transition-colors">
                                                    <Trash2 className="w-6 h-6 text-red-500" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-black text-red-600 uppercase tracking-tight">
                                                        CLEAR ALL DATA
                                                    </p>
                                                    <p className="text-xs text-red-400 uppercase tracking-wide mt-0.5">
                                                        PERMANENTLY DELETE ALL RECORDS
                                                    </p>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Safety Protocols */}
                        {activeSection === 'safety' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">
                                        SAFETY PROTOCOLS
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    REQUIRE SAFETY CHECKLIST
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Mandatory safety verification before work starts
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    AUTO-ALERT ON HIGH PRIORITY
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Send notifications for urgent reports
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    INCIDENT LOGGING
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Track all safety incidents and near-misses
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* UI Presets */}
                        {activeSection === 'ui' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">
                                        UI PRESETS
                                    </h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                                THEME MODE
                                            </label>
                                            <div className="grid grid-cols-3 gap-4">
                                                <button className="p-4 bg-slate-50 dark:bg-slate-900 border-2 border-orange-500 rounded-xl text-center transition-all">
                                                    <div className="w-12 h-12 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                                                        LIGHT
                                                    </p>
                                                </button>
                                                <button className="p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-center hover:border-orange-500 transition-all">
                                                    <div className="w-12 h-12 bg-slate-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                                                        DARK
                                                    </p>
                                                </button>
                                                <button className="p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-center hover:border-orange-500 transition-all">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-white to-slate-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                                                        AUTO
                                                    </p>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    COMPACT MODE
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Reduce spacing for more content on screen
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                                    ANIMATIONS
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Enable smooth transitions and effects
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-500"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Version Info */}
                                <div className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                SYSTEM VERSION
                                            </p>
                                            <p className="text-2xl font-black">
                                                V3.0A-61
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                BUILD DATE
                                            </p>
                                            <p className="text-sm font-bold">
                                                FEB 2026
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
