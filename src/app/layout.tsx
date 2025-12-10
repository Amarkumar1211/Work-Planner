import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Daily Planner - Plan Your Day Effectively',
    description: 'A comprehensive daily and monthly planner with smart notifications and performance tracking',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
