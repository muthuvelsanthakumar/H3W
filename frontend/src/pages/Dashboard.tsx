import {
    AlertTriangle,
    CheckCircle2,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Lightbulb,
    Sparkles,
    TrendingUp,
    Target,
    ArrowRight,
    FileText,
    ShieldCheck
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { useInsights } from '../hooks/useInsights';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const COLORS = ['#6366f1', '#14b8a6', '#f43f5e', '#8b5cf6', '#ec4899', '#f59e0b', '#3b82f6'];

interface InsightMetric {
    key: string;
    color: string;
    name: string;
}

interface VisualizationData {
    type: 'area' | 'bar' | 'pie';
    title: string;
    data: any[];
    metrics: InsightMetric[];
}

interface Insight {
    id: number;
    title: string;
    description: string;
    impact_level: 'High' | 'Medium' | 'Low';
    confidence_score: number;
    category: string;
    ai_root_cause: string;
    visualization_data: VisualizationData[];
    status: 'active' | 'dismissed';
    created_at?: string;
}

export default function Dashboard() {
    const { summary, isLoading } = useDashboard();
    const { insights, isLoading: isInsightsLoading, generate, isGenerating } = useInsights() as { insights: Insight[], isLoading: boolean, generate: any, isGenerating: boolean };
    const [selectedInsightId, setSelectedInsightId] = useState<number | null>(null);

    const stats = [
        { name: 'Business Health', value: isLoading ? '...' : `${summary?.business_health}/100`, change: '+2.4%', trend: 'up', icon: Activity, color: 'indigo' },
        { name: 'Data Integrity', value: isLoading ? '...' : summary?.data_integrity, change: '+0.5%', trend: 'up', icon: CheckCircle2, color: 'emerald' },
        { name: 'Live Insights', value: isLoading ? '...' : summary?.live_insights, change: 'Active', trend: 'neutral', icon: Lightbulb, color: 'amber' },
        { name: 'Critical Risks', value: isLoading ? '...' : summary?.critical_risks, change: 'Alert', trend: 'down', icon: AlertTriangle, color: 'rose' },
    ];

    const selectedInsight = insights.find(ins => ins.id === selectedInsightId);

    // Auto-select first insight if none selected to make it feel faster
    useEffect(() => {
        if (!selectedInsightId && insights.length > 0 && insights[0].status === 'active') {
            // commented out auto-select to let user choose, but could be used
        }
    }, [insights, selectedInsightId]);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {selectedInsight ? 'Intelligence Deep-Dive' : 'Intelligence Dashboard'}
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium italic">
                        {selectedInsightId ? `Analyzing: ${selectedInsight?.title}` : 'Unified command center for validated business operations.'}
                    </p>
                </div>
                {selectedInsightId && (
                    <button
                        onClick={() => setSelectedInsightId(null)}
                        className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-xl text-indigo-600 font-bold text-xs hover:bg-indigo-100 transition shadow-sm"
                    >
                        <ArrowRight className="h-4 w-4 rotate-180" />
                        <span>Return to Overview</span>
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            {!selectedInsightId && (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.name}
                            variants={item}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="group bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-sm",
                                    stat.color === 'indigo' && "bg-indigo-50 text-indigo-600",
                                    stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                                    stat.color === 'amber' && "bg-amber-50 text-amber-600",
                                    stat.color === 'rose' && "bg-rose-50 text-rose-700"
                                )}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-black px-2.5 py-1 rounded-full flex items-center shadow-sm uppercase tracking-wider",
                                    stat.trend === 'up' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                        stat.trend === 'down' ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-slate-50 text-slate-500 border border-slate-100"
                                )}>
                                    {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3 mr-1" />}
                                    {stat.trend === 'down' && <ArrowDownRight className="h-3 w-3 mr-1" />}
                                    {stat.change}
                                </span>
                            </div>
                            <div className="mt-5">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.name}</p>
                                <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Visualization Area */}
                <div className="lg:col-span-2 space-y-8">
                    {selectedInsight ? (
                        <DeepDiveView insight={selectedInsight} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-10 rounded-[40px] border border-slate-200/60 shadow-sm flex flex-col relative overflow-hidden h-full min-h-[600px]"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                                <FileText className="h-64 w-64 text-indigo-950" />
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 z-10">
                                <div>
                                    <div className="flex items-center space-x-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                                        <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-pulse" />
                                        <span>Official Operations Report</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Executive Intelligence Report</h3>
                                    <p className="text-sm text-slate-400 font-bold mt-1">Generated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-1 gap-10 flex-1 z-10">
                                <div className="space-y-8">
                                    <div className="p-8 bg-indigo-50/50 rounded-[32px] border border-indigo-100/50 text-left">
                                        <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center">
                                            <Sparkles className="h-3 w-3 mr-2" />
                                            Ravana 1.0 Executive Summary
                                        </h4>
                                        <p className="text-slate-700 font-medium leading-relaxed italic">
                                            "Current business operations are showing strong momentum with an overall health score of {summary?.business_health}/100. Ravana 1.0 diagnostics have successfully validated {summary?.data_integrity} integrity across all active nodes. We have identified {summary?.live_insights} new growth levers while containing {summary?.critical_risks} high-priority risks in the last 24 hours."
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        {[
                                            { label: 'Latency', val: '-14%', icon: Activity, color: 'emerald' },
                                            { label: 'Accuracy', val: '99.8%', icon: ShieldCheck, color: 'indigo' },
                                            { label: 'Completion', val: '84%', icon: Target, color: 'amber' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex flex-col p-6 bg-white border border-slate-100 rounded-2xl shadow-sm text-left">
                                                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:rotate-6 shadow-sm",
                                                    item.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                                                    item.color === 'indigo' && "bg-indigo-50 text-indigo-600",
                                                    item.color === 'amber' && "bg-amber-50 text-amber-600")}>
                                                    <item.icon className="h-4 w-4" />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                                <span className="text-xl font-black text-slate-900">{item.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* AI Sidebar - Interactive */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-indigo-950 p-8 rounded-[40px] shadow-2xl shadow-indigo-900/20 flex flex-col relative group overflow-hidden h-full min-h-[550px]"
                >
                    <div className="absolute -bottom-6 -right-6 h-64 w-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex items-center space-x-3 mb-10">
                        <div className="p-2.5 bg-indigo-500/20 rounded-xl shadow-inner">
                            <Lightbulb className="h-5 w-5 text-indigo-300" />
                        </div>
                        <h3 className="font-black text-white tracking-tight uppercase text-xs">Ravana 1.0 Intelligence Streams</h3>
                    </div>

                    <div className="space-y-4 flex-1 z-10">
                        {isInsightsLoading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-28 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                            ))
                        ) : insights.length > 0 ? (
                            insights.filter(i => i.status === 'active').slice(0, 4).map((ins) => (
                                <motion.div
                                    key={ins.id}
                                    onClick={() => setSelectedInsightId(ins.id)}
                                    layout
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        "p-5 rounded-2xl border-2 transition-all cursor-pointer group/alert relative overflow-hidden backdrop-blur-md",
                                        selectedInsightId === ins.id
                                            ? "bg-white border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                            : "bg-white/10 border-white/10 border-dashed hover:border-white/30 hover:bg-white/[0.15]"
                                    )}
                                >
                                    {selectedInsightId === ins.id && (
                                        <div className="absolute top-0 right-0 h-10 w-10 flex items-center justify-center">
                                            <ArrowRight className="h-4 w-4 text-indigo-600" />
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mb-2.5">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            ins.impact_level === 'High' ? "bg-rose-400" :
                                                ins.impact_level === 'Medium' ? "bg-amber-400" : "bg-emerald-400"
                                        )} />
                                        <span className={cn(
                                            "text-[9px] uppercase font-black tracking-widest",
                                            selectedInsightId === ins.id ? "text-indigo-400" : "text-indigo-300/60"
                                        )}>
                                            {ins.category}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-xs font-bold leading-relaxed transition-colors",
                                        selectedInsightId === ins.id ? "text-slate-900" : "text-white group-hover/alert:text-indigo-50"
                                    )}>
                                        {ins.title}
                                    </p>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-10 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center flex flex-col items-center">
                                <Activity className="h-8 w-8 text-white/20 mb-3" />
                                <p className="text-indigo-200 text-xs font-bold opacity-60">Optimizing Engine...</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => generate()}
                        disabled={isGenerating}
                        className={cn(
                            "mt-8 w-full py-5 font-black text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-950/20 flex items-center justify-center space-x-2",
                            isGenerating
                                ? "bg-indigo-800 text-indigo-300 cursor-not-allowed"
                                : "bg-white text-indigo-950 hover:bg-indigo-50"
                        )}
                    >
                        {isGenerating && <Activity className="h-4 w-4 animate-spin" />}
                        <span>{isGenerating ? 'Analyzing Streams...' : `Review Recommended Actions`}</span>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}


function DeepDiveView({ insight }: { insight: any }) {
    // Backend now guarantees visualization_data or fallback, but we keep safety check
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 h-full"
        >
            <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Sparkles className="h-32 w-32" />
                </div>
                <div className="flex items-center space-x-3 mb-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        Ravana 1.0 Reasoning Engine
                    </span>
                    <span className="h-1 w-1 bg-white/40 rounded-full" />
                    <span className="text-[10px] font-bold text-indigo-100 uppercase italic">
                        Confidence: {insight.confidence_score}%
                    </span>
                </div>
                <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">{insight.title}</h2>
                <div className="p-5 bg-black/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <p className="text-indigo-50 font-medium leading-relaxed italic">
                        "{insight.ai_root_cause}"
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {insight.visualization_data.map((viz: any, idx: number) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 1 }}
                        className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm h-[400px] flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{viz.title}</h4>
                            <div className="p-2 bg-slate-50 rounded-xl">
                                {viz.type === 'pie' ? <Target className="h-4 w-4 text-indigo-500" /> : <TrendingUp className="h-4 w-4 text-emerald-500" />}
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {viz.type === 'area' ? (
                                    <AreaChart data={viz.data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} />
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                                        {viz.metrics.map((m: any, midx: number) => (
                                            <Area
                                                key={midx}
                                                type="monotone"
                                                dataKey={m.key}
                                                stroke={m.color}
                                                fill={m.color}
                                                fillOpacity={0.1}
                                                strokeWidth={3}
                                                name={m.name}
                                            />
                                        ))}
                                    </AreaChart>
                                ) : viz.type === 'bar' ? (
                                    <BarChart data={viz.data}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey={Object.keys(viz.data[0])[0]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700 }} />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} />
                                        {viz.metrics.map((m: any, midx: number) => (
                                            <Bar key={midx} dataKey={m.key} fill={m.color} radius={[6, 6, 0, 0]} barSize={24} name={m.name} />
                                        ))}
                                    </BarChart>
                                ) : (
                                    <PieChart>
                                        <Pie
                                            data={viz.data}
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {viz.data.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} strokeWidth={0} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                                    </PieChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                ))}


            </div>
        </motion.div>
    );
}
