import { createClient } from '@supabase/supabase-js';

// Browser client for client components (Edge-compatible)
export const createBrowserClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    });
};

// Server client for server components and API routes
export const createServerClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, supabaseAnonKey);
};

// Database types
export type Task = {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    scheduled_date: string;
    scheduled_time: string | null;
    duration_minutes: number;
    status: 'pending' | 'completed' | 'missed';
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    updated_at: string;
    completed_at: string | null;
};

export type DailyPerformance = {
    id: string;
    user_id: string;
    date: string;
    total_tasks: number;
    completed_tasks: number;
    missed_tasks: number;
    completion_rate: number;
    rating: 'poor' | 'average' | 'good';
    created_at: string;
};

export type NotificationRecord = {
    id: string;
    task_id: string;
    user_id: string;
    notification_time: string;
    sent: boolean;
    type: 'reminder' | 'recurring' | 'daily_summary';
    created_at: string;
};
