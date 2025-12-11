'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default function VerifyDBPage() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createBrowserClient();

    useEffect(() => {
        const runTests = async () => {
            const tests = [];

            // Test 1: Connection Check
            try {
                const { data, error } = await supabase.from('users_profile').select('count', { count: 'exact', head: true });
                if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows" which is fine for connection
                tests.push({ name: 'Database Connection', status: 'success', message: 'Connected to Supabase' });
            } catch (e: any) {
                tests.push({ name: 'Database Connection', status: 'error', message: e.message });
            }

            // Test 2: Table Existence - tasks
            try {
                const { error } = await supabase.from('tasks').select('id').limit(1);
                if (error) throw error;
                tests.push({ name: 'Table: tasks', status: 'success', message: 'Table exists' });
            } catch (e: any) {
                tests.push({ name: 'Table: tasks', status: 'error', message: e.message });
            }

            // Test 3: Table Existence - notifications
            try {
                const { error } = await supabase.from('notifications').select('id').limit(1);
                if (error) throw error;
                tests.push({ name: 'Table: notifications', status: 'success', message: 'Table exists' });
            } catch (e: any) {
                tests.push({ name: 'Table: notifications', status: 'error', message: e.message });
            }

            // Test 4: Table Existence - daily_performance
            try {
                const { error } = await supabase.from('daily_performance').select('id').limit(1);
                if (error) throw error;
                tests.push({ name: 'Table: daily_performance', status: 'success', message: 'Table exists' });
            } catch (e: any) {
                tests.push({ name: 'Table: daily_performance', status: 'error', message: e.message });
            }

            // Test 5: Table Existence - users_profile
            try {
                const { error } = await supabase.from('users_profile').select('id').limit(1);
                if (error) throw error;
                tests.push({ name: 'Table: users_profile', status: 'success', message: 'Table exists' });
            } catch (e: any) {
                tests.push({ name: 'Table: users_profile', status: 'error', message: e.message });
            }

            setResults(tests);
            setLoading(false);
        };

        runTests();
    }, [supabase]);

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Database Verification</h1>

            {loading ? (
                <div>Running tests...</div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {results.map((test, i) => (
                        <div key={i} style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            background: test.status === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                            border: `1px solid ${test.status === 'success' ? '#4CAF50' : '#F44336'}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <strong>{test.name}</strong>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{test.message}</p>
                            </div>
                            <span style={{
                                fontWeight: 'bold',
                                color: test.status === 'success' ? '#4CAF50' : '#F44336'
                            }}>
                                {test.status === 'success' ? 'PASS' : 'FAIL'}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '2rem' }}>
                <a href="/auth/login" className="btn btn-primary">Go to Login</a>
            </div>
        </div>
    );
}
