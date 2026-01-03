'use client';

interface OutputPanelProps {
    output: string;
    error: string;
    isLoading: boolean;
    executionTime?: number;
}

export default function OutputPanel({ output, error, isLoading, executionTime }: OutputPanelProps) {
    const hasOutput = output || error;

    return (
        <div className="output-panel h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--editor-border)]">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' :
                            error ? 'bg-red-500' :
                                hasOutput ? 'bg-green-500' : 'bg-zinc-600'
                        }`} />
                    <span className="text-sm font-medium text-[var(--foreground-muted)]">
                        {isLoading ? 'Running...' : 'Output'}
                    </span>
                </div>
                {executionTime !== undefined && !isLoading && (
                    <span className="text-xs text-[var(--foreground-muted)]">
                        {executionTime}ms
                    </span>
                )}
            </div>

            {/* Output Content */}
            <div className="flex-1 p-4 overflow-auto">
                {isLoading ? (
                    <div className="flex items-center gap-3 text-[var(--foreground-muted)]">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span>Compiling and executing...</span>
                    </div>
                ) : error ? (
                    <div className="output-error whitespace-pre-wrap">{error}</div>
                ) : output ? (
                    <div className="output-success whitespace-pre-wrap">{output}</div>
                ) : (
                    <div className="text-[var(--foreground-muted)] italic">
                        Click "Run Code" to compile and execute your C++ program.
                    </div>
                )}
            </div>
        </div>
    );
}
