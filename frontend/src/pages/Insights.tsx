import {
    Info, CheckCircle, ExternalLink, Sparkles, Filter,
    MoreVertical, ShieldCheck, Loader2, Trash2, TrendingUp,
    BarChart2, PieChart as PieIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    AreaChart, Area, XAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { cn } from '../utils/cn';
import { useInsights } from '../hooks/useInsights';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Insights() {
    const { insights, isLoading, dismiss, isError, generate, isGenerating, execute } = useInsights();
    const [executingId, setExecutingId] = useState<number | null>(null);

    const handleExecute = (id: number) => {
        setExecutingId(id);
        execute(id, {
            onSettled: () => setExecutingId(null)
        });
    };

    const [showNoNewInsights, setShowNoNewInsights] = useState(false);
    const [showSuccessDiscovery, setShowSuccessDiscovery] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>('All');

    const handleGenerate = () => {
        console.log("🚀 Triggering Global Intelligence Scan...");
        generate(undefined, {
            onSuccess: (data: any) => {
                console.log("✅ Scan Complete. New insights:", data?.length);
                if (data?.length === 0) {
                    setShowNoNewInsights(true);
                    setTimeout(() => setShowNoNewInsights(false), 5000);
                } else {
                    setShowSuccessDiscovery(true);
                    setTimeout(() => setShowSuccessDiscovery(false), 5000);
                }
            },
            onError: (err) => {
                console.error("❌ Intelligence Scan Failed:", err);
            }
        });
    };

    // Dynamically extract unique categories from actual data
    const dynamicCategories = Array.from(new Set(insights.map((ins: any) => ins.category)));

    const filteredInsights = [...insights].sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).filter((insight: any) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'High' || activeFilter === 'Medium') return insight.impact_level === activeFilter;
        return insight.category === activeFilter;
    });

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                <p className="font-bold">Analyzing Intelligence Streams...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Intelligence Explorer</h1>
                    <p className="text-slate-500 mt-2 font-medium">Validated business hypotheses with statistical significance.</p>
                </div>
                <div className="flex space-x-2 relative">
                    <button
                        onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                        className={cn(
                            "p-3 rounded-xl shadow-sm transition-all border",
                            activeFilter !== 'All' ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Filter className="h-5 w-5" />
                    </button>

                    <AnimatePresence>
                        {filterMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setFilterMenuOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 py-3 overflow-hidden"
                                >
                                    <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter by Impact</p>
                                    {['All', 'High', 'Medium'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => { setActiveFilter(f as any); setFilterMenuOpen(false); }}
                                            className={cn(
                                                "w-full text-left px-4 py-2 text-sm font-bold transition-colors",
                                                activeFilter === f ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                    <div className="h-px bg-slate-100 mx-3 my-2" />
                                    <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter by Category</p>
                                    {dynamicCategories.length > 0 ? (
                                        dynamicCategories.map((f: any) => (
                                            <button
                                                key={f}
                                                onClick={() => { setActiveFilter(f); setFilterMenuOpen(false); }}
                                                className={cn(
                                                    "w-full text-left px-4 py-2 text-sm font-bold transition-colors capitalize",
                                                    activeFilter === f ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:bg-slate-50"
                                                )}
                                            >
                                                {f}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="px-4 py-2 text-[10px] italic text-slate-300">No categories found</p>
                                    )}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {isGenerating && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col items-center max-w-sm text-center"
                    >
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-3xl animate-pulse rounded-full" />
                            <Loader2 className="h-16 w-16 text-indigo-600 animate-spin relative z-10" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Engaging Deep Diagnosis</h2>
                        <p className="text-slate-500 font-medium">AI is autonomously scanning your data streams for hidden anomalies and strategic opportunities...</p>
                    </motion.div>
                </motion.div>
            )}

            <AnimatePresence>
                {showNoNewInsights && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-8 py-4 rounded-[20px] shadow-2xl flex items-center space-x-3 border border-slate-800"
                    >
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                        <span className="font-bold text-sm text-slate-200">System Healthy: No new anomalies detected in this scan.</span>
                    </motion.div>
                )}
                {showSuccessDiscovery && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-8 py-4 rounded-[20px] shadow-2xl flex items-center space-x-3"
                    >
                        <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                        <span className="font-bold text-sm">Strategic Discovery Complete! New critical insights have been added to your feed.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {isError && (
                <div className="bg-rose-50 p-4 rounded-2x flex items-center text-rose-600 font-semibold border border-rose-100 italic">
                    Failed to fetch intelligence reports. Ensure database is synchronized.
                </div>
            )}

            <div className="grid gap-6">
                {filteredInsights.length === 0 ? (
                    <div className="bg-white/50 p-16 rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <Filter className="h-12 w-12 mb-4 opacity-20" />
                        <p className="font-bold">No insights match this filter.</p>
                        <p className="text-sm">Try clearing your filters to see all results.</p>
                        <button
                            onClick={() => setActiveFilter('All')}
                            className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
                        >
                            Reset to All Insights
                        </button>
                    </div>
                ) : filteredInsights.map((insight: any, idx: number) => (
                    <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest",
                                        insight.impact_level === 'High' ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
                                    )}>
                                        {insight.impact_level} Impact
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-50 px-3 py-1 rounded-full">
                                        {insight.category}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-extrabold text-slate-900">{insight.confidence_score}%</span>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Confidence</span>
                                    </div>
                                    <button className="p-2 text-slate-300 hover:text-slate-500 rounded-lg">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{insight.title}</h3>
                            <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-3xl font-medium">{insight.description}</p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <ShieldCheck className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Statistical Verification</p>
                                        <p className="text-xs font-semibold text-slate-600 leading-relaxed">Cross-referenced with historical operations and live data streams.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Info className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">AI Reasoning Engine</p>
                                        <p className="text-xs font-semibold text-indigo-700 leading-relaxed">{insight.ai_root_cause}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50/80 px-8 py-5 flex justify-between items-center border-t border-slate-100">
                            <button
                                onClick={() => setExpandedId(expandedId === insight.id ? null : insight.id)}
                                className="text-sm font-bold text-indigo-600 flex items-center hover:text-indigo-800 transition-colors group/btn"
                            >
                                Explore Attribution Details
                                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                            </button>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => dismiss(insight.id)}
                                    className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-extrabold text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center"
                                >
                                    <Trash2 className="h-3 w-3 mr-2" />
                                    Dismiss
                                </button>
                                <button
                                    onClick={() => handleExecute(insight.id)}
                                    disabled={executingId === insight.id || insight.status === 'resolved'}
                                    className={cn(
                                        "px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center shadow-lg active:scale-95",
                                        insight.status === 'resolved'
                                            ? "bg-emerald-500 text-white shadow-emerald-100"
                                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 disabled:opacity-50"
                                    )}
                                >
                                    {executingId === insight.id ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : insight.status === 'resolved' ? (
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                    ) : (
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                    )}
                                    {insight.status === 'resolved' ? 'Strategy Executed' : 'Approve & Execute'}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {expandedId === insight.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-slate-50/30 border-t border-slate-100 overflow-hidden"
                                >
                                    <div className="p-10 space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
                                                <TrendingUp className="h-4 w-4 mr-2 text-indigo-600" />
                                                Causal Attribution & Data Evidence
                                            </h4>
                                            <span className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm italic">
                                                Source: AI Multi-Stream Analysis
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {(insight.visualization_data || []).map((chart: any, cIdx: number) => (
                                                <div key={cIdx} className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex flex-col h-[300px]">
                                                    <h5 className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-wider flex items-center">
                                                        {chart.type === 'area' && <TrendingUp className="h-3 w-3 mr-2 text-indigo-500" />}
                                                        {chart.type === 'bar' && <BarChart2 className="h-3 w-3 mr-2 text-emerald-500" />}
                                                        {chart.type === 'pie' && <PieIcon className="h-3 w-3 mr-2 text-amber-500" />}
                                                        {chart.title}
                                                    </h5>

                                                    <div className="flex-1 w-full">
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            {chart.type === 'area' ? (
                                                                <AreaChart data={chart.data}>
                                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                                    <XAxis dataKey={chart.data?.[0]?.name ? "name" : Object.keys(chart.data?.[0] || {}).find(k => k !== 'value' && k !== 'val') || "name"} hide />
                                                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                                                                    {(chart.metrics || []).length > 0 ? chart.metrics.map((m: any) => (
                                                                        <Area key={m.key} type="monotone" dataKey={m.key} stroke={m.color} fill={m.color} fillOpacity={0.1} strokeWidth={3} animationDuration={600} />
                                                                    )) : (
                                                                        <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} strokeWidth={3} animationDuration={600} />
                                                                    )}
                                                                </AreaChart>
                                                            ) : chart.type === 'bar' ? (
                                                                <BarChart data={chart.data}>
                                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                                    <XAxis dataKey={chart.data?.[0]?.segment ? "segment" : "name"} hide />
                                                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                                                                    {(chart.metrics || []).length > 0 ? chart.metrics.map((m: any) => (
                                                                        <Bar key={m.key} dataKey={m.key} fill={m.color} radius={[4, 4, 0, 0]} barSize={32} animationDuration={600} />
                                                                    )) : (
                                                                        <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} animationDuration={600} />
                                                                    )}
                                                                </BarChart>
                                                            ) : (
                                                                <PieChart>
                                                                    <Pie
                                                                        data={chart.data}
                                                                        innerRadius={60}
                                                                        outerRadius={80}
                                                                        paddingAngle={5}
                                                                        dataKey={chart.data?.[0]?.value ? "value" : (chart.data?.[0]?.val ? "val" : "value")}
                                                                    >
                                                                        {(chart.data || []).map((_: any, index: number) => (
                                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                        ))}
                                                                    </Pie>
                                                                    <Tooltip />
                                                                    <Legend />
                                                                </PieChart>
                                                            )}
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>
                                            ))}

                                            {(!insight.visualization_data || insight.visualization_data.length === 0) && (
                                                <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                                    <p className="text-slate-400 font-bold italic">Detailed attribution graphs are being synthesized for this legacy insight.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
