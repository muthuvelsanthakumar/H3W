import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Database,
    Lightbulb,
    Settings as SettingsIcon,
    ChevronLeft,
    ChevronRight,
    Bell,
    Search,
    Zap
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useInsights } from '../../hooks/useInsights';
import { useUser } from '../../hooks/useUser';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Data Engine', href: '/data', icon: Database },
    { name: 'Intelligence', href: '/insights', icon: Lightbulb },
    { name: 'System Settings', href: '/settings', icon: SettingsIcon },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { insights } = useInsights();
    const { user } = useUser();

    const activeInsightsCount = insights?.filter(i => i.status === 'active').length || 0;

    // Derived initials for the user profile
    const initials = user?.full_name
        ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'JD';

    return (
        <div className="min-h-screen mesh-gradient flex text-slate-900">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 88 }}
                className="bg-white/80 backdrop-blur-xl border-r border-slate-200/60 sticky top-0 h-screen flex flex-col z-30"
            >
                <div className="h-20 flex items-center px-6 mb-4">
                    <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Zap className="h-6 w-6 text-white" />
                    </div>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="ml-3 font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500 whitespace-nowrap"
                            >
                                H3W Platform
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>

                <nav className="flex-1 px-4 space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden",
                                    isActive
                                        ? "text-indigo-700"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-indigo-50/80 z-0"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <item.icon className={cn(
                                    "h-5 w-5 shrink-0 z-10 transition-transform duration-200 group-hover:scale-110",
                                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                <AnimatePresence mode="wait">
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="ml-4 font-semibold z-10 whitespace-nowrap"
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="flex items-center justify-center w-full h-10 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                    >
                        {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white/40 backdrop-blur-md border-b border-slate-200/40 flex items-center justify-between px-8 sticky top-0 z-20">
                    <div className="relative max-w-md w-full mr-8 hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search insights or dimensions..."
                            className="w-full bg-slate-100/50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                        />
                    </div>

                    <div className="flex items-center space-x-5">
                        <button className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors">
                            <Bell className="h-5 w-5" />
                            {activeInsightsCount > 0 && (
                                <span className="absolute top-1 right-1 h-5 w-5 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                    {activeInsightsCount}
                                </span>
                            )}
                        </button>
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">Command Center</p>
                                <p className="text-sm font-bold text-slate-800 tracking-tight mt-1">{user?.full_name || 'Guest User'}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-300 p-0.5 shadow-md shadow-indigo-100 group-hover:shadow-lg group-hover:shadow-indigo-200 transition-all">
                                <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-indigo-600 font-extrabold text-xs uppercase">
                                    {initials}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 md:p-12 overflow-x-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
