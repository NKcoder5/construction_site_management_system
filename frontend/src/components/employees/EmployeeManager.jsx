import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Filter, SortDesc, MoreVertical, Edit2, Trash2, CheckCircle, X, Award, Briefcase, Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { employeeService, taskService } from '../../services';
import StatusBadge from '../shared/StatusBadge';

const EmployeeManager = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        onLeave: 0,
        available: 0,
        byRole: {}
    });

    // Filters and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterAvailability, setFilterAvailability] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [showFilters, setShowFilters] = useState(false);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeePerformance, setEmployeePerformance] = useState(null);

    const [newEmployee, setNewEmployee] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        skills: '',
        salary: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const allEmployees = await employeeService.getAllEmployees();
            setEmployees(allEmployees);

            const employeeStats = await employeeService.getEmployeeStats();
            setStats(employeeStats);
        } catch (error) {
            console.error('Failed to load employees:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...employees];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(emp =>
                emp.name?.toLowerCase().includes(term) ||
                emp.role?.toLowerCase().includes(term) ||
                emp.email?.toLowerCase().includes(term) ||
                emp.phone?.includes(term)
            );
        }

        if (filterRole !== 'all') {
            filtered = filtered.filter(emp => emp.role === filterRole);
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(emp => emp.status === filterStatus);
        }

        if (filterAvailability !== 'all') {
            filtered = filtered.filter(emp => emp.availability === filterAvailability);
        }

        // Sorting
        filtered.sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'role') {
                return a.role.localeCompare(b.role);
            } else if (sortBy === 'joined') {
                return new Date(b.joinedDate) - new Date(a.joinedDate);
            }
            return 0;
        });

        setFilteredEmployees(filtered);
    }, [employees, searchTerm, filterRole, filterStatus, filterAvailability, sortBy]);

    const handleAddMemberClick = () => {
        setIsEditing(false);
        setSelectedEmployee(null);
        setNewEmployee({ name: '', role: '', email: '', phone: '', skills: '', salary: '' });
        setShowAddModal(true);
    };

    const handleEditClick = (employee) => {
        setIsEditing(true);
        setSelectedEmployee(employee);
        setNewEmployee({
            name: employee.name || '',
            role: employee.role || '',
            email: employee.email || '',
            phone: employee.phone || '',
            skills: Array.isArray(employee.skills) ? employee.skills.join(', ') : '',
            salary: employee.salary || ''
        });
        setShowAddModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const skillsArray = newEmployee.skills.split(',').map(s => s.trim()).filter(Boolean);
            const data = {
                ...newEmployee,
                skills: skillsArray,
                salary: parseFloat(newEmployee.salary) || 0
            };

            if (isEditing && selectedEmployee) {
                await employeeService.updateEmployee(selectedEmployee.id, data);
            } else {
                await employeeService.createEmployee(data);
            }

            setNewEmployee({ name: '', role: '', email: '', phone: '', skills: '', salary: '' });
            setShowAddModal(false);
            setIsEditing(false);
            setSelectedEmployee(null);
            loadData();
        } catch (error) {
            console.error('Failed to save employee:', error);
            alert('Failed to save employee. Please try again.');
        }
    };

    const handleDeleteEmployee = async (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name} from the roster?`)) {
            try {
                await employeeService.deleteEmployee(id);
                loadData();
            } catch (error) {
                console.error('Failed to delete employee:', error);
            }
        }
    };

    const handleViewProfile = async (employee) => {
        setSelectedEmployee(employee);
        try {
            const performance = await employeeService.getEmployeePerformance(employee.id);
            setEmployeePerformance(performance);
            setShowProfileModal(true);
        } catch (error) {
            console.error('Failed to load performance metrics:', error);
        }
    };

    const handleUpdateAvailability = async (id, availability) => {
        try {
            await employeeService.updateAvailability(id, availability);
            loadData();
            if (selectedEmployee && selectedEmployee.id === id) {
                setSelectedEmployee({ ...selectedEmployee, availability });
            }
        } catch (error) {
            console.error('Failed to update availability:', error);
        }
    };

    const getRoleBadgeColor = (role) => {
        const roleLower = role?.toLowerCase() || '';
        if (roleLower.includes('lead') || roleLower.includes('supervisor')) {
            return 'bg-orange-50 text-orange-600 border-orange-200';
        } else if (roleLower.includes('manager')) {
            return 'bg-blue-50 text-blue-600 border-blue-200';
        } else if (roleLower.includes('architect') || roleLower.includes('engineer')) {
            return 'bg-emerald-50 text-emerald-600 border-emerald-200';
        }
        return 'bg-slate-50 text-slate-600 border-slate-200';
    };

    const getAvailabilityBadge = (avg) => {
        switch (avg) {
            case 'available': return 'bg-emerald-500';
            case 'busy': return 'bg-orange-500';
            case 'on-leave': return 'bg-red-500';
            default: return 'bg-slate-400';
        }
    };

    const activeFiltersCount = [
        searchTerm !== '',
        filterRole !== 'all',
        filterStatus !== 'all',
        filterAvailability !== 'all'
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-[1600px] mx-auto px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tight leading-none">
                                TEAM ROSTER
                            </h1>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                                SITE PERSONNEL DIRECTORY
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`relative p-3 border rounded-xl transition-all ${showFilters
                                    ? 'bg-orange-500 border-orange-500 text-white'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={handleAddMemberClick}
                            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            ADD MEMBER
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-5 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">TOTAL MEMBERS</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AVAILABLE</p>
                        <p className="text-4xl font-black text-emerald-500">{stats.available}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">BUSY</p>
                        <p className="text-4xl font-black text-orange-500">{stats.total - (stats.available || 0) - (stats.onLeave || 0)}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ON LEAVE</p>
                        <p className="text-4xl font-black text-red-500">{stats.onLeave}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AVG. PERF</p>
                        <p className="text-4xl font-black text-blue-500">92%</p>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 mb-8">
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Name, role, contact..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Role</label>
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                >
                                    <option value="all">All Roles</option>
                                    {Object.keys(stats.byRole || {}).map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Availability</label>
                                <select
                                    value={filterAvailability}
                                    onChange={(e) => setFilterAvailability(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                >
                                    <option value="all">All Availability</option>
                                    <option value="available">Available</option>
                                    <option value="busy">Busy</option>
                                    <option value="on-leave">On Leave</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="role">Role</option>
                                    <option value="joined">Joined Date</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Employee Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmployees.map((employee) => (
                        <div
                            key={employee.id}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-900 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                                        {employee.avatar ? (
                                            <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users className="w-10 h-10 text-slate-400" />
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 ${getAvailabilityBadge(employee.availability)}`} />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditClick(employee)}
                                        className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-orange-500"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteEmployee(employee.id, employee.name)}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{employee.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getRoleBadgeColor(employee.role)}`}>
                                        {employee.role}
                                    </span>
                                    {employee.status === 'on-leave' && (
                                        <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-black uppercase">
                                            LEAVE
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 mb-6 text-sm">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{employee.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Phone className="w-4 h-4" />
                                    <span>{employee.phone}</span>
                                </div>
                                {employee.skills && employee.skills.length > 0 && (
                                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <Award className="w-4 h-4 text-orange-400" />
                                        <span className="truncate">{employee.skills.join(', ')}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => handleViewProfile(employee)}
                                className="w-full py-3 bg-slate-900 dark:bg-slate-950 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-slate-800 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                            >
                                <Briefcase className="w-4 h-4" />
                                VIEW PERFORMANCE
                            </button>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {!loading && filteredEmployees.length === 0 && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-dashed border-slate-200 dark:border-slate-700 text-center mt-12">
                        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-300 uppercase mb-2">No Members Found</h3>
                        <p className="text-sm text-slate-400 mb-6">Try adjusting your filters or add a new team member.</p>
                        <button
                            onClick={handleAddMemberClick}
                            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm uppercase tracking-wide"
                        >
                            + Add Team Member
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Modal */}
            {showProfileModal && selectedEmployee && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-0 max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-100/10 shadow-2xl">
                        <div className="bg-slate-900 dark:bg-slate-950 p-8 text-white relative">
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-6">
                                <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md relative">
                                    <Users className="w-16 h-16 text-white/50" />
                                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-slate-900 ${getAvailabilityBadge(selectedEmployee.availability)}`} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black italic tracking-tight uppercase leading-none mb-2">{selectedEmployee.name}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-orange-500 text-white rounded text-xs font-black uppercase tracking-wider">
                                            {selectedEmployee.role}
                                        </span>
                                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            JOINED: {new Date(selectedEmployee.joinedDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-4 gap-4 mb-8">
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-100/5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">COMPLETION</p>
                                    <p className="text-2xl font-black text-emerald-500">{employeePerformance?.completionRate || 0}%</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-100/5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TOTAL TASKS</p>
                                    <p className="text-2xl font-black text-blue-500">{employeePerformance?.totalTasks || 0}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-100/5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">IN PROGRESS</p>
                                    <p className="text-2xl font-black text-orange-500">{employeePerformance?.inProgress || 0}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-100/5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AVG. DAYS</p>
                                    <p className="text-2xl font-black text-slate-700 dark:text-slate-300">{employeePerformance?.avgCompletionDays || 0}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Availability Management</h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleUpdateAvailability(selectedEmployee.id, 'available')}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedEmployee.availability === 'available' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 hover:border-emerald-100'}`}
                                        >
                                            <span className="text-sm font-bold">Mark Available</span>
                                            <CheckCircle className={`w-5 h-5 ${selectedEmployee.availability === 'available' ? 'visible' : 'invisible'}`} />
                                        </button>
                                        <button
                                            onClick={() => handleUpdateAvailability(selectedEmployee.id, 'busy')}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedEmployee.availability === 'busy' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-100 hover:border-orange-100'}`}
                                        >
                                            <span className="text-sm font-bold">Mark Busy</span>
                                            <CheckCircle className={`w-5 h-5 ${selectedEmployee.availability === 'busy' ? 'visible' : 'invisible'}`} />
                                        </button>
                                        <button
                                            onClick={() => handleUpdateAvailability(selectedEmployee.id, 'on-leave')}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedEmployee.availability === 'on-leave' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-100 hover:border-red-100'}`}
                                        >
                                            <span className="text-sm font-bold">Mark on Leave</span>
                                            <X className={`w-5 h-5 ${selectedEmployee.availability === 'on-leave' ? 'visible' : 'invisible'}`} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Details</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-400">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">EMAIL ADDRESS</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedEmployee.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-400">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">PHONE NUMBER</p>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedEmployee.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-t border-slate-100 dark:border-slate-100/10 flex justify-end">
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="px-6 py-2 bg-slate-900 dark:bg-slate-950 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-slate-800"
                            >
                                CLOSE PROFILE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                                {isEditing ? <Edit2 className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase leading-none">
                                    {isEditing ? 'Edit Member' : 'Add Member'}
                                </h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {isEditing ? 'UPDATE ROSTER ENTRY' : 'NEW ROSTER ENTRY'}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newEmployee.name}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    placeholder="Enter full name..."
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Role</label>
                                <input
                                    type="text"
                                    required
                                    value={newEmployee.role}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    placeholder="e.g. Mason"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Salary (₹)</label>
                                <input
                                    type="number"
                                    value={newEmployee.salary}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    placeholder="Amount..."
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={newEmployee.phone}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    placeholder="Contact number..."
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Skills (Comma separated)</label>
                                <input
                                    type="text"
                                    value={newEmployee.skills}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, skills: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                                    placeholder="Skill 1, Skill 2..."
                                />
                            </div>
                            <div className="col-span-2 flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setIsEditing(false);
                                        setSelectedEmployee(null);
                                    }}
                                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                                >
                                    {isEditing ? 'Save Changes' : 'Register Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManager;
