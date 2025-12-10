'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import type { Task } from '@/lib/supabase';
import { format } from 'date-fns';
import styles from './DailyPlanner.module.css';

interface DailyPlannerProps {
    userId: string;
    onEditTask: (task: Task) => void;
}

export default function DailyPlanner({ userId, onEditTask }: DailyPlannerProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createBrowserClient();

    useEffect(() => {
        fetchTasks();
    }, [selectedDate, userId]);

    const fetchTasks = async () => {
        setLoading(true);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .eq('scheduled_date', dateStr)
            .order('scheduled_time', { ascending: true, nullsFirst: false });

        if (!error && data) {
            setTasks(data);
        }
        setLoading(false);
    };

    const handleToggleComplete = async (task: Task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const completed_at = newStatus === 'completed' ? new Date().toISOString() : null;

        const { error } = await supabase
            .from('tasks')
            .update({ status: newStatus, completed_at })
            .eq('id', task.id);

        if (!error) {
            fetchTasks();
        }
    };

    const handlePreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const handleToday = () => {
        setSelectedDate(new Date());
    };

    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const totalCount = tasks.length;
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className={styles.dailyPlanner}>
            {/* Date Navigation */}
            <div className={`glass-card ${styles.dateNav}`}>
                <button onClick={handlePreviousDay} className="btn btn-secondary">
                    ← Previous
                </button>
                <div className={styles.dateDisplay}>
                    <h2>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
                    <button onClick={handleToday} className={styles.todayButton}>
                        Today
                    </button>
                </div>
                <button onClick={handleNextDay} className="btn btn-secondary">
                    Next →
                </button>
            </div>

            {/* Stats */}
            <div className={`glass-card ${styles.stats}`}>
                <div className={styles.statItem}>
                    <div className={styles.statValue}>{totalCount}</div>
                    <div className={styles.statLabel}>Total Tasks</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statValue}>{completedCount}</div>
                    <div className={styles.statLabel}>Completed</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statValue}>{completionRate}%</div>
                    <div className={styles.statLabel}>Completion Rate</div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="glass-card">
                <h3 className={styles.sectionTitle}>Tasks for Today</h3>

                {loading ? (
                    <div className={styles.loadingState}>
                        <div className="spinner"></div>
                        <p>Loading tasks...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>📝 No tasks scheduled for this day</p>
                        <p className="text-muted">Click "New Task" to add one</p>
                    </div>
                ) : (
                    <div className={styles.tasksList}>
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`${styles.taskCard} ${task.status === 'completed' ? styles.taskCompleted : ''} ${task.status === 'missed' ? styles.taskMissed : ''}`}
                            >
                                <div className={styles.taskCheckbox}>
                                    <input
                                        type="checkbox"
                                        checked={task.status === 'completed'}
                                        onChange={() => handleToggleComplete(task)}
                                        disabled={task.status === 'missed'}
                                    />
                                </div>

                                <div className={styles.taskContent} onClick={() => onEditTask(task)}>
                                    <div className={styles.taskHeader}>
                                        <h4 className={styles.taskTitle}>{task.title}</h4>
                                        <span className={`badge badge-priority-${task.priority}`}>
                                            {task.priority}
                                        </span>
                                    </div>

                                    {task.description && (
                                        <p className={styles.taskDescription}>{task.description}</p>
                                    )}

                                    <div className={styles.taskMeta}>
                                        {task.scheduled_time && (
                                            <span className={styles.taskTime}>
                                                🕐 {task.scheduled_time.slice(0, 5)}
                                            </span>
                                        )}
                                        <span className={styles.taskDuration}>
                                            ⏱️ {task.duration_minutes} min
                                        </span>
                                        {task.status === 'missed' && (
                                            <span className="badge badge-poor">Missed</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
