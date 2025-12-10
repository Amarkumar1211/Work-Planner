'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase';
import type { Task } from '@/lib/supabase';
import { notificationService } from '@/lib/notifications';
import { performanceService } from '@/lib/performance';
import DailyPlanner from '@/components/DailyPlanner';
import MonthlyPlanner from '@/components/MonthlyPlanner';
import PerformanceDashboard from '@/components/PerformanceDashboard';
import TaskForm from '@/components/TaskForm';
import styles from './dashboard.module.css';

export const dynamic = 'force-dynamic';

type ViewMode = 'daily' | 'monthly' | 'performance';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('daily');
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createBrowserClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                // Request notification permission
                notificationService.requestPermission();
                // Mark overdue tasks
                await performanceService.markOverdueTasks(user.id);
            } else {
                router.push('/auth/login');
            }
            setLoading(false);
        };

        getUser();
    }, [router, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
        router.refresh();
    };

    const handleCreateTask = () => {
        setSelectedTask(null);
        setShowTaskForm(true);
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setShowTaskForm(true);
    };

    const handleCloseForm = () => {
        setShowTaskForm(false);
        setSelectedTask(null);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className="spinner"></div>
                <p>Loading your planner...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className={styles.dashboardContainer}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.logo}>📅 Daily Planner</h1>
                    <div className={styles.headerActions}>
                        <button onClick={handleCreateTask} className="btn btn-primary">
                            + New Task
                        </button>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* View Mode Tabs */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${viewMode === 'daily' ? styles.tabActive : ''}`}
                        onClick={() => setViewMode('daily')}
                    >
                        Daily View
                    </button>
                    <button
                        className={`${styles.tab} ${viewMode === 'monthly' ? styles.tabActive : ''}`}
                        onClick={() => setViewMode('monthly')}
                    >
                        Monthly View
                    </button>
                    <button
                        className={`${styles.tab} ${viewMode === 'performance' ? styles.tabActive : ''}`}
                        onClick={() => setViewMode('performance')}
                    >
                        Performance
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <div className="container">
                    {viewMode === 'daily' && (
                        <DailyPlanner userId={user.id} onEditTask={handleEditTask} />
                    )}
                    {viewMode === 'monthly' && (
                        <MonthlyPlanner userId={user.id} onEditTask={handleEditTask} />
                    )}
                    {viewMode === 'performance' && (
                        <PerformanceDashboard userId={user.id} />
                    )}
                </div>
            </main>

            {/* Task Form Modal */}
            {showTaskForm && (
                <div className={styles.modalOverlay} onClick={handleCloseForm}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <TaskForm
                            userId={user.id}
                            task={selectedTask}
                            onClose={handleCloseForm}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
