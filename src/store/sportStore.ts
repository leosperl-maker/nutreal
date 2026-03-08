import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SportProfile, WorkoutPlan, CompletedWorkout } from '../lib/workoutGenerator';

interface SportState {
  // Sport Profile
  sportProfile: SportProfile | null;
  sportSetupComplete: boolean;
  
  // Workout Plan
  currentPlan: WorkoutPlan | null;
  
  // Completed Workouts
  completedWorkouts: CompletedWorkout[];
  
  // Active Workout
  activeWorkoutSessionId: string | null;
  activeWorkoutStartTime: string | null;
  
  // Steps
  todaySteps: number;
  stepsHistory: { date: string; steps: number }[];
  
  // Actions
  setSportProfile: (profile: SportProfile) => void;
  setSportSetupComplete: (complete: boolean) => void;
  setCurrentPlan: (plan: WorkoutPlan) => void;
  addCompletedWorkout: (workout: CompletedWorkout) => void;
  startWorkout: (sessionId: string) => void;
  endWorkout: () => void;
  setTodaySteps: (steps: number) => void;
  addStepsHistory: (date: string, steps: number) => void;
  getWeeklyStats: () => { workouts: number; totalCalories: number; totalMinutes: number; avgFeeling: string };
  getStreak: () => number;
}

export const useSportStore = create<SportState>()(
  persist(
    (set, get) => ({
      sportProfile: null,
      sportSetupComplete: false,
      currentPlan: null,
      completedWorkouts: [],
      activeWorkoutSessionId: null,
      activeWorkoutStartTime: null,
      todaySteps: 0,
      stepsHistory: [],

      setSportProfile: (profile) => set({ sportProfile: profile }),
      
      setSportSetupComplete: (complete) => set({ sportSetupComplete: complete }),
      
      setCurrentPlan: (plan) => set({ currentPlan: plan }),
      
      addCompletedWorkout: (workout) => set((state) => ({
        completedWorkouts: [workout, ...state.completedWorkouts].slice(0, 200),
      })),
      
      startWorkout: (sessionId) => set({
        activeWorkoutSessionId: sessionId,
        activeWorkoutStartTime: new Date().toISOString(),
      }),
      
      endWorkout: () => set({
        activeWorkoutSessionId: null,
        activeWorkoutStartTime: null,
      }),
      
      setTodaySteps: (steps) => set({ todaySteps: steps }),
      
      addStepsHistory: (date, steps) => set((state) => {
        const existing = state.stepsHistory.find(s => s.date === date);
        if (existing) {
          return {
            stepsHistory: state.stepsHistory.map(s =>
              s.date === date ? { ...s, steps } : s
            ),
          };
        }
        return { stepsHistory: [...state.stepsHistory, { date, steps }] };
      }),
      
      getWeeklyStats: () => {
        const { completedWorkouts } = get();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekStr = weekAgo.toISOString().split('T')[0];
        
        const thisWeek = completedWorkouts.filter(w => w.date >= weekStr);
        
        const feelings = thisWeek.map(w => w.feeling);
        const feelingScore: Record<string, number> = { easy: 1, good: 2, hard: 3, exhausted: 4 };
        const avgScore = feelings.length > 0
          ? feelings.reduce((sum, f) => sum + (feelingScore[f] || 2), 0) / feelings.length
          : 0;
        
        let avgFeeling = 'N/A';
        if (avgScore <= 1.5) avgFeeling = '😊 Facile';
        else if (avgScore <= 2.5) avgFeeling = '💪 Bien';
        else if (avgScore <= 3.5) avgFeeling = '🔥 Intense';
        else avgFeeling = '😤 Épuisant';
        
        return {
          workouts: thisWeek.length,
          totalCalories: thisWeek.reduce((sum, w) => sum + w.caloriesBurned, 0),
          totalMinutes: thisWeek.reduce((sum, w) => sum + w.duration, 0),
          avgFeeling,
        };
      },
      
      getStreak: () => {
        const { completedWorkouts } = get();
        if (completedWorkouts.length === 0) return 0;
        
        const today = new Date();
        let streak = 0;
        
        for (let i = 0; i < 365; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const hasWorkout = completedWorkouts.some(w => w.date === dateStr);
          if (hasWorkout) {
            streak++;
          } else if (i > 0) {
            break;
          }
        }
        
        return streak;
      },
    }),
    {
      name: 'nutrilens-sport-storage',
    }
  )
);
