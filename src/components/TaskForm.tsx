'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';
import type { Task } from '@/lib/supabase';
import { notificationService } from '@/lib/notifications';
import styles from './TaskForm.module.css';

interface TaskFormProps {
    userId: string;
    task?: Task | null;
    onClose: () => void;
}

export default function TaskForm({ userId, task, onClose }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [durationMinutes, setDurationMinutes] = useState(30);
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const supabase = createBrowserClient();

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setScheduledDate(task.scheduled_date);
            setScheduledTime(task.scheduled_time || '');
            setDurationMinutes(task.duration_minutes);
            setPriority(task.priority);
        } else {
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            setScheduledDate(today);
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const taskData = {
                user_id: userId,
                title,
                description: description || null,
                scheduled_date: scheduledDate,
                scheduled_time: scheduledTime || null,
                duration_minutes: durationMinutes,
                priority,
                status: 'pending' as const,
            };

            if (task) {
                // Update existing task
                const { error: updateError } = await supabase
                    .from('tasks')
                    .update(taskData)
                    .eq('id', task.id);

                if (updateError) throw updateError;
            } else {
                // Create new task
                const { data: newTask, error: insertError } = await supabase
                    .from('tasks')
                    .insert([taskData])
                    .select()
                    .single();

                if (insertError) throw insertError;

                // Schedule notifications if time is set
                if (scheduledTime && newTask) {
                    const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
                    notificationService.scheduleTaskReminders(title, dateTime);
                }
            }

            onClose();
            window.location.reload(); // Refresh to show updated tasks
        } catch (err: any) {
            setError(err.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!task || !confirm('Are you sure you want to delete this task?')) return;

        setLoading(true);
        try {
            const { error: deleteError } = await supabase
                .from('tasks')
                .delete()
                .eq('id', task.id);

            if (deleteError) throw deleteError;

            onClose();
            window.location.reload();
        } catch (err: any) {
            setError(err.message || 'Failed to delete task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`glass-card ${styles.taskForm}`}>
            <div className={styles.formHeader}>
                <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
                <button onClick={onClose} className={styles.closeButton}>
                    ✕
                </button>
            </div>

            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="form-label">
                        Task Title *
                    </label>
                    <input
                        id="title"
                        type="text"
                        className="form-input"
                        placeholder="Enter task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="description"
                        className="form-textarea"
                        placeholder="Add task description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className={styles.formRow}>
                    <div className="form-group">
                        <label htmlFor="scheduledDate" className="form-label">
                            Date *
                        </label>
                        <input
                            id="scheduledDate"
                            type="date"
                            className="form-input"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="scheduledTime" className="form-label">
                            Time
                        </label>
                        <input
                            id="scheduledTime"
                            type="time"
                            className="form-input"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className="form-group">
                        <label htmlFor="duration" className="form-label">
                            Duration (minutes)
                        </label>
                        <input
                            id="duration"
                            type="number"
                            className="form-input"
                            min="5"
                            step="5"
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority" className="form-label">
                            Priority
                        </label>
                        <select
                            id="priority"
                            className="form-select"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as any)}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formActions}>
                    {task && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="btn btn-danger"
                            disabled={loading}
                        >
                            Delete
                        </button>
                    )}
                    <div className={styles.formActionsRight}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
