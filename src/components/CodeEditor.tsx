'use client';

import { useRef, useEffect, useState } from 'react';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function CodeEditor({ value, onChange, placeholder }: CodeEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const [lineCount, setLineCount] = useState(1);

    useEffect(() => {
        const lines = value.split('\n').length;
        setLineCount(Math.max(lines, 20));
    }, [value]);

    const handleScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newValue = value.substring(0, start) + '    ' + value.substring(end);
                onChange(newValue);
                // Set cursor position after the tab
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + 4;
                }, 0);
            }
        }
    };

    return (
        <div className="code-editor flex h-full overflow-hidden">
            {/* Line Numbers */}
            <div
                ref={lineNumbersRef}
                className="line-numbers py-4 px-2 overflow-hidden select-none flex-shrink-0"
                style={{ width: '50px' }}
            >
                {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i + 1} className="h-[1.7em]">
                        {i + 1}
                    </div>
                ))}
            </div>

            {/* Code Input */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 p-4 w-full h-full"
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
            />
        </div>
    );
}
