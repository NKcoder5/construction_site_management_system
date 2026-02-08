import React, { useState, useEffect } from 'react';
import { RefreshCw, Edit2, Trash2, MoreVertical, Bookmark, Clock, Filter, SortDesc, CheckCircle, AlertTriangle, FileText, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services';
import StatusBadge from '../shared/StatusBadge';
import WeatherWidget from '../shared/WeatherWidget';
import QuickTools from '../shared/QuickTools';

const DailyLog = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentStation, setCurrentStation] = useState('YC-CONTROL-01');
    const [uplinkStatus, setUplinkStatus] = useState('OFFLINE');

    // Filters and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showBookmarked, setShowBookmarked] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, priority
    const [showFilters, setShowFilters] = useState(false);

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        acknowledged: 0,
        bookmarked: 0,
        byPriority: {}
    });

    const loadReports = async () => {
        setLoading(true);
        try {
            const logs = await reportService.getAllLogs();
            setReports(logs);

            // Load stats
            const logStats = await reportService.getLogStats();
            setStats(logStats);
        } catch (e) {
            console.error('Failed to load reports:', e);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
        window.addEventListener('refresh-logs', loadReports);
        return () => window.removeEventListener('refresh-logs', loadReports);
    }, []);

    // Check online status
    useEffect(() => {
        const updateStatus = () => {
            setUplinkStatus(window.navigator.onLine ? 'ONLINE' : 'OFFLINE');
        };
        updateStatus();
        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, []);

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...reports];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(r =>
                r.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.location?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Priority filter
        if (filterPriority !== 'all') {
            filtered = filtered.filter(r => r.priority === filterPriority);
        }

        // Status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(r => r.status === filterStatus);
        }

        // Bookmarked filter
        if (showBookmarked) {
            filtered = filtered.filter(r => r.bookmarked);
        }

        // Sorting
        filtered.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortBy === 'priority') {
                const priorityOrder = { 'Urgent': 4, 'High': 3, 'Important': 2, 'Normal': 1 };
                return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
            }
            return 0;
        });

        setFilteredReports(filtered);
    }, [reports, searchTerm, filterPriority, filterStatus, showBookmarked, sortBy]);

    const handleToggleBookmark = async (id) => {
        try {
            await reportService.toggleBookmark(id);
            loadReports();
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
        }
    };

    const handleMarkAsDone = async (id) => {
        try {
            await reportService.updateLog(id, { status: 'completed', acknowledged: true });
            loadReports();
        } catch (error) {
            console.error('Failed to mark as done:', error);
        }
    };

    const handleAcknowledge = async (id) => {
        try {
            await reportService.acknowledgeLog(id);
            loadReports();
        } catch (error) {
            console.error('Failed to acknowledge:', error);
        }
    };

    const handleDelete = async (id, caption) => {
        if (!confirm(`Are you sure you want to delete "${caption}"?`)) {
            return;
        }

        try {
            await reportService.deleteLog(id);
            loadReports();
        } catch (error) {
            console.error('Failed to delete report:', error);
            alert('Failed to delete report');
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterPriority('all');
        setFilterStatus('all');
        setShowBookmarked(false);
        setSortBy('newest');
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    };

    const formatTime = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            case 'High': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
            case 'Important': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            default: return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
        }
    };

    const activeFiltersCount = [
        searchTerm !== '',
        filterPriority !== 'all',
        filterStatus !== 'all',
        showBookmarked
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-[1600px] mx-auto px-8 py-8">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <div className="w-1 h-8 bg-white rounded-full"></div>
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tight leading-none">
                                Morning Ops
                            </h1>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                                ACTIVE STATION: {currentStation}
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
                            onClick={loadReports}
                            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <Link
                            to="/create"
                            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
                        >
                            + POST UPDATE
                        </Link>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase">Filters & Sorting</h3>
                            {activeFiltersCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                    CLEAR ALL
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search reports..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Priority Filter */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Priority
                                </label>
                                <select
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                >
                                    <option value="all">All Priorities</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="High">High</option>
                                    <option value="Important">Important</option>
                                    <option value="Normal">Normal</option>
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Status
                                </label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="priority">By Priority</option>
                                </select>
                            </div>
                        </div>

                        {/* Bookmarked Toggle */}
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showBookmarked}
                                    onChange={(e) => setShowBookmarked(e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Show Bookmarked Only ({stats.bookmarked})
                                </span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-5 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            TOTAL LOGS
                        </p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white">
                            {stats.total}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            ACTIVE
                        </p>
                        <p className="text-4xl font-black text-emerald-500">
                            {stats.active}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            ACKNOWLEDGED
                        </p>
                        <p className="text-4xl font-black text-blue-500">
                            {stats.acknowledged}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            BOOKMARKED
                        </p>
                        <p className="text-4xl font-black text-orange-500">
                            {stats.bookmarked}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            UPLINK STATUS
                        </p>
                        <p className={`text-2xl font-black ${uplinkStatus === 'ONLINE' ? 'text-emerald-500' : 'text-orange-500'}`}>
                            {uplinkStatus}
                        </p>
                    </div>
                </div>

                {/* Results Count */}
                {activeFiltersCount > 0 && (
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredReports.length}</span> of <span className="font-bold">{reports.length}</span> reports
                        </p>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Reports Column */}
                    <div className="col-span-8 space-y-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-12 h-12 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
                            </div>
                        ) : filteredReports.length > 0 ? (
                            filteredReports.map((report, index) => (
                                <div
                                    key={report.id}
                                    className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border transition-all ${report.bookmarked
                                            ? 'border-orange-300 dark:border-orange-700 shadow-lg shadow-orange-500/10'
                                            : 'border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-900'
                                        }`}
                                >
                                    {/* Report Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getPriorityColor(report.priority)}`}>
                                                {report.priority === 'Urgent' || report.priority === 'High' ? (
                                                    <AlertTriangle className="w-6 h-6" />
                                                ) : (
                                                    <FileText className="w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-slate-900 dark:text-white">
                                                        REPORT #{String(report.id).padStart(4, '0')}
                                                    </span>
                                                    <StatusBadge status={report.priority === 'Urgent' || report.priority === 'High' ? 'IMPORTANT' : 'NORMAL'} />
                                                    {report.acknowledged && (
                                                        <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded text-[10px] font-black uppercase">
                                                            ✓ ACK
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDate(report.createdAt)} • {formatTime(report.createdAt)}
                                                    </span>
                                                    <span className="text-xs font-semibold text-blue-500 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {report.location || 'MAIN HIGHWAY LINK'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/create?edit=${report.id}`}
                                                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4 text-slate-400" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(report.id, report.caption)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                                            </button>
                                            <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all">
                                                <MoreVertical className="w-4 h-4 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Report Content */}
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                        {report.caption || 'Untitled Report'}
                                    </h3>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
                                        {report.description || report.notes || 'No description provided.'}
                                    </p>

                                    {/* Tags */}
                                    {report.tags && report.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {report.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-medium"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Planned Time */}
                                    {report.scheduledFor && (
                                        <div className="flex items-center gap-2 mb-4 text-orange-500">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wide">
                                                PLANNED: {formatTime(report.scheduledFor)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        {!report.acknowledged && (
                                            <button
                                                onClick={() => handleAcknowledge(report.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                ACKNOWLEDGE
                                            </button>
                                        )}
                                        {report.status !== 'completed' && (
                                            <button
                                                onClick={() => handleMarkAsDone(report.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                MARK AS DONE
                                            </button>
                                        )}
                                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                            NOTES (0)
                                        </button>
                                        <button
                                            onClick={() => handleToggleBookmark(report.id)}
                                            className="ml-auto p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all"
                                        >
                                            <Bookmark className={`w-4 h-4 ${report.bookmarked ? 'fill-orange-500 text-orange-500' : 'text-slate-400'}`} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-dashed border-slate-200 dark:border-slate-700 text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-black text-slate-300 dark:text-slate-600 uppercase mb-2">
                                    {activeFiltersCount > 0 ? 'No Reports Match Filters' : 'No Reports Yet'}
                                </h3>
                                <p className="text-sm text-slate-400 mb-6">
                                    {activeFiltersCount > 0
                                        ? 'Try adjusting your filters or search term'
                                        : 'Start logging site activities to track progress'}
                                </p>
                                {activeFiltersCount > 0 ? (
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-950 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-slate-800 dark:hover:bg-slate-900 transition-all"
                                    >
                                        Clear Filters
                                    </button>
                                ) : (
                                    <Link
                                        to="/create"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-orange-600 transition-all"
                                    >
                                        + Create First Report
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-span-4 space-y-6">
                        <WeatherWidget />
                        <QuickTools />

                        {/* Priority Breakdown */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-4">
                                Priority Breakdown
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Urgent</span>
                                    <span className="text-sm font-bold text-red-500">{stats.byPriority.urgent || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">High</span>
                                    <span className="text-sm font-bold text-orange-500">{stats.byPriority.high || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Important</span>
                                    <span className="text-sm font-bold text-yellow-500">{stats.byPriority.important || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Normal</span>
                                    <span className="text-sm font-bold text-blue-500">{stats.byPriority.normal || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyLog;
