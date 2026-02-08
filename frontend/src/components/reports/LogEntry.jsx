import React, { useState } from 'react';
import {
    MapPin,
    Maximize2,
    CheckCircle2,
    MessageSquare,
    Bookmark,
    Terminal,
    Clock,
    User,
    Edit3,
    Trash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import db from '../../utils/localDb';

const LogEntry = ({ report }) => {
    const navigate = useNavigate();
    const [showNotes, setShowNotes] = useState(false);
    const [noteText, setNoteText] = useState(report.notes || '');
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(report.caption || '');

    const handleAcknowledge = async () => {
        try {
            await db.siteLogs.update(report.id, {
                acknowledged: !report.acknowledged,
                status: report.acknowledged ? 'PENDING' : 'DONE'
            });
            window.dispatchEvent(new CustomEvent('refresh-logs'));
        } catch (e) {
            console.error("Failed to update status:", e);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Delete this site report? This cannot be undone.')) {
            try {
                await db.siteLogs.delete(report.id);
                window.dispatchEvent(new CustomEvent('refresh-logs'));
            } catch (e) {
                console.error("Failed to delete log:", e);
            }
        }
    };

    const handleToggleBookmark = async () => {
        try {
            await db.siteLogs.update(report.id, {
                bookmarked: !report.bookmarked
            });
            window.dispatchEvent(new CustomEvent('refresh-logs'));
        } catch (e) {
            console.error("Failed to toggle bookmark:", e);
        }
    };

    const handleSaveNote = async () => {
        try {
            await db.siteLogs.update(report.id, { notes: noteText });
            setShowNotes(false);
            window.dispatchEvent(new CustomEvent('refresh-logs'));
        } catch (e) {
            console.error("Failed to save note:", e);
        }
    };

    const handleSaveEdit = async () => {
        try {
            await db.siteLogs.update(report.id, { caption: editText });
            setIsEditing(false);
            window.dispatchEvent(new CustomEvent('refresh-logs'));
        } catch (e) {
            console.error("Failed to save edit:", e);
        }
    };

    const timeAgo = (date) => {
        if (!date) return 'Just now';
        const d = new Date(date);
        const diff = Math.floor((new Date() - d) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}M ago`;
        return `${Math.floor(diff / 3600)}H ago`;
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            {/* Top Indicator Bar */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/30">
                        <Terminal className="w-5 h-5 text-white dark:text-slate-900" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-widest">Entry #{report.id?.toString().padStart(4, '0')}</span>
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${report.priority === 'Urgent' ? 'bg-red-100 text-red-600' : report.priority === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                }`}>
                                {report.priority === 'Urgent' ? 'Immediate Blocker' : report.priority === 'High' ? 'Critical Constraint' : 'Operating Within Limits'}
                            </span>
                            <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-md text-[8px] font-black uppercase tracking-widest">Site Reality</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            <Clock className="w-3 h-3" />
                            <span>{timeAgo(report.createdAt)}</span>
                            <span>•</span>
                            <MapPin className="w-3 h-3 text-orange-500" />
                            <span>{report.location || 'Unknown Zone'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-orange-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'}`}
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-red-400 group-active:scale-95 transition-transform"
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Task Title / Edit Field */}
            {isEditing ? (
                <div className="mb-6 space-y-3">
                    <textarea
                        className="w-full bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] p-6 text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white outline-none ring-2 ring-orange-500/50 min-h-[120px] resize-none"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleSaveEdit}
                            className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                        >
                            Verify Change
                        </button>
                        <button
                            onClick={() => { setIsEditing(false); setEditText(report.caption || ''); }}
                            className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            ) : (
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-6 leading-tight max-w-[80%]">
                    {report.caption || 'No description recorded'}
                </h2>
            )}

            {/* Author Chip */}
            <button
                onClick={() => navigate('/employees', { state: { highlightId: report.authorId } })}
                className="flex items-center gap-3 mb-8 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl w-fit border border-slate-100 dark:border-slate-800 hover:border-orange-500/50 transition-all group/author"
            >
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover/author:bg-orange-100 dark:group-hover/author:bg-orange-900/30 transition-colors">
                    <User className="w-3 h-3 text-slate-500 group-hover/author:text-orange-600" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 group-hover/author:text-orange-600 transition-colors">
                    Official Sign-off: {report.authorName || 'Site Representative'}
                </span>
            </button>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Primary Site Image */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {report.image ? (
                        <img src={report.image} className="w-full h-full object-cover" alt="site work" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 opacity-20">
                            <Maximize2 className="w-8 h-8" />
                            <span className="text-[8px] font-black uppercase">No Ground Truth Image</span>
                        </div>
                    )}
                    <button className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-lg text-white hover:bg-black/40 transition-all">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
                {/* Secondary Site Image (Simulated for visual) */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {report.image ? (
                        <img src={report.image} className="w-full h-full object-cover grayscale opacity-50" alt="site work view 2" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 opacity-20">
                            <Maximize2 className="w-8 h-8" />
                        </div>
                    )}
                    <button className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-lg text-white hover:bg-black/40 transition-all">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="text-white font-black uppercase italic tracking-widest text-xs">Reality Archive</span>
                    </div>
                </div>
            </div>

            {/* Note Editor Section */}
            {showNotes && (
                <div className="mb-8 p-6 bg-orange-50 dark:bg-orange-950/20 rounded-[2rem] border border-orange-100 dark:border-orange-800 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <MessageSquare className="w-4 h-4 text-orange-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Supervisory Context</span>
                    </div>
                    <textarea
                        className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none h-24"
                        placeholder="Contextualize this site reality..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() => { setShowNotes(false); setNoteText(report.notes || ''); }}
                            className="px-4 py-2 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSaveNote}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20 active:scale-95 transition-all"
                        >
                            Save Context
                        </button>
                    </div>
                </div>
            )}

            {/* Verification Chain */}
            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-6">Reality Verification Chain</h3>
                <div className="flex items-center justify-between relative">
                    {/* Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2"></div>

                    {[
                        { label: 'Observed', active: true, icon: Clock },
                        { label: 'Recorded', active: true, icon: Terminal },
                        { label: 'Signed Off', active: report.acknowledged, icon: ShieldCheck }
                    ].map((step, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${step.active
                                ? 'bg-orange-600 border-white dark:border-slate-900 shadow-lg'
                                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800'
                                }`}>
                                <step.icon className={`w-4 h-4 ${step.active ? 'text-white' : 'text-slate-300'}`} />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${step.active ? 'text-slate-900 dark:text-white' : 'text-slate-300'}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-3">
                    <button
                        onClick={handleAcknowledge}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all ${report.acknowledged
                            ? 'bg-green-50 dark:bg-green-900/10 text-green-600 border border-green-200 dark:border-green-800'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:border-orange-500 hover:text-orange-600'
                            }`}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        {report.acknowledged ? 'Reality Verified' : 'Acknowledge Reality'}
                    </button>
                    <button
                        onClick={() => setShowNotes(!showNotes)}
                        className={`flex items-center gap-2 px-6 py-3 border rounded-xl font-black uppercase tracking-widest text-[9px] transition-all ${showNotes || report.notes
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Field Observations ({report.notes ? '1' : '0'})
                    </button>
                </div>
                <button
                    onClick={handleToggleBookmark}
                    className={`p-3 transition-colors ${report.bookmarked ? 'text-orange-600' : 'text-slate-300 hover:text-orange-600'}`}
                >
                    <Bookmark className={`w-6 h-6 ${report.bookmarked ? 'fill-current' : ''}`} />
                </button>
            </div>
        </div>
    );
};

export default LogEntry;
