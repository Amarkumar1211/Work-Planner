'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import Link from 'next/link';
import styles from '../login/auth.module.css';

export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const supabase = createBrowserClient();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            });

            if (error) throw error;

            setMessage('Check your email for the password reset link');
        } catch (err: any) {
            console.error('Reset password error:', err);
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1>Reset Password</h1>
                    <p>Enter your email to receive a reset link</p>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                {message && (
                    <div className="alert alert-success" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4CAF50', borderRadius: '8px', color: '#4CAF50' }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleResetPassword} className={styles.authForm}>
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

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Sending link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <p>
                        Remember your password?{' '}
                        <Link href="/auth/login" className={styles.authLink}>
                            Sign in
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
