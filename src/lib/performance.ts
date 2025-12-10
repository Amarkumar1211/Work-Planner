import { createBrowserClient } from './supabase';
import type { Task, DailyPerformance } from './supabase';

export type PerformanceRating = 'poor' | 'average' | 'good';

export interface PerformanceMetrics {
    totalTasks: number;
    completedTasks: number;
    missedTasks: number;
    completionRate: number;
    rating: PerformanceRating;
}

export class PerformanceService {
    private supabase = createBrowserClient();

    // Calculate performance rating based on completion rate
    calculateRating(completionRate: number): PerformanceRating {
        if (completionRate >= 80) return 'good';
        if (completionRate >= 50) return 'average';
        return 'poor';
    }

    // Calculate daily performance metrics
    async calculateDailyPerformance(
        userId: string,
        date: Date
    ): Promise<PerformanceMetrics> {
        const dateStr = date.toISOString().split('T')[0];

        // Get all tasks for the day
        const { data: tasks, error } = await this.supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .eq('scheduled_date', dateStr);

        if (error) {
            console.error('Error fetching tasks:', error);
            return {
                totalTasks: 0,
                completedTasks: 0,
                missedTasks: 0,
                completionRate: 0,
                rating: 'poor',
            };
        }

        const totalTasks = tasks?.length || 0;
        const completedTasks = tasks?.filter((t) => t.status === 'completed').length || 0;
        const missedTasks = tasks?.filter((t) => t.status === 'missed').length || 0;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        const rating = this.calculateRating(completionRate);

        return {
            totalTasks,
            completedTasks,
            missedTasks,
            completionRate: Math.round(completionRate * 100) / 100,
            rating,
        };
    }

    // Save daily performance to database
    async saveDailyPerformance(
        userId: string,
        date: Date,
        metrics: PerformanceMetrics
    ): Promise<DailyPerformance | null> {
        const dateStr = date.toISOString().split('T')[0];

        const { data, error } = await this.supabase
            .from('daily_performance')
            .upsert({
                user_id: userId,
                date: dateStr,
                total_tasks: metrics.totalTasks,
                completed_tasks: metrics.completedTasks,
                missed_tasks: metrics.missedTasks,
                completion_rate: metrics.completionRate,
                rating: metrics.rating,
            })
            .select()
            .single();

        if (error) {
            console.error('Error saving performance:', error);
            return null;
        }

        return data;
    }

    // Get performance history
    async getPerformanceHistory(
        userId: string,
        days: number = 30
    ): Promise<DailyPerformance[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        const { data, error } = await this.supabase
            .from('daily_performance')
            .select('*')
            .eq('user_id', userId)
            .gte('date', startDateStr)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching performance history:', error);
            return [];
        }

        return data || [];
    }

    // Mark overdue tasks as missed
    async markOverdueTasks(userId: string): Promise<void> {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0];

        // Get all pending tasks that are overdue
        const { data: tasks, error: fetchError } = await this.supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'pending')
            .or(`scheduled_date.lt.${today},and(scheduled_date.eq.${today},scheduled_time.lt.${currentTime})`);

        if (fetchError || !tasks) {
            console.error('Error fetching overdue tasks:', fetchError);
            return;
        }

        // Update all overdue tasks to missed
        if (tasks.length > 0) {
            const taskIds = tasks.map((t) => t.id);
            const { error: updateError } = await this.supabase
                .from('tasks')
                .update({ status: 'missed' })
                .in('id', taskIds);

            if (updateError) {
                console.error('Error updating overdue tasks:', updateError);
            }
        }
    }

    // Get current streak (consecutive days with good rating)
    async getCurrentStreak(userId: string): Promise<number> {
        const { data, error } = await this.supabase
            .from('daily_performance')
            .select('date, rating')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(365);

        if (error || !data) {
            return 0;
        }

        let streak = 0;
        for (const performance of data) {
            if (performance.rating === 'good') {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }
}

export const performanceService = new PerformanceService();
