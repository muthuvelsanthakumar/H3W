import {
    Building2,
    Mail,
    Cpu,
    ShieldCheck,
    Eye,
    Save,
    Zap,
    BellRing,
    Loader2,
    Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { useSettings } from '../hooks/useSettings';
import { useState, useEffect } from 'react';

export default function Settings() {
    const { settings, isLoading, update, isUpdating } = useSettings();
    const [localName, setLocalName] = useState('');
    const [localSettings, setLocalSettings] = useState({
        verbosity: 'Balanced',
        conservative: true,
        realtime: false,
        notifications: true
    });
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (settings) {
            setLocalName(settings.name || '');
            if (settings.settings) {
                setLocalSettings(settings.settings);
            }
        }
    }, [settings]);

    const handleSave = () => {
        update({
            name: localName,
            settings: localSettings
        }, {
            onSuccess: () => {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        });
    };

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                <p className="font-bold tracking-tight">Syncing Platform Configuration...</p>
            </div>
        );
    }

    const toggleSetting = (key: keyof typeof localSettings) => {
        setLocalSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const verbosityOptions = ['Concise', 'Balanced', 'Detailed'];

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
                    <p className="text-slate-500 mt-2 font-medium">Configure Intelligence Engine parameters and Organizational metadata.</p>
                </div>
                {saveSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100"
                    >
                        <Check className="h-4 w-4 mr-2" />
                        Changes Saved Successfully
                    </motion.div>
                )}
            </div>

            <div className="bg-white rounded-[40px] border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="p-10 space-y-16">
                    {/* Organization Profile */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-2.5 bg-indigo-50 rounded-2xl">
                                <Building2 className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Organization Master</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">Entity Display Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={localName}
                                        onChange={(e) => setLocalName(e.target.value)}
                                        className="block w-full rounded-2xl border-none bg-slate-100/50 py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-300"
                                        placeholder="Enter organization name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3 opacity-40 grayscale cursor-not-allowed">
                                <label className="text-sm font-bold text-slate-400 ml-1">Master Administrator</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value="admin@acme.com"
                                        disabled
                                        className="block w-full rounded-2xl border-none bg-slate-100/30 py-4 pl-12 pr-4 outline-none font-bold text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* AI Configuration */}
                    <section>
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="p-2.5 bg-amber-50 rounded-2xl">
                                <Cpu className="h-5 w-5 text-amber-600" />
                            </div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Intelligence Engine</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Radio Group for Verbosity */}
                            <div className="flex flex-col p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 group transition-all hover:border-indigo-100">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Eye className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-900 leading-none mb-1">Response Verbosity</h4>
                                        <p className="text-xs text-slate-400 font-semibold">Granularity of AI-generated diagnostic output.</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {verbosityOptions.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setLocalSettings(p => ({ ...p, verbosity: option }))}
                                            className={cn(
                                                "flex-1 py-3 px-6 rounded-2xl text-sm font-bold transition-all border-2",
                                                localSettings.verbosity === option
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                                                    : "bg-white text-slate-500 border-slate-100 hover:border-indigo-200"
                                            )}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <SettingCard
                                    title="Conservative"
                                    active={localSettings.conservative}
                                    onClick={() => toggleSetting('conservative')}
                                    icon={ShieldCheck}
                                />
                                <SettingCard
                                    title="Real-time"
                                    active={localSettings.realtime}
                                    onClick={() => toggleSetting('realtime')}
                                    icon={Zap}
                                />
                                <SettingCard
                                    title="Alerts"
                                    active={localSettings.notifications}
                                    onClick={() => toggleSetting('notifications')}
                                    icon={BellRing}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="bg-slate-50/80 p-8 border-t border-slate-100 flex justify-end items-center space-x-6">
                    <p className="text-xs font-bold text-slate-400 italic">Configuration syncs with Intelligence Layer on save.</p>
                    <button
                        onClick={handleSave}
                        disabled={isUpdating}
                        className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-extrabold text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center active:scale-95 group disabled:opacity-70 disabled:translate-y-0"
                    >
                        {isUpdating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />}
                        {isUpdating ? 'Executing Sync...' : 'Apply Configuration'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function SettingCard({ title, active, onClick, icon: Icon }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center p-8 rounded-[32px] border-2 transition-all group",
                active
                    ? "bg-indigo-50/50 border-indigo-100 shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-200"
            )}
        >
            <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110",
                active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-100 text-slate-400"
            )}>
                <Icon className="h-6 w-6" />
            </div>
            <h4 className={cn("font-bold text-sm", active ? "text-indigo-700" : "text-slate-500")}>{title}</h4>
            <div className={cn(
                "mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                active ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"
            )}>
                {active ? 'ON' : 'OFF'}
            </div>
        </button>
    );
}
