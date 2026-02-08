import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../utils/localDb';
import {
    Users,
    Phone,
    MapPin,
    Search,
    Shield,
    HardHat,
    ChevronRight,
    Navigation,
    Globe
} from 'lucide-react';

const StaffMap = () => {
    const contacts = useLiveQuery(() => db.contacts.toArray());
    const [search, setSearch] = useState('');

    const filteredContacts = contacts?.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-10 max-w-[1700px] mx-auto pb-24">
            {/* Header */}
            <div className="flex justify-between items-end mb-12">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                        <Globe className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                            Staff & Map
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            Field Placement Directory
                        </p>
                    </div>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <button className="px-8 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl shadow-sm text-[10px] font-black uppercase tracking-widest">Map View</button>
                    <button className="px-8 py-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">Directory</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Map Visualization */}
                <div className="lg:col-span-8">
                    <div className="bg-slate-200 dark:bg-slate-900 rounded-[2.5rem] h-[600px] w-full relative overflow-hidden group shadow-inner border border-slate-100 dark:border-slate-800">
                        {/* Map Grid Background */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                        {/* Simulated Map Markers */}
                        <div className="absolute top-1/4 left-1/3 group cursor-pointer">
                            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl group-hover:scale-125 transition-transform duration-500">
                                <HardHardSmall className="w-3 h-3 text-white" />
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-slate-800 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                                <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white">Nandha Kumar</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Lead Supervisor • Sector A</p>
                            </div>
                        </div>

                        <div className="absolute bottom-1/3 right-1/4 group cursor-pointer">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl group-hover:scale-125 transition-transform duration-500">
                                <HardHardSmall className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        <div className="absolute bottom-12 left-12 bg-white dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                                    <Navigation className="w-5 h-5 animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest leading-none">Active GPS Tracking</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Simulating Field Location</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Quick Directory */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Search Component */}
                    <div className="premium-card p-0 flex items-center h-16 overflow-hidden">
                        <div className="px-6 text-slate-300">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Find personnel..."
                            className="flex-1 h-full bg-transparent outline-none font-bold text-slate-700 dark:text-slate-200 text-xs placeholder:text-slate-300"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredContacts?.map((person) => (
                            <div key={person.id} className="premium-card !p-6 flex items-center justify-between group cursor-pointer hover:border-blue-500/30">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${person.role.includes('Lead') ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                                        {person.role.includes('Lead') ? <Shield className="w-5 h-5" /> : <HardHat className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black italic uppercase tracking-tight text-slate-900 dark:text-white leading-none mb-1">{person.name}</h3>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{person.role}</p>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Team Summary Card */}
                    <div className="premium-card bg-slate-900 text-white p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Users className="w-6 h-6 text-blue-500" />
                            <h4 className="text-sm font-black uppercase italic">Team Presence</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="opacity-40">On Field</span>
                                <span className="text-green-500">12 Workers</span>
                            </div>
                            <div className="w-full bg-white/5 h-1 rounding-full overflow-hidden">
                                <div className="bg-green-500 h-full w-[80%]"></div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="opacity-40">Standby</span>
                                <span>4 Workers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal icon helper
const HardHardSmall = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"></path><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"></path><path d="M4 15v-3a6 6 0 0 1 12 0v3"></path></svg>
);

export default StaffMap;
