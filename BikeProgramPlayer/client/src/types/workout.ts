export type WorkoutView = 'fileUpload' | 'programPreview' | 'activeWorkout' | 'pause' | 'workoutCompleted' | 'quickStart';
export type WorkoutState = 'inactive' | 'active' | 'paused' | 'completed';

export type PowerTargetType = 'constant' | 'ramp' | 'step';

export interface PowerTarget {
  type: PowerTargetType;
  value?: number;
  start?: number;
  end?: number;
}

export interface CadenceTarget {
  min: number;
  max: number;
}

export interface PositionSettings {
  handsPosition?: 'hoods' | 'drops' | 'tops' | 'aerobars';
  bodyPosition?: 'seated' | 'standing';
  legFocus?: 'both' | 'left' | 'right';
}

export interface CoachComment {
  triggerTimeSec: number;
  message: string;
  type?: 'instruction' | 'motivation' | 'warning';
  durationSec?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface WorkoutSegment {
  type: 'warmup' | 'interval' | 'recovery' | 'cooldown';
  durationSec: number;
  targetPower?: PowerTarget;
  targetCadence?: CadenceTarget;
  resistance?: number;
  positionSettings?: PositionSettings;
  coachComments?: CoachComment[];
}

export interface WorkoutMetadata {
  id: string;
  title: string;
  description?: string;
  author?: string;
  creationDate?: string;
  modificationDate?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface WorkoutPlan {
  totalDurationSec: number;
  segments: WorkoutSegment[];
}

export interface WorkoutProgram {
  formatVersion: string;
  metadata: WorkoutMetadata;
  workoutPlan: WorkoutPlan;
}

export interface WorkoutProgressState {
  currentSegmentIndex: number;
  elapsedTimeInSegment: number;
  PrevelapsedTimeInSegment: number;
  totalElapsedTime: number;
  currentPower: number;
  currentCadence: number;
  currentResistance: number;
}

export interface RecentWorkout {
  id: string;
  title: string;
  duration: number;
  difficulty?: string;
  type: 'warmup' | 'interval' | 'recovery' | 'cooldown';
}
