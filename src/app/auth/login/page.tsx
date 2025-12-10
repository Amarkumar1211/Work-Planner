'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import Link from 'next/link';
import styles from './auth.module.css';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createBrowserClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Login error:', error);
                throw error;
            }

            if (!data.user) {
                throw new Error('Login failed: No user data returned');
            }

            // Wait a moment for the session to be established in storage
            await new Promise(resolve => setTimeout(resolve, 500));

            // Verify session is persisted
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.error('Session error:', sessionError);
                throw sessionError;
            }

            if (!sessionData.session) {
                throw new Error('Session was not established. Please try again.');
            }

            // Navigate to dashboard
            router.push('/dashboard');
            router.refresh();
        } catch (err: any) {
            console.error('Login error details:', err);
            const errorMessage = err.message || 'Failed to login';
            
            // Provide specific error messages
            if (errorMessage.includes('Invalid login credentials')) {
                setError('Invalid email or password');
            } else if (errorMessage.includes('Email not confirmed')) {
                setError('Please verify your email before signing in');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to your daily planner</p>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className={styles.authForm}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <p>
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className={styles.authLink}>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            <div className={styles.authBackground}>
                <div className={styles.gradientOrb1}></div>
                <div className={styles.gradientOrb2}></div>
                <div className={styles.gradientOrb3}></div>
            </div>
        </div>
    );
}
