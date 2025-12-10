import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
    return (
        <div className={styles.homeContainer}>
            <div className={styles.heroSection}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            Plan Your Day,
                            <br />
                            Achieve Your Goals
                        </h1>
                        <p className={styles.heroSubtitle}>
                            A smart daily planner with intelligent notifications and performance tracking
                            to help you stay productive and organized.
                        </p>
                        <div className={styles.heroButtons}>
                            <Link href="/auth/signup" className="btn btn-primary">
                                Get Started Free
                            </Link>
                            <Link href="/auth/login" className="btn btn-secondary">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.featuresSection}>
                <div className="container">
                    <h2 className="text-center mb-4">Features</h2>
                    <div className="grid grid-3">
                        <div className="glass-card">
                            <div className={styles.featureIcon}>📅</div>
                            <h3>Daily & Monthly Planning</h3>
                            <p>
                                Plan your entire day or month at once with an intuitive interface.
                                Schedule tasks with specific times and priorities.
                            </p>
                        </div>

                        <div className="glass-card">
                            <div className={styles.featureIcon}>🔔</div>
                            <h3>Smart Notifications</h3>
                            <p>
                                Get timely reminders for your tasks. Never miss an important deadline
                                with recurring notifications.
                            </p>
                        </div>

                        <div className="glass-card">
                            <div className={styles.featureIcon}>📊</div>
                            <h3>Performance Tracking</h3>
                            <p>
                                Track your daily performance with Good, Average, or Poor ratings.
                                Build streaks and improve over time.
                            </p>
                        </div>

                        <div className="glass-card">
                            <div className={styles.featureIcon}>🔒</div>
                            <h3>Secure & Private</h3>
                            <p>
                                Your data is securely stored with Supabase. Full authentication
                                and data encryption.
                            </p>
                        </div>

                        <div className="glass-card">
                            <div className={styles.featureIcon}>💾</div>
                            <h3>Auto-Save</h3>
                            <p>
                                All your tasks and plans are automatically saved to the cloud.
                                Access from anywhere, anytime.
                            </p>
                        </div>

                        <div className="glass-card">
                            <div className={styles.featureIcon}>🎯</div>
                            <h3>Goal Oriented</h3>
                            <p>
                                Set priorities, track completion rates, and achieve your goals
                                with data-driven insights.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.ctaSection}>
                <div className="container text-center">
                    <h2>Ready to boost your productivity?</h2>
                    <p className={styles.ctaText}>
                        Join thousands of users who plan their days effectively
                    </p>
                    <Link href="/auth/signup" className="btn btn-primary">
                        Start Planning Today
                    </Link>
                </div>
            </div>

            <div className={styles.background}>
                <div className={styles.gradientOrb1}></div>
                <div className={styles.gradientOrb2}></div>
            </div>
        </div>
    );
}
