import confetti from 'canvas-confetti';

// ── Haptic Feedback ──
export function haptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') {
  if (!navigator.vibrate) return;
  switch (type) {
    case 'light': navigator.vibrate(10); break;
    case 'medium': navigator.vibrate(25); break;
    case 'heavy': navigator.vibrate([50, 30, 50]); break;
    case 'success': navigator.vibrate([10, 50, 20, 50, 30]); break;
    case 'error': navigator.vibrate([100, 50, 100]); break;
  }
}

// ── Confetti Presets ──
export function celebrateStreak(streakCount: number) {
  haptic('success');
  const intensity = Math.min(streakCount / 7, 1);
  confetti({
    particleCount: 50 + Math.floor(intensity * 150),
    spread: 60 + intensity * 60,
    origin: { y: 0.7 },
    colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'],
    gravity: 0.8,
  });
}

export function celebrateMealLogged() {
  haptic('medium');
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { y: 0.8, x: 0.5 },
    colors: ['#3b82f6', '#60a5fa', '#93c5fd'],
    gravity: 1.2,
    scalar: 0.8,
  });
}

export function celebrateGoalReached() {
  haptic('heavy');
  const fire = (delay: number, x: number) => {
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        startVelocity: 30,
        origin: { x, y: 0.5 },
        colors: ['#fbbf24', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'],
      });
    }, delay);
  };
  fire(0, 0.3);
  fire(300, 0.7);
  fire(600, 0.5);
}

export function celebrateLevelUp() {
  haptic('heavy');
  confetti({
    particleCount: 200,
    spread: 160,
    startVelocity: 45,
    origin: { y: 0.6 },
    colors: ['#fbbf24', '#f59e0b', '#d97706'],
    gravity: 0.6,
    ticks: 300,
  });
}

export function celebrateAchievement() {
  haptic('success');
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#fbbf24'],
  });
}

export function celebrateWaterComplete() {
  haptic('medium');
  confetti({
    particleCount: 40,
    spread: 40,
    origin: { y: 0.75 },
    colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    gravity: 1.5,
    scalar: 0.7,
  });
}

export function celebrateOnboarding() {
  haptic('heavy');
  confetti({
    particleCount: 150,
    spread: 120,
    startVelocity: 40,
    origin: { y: 0.5 },
    colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#8b5cf6', '#60a5fa'],
    gravity: 0.7,
    ticks: 400,
  });
}
