import { Upload, FileText, Database, AlertCircle, CheckCircle2, MoreHorizontal, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { useDataSources } from '../hooks/useDataSources';
import { useRef, useState } from 'react';

export default function DataSources() {
    const { sources, isLoading, upload, isUploading, isError, remove, calibrate, isCalibrating } = useDataSources();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [showAuditModal, setShowAuditModal] = useState(false);
    const [calibratingSource, setCalibratingSource] = useState<any>(null);

    const [tempSettings, setTempSettings] = useState({
        missing_threshold: 10,
        duplicate_threshold: 5,
        sensitivity: 'balanced'
    });

    const allAlerts = sources.flatMap((s: any) =>
        (s.quality_report?.alerts || []).map((a: any) => ({ ...a, sourceName: s.name }))
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 15 * 1024 * 1024) return alert("File too large (>15MB)");
            upload(file);
        }
    };

    const handleRemove = (id: number) => {
        if (window.confirm("Are you sure you want to disconnect this data stream?")) {
            remove(id);
            setActiveMenu(null);
        }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Engine</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage and calibrate your data streams for the Intelligence layer.</p>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".csv,.xlsx"
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-indigo-600 shadow-lg shadow-indigo-100 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center group disabled:opacity-70"
                >
                    {isUploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Upload className="h-4 w-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                    )}
                    {isUploading ? 'Ingesting...' : 'Ingest Dataset'}
                </button>
            </div>

            {isError && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-sm font-semibold flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Operational Error: Failed to synchronization with the Data Engine. Please check your session or backend status.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 ml-1">Live Connections</h3>
                    <div className="grid gap-4">
                        {isLoading ? (
                            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                <p className="font-medium">Connecting to backend engine...</p>
                            </div>
                        ) : sources.length === 0 ? (
                            <div className="bg-white/50 p-12 rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                <Database className="h-12 w-12 mb-4 opacity-20" />
                                <p className="font-bold">No active data sources found.</p>
                                <p className="text-sm">Upload a CSV or Excel file to get started.</p>
                            </div>
                        ) : sources.map((source: any, idx: number) => (
                            <motion.div
                                key={source.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.01 }}
                                className="bg-white p-5 rounded-[24px] border border-slate-200/60 shadow-sm flex items-center justify-between group"
                            >
                                <div className="flex items-center space-x-5">
                                    <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                        {source.source_type === 'api' ? (
                                            <Database className="h-6 w-6 text-indigo-500" />
                                        ) : (
                                            <FileText className="h-6 w-6 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900">{source.name}</h4>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-xs font-bold text-slate-400 uppercase">{source.source_type}</span>
                                            <span className="text-slate-200">•</span>
                                            <span className="text-xs font-medium text-slate-400">
                                                {new Date(source.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-12">
                                    <div className="hidden md:block">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase text-right mb-1">Health Score</p>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${source.health_score}%` }}
                                                    transition={{ duration: 1, delay: 0.5 }}
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        source.health_score > 90 ? "bg-emerald-500" : "bg-amber-500"
                                                    )}
                                                />
                                            </div>
                                            <span className="text-xs font-extrabold text-slate-700">{source.health_score}%</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <span className={cn(
                                            "flex items-center text-xs font-bold px-3 py-1.5 rounded-xl",
                                            source.health_score > 80 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                        )}>
                                            {source.health_score > 80 && <CheckCircle2 className="h-3 w-3 mr-1.5" />}
                                            {source.health_score > 80 ? 'Healthy' : 'Needs Review'}
                                        </span>
                                        <div className="relative">
                                            <button
                                                onClick={() => setActiveMenu(activeMenu === source.id ? null : source.id)}
                                                className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                                            >
                                                <MoreHorizontal className="h-5 w-5" />
                                            </button>

                                            {activeMenu === source.id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-10"
                                                        onClick={() => setActiveMenu(null)}
                                                    />
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 py-2 overflow-hidden"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                setCalibratingSource(source);
                                                                setTempSettings(source.settings || {
                                                                    missing_threshold: 10,
                                                                    duplicate_threshold: 5,
                                                                    sensitivity: 'balanced'
                                                                });
                                                                setActiveMenu(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                                        >
                                                            Configure Stream
                                                        </button>
                                                        <div className="h-px bg-slate-100 mx-2 my-1" />
                                                        <button
                                                            onClick={() => handleRemove(source.id)}
                                                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                                        >
                                                            Delete Source
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 ml-1">System Audit</h3>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between aspect-square lg:aspect-auto h-full min-h-[400px]"
                    >
                        <div>
                            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                <AlertCircle className="h-6 w-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold leading-tight">Calibration Engine</h4>
                            <p className="mt-4 text-indigo-100 font-medium leading-relaxed">
                                Connect your data sources. The engine will automatically detect schema inconsistencies and suggest mapping fixes.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center space-x-2 text-[10px] font-bold text-indigo-200 uppercase tracking-widest bg-white/10 w-fit px-3 py-1 rounded-full">
                                <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full" />
                                Scanner Online
                            </div>
                            <button
                                onClick={() => setShowAuditModal(true)}
                                className="w-full py-4 bg-white text-indigo-600 font-extrabold text-sm rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center group/btn shadow-lg"
                            >
                                View Audit Logs
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {showAuditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAuditModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh]"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-slate-900">System Audit Logs</h2>
                                    <p className="text-slate-500 text-sm font-medium">Cross-stream anomaly detection results.</p>
                                </div>
                                <button
                                    onClick={() => setShowAuditModal(false)}
                                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-all"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-4">
                                {allAlerts.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400">
                                        <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p className="font-bold text-lg">No critical inconsistencies found.</p>
                                        <p className="text-sm">Calibration engine is healthy.</p>
                                    </div>
                                ) : (
                                    allAlerts.map((alert: any, i: number) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "p-5 rounded-2xl border flex gap-4 items-start",
                                                alert.severity === 'critical' ? "bg-rose-50 border-rose-100" :
                                                    alert.severity === 'high' ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"
                                            )}
                                        >
                                            <div className={cn(
                                                "p-2 rounded-lg mt-0.5",
                                                alert.severity === 'critical' ? "bg-rose-100 text-rose-600" :
                                                    alert.severity === 'high' ? "bg-amber-100 text-amber-600" : "bg-white text-slate-400"
                                            )}>
                                                <AlertCircle className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Source: {alert.sourceName}</span>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter",
                                                        alert.severity === 'critical' ? "bg-rose-200 text-rose-700" : "bg-amber-200 text-amber-700"
                                                    )}>
                                                        {alert.severity}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-800">{alert.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-8 bg-slate-50/50 border-t border-slate-100">
                                <button
                                    onClick={() => setShowAuditModal(false)}
                                    className="w-full py-4 bg-indigo-600 text-white font-extrabold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                >
                                    Dismiss & Recalibrate
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {calibratingSource && (
                    <div className="fixed inset-0 z-50 flex items-center justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCalibratingSource(null)}
                            className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white w-full max-w-lg h-full relative z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
                        >
                            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Database className="h-4 w-4 text-indigo-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stream Configuration</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900">{calibratingSource.name}</h2>
                                </div>
                                <button
                                    onClick={() => setCalibratingSource(null)}
                                    className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-10 flex-1 overflow-y-auto space-y-12">
                                <section className="space-y-6">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full mr-2" />
                                        Assessment Thresholds
                                    </h3>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <label className="text-sm font-bold text-slate-700">Missing Value Tolerance</label>
                                                <span className="text-lg font-black text-indigo-600">{tempSettings.missing_threshold}%</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="50" step="0.5"
                                                value={tempSettings.missing_threshold}
                                                onChange={(e) => setTempSettings({ ...tempSettings, missing_threshold: parseFloat(e.target.value) })}
                                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                            <p className="text-xs text-slate-400 font-medium italic">Higher tolerance reduces 'Critical' alerts for sparse data columns.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <label className="text-sm font-bold text-slate-700">Duplicate Record Limit</label>
                                                <span className="text-lg font-black text-indigo-600">{tempSettings.duplicate_threshold}%</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="25" step="0.5"
                                                value={tempSettings.duplicate_threshold}
                                                onChange={(e) => setTempSettings({ ...tempSettings, duplicate_threshold: parseFloat(e.target.value) })}
                                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
                                        <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full mr-2" />
                                        AI Engine Sensitivity
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-100 rounded-[24px]">
                                        {['low', 'balanced', 'high'].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setTempSettings({ ...tempSettings, sensitivity: level })}
                                                className={cn(
                                                    "py-3 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all",
                                                    tempSettings.sensitivity === level
                                                        ? "bg-white text-indigo-600 shadow-md shadow-slate-200/50 scale-100"
                                                        : "text-slate-400 hover:text-slate-600 scale-95"
                                                )}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        {tempSettings.sensitivity === 'high' && "Strict mode: Every minor anomaly will trigger a high-impact alert."}
                                        {tempSettings.sensitivity === 'balanced' && "Optimal mode: Balances statistical significance and operational noise."}
                                        {tempSettings.sensitivity === 'low' && "Conservative mode: Only critical, confirmed anomalies will be highlighted."}
                                    </p>
                                </section>
                            </div>

                            <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                                <button
                                    onClick={() => setCalibratingSource(null)}
                                    className="flex-1 py-5 bg-white border border-slate-200 text-slate-600 font-black rounded-3xl hover:bg-slate-50 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        calibrate({ id: calibratingSource.id, settings: tempSettings });
                                        setCalibratingSource(null);
                                    }}
                                    disabled={isCalibrating}
                                    className="flex-[2] py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center text-sm disabled:opacity-50"
                                >
                                    {isCalibrating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply Calibration'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
