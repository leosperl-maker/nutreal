/*
  # NutriLens Database Schema
  
  1. New Tables
    - `profiles` - User profile data (nutrition goals, preferences)
    - `meals` - Logged meals with nutritional data
    - `water_logs` - Daily water intake tracking
    - `weight_logs` - Weight tracking over time
    - `meal_plans` - AI-generated weekly meal plans
    - `product_scans` - Barcode product scan history
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  sex text NOT NULL DEFAULT 'M',
  birth_date date,
  height_cm integer NOT NULL DEFAULT 170,
  weight_current_kg decimal(5,2) NOT NULL DEFAULT 70,
  weight_goal_kg decimal(5,2) NOT NULL DEFAULT 65,
  activity_level text NOT NULL DEFAULT 'moderate',
  medical_conditions jsonb DEFAULT '[]'::jsonb,
  diet_preferences text[] DEFAULT '{}',
  daily_calorie_budget integer NOT NULL DEFAULT 2000,
  macro_targets jsonb DEFAULT '{"protein_g": 150, "fat_g": 55, "carbs_g": 200, "fiber_g": 28}'::jsonb,
  tdee integer NOT NULL DEFAULT 2200,
  estimated_goal_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  meal_type text NOT NULL DEFAULT 'lunch',
  dish_name text NOT NULL DEFAULT '',
  photo_url text,
  foods jsonb DEFAULT '[]'::jsonb,
  total_calories integer NOT NULL DEFAULT 0,
  total_protein_g decimal(6,2) NOT NULL DEFAULT 0,
  total_fat_g decimal(6,2) NOT NULL DEFAULT 0,
  total_carbs_g decimal(6,2) NOT NULL DEFAULT 0,
  total_fiber_g decimal(6,2) NOT NULL DEFAULT 0,
  ai_tip text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own meals"
  ON meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Water logs table
CREATE TABLE IF NOT EXISTS water_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  amount_ml integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own water logs"
  ON water_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own water logs"
  ON water_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own water logs"
  ON water_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Weight logs table
CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  weight_kg decimal(5,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own weight logs"
  ON weight_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight logs"
  ON weight_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight logs"
  ON weight_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date date NOT NULL,
  plan_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own meal plans"
  ON meal_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans"
  ON meal_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans"
  ON meal_plans FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Product scans table
CREATE TABLE IF NOT EXISTS product_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  barcode text NOT NULL DEFAULT '',
  product_name text NOT NULL DEFAULT '',
  brand text DEFAULT '',
  score_100 integer NOT NULL DEFAULT 50,
  nutriscore_grade char(1),
  additives jsonb DEFAULT '[]'::jsonb,
  nutrients jsonb DEFAULT '{}'::jsonb,
  category text DEFAULT '',
  image_url text DEFAULT '',
  alternatives jsonb DEFAULT '[]'::jsonb,
  scanned_at timestamptz DEFAULT now()
);

ALTER TABLE product_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own product scans"
  ON product_scans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own product scans"
  ON product_scans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, date);
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON water_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON weight_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_product_scans_user ON product_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_product_scans_barcode ON product_scans(barcode);