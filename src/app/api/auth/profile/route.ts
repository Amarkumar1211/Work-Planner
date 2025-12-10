import { createServerClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { userId, fullName } = await request.json();

        if (!userId || !fullName) {
            return NextResponse.json(
                { error: 'userId and fullName are required' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Insert user profile
        const { error } = await supabase
            .from('users_profile')
            .insert([
                {
                    id: userId,
                    full_name: fullName,
                    notification_preferences: {
                        email: true,
                        browser: true,
                        daily_summary: true,
                    },
                },
            ]);

        if (error) {
            console.error('Profile creation error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Profile created successfully' },
            { status: 200 }
        );
    } catch (err: any) {
        console.error('API route error:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to create profile' },
            { status: 500 }
        );
    }
}
