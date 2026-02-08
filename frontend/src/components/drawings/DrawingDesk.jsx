import React, { useState, useEffect } from 'react';
import { FolderOpen, Search, Download, Upload, ExternalLink, FileText, Lock, Unlock, Eye, Trash2, Plus, AlertTriangle } from 'lucide-react';
import db from '../../utils/localDb';

const DrawingFiles = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [drawings, setDrawings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadMetadata, setUploadMetadata] = useState({
        name: '',
        version: '1.0',
        projectId: 1
    });
    const [accessLevel, setAccessLevel] = useState('restricted'); // 'open' or 'restricted'

    useEffect(() => {
        loadDrawings();
    }, []);

    const loadDrawings = async () => {
        setLoading(true);
        try {
            if (!db.isOpen()) {
                await db.open();
            }
            const files = await db.blueprints.orderBy('uploadedAt').reverse().toArray();
            setDrawings(files);
        } catch (error) {
            console.error('Failed to load drawings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFiles = drawings.filter(file =>
        file.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Open local folder using Electron IPC
    const openLocalFolder = async () => {
        try {
            // Check if running in Electron
            if (window.electron && window.electron.openFolder) {
                await window.electron.openFolder('drawings');
            } else {
                // Fallback for web version
                alert('File system access is only available in the desktop app');
            }
        } catch (error) {
            console.error('Failed to open folder:', error);
            alert('Failed to open local folder');
        }
    };

    // Handle file upload
    const handleFileUpload = async (e) => {
        e.preventDefault();

        if (!uploadFile) {
            alert('Please select a file');
            return;
        }

        if (accessLevel === 'restricted') {
            alert('Upload is restricted. Please enable open access mode or sync via site server.');
            return;
        }

        try {
            // Read file as base64 for storage
            const reader = new FileReader();
            reader.onload = async (event) => {
                const fileData = {
                    name: uploadMetadata.name || uploadFile.name,
                    version: uploadMetadata.version,
                    uploadedAt: new Date(),
                    size: uploadFile.size,
                    type: uploadFile.type,
                    path: uploadFile.name, // In production, this would be actual file path
                    projectId: uploadMetadata.projectId,
                    data: event.target.result // Base64 data
                };

                await db.blueprints.add(fileData);

                // Log the upload
                await db.siteLogs.add({
                    caption: `Drawing Uploaded: ${fileData.name}`,
                    description: `New drawing file uploaded - Version ${fileData.version}`,
                    priority: 'Normal',
                    status: 'active',
                    location: 'Drawing Repository',
                    createdAt: new Date(),
                    tags: ['drawing', 'upload']
                });

                setShowUploadModal(false);
                setUploadFile(null);
                setUploadMetadata({ name: '', version: '1.0', projectId: 1 });
                loadDrawings();
            };

            reader.readAsDataURL(uploadFile);
        } catch (error) {
            console.error('Failed to upload file:', error);
            alert('Failed to upload file');
        }
    };

    // Download file
    const handleDownload = async (drawing) => {
        try {
            if (drawing.data) {
                // Create download link from base64 data
                const link = document.createElement('a');
                link.href = drawing.data;
                link.download = drawing.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Log the download
                await db.siteLogs.add({
                    caption: `Drawing Downloaded: ${drawing.name}`,
                    description: `Drawing file downloaded - Version ${drawing.version}`,
                    priority: 'Normal',
                    status: 'active',
                    location: 'Drawing Repository',
                    createdAt: new Date(),
                    tags: ['drawing', 'download']
                });
            } else {
                alert('File data not available');
            }
        } catch (error) {
            console.error('Failed to download file:', error);
            alert('Failed to download file');
        }
    };

    // View file
    const handleView = async (drawing) => {
        try {
            if (drawing.data) {
                // Open in new window
                const newWindow = window.open();
                if (newWindow) {
                    if (drawing.type?.includes('pdf')) {
                        newWindow.document.write(`<iframe src="${drawing.data}" width="100%" height="100%" style="border:none;"></iframe>`);
                    } else if (drawing.type?.includes('image')) {
                        newWindow.document.write(`<img src="${drawing.data}" style="max-width:100%; height:auto;" />`);
                    } else {
                        newWindow.document.write(`<pre>${drawing.data}</pre>`);
                    }
                }
            } else {
                alert('File data not available');
            }
        } catch (error) {
            console.error('Failed to view file:', error);
            alert('Failed to view file');
        }
    };

    // Delete file
    const handleDelete = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await db.blueprints.delete(id);

            // Log the deletion
            await db.siteLogs.add({
                caption: `Drawing Deleted: ${name}`,
                description: 'Drawing file removed from repository',
                priority: 'Important',
                status: 'active',
                location: 'Drawing Repository',
                createdAt: new Date(),
                tags: ['drawing', 'delete']
            });

            loadDrawings();
        } catch (error) {
            console.error('Failed to delete file:', error);
            alert('Failed to delete file');
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-[1600px] mx-auto px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <FolderOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tight leading-none">
                                    DRAWING FILES
                                </h1>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    MANAGEMENT REPOSITORY
                                </p>
                                <span className="px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded text-[10px] font-black uppercase tracking-wider">
                                    {drawings.length} TOTAL
                                </span>
                                {accessLevel === 'restricted' ? (
                                    <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        RESTRICTED
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                        <Unlock className="w-3 h-3" />
                                        OPEN ACCESS
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setAccessLevel(accessLevel === 'restricted' ? 'open' : 'restricted')}
                            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:text-orange-500 transition-all"
                        >
                            {accessLevel === 'restricted' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            <div className="text-left">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                                    SECURITY
                                </div>
                                <div className="text-xs font-black uppercase tracking-tight mt-0.5">
                                    {accessLevel === 'restricted' ? 'ENABLE ACCESS' : 'RESTRICT ACCESS'}
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={openLocalFolder}
                            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:text-orange-500 transition-all"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <div className="text-left">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                                    LOCAL DRIVE
                                </div>
                                <div className="text-xs font-black uppercase tracking-tight mt-0.5">
                                    OPEN SITE FOLDER
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Search Bar & Upload Button */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter documentation by name or type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        UPLOAD FILE
                    </button>
                </div>

                {/* Drawing Files Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400">Loading drawings...</p>
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">
                            {searchTerm ? 'No files match your search' : 'No drawing files yet'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {filteredFiles.map((file) => (
                            <div
                                key={file.id}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-900 transition-all"
                            >
                                {/* File Icon & Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                                        <FileText className="w-7 h-7 text-slate-400" />
                                    </div>
                                    <button
                                        onClick={() => handleDelete(file.id, file.name)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* File Name & Version */}
                                <div className="mb-4">
                                    <h3 className="text-base font-black text-slate-900 dark:text-white italic uppercase tracking-tight mb-1 truncate">
                                        {file.name}
                                    </h3>
                                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">
                                        V{file.version}
                                    </span>
                                </div>

                                {/* Metadata */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            DATE
                                        </div>
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {new Date(file.uploadedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            SIZE
                                        </div>
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {formatFileSize(file.size)}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleView(file)}
                                        className="flex-1 py-3 bg-slate-900 dark:bg-slate-950 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-slate-800 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        VIEW
                                    </button>
                                    <button
                                        onClick={() => handleDownload(file)}
                                        className="p-3 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-all"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Security Notice */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            {accessLevel === 'restricted' ? (
                                <Lock className="w-6 h-6 text-blue-500" />
                            ) : (
                                <AlertTriangle className="w-6 h-6 text-orange-500" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight mb-2">
                                {accessLevel === 'restricted' ? 'RESTRICTED ACCESS MODE' : 'OPEN ACCESS MODE'}
                            </h2>
                            <p className="text-sm text-blue-400 font-semibold uppercase tracking-wide mb-4">
                                {accessLevel === 'restricted'
                                    ? 'BLUEPRINTS MUST BE SYNCED VIA SITE SERVER. LOCAL UPLOADS ARE RESTRICTED FOR SECURITY.'
                                    : 'LOCAL UPLOADS ENABLED. FILES ARE STORED IN BROWSER DATABASE WITH BASE64 ENCODING.'}
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={openLocalFolder}
                                    className="px-6 py-3 bg-orange-500 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                                >
                                    ACCESS LOCAL DATABASE
                                </button>
                                {accessLevel === 'restricted' && (
                                    <button
                                        onClick={() => setAccessLevel('open')}
                                        className="px-6 py-3 bg-slate-900 dark:bg-slate-950 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:bg-slate-800 dark:hover:bg-slate-900 transition-all"
                                    >
                                        ENABLE UPLOADS
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-200 dark:border-slate-700">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight mb-6">
                                UPLOAD DRAWING
                            </h2>

                            <form onSubmit={handleFileUpload} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        FILE
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        FILE NAME (OPTIONAL)
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadMetadata.name}
                                        onChange={(e) => setUploadMetadata({ ...uploadMetadata, name: e.target.value })}
                                        placeholder="Leave empty to use original filename"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        VERSION
                                    </label>
                                    <input
                                        type="text"
                                        value={uploadMetadata.version}
                                        onChange={(e) => setUploadMetadata({ ...uploadMetadata, version: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowUploadModal(false);
                                            setUploadFile(null);
                                        }}
                                        className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                                    >
                                        UPLOAD
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DrawingFiles;
