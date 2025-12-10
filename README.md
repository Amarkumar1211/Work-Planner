# Daily Planner SaaS

A comprehensive daily and monthly planner application with smart notifications, performance tracking, and reward system.

## 🌟 Features

- **📅 Daily & Monthly Planning**: Plan your entire day or month with an intuitive interface
- **🔔 Smart Notifications**: Browser notifications for task reminders (15 min, 5 min, and at task time)
- **📊 Performance Tracking**: Daily performance analysis with Good/Average/Poor ratings
- **🎯 Reward System**: Get daily performance feedback and track your streaks
- **🔒 Secure Authentication**: Email/password authentication with Supabase
- **💾 Cloud Storage**: All tasks automatically saved to Supabase database
- **🎨 Premium UI**: Modern glassmorphism design with smooth animations
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to **Project Settings** → **API**
4. Copy your **Project URL** and **anon/public key**

### 2. Run Database Migration

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor and click **Run**
5. Verify that all tables were created successfully

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   copy .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Use

### Creating an Account

1. Click **Get Started Free** or **Sign Up**
2. Enter your full name, email, and password
3. Click **Sign Up**
4. You'll be automatically logged in

### Adding Tasks

1. Click **+ New Task** button
2. Fill in task details:
   - **Title**: What you need to do
   - **Description**: Optional details
   - **Date**: When to do it
   - **Time**: Specific time (optional, but needed for notifications)
   - **Duration**: How long it will take
   - **Priority**: Low, Medium, or High
3. Click **Create Task**

### Enabling Notifications

1. When you first log in, the app will request notification permission
2. Click **Allow** in your browser
3. Notifications will appear:
   - 15 minutes before task time
   - 5 minutes before task time
   - At the exact task time

### Viewing Your Schedule

- **Daily View**: See all tasks for a specific day
- **Monthly View**: Calendar view with task dots (color-coded by priority)
- **Performance**: Track your completion rates and streaks

### Completing Tasks

1. In Daily View, check the checkbox next to a task to mark it complete
2. Your performance is automatically calculated at the end of each day

### Performance Ratings

- **Good** (🎉): 80%+ completion rate
- **Average** (👍): 50-79% completion rate
- **Poor** (💪): Below 50% completion rate

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effect
- **Vibrant Gradients**: Eye-catching color schemes
- **Smooth Animations**: Fade-ins, slides, and hover effects
- **Dark Theme**: Easy on the eyes
- **Responsive Design**: Works on all screen sizes

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Vanilla CSS with CSS Modules
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Notifications**: Browser Notification API
- **Date Handling**: date-fns

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/          # Login page
│   │   │   └── signup/         # Signup page
│   │   ├── dashboard/          # Main dashboard
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── DailyPlanner.tsx    # Daily view component
│   │   ├── MonthlyPlanner.tsx  # Monthly calendar view
│   │   ├── PerformanceDashboard.tsx  # Performance tracking
│   │   └── TaskForm.tsx        # Task create/edit form
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── notifications.ts    # Notification service
│   │   └── performance.ts      # Performance tracking service
│   └── middleware.ts           # Route protection
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🔐 Security Features

- Row Level Security (RLS) policies in Supabase
- Users can only access their own data
- Secure authentication with Supabase Auth
- Protected routes with middleware

## 🐛 Troubleshooting

### Notifications Not Working

- Make sure you've granted notification permission in your browser
- Notifications only work when the browser is open
- Check that you've set a time for the task
- Some browsers block notifications in incognito mode

### Database Errors

- Verify your Supabase credentials in `.env.local`
- Make sure you ran the migration script
- Check Supabase dashboard for any errors

### Build Errors

- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Make sure you're using Node.js 18 or higher

## 📝 Future Enhancements

- Email notifications
- Task categories/tags
- Recurring tasks
- Team collaboration
- Mobile app (React Native)
- Task templates
- Export to calendar (iCal)
- Dark/light theme toggle

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💬 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ using Next.js and Supabase**
