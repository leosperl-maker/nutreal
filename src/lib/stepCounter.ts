// Step Counter using DeviceMotion API
// Compteur de pas utilisant l'API DeviceMotion

type StepCallback = (steps: number) => void;

class StepCounter {
  private steps = 0;
  private isRunning = false;
  private callback: StepCallback | null = null;
  private lastAcceleration = 0;
  private threshold = 1.2; // Sensibilité du détecteur
  private lastStepTime = 0;
  private minStepInterval = 250; // ms entre deux pas minimum
  private permissionGranted = false;

  async requestPermission(): Promise<boolean> {
    // iOS 13+ requires explicit permission
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceMotionEvent as any).requestPermission();
        this.permissionGranted = response === 'granted';
        return this.permissionGranted;
      } catch {
        this.permissionGranted = false;
        return false;
      }
    }
    // Android and older iOS don't need permission
    this.permissionGranted = true;
    return true;
  }

  private handleMotion = (event: DeviceMotionEvent) => {
    if (!event.accelerationIncludingGravity) return;

    const { x, y, z } = event.accelerationIncludingGravity;
    if (x === null || y === null || z === null) return;

    const acceleration = Math.sqrt(x * x + y * y + z * z);
    const delta = Math.abs(acceleration - this.lastAcceleration);
    const now = Date.now();

    if (delta > this.threshold && (now - this.lastStepTime) > this.minStepInterval) {
      this.steps++;
      this.lastStepTime = now;
      this.callback?.(this.steps);
    }

    this.lastAcceleration = acceleration;
  };

  start(callback: StepCallback, initialSteps = 0): boolean {
    if (this.isRunning) return true;
    
    if (!window.DeviceMotionEvent) {
      console.warn('DeviceMotion API non disponible');
      return false;
    }

    this.steps = initialSteps;
    this.callback = callback;
    this.isRunning = true;

    window.addEventListener('devicemotion', this.handleMotion);
    return true;
  }

  stop(): number {
    if (!this.isRunning) return this.steps;
    
    window.removeEventListener('devicemotion', this.handleMotion);
    this.isRunning = false;
    this.callback = null;
    
    return this.steps;
  }

  getSteps(): number {
    return this.steps;
  }

  reset(): void {
    this.steps = 0;
    this.lastAcceleration = 0;
    this.lastStepTime = 0;
  }

  isActive(): boolean {
    return this.isRunning;
  }

  isSupported(): boolean {
    return !!window.DeviceMotionEvent;
  }
}

export const stepCounter = new StepCounter();
export default StepCounter;
