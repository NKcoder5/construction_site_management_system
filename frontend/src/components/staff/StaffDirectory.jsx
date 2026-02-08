import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Phone,
    Mail,
    MoreHorizontal,
    Shield,
    Plus,
    Trash2,
    X,
    UserPlus
} from 'lucide-react';
import db from '../../utils/localDb';

const StaffDirectory = () => {
    const [team, setTeam] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', role: '', email: '', phone: '' });

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        const contacts = await db.contacts.toArray();
        setTeam(contacts);
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        await db.contacts.add({
            ...newMember,
            role: newMember.role || 'Site Worker'
        });
        setNewMember({ name: '', role: '', email: '', phone: '' });
        setIsAddModalOpen(false);
        loadTeam();
    };

    const handleDeleteMember = async (id) => {
        if (window.confirm('Remove this person from the directory?')) {
            await db.contacts.delete(id);
            loadTeam();
        }
    };

    const filteredTeam = team.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Team Roster</h1>
                        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Personnel Management</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find Crew Member..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Add Member</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTeam.map(member => (
                    <div key={member.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all group relative">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDeleteMember(member.id)} className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-full transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-2xl font-black text-slate-400">
                                {member.name.charAt(0)}
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{member.name}</h3>
                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mt-2">{member.role}</span>
                        </div>

                        <div className="space-y-3">
                            <a href={`mailto:${member.email}`} className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group/link">
                                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-400 group-hover/link:text-blue-500 transition-colors mr-3">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">{member.email || 'No Email'}</span>
                            </a>
                            <a href={`tel:${member.phone}`} className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group/link">
                                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-400 group-hover/link:text-green-500 transition-colors mr-3">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{member.phone || 'No Phone'}</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black uppercase italic dark:text-white">New Hire</h2>
                            <button onClick={() => setIsAddModalOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleAddMember} className="space-y-4">
                            <input
                                required
                                placeholder="Full Name"
                                value={newMember.name}
                                onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                required
                                placeholder="Role (e.g. Supervisor)"
                                value={newMember.role}
                                onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={newMember.email}
                                onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={newMember.phone}
                                onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-blue-200 hover:bg-blue-700 transition-all mt-4">
                                Add to Roster
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffDirectory;
