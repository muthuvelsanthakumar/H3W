import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-rose-600 mb-4">Something went wrong</h1>
                    <div className="bg-slate-100 p-6 rounded-xl overflow-auto border border-slate-200">
                        <h2 className="text-xl font-semibold mb-2 text-slate-800">Error:</h2>
                        <pre className="text-sm font-mono text-rose-600 mb-6 whitespace-pre-wrap">
                            {this.state.error?.toString()}
                        </pre>
                        <h2 className="text-xl font-semibold mb-2 text-slate-800">Component Stack:</h2>
                        <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap">
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
