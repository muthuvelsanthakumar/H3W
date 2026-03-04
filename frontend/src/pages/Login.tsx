import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Zap, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('admin@h3w.com');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            alert('Login failed. Check backend/database connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mesh-gradient flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] border border-white shadow-2xl max-w-md w-full"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="h-16 w-16 bg-indigo-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-200 mb-6">
                        <Zap className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">H3W Enterprise</h1>
                    <p className="text-slate-500 font-medium mt-2 text-center">Enter your credentials to access the intelligence engine.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-100/50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-semibold text-slate-700"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-100/50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-semibold text-slate-700"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 text-white font-extrabold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In to Platform'}
                    </button>
                </form>

                <div className="mt-8 flex items-center justify-center space-x-2 text-slate-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Enterprise Encrypted</span>
                </div>
            </motion.div>
        </div>
    );
}
