'use client';

import { useState, useEffect } from 'react';
import { performanceService } from '@/lib/performance';
import type { DailyPerformance } from '@/lib/supabase';
import { format } from 'date-fns';
import styles from './PerformanceDashboard.module.css';

interface PerformanceDashboardProps {
    userId: string;
}

export default function PerformanceDashboard({ userId }: PerformanceDashboardProps) {
    const [performanceHistory, setPerformanceHistory] = useState<DailyPerformance[]>([]);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPerformanceData();
    }, [userId]);

    const fetchPerformanceData = async () => {
        setLoading(true);

        // Fetch performance history
        const history = await performanceService.getPerformanceHistory(userId, 30);
        setPerformanceHistory(history);

        // Fetch current streak
        const streak = await performanceService.getCurrentStreak(userId);
        setCurrentStreak(streak);

        setLoading(false);
    };

    const calculateAverageCompletion = () => {
        if (performanceHistory.length === 0) return 0;
        const total = performanceHistory.reduce((sum, p) => sum + p.completion_rate, 0);
        return Math.round(total / performanceHistory.length);
    };

    const getRatingCounts = () => {
        const counts = { good: 0, average: 0, poor: 0 };
        performanceHistory.forEach(p => {
            counts[p.rating]++;
        });
        return counts;
    };

    const getRatingEmoji = (rating: string) => {
        switch (rating) {
            case 'good': return '🎉';
            case 'average': return '👍';
            case 'poor': return '💪';
            default: return '📊';
        }
    };

    const getRatingColor = (rating: string) => {
        switch (rating) {
            case 'good': return 'var(--success)';
            case 'average': return 'var(--warning)';
            case 'poor': return 'var(--danger)';
            default: return 'var(--text-muted)';
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <div className="spinner"></div>
                <p>Loading performance data...</p>
            </div>
        );
    }

    const ratingCounts = getRatingCounts();
    const avgCompletion = calculateAverageCompletion();

    return (
        <div className={styles.performanceDashboard}>
            {/* Overview Stats */}
            <div className={styles.statsGrid}>
                <div className="glass-card">
                    <div className={styles.statIcon}>📊</div>
                    <div className={styles.statValue}>{avgCompletion}%</div>
                    <div className={styles.statLabel}>Average Completion</div>
                </div>

                <div className="glass-card">
                    <div className={styles.statIcon}>🔥</div>
                    <div className={styles.statValue}>{currentStreak}</div>
                    <div className={styles.statLabel}>Day Streak</div>
                    <p className={styles.statHint}>Consecutive "Good" days</p>
                </div>

                <div className="glass-card">
                    <div className={styles.statIcon}>📅</div>
                    <div className={styles.statValue}>{performanceHistory.length}</div>
                    <div className={styles.statLabel}>Days Tracked</div>
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="glass-card">
                <h3 className={styles.sectionTitle}>Performance Distribution (Last 30 Days)</h3>
                <div className={styles.ratingGrid}>
                    <div className={styles.ratingCard}>
                        <div className={styles.ratingEmoji}>🎉</div>
                        <div className={styles.ratingValue}>{ratingCounts.good}</div>
                        <div className={styles.ratingLabel}>Good Days</div>
                        <div className={styles.ratingBar}>
                            <div
                                className={styles.ratingBarFill}
                                style={{
                                    width: `${performanceHistory.length > 0 ? (ratingCounts.good / performanceHistory.length) * 100 : 0}%`,
                                    background: 'var(--success-gradient)'
                                }}
                            />
                        </div>
                    </div>

                    <div className={styles.ratingCard}>
                        <div className={styles.ratingEmoji}>👍</div>
                        <div className={styles.ratingValue}>{ratingCounts.average}</div>
                        <div className={styles.ratingLabel}>Average Days</div>
                        <div className={styles.ratingBar}>
                            <div
                                className={styles.ratingBarFill}
                                style={{
                                    width: `${performanceHistory.length > 0 ? (ratingCounts.average / performanceHistory.length) * 100 : 0}%`,
                                    background: 'var(--warning-gradient)'
                                }}
                            />
                        </div>
                    </div>

                    <div className={styles.ratingCard}>
                        <div className={styles.ratingEmoji}>💪</div>
                        <div className={styles.ratingValue}>{ratingCounts.poor}</div>
                        <div className={styles.ratingLabel}>Poor Days</div>
                        <div className={styles.ratingBar}>
                            <div
                                className={styles.ratingBarFill}
                                style={{
                                    width: `${performanceHistory.length > 0 ? (ratingCounts.poor / performanceHistory.length) * 100 : 0}%`,
                                    background: 'var(--danger-gradient)'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance History */}
            <div className="glass-card">
                <h3 className={styles.sectionTitle}>Recent Performance</h3>

                {performanceHistory.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>📈 No performance data yet</p>
                        <p className="text-muted">Complete some tasks to see your performance tracking</p>
                    </div>
                ) : (
                    <div className={styles.historyList}>
                        {performanceHistory.map((performance) => (
                            <div key={performance.id} className={styles.historyItem}>
                                <div className={styles.historyDate}>
                                    <div className={styles.historyDay}>
                                        {format(new Date(performance.date), 'EEE')}
                                    </div>
                                    <div className={styles.historyDateNum}>
                                        {format(new Date(performance.date), 'MMM d')}
                                    </div>
                                </div>

                                <div className={styles.historyStats}>
                                    <div className={styles.historyProgress}>
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{
                                                    width: `${performance.completion_rate}%`,
                                                    background: getRatingColor(performance.rating)
                                                }}
                                            />
                                        </div>
                                        <div className={styles.progressLabel}>
                                            {performance.completed_tasks} / {performance.total_tasks} tasks ({performance.completion_rate}%)
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.historyRating}>
                                    <span className={`badge badge-${performance.rating}`}>
                                        {getRatingEmoji(performance.rating)} {performance.rating.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Motivational Message */}
            <div className={`glass-card ${styles.motivationCard}`}>
                <h3>Keep Going! 💪</h3>
                <p>
                    {currentStreak > 0
                        ? `Amazing! You're on a ${currentStreak}-day streak. Keep up the great work!`
                        : avgCompletion >= 80
                            ? "You're doing great! Keep maintaining that high completion rate!"
                            : avgCompletion >= 50
                                ? "Good progress! Try to complete more tasks to boost your performance."
                                : "Every journey starts with a single step. You've got this!"}
                </p>
            </div>
        </div>
    );
}
