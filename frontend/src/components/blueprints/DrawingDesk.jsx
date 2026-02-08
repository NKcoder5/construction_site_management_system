import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../utils/localDb';
import {
    FileText,
    Search,
    HardDrive,
    FolderOpen,
    ChevronRight,
    SearchX,
    FolderSync,
    Trash2
} from 'lucide-react';

const DrawingDesk = () => {
    const blueprints = useLiveQuery(() => db.blueprints.toArray());
    const [search, setSearch] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const filteredDocs = blueprints?.filter(b => b.name.toLowerCase().includes(search.toLowerCase())) || [];

    const handleOpenSiteFolder = () => {
        if (window.ipcRenderer) {
            window.ipcRenderer.send('open-explorer');
        } else {
            console.log('IPC not available - simulated folder open');
        }
    };

    const handleDeleteBlueprint = async (id) => {
        if (window.confirm('Forget this blueprint entry?')) {
            await db.blueprints.delete(id);
        }
    };

    const handleSync = async () => {
        setIsRefreshing(true);
        // Simulate a tiny delay
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsRefreshing(false);
    };

    return (
        <div className="p-10 max-w-[1600px] mx-auto min-h-screen pb-24">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-12">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-orange-600 rounded-3xl flex items-center justify-center shadow-xl shadow-orange-600/20">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                            Technical Authority
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">
                            Single Source of Technical Truth <span className="bg-orange-100 text-orange-600 px-2 rounded-md ml-2">{filteredDocs.length} TOTAL</span>
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleOpenSiteFolder}
                    className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                >
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FolderOpen className="w-6 h-6" />
                    </div>
                    <div className="text-left pr-4">
                        <p className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest leading-none">Authority Drive</p>
                        <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest mt-1">Open Local Specs</p>
                    </div>
                </button>
            </div>

            {/* Search Bar */}
            <div className="premium-card p-0 h-20 flex items-center mb-16 overflow-hidden group focus-within:ring-4 focus-within:ring-orange-500/10 transition-all">
                <div className="p-8 text-slate-300 group-focus-within:text-orange-500 transition-colors">
                    <Search className="w-6 h-6" />
                </div>
                <input
                    type="text"
                    placeholder="Search technical truth..."
                    className="flex-1 h-full bg-transparent outline-none font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-300 placeholder:font-bold"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Document Feed / Empty State */}
            {filteredDocs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDocs.map((doc) => (
                        <div key={doc.id} className="premium-card premium-card-hover group">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl transition-transform group-hover:scale-110">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{doc.version || 'REV.01'}</span>
                                    <button
                                        onClick={() => handleDeleteBlueprint(doc.id)}
                                        className="text-slate-200 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-800 dark:text-white leading-tight mb-2">
                                {doc.name}
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">{doc.uploadedAt || 'Recently Verified'}</p>

                            <button className="w-full flex items-center justify-between p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] group/btn overflow-hidden relative">
                                <span className="relative z-10">Load Spec</span>
                                <ChevronRight className="w-4 h-4 relative z-10 transform group-hover/btn:translate-x-1 transition-all" />
                                <div className="absolute inset-0 bg-orange-600 translate-x-full group-hover/btn:translate-x-0 transition-transform"></div>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="premium-card flex items-center justify-between p-16 border-dashed bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="max-w-md">
                        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-4 leading-none">
                            No Technical Authority Found
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                            Drawings must be verified via the site server. Local uploads are restricted for structural safety compliance.
                        </p>
                    </div>

                    <button
                        onClick={handleSync}
                        className={`btn-primary group ${isRefreshing ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <FolderSync className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Scanning Sector...' : 'Sync Technical Drive'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DrawingDesk;
