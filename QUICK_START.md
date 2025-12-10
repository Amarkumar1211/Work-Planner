# 🚀 Quick Start Guide - Daily Planner

## ✅ Setup Complete!

Your Supabase credentials have been configured:
- **Project URL**: `https://qqncavmhkbzislkgtzfv.supabase.co`
- **Environment file**: `.env.local` created ✓

## 📋 Next Steps

### 1. Run Database Migration

Before you can use the app, you need to set up the database tables in Supabase:

1. Go to your Supabase project: https://supabase.com/dashboard/project/qqncavmhkbzislkgtzfv
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file: `supabase/migrations/001_initial_schema.sql`
5. Copy ALL the contents
6. Paste into the Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. You should see "Success. No rows returned"

This creates all the necessary tables:
- `users_profile`
- `tasks`
- `notifications`
- `daily_performance`

### 2. Access the Application

The development server is already running!

1. Open your browser (Chrome, Edge, or Firefox recommended)
2. Navigate to: **http://localhost:3000**
3. You should see the beautiful landing page with:
   - Animated gradient background
   - "Plan Your Day, Achieve Your Goals" heading
   - "Get Started Free" button

### 3. Create Your Account

1. Click **"Get Started Free"** or **"Sign Up"**
2. Fill in the form:
   - **Full Name**: Your name
   - **Email**: Your email address
   - **Password**: At least 6 characters
   - **Confirm Password**: Same password
3. Click **"Sign Up"**
4. You'll be automatically logged in and redirected to the dashboard

### 4. Grant Notification Permission

When you first log in, the app will request permission to show notifications:
- Click **"Allow"** to enable task reminders
- This lets the app notify you 15 min, 5 min, and at task time

### 5. Create Your First Task

1. Click the **"+ New Task"** button in the header
2. Fill in the task details:
   - **Title**: "My First Task" (required)
   - **Description**: Optional details
   - **Date**: Today's date (pre-filled)
   - **Time**: Set a time (e.g., 2 hours from now) to test notifications
   - **Duration**: 30 minutes (default)
   - **Priority**: Medium (default)
3. Click **"Create Task"**

### 6. Explore the Views

Use the tabs to switch between views:

**Daily View**
- See all tasks for the selected day
- Check boxes to mark tasks complete
- View completion statistics
- Navigate between days

**Monthly View**
- Calendar grid showing the entire month
- Color-coded dots for task priorities:
  - 🔴 Red = High priority
  - 🟡 Yellow = Medium priority
  - 🔵 Blue = Low priority
- Click dots to edit tasks
- See task counts per day

**Performance**
- View your completion statistics
- Track your streak (consecutive "Good" days)
- See rating distribution (Good/Average/Poor)
- Get motivational messages

### 7. Test Notifications

To test the notification system:

1. Create a task with a time set to 2-3 minutes from now
2. Wait for the notifications to appear
3. You should receive:
   - First notification: 15 minutes before (if time allows)
   - Second notification: 5 minutes before (if time allows)
   - Final notification: At the exact task time

### 8. Complete Tasks & Get Rewards

1. In **Daily View**, check the box next to a task to mark it complete
2. At the end of the day, the system calculates your performance:
   - **Good (🎉)**: 80%+ completion rate
   - **Average (👍)**: 50-79% completion rate
   - **Poor (💪)**: Below 50% completion rate
3. View your performance in the **Performance** tab

## 🎨 Features to Try

- **Edit Tasks**: Click on any task card to edit it
- **Delete Tasks**: Open a task and click "Delete"
- **Change Dates**: Use Previous/Next buttons in Daily View
- **View Different Months**: Navigate months in Monthly View
- **Track Progress**: Watch your completion rates in Performance tab
- **Build Streaks**: Complete 80%+ of tasks daily to build your streak

## 🐛 Troubleshooting

### "No tasks showing"
- Make sure you created tasks for the selected date
- Check that you're logged in
- Refresh the page

### "Notifications not working"
- Make sure you clicked "Allow" for notifications
- Notifications only work when browser is open
- Check browser notification settings
- Set a time for the task (notifications need a time)

### "Can't log in"
- Make sure you ran the database migration
- Check that your email/password are correct
- Try signing up with a new account

### "Database errors"
- Verify the migration ran successfully in Supabase
- Check that your `.env.local` file has the correct credentials
- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

## 📱 Browser Compatibility

Works best on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)

## 🎯 What to Expect

### Landing Page
- Beautiful gradient background with floating orbs
- Modern glassmorphism design
- Feature cards showcasing app capabilities

### Dashboard
- Clean, organized interface
- Sticky header with navigation
- Tab-based view switching
- Smooth animations and transitions

### Task Management
- Intuitive form with all necessary fields
- Real-time updates
- Visual feedback for actions

### Performance Tracking
- Colorful charts and statistics
- Motivational messages
- Historical data visualization

## 🚀 Ready to Go!

Everything is set up and ready. Just:
1. ✅ Run the database migration in Supabase
2. ✅ Open http://localhost:3000 in your browser
3. ✅ Sign up and start planning!

Enjoy your new Daily Planner! 🎉

## **Deploying to Netlify**

- **Build & plugin:** This project uses Next.js (app dir). Netlify supports it via the `@netlify/plugin-nextjs` plugin and the `netlify.toml` already added to the repo.
- **Install deps locally:**

```powershell
npm install
```

- **Add plugin on CI:** If you let Netlify build from your repo, Netlify will install `devDependencies` during build by default. Ensure `@netlify/plugin-nextjs` is listed in `devDependencies` (it is).
- **Create a Netlify site and connect your repo:**
   1. Sign in to Netlify and click "New site from Git".
   2. Connect your Git provider (GitHub/GitLab/Bitbucket) and pick the repo.
   3. For the build settings use:

```text
Build command: npm run build
Publish directory: .next
```

   4. Add any environment variables from your `.env.local` into Netlify's Site settings → Build & deploy → Environment.
   5. Deploy the site. The Netlify Next.js plugin will handle SSR/edge functions and the app dir output.

- **Local build test:**

```powershell
npm run build
npm run start
# then open http://localhost:3000
```

- **Notes:**
   - If you use Supabase, set the Supabase `URL` and `ANON_KEY` in Netlify environment variables.
   - If Netlify changes their recommended `publish` output for app-dir in the future, consult `@netlify/plugin-nextjs` docs.
