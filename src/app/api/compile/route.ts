import { NextRequest, NextResponse } from 'next/server';

interface WandboxResponse {
    status?: string;
    signal?: string;
    compiler_output?: string;
    compiler_error?: string;
    compiler_message?: string;
    program_output?: string;
    program_error?: string;
    program_message?: string;
}

export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json();

        if (!code || typeof code !== 'string') {
            return NextResponse.json(
                { error: 'Code is required' },
                { status: 400 }
            );
        }

        const startTime = Date.now();

        // Use Wandbox API for C++ compilation
        const response = await fetch('https://wandbox.org/api/compile.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                compiler: 'gcc-head',
                options: 'warning,gnu++2b',
                'compiler-option-raw': '-O2',
            }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Compilation service unavailable. Please try again.' },
                { status: 503 }
            );
        }

        const result: WandboxResponse = await response.json();
        const executionTime = Date.now() - startTime;

        // Build output
        let output = '';
        let error = '';

        // Compiler errors
        if (result.compiler_error) {
            error += result.compiler_error;
        }
        if (result.compiler_message && result.status !== '0') {
            error += result.compiler_message;
        }

        // Program output
        if (result.program_output) {
            output += result.program_output;
        }
        if (result.program_error) {
            error += (error ? '\n' : '') + result.program_error;
        }
        if (result.program_message && !result.program_output) {
            output += result.program_message;
        }

        // Check exit status
        if (result.status && result.status !== '0' && !error) {
            error = `Program exited with code ${result.status}`;
            if (result.signal) {
                error += ` (${result.signal})`;
            }
        }

        return NextResponse.json({
            output: output || (error ? '' : 'Program executed successfully with no output.'),
            error,
            executionTime,
        });

    } catch (err) {
        console.error('Compilation error:', err);
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
