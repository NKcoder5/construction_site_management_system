import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, X, Calendar, MapPin, AlertTriangle } from 'lucide-react';
import db from '../../utils/localDb';

const CreateLog = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        caption: '',
        description: '',
        location: '',
        priority: 'Normal',
        scheduledFor: '',
        tags: []
    });
    const [tagInput, setTagInput] = useState('');
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await db.siteLogs.add({
                ...formData,
                createdAt: new Date(),
                files: files.map(f => f.name)
            });

            // Dispatch event to refresh logs
            window.dispatchEvent(new Event('refresh-logs'));

            // Navigate back to feed
            navigate('/feed');
        } catch (error) {
            console.error('Failed to create log:', error);
            alert('Failed to create report. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles([...files, ...newFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()]
            });
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(t => t !== tag)
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-[1000px] mx-auto px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Plus className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tight leading-none">
                            NEW REPORT
                        </h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                            LOG SITE ACTIVITY OR ISSUE
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Content Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700">
                        {/* Title */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                REPORT TITLE
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.caption}
                                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                placeholder="Brief summary of the activity or issue..."
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                DETAILED DESCRIPTION
                            </label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Provide complete details about the work, observations, or issues..."
                                rows={6}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                            />
                        </div>

                        {/* Location & Priority Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                    SITE LOCATION
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g., SECTOR A-1, EAST BRIDGE..."
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                    PRIORITY LEVEL
                                </label>
                                <div className="relative">
                                    <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Normal">NORMAL</option>
                                        <option value="Important">IMPORTANT</option>
                                        <option value="High">HIGH</option>
                                        <option value="Urgent">URGENT</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Scheduled Time */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                PLANNED EXECUTION TIME (OPTIONAL)
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="datetime-local"
                                    value={formData.scheduledFor}
                                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                ATTACH PHOTOS OR DOCUMENTS
                            </label>
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:border-orange-500 transition-all">
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                    accept="image/*,.pdf,.doc,.docx"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        Click to upload files
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Images, PDFs, or documents
                                    </p>
                                </label>
                            </div>

                            {/* File List */}
                            {files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                                        >
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                                {file.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-all"
                                            >
                                                <X className="w-4 h-4 text-slate-400" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                TAGS (OPTIONAL)
                            </label>
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    placeholder="Add tag and press Enter..."
                                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-4 py-2 bg-slate-900 dark:bg-slate-950 text-white rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-slate-800 dark:hover:bg-slate-900 transition-all"
                                >
                                    ADD
                                </button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold uppercase tracking-wider"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-blue-800 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/feed')}
                            className="flex-1 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-black text-base uppercase tracking-wide hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-4 bg-orange-500 text-white rounded-xl font-black text-base uppercase tracking-wide hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'SUBMITTING...' : 'POST REPORT'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLog;
