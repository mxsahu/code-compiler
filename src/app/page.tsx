'use client';

import { useState, useCallback } from 'react';
import CodeEditor from '@/components/CodeEditor';
import OutputPanel from '@/components/OutputPanel';

const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // Try editing this code!
    int a = 5, b = 10;
    cout << "Sum of " << a << " and " << b << " is: " << a + b << endl;
    
    return 0;
}`;

const EXAMPLE_SNIPPETS = [
  {
    name: 'Hello World',
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  },
  {
    name: 'Fibonacci',
    code: `#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << "Fibonacci Sequence:" << endl;
    for (int i = 0; i < 15; i++) {
        cout << fibonacci(i) << " ";
    }
    cout << endl;
    return 0;
}`,
  },
  {
    name: 'Prime Numbers',
    code: `#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    cout << "Prime numbers from 1 to 50:" << endl;
    for (int i = 1; i <= 50; i++) {
        if (isPrime(i)) {
            cout << i << " ";
        }
    }
    cout << endl;
    return 0;
}`,
  },
  {
    name: 'Sorting Array',
    code: `#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    cout << "Original array: ";
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    cout << endl;
    
    sort(arr, arr + n);
    
    cout << "Sorted array: ";
    for (int i = 0; i < n; i++) cout << arr[i] << " ";
    cout << endl;
    
    return 0;
}`,
  },
];

export default function Home() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | undefined>();
  const [showExamples, setShowExamples] = useState(false);

  const runCode = useCallback(async () => {
    setIsLoading(true);
    setOutput('');
    setError('');
    setExecutionTime(undefined);

    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Compilation failed');
      } else {
        setOutput(result.output || '');
        setError(result.error || '');
        setExecutionTime(result.executionTime);
      }
    } catch (err) {
      setError('Failed to connect to the compiler. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
    setShowExamples(false);
    setOutput('');
    setError('');
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--background)] overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-[var(--glass-border)] backdrop-blur-md bg-[var(--background)]/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              C++
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">C++ Compiler</h1>
              <p className="text-xs text-[var(--foreground-muted)]">Online IDE • GCC Latest</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Examples Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="btn-secondary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Examples
              </button>

              {showExamples && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-panel p-2 z-50">
                  {EXAMPLE_SNIPPETS.map((snippet, index) => (
                    <button
                      key={index}
                      onClick={() => loadExample(snippet.code)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
                    >
                      {snippet.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Run Button */}
            <button
              onClick={runCode}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run Code
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col min-h-0 lg:min-w-0">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--editor-border)] bg-[var(--editor-line-bg)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-sm text-[var(--foreground-muted)] ml-2">main.cpp</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              placeholder="Write your C++ code here..."
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-[var(--editor-border)]"></div>
        <div className="lg:hidden h-px bg-[var(--editor-border)]"></div>

        {/* Output Panel */}
        <div className="flex-1 flex flex-col min-h-[200px] lg:min-h-0 lg:min-w-0">
          <OutputPanel
            output={output}
            error={error}
            isLoading={isLoading}
            executionTime={executionTime}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 border-t border-[var(--glass-border)] py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[var(--foreground-muted)]">
          <span>Powered by Wandbox API • GCC (Latest)</span>
          <span>Press Ctrl+Enter to run (coming soon)</span>
        </div>
      </footer>
    </div>
  );
}
