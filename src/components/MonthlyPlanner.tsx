'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import type { Task } from '@/lib/supabase';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import styles from './MonthlyPlanner.module.css';

interface MonthlyPlannerProps {
    userId: string;
    onEditTask: (task: Task) => void;
}

export default function MonthlyPlanner({ userId, onEditTask }: MonthlyPlannerProps) {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createBrowserClient();

    useEffect(() => {
        fetchTasks();
    }, [selectedMonth, userId]);

    const fetchTasks = async () => {
        setLoading(true);
        const start = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
        const end = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');

        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .gte('scheduled_date', start)
            .lte('scheduled_date', end)
            .order('scheduled_date', { ascending: true });

        if (!error && data) {
            setTasks(data);
        }
        setLoading(false);
    };

    const handlePreviousMonth = () => {
        const newMonth = new Date(selectedMonth);
        newMonth.setMonth(newMonth.getMonth() - 1);
        setSelectedMonth(newMonth);
    };

    const handleNextMonth = () => {
        const newMonth = new Date(selectedMonth);
        newMonth.setMonth(newMonth.getMonth() + 1);
        setSelectedMonth(newMonth);
    };

    const handleThisMonth = () => {
        setSelectedMonth(new Date());
    };

    const getTasksForDate = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return tasks.filter(task => task.scheduled_date === dateStr);
    };

    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calculate calendar grid (including previous/next month days)
    const startDay = monthStart.getDay();
    const calendarDays: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(null);
    }

    // Add days of the month
    calendarDays.push(...daysInMonth);

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const totalTasks = tasks.length;

    return (
        <div className={styles.monthlyPlanner}>
            {/* Month Navigation */}
            <div className={`glass-card ${styles.monthNav}`}>
                <button onClick={handlePreviousMonth} className="btn btn-secondary">
                    ← Previous
                </button>
                <div className={styles.monthDisplay}>
                    <h2>{format(selectedMonth, 'MMMM yyyy')}</h2>
                    <button onClick={handleThisMonth} className={styles.thisMonthButton}>
                        This Month
                    </button>
                </div>
                <button onClick={handleNextMonth} className="btn btn-secondary">
                    Next →
                </button>
            </div>

            {/* Month Stats */}
            <div className={`glass-card ${styles.monthStats}`}>
                <div className={styles.statItem}>
                    <div className={styles.statValue}>{totalTasks}</div>
                    <div className={styles.statLabel}>Tasks This Month</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statValue}>{completedTasks}</div>
                    <div className={styles.statLabel}>Completed</div>
                </div>
                <div className={styles.statItem}>
                    <div className={styles.statValue}>{totalTasks - completedTasks}</div>
                    <div className={styles.statLabel}>Remaining</div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="glass-card">
                {loading ? (
                    <div className={styles.loadingState}>
                        <div className="spinner"></div>
                        <p>Loading calendar...</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.calendarHeader}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className={styles.dayName}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className={styles.calendarGrid}>
                            {calendarDays.map((day, index) => {
                                if (!day) {
                                    return <div key={`empty-${index}`} className={styles.emptyDay}></div>;
                                }

                                const dayTasks = getTasksForDate(day);
                                const isCurrentMonth = isSameMonth(day, selectedMonth);
                                const isTodayDate = isToday(day);
                                const completedCount = dayTasks.filter(t => t.status === 'completed').length;

                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={`${styles.calendarDay} ${!isCurrentMonth ? styles.otherMonth : ''} ${isTodayDate ? styles.today : ''}`}
                                    >
                                        <div className={styles.dayNumber}>{format(day, 'd')}</div>

                                        {dayTasks.length > 0 && (
                                            <div className={styles.dayTasks}>
                                                <div className={styles.taskCount}>
                                                    {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                                                </div>
                                                {completedCount > 0 && (
                                                    <div className={styles.completedCount}>
                                                        ✓ {completedCount}
                                                    </div>
                                                )}
                                                <div className={styles.taskPreview}>
                                                    {dayTasks.slice(0, 3).map(task => (
                                                        <div
                                                            key={task.id}
                                                            className={`${styles.taskDot} ${styles[`priority-${task.priority}`]} ${task.status === 'completed' ? styles.completed : ''}`}
                                                            onClick={() => onEditTask(task)}
                                                            title={task.title}
                                                        />
                                                    ))}
                                                    {dayTasks.length > 3 && (
                                                        <div className={styles.moreTasks}>+{dayTasks.length - 3}</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
