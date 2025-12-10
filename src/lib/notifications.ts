// Notification Service for Browser Notifications

export class NotificationService {
    private static instance: NotificationService;
    private permission: NotificationPermission = 'default';

    private constructor() {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            this.permission = Notification.permission;
        }
    }

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    async requestPermission(): Promise<boolean> {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            console.warn('Browser does not support notifications');
            return false;
        }

        if (this.permission === 'granted') {
            return true;
        }

        const permission = await Notification.requestPermission();
        this.permission = permission;
        return permission === 'granted';
    }

    hasPermission(): boolean {
        return this.permission === 'granted';
    }

    async showNotification(title: string, options?: NotificationOptions): Promise<void> {
        if (!this.hasPermission()) {
            console.warn('Notification permission not granted');
            return;
        }

        try {
            new Notification(title, {
                icon: '/icon-192x192.png',
                badge: '/icon-192x192.png',
                ...options,
            });
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }

    scheduleNotification(
        title: string,
        scheduledTime: Date,
        options?: NotificationOptions
    ): number {
        const now = new Date().getTime();
        const scheduledTimeMs = scheduledTime.getTime();
        const delay = scheduledTimeMs - now;

        if (delay <= 0) {
            this.showNotification(title, options);
            return -1;
        }

        const timeoutId = window.setTimeout(() => {
            this.showNotification(title, options);
        }, delay);

        return timeoutId;
    }

    cancelNotification(timeoutId: number): void {
        if (timeoutId !== -1) {
            window.clearTimeout(timeoutId);
        }
    }

    // Schedule recurring notifications for a task
    scheduleTaskReminders(
        taskTitle: string,
        scheduledDateTime: Date,
        reminderMinutes: number[] = [15, 5, 0] // Remind 15 min, 5 min before, and at time
    ): number[] {
        const timeoutIds: number[] = [];

        reminderMinutes.forEach((minutes) => {
            const reminderTime = new Date(scheduledDateTime.getTime() - minutes * 60 * 1000);
            const message = minutes === 0
                ? `Time to: ${taskTitle}`
                : `Reminder: ${taskTitle} in ${minutes} minutes`;

            const timeoutId = this.scheduleNotification(message, reminderTime, {
                body: 'Click to view your task',
                tag: `task-${taskTitle}-${minutes}`,
                requireInteraction: minutes === 0,
            });

            if (timeoutId !== -1) {
                timeoutIds.push(timeoutId);
            }
        });

        return timeoutIds;
    }

    // Show daily performance notification
    showDailyPerformance(rating: 'good' | 'average' | 'poor', completionRate: number): void {
        const emojis = {
            good: '🎉',
            average: '👍',
            poor: '💪',
        };

        const messages = {
            good: 'Excellent work today!',
            average: 'Good effort today!',
            poor: 'Keep pushing forward!',
        };

        this.showNotification(
            `${emojis[rating]} Daily Performance: ${rating.toUpperCase()}`,
            {
                body: `${messages[rating]} You completed ${completionRate}% of your tasks.`,
                tag: 'daily-performance',
                requireInteraction: true,
            }
        );
    }
}

export const notificationService = NotificationService.getInstance();
