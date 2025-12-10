# 🗄️ Database Setup - Fix "Could not find table" Error

## ✅ Good News!

You successfully logged in! The error you're seeing means the database tables haven't been created yet.

![Error Screenshot](file:///C:/Users/HP/.gemini/antigravity/brain/1a64ceec-871e-481d-8837-95aa88027901/uploaded_image_1765341253194.png)

**Error**: "Could not find the table 'public.tasks' in the schema cache"

---

## 🚀 Quick Fix: Run Database Migration

### Step 1: Open Supabase SQL Editor

1. Click this link: https://supabase.com/dashboard/project/qqncavmhkbzislkgtzfv/sql/new
2. You'll see a blank SQL editor

### Step 2: Copy the Migration Script

1. In VS Code, open the file: `supabase/migrations/001_initial_schema.sql`
2. Press **Ctrl+A** to select all
3. Press **Ctrl+C** to copy

### Step 3: Paste and Run

1. Go back to the Supabase SQL Editor tab
2. Press **Ctrl+V** to paste the entire script
3. Click the **Run** button (or press **Ctrl+Enter**)
4. Wait a few seconds
5. You should see: **"Success. No rows returned"**

### Step 4: Verify Tables Were Created

1. In Supabase, click **Table Editor** in the left sidebar
2. You should now see these tables:
   - ✅ `users_profile`
   - ✅ `tasks`
   - ✅ `notifications`
   - ✅ `daily_performance`

### Step 5: Go Back to Your App

1. Go back to http://localhost:3000/dashboard
2. Refresh the page (F5)
3. Click **"+ New Task"** again
4. The error should be gone!
5. Fill in the task form and click **Create Task**
6. Your task should be created successfully! 🎉

---

## 📋 What the Migration Creates

The SQL script creates:

### Tables
- **users_profile**: Your user information
- **tasks**: All your tasks and to-dos
- **notifications**: Scheduled reminders
- **daily_performance**: Performance tracking data

### Security
- **Row Level Security (RLS)**: You can only see your own data
- **Policies**: Automatic access control
- **Triggers**: Auto-update timestamps

### Indexes
- Optimized for fast queries
- Better performance

---

## 🎯 After Migration

Once the migration is complete, you'll be able to:

✅ Create tasks  
✅ Edit tasks  
✅ Delete tasks  
✅ View daily schedule  
✅ View monthly calendar  
✅ Track performance  
✅ Receive notifications  

---

## 🐛 Troubleshooting

### "Permission denied" error
- Make sure you're logged into the correct Supabase project
- Check that you're the project owner

### "Syntax error" in SQL
- Make sure you copied the ENTIRE file
- Don't modify the SQL script
- Copy from the very first line to the very last line

### Tables still not showing
- Refresh the Supabase dashboard
- Check the **Table Editor** to verify tables exist
- Try refreshing your app (F5)

---

## 🔗 Quick Links

- **SQL Editor**: https://supabase.com/dashboard/project/qqncavmhkbzislkgtzfv/sql/new
- **Table Editor**: https://supabase.com/dashboard/project/qqncavmhkbzislkgtzfv/editor
- **Your App**: http://localhost:3000/dashboard

---

## ✨ You're Almost There!

Just run that SQL script and you'll be all set to start using your Daily Planner! 🚀
