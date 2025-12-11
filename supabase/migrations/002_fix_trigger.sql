-- Fix for "row violates row-level security policy" error
-- This script updates the trigger function to ensure it has proper permissions

-- 1. Update the function to be SECURITY DEFINER (bypasses RLS)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Drop and recreate the trigger to be sure it's linked correctly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Ensure the Policy allows users to insert their own profile (backup for client-side creation)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users_profile;

CREATE POLICY "Users can insert own profile" ON public.users_profile
  FOR INSERT WITH CHECK (auth.uid() = id);
