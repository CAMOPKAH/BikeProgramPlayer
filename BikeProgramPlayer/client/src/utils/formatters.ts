import { PowerTarget, CadenceTarget } from '@/types/workout';

/**
 * Formats seconds into MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format power target based on type
 */
export const formatPowerTarget = (powerTarget?: PowerTarget): string => {
  if (!powerTarget) return 'N/A';

  switch (powerTarget.type) {
    case 'constant':
      return `${powerTarget.value}W`;
    case 'ramp':
      return `${powerTarget.start}W → ${powerTarget.end}W`;
    case 'step':
      return `${powerTarget.value}W`;
    default:
      return 'N/A';
  }
};

/**
 * Format cadence target range
 */
export const formatCadenceTarget = (cadenceTarget?: CadenceTarget): string => {
  if (!cadenceTarget) return 'N/A';
  return `${cadenceTarget.min}-${cadenceTarget.max} RPM`;
};

/**
 * Format resistance value with percentage
 */
export const formatResistance = (resistance?: number): string => {
  if (!resistance && resistance !== 0) return 'N/A';
  return `${resistance}%`;
};

/**
 * Capitalize first letter of a string
 */
export const capitalizeFirstLetter = (string?: string): string => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Calculate current power based on target and progress
 */
export const calculateCurrentPower = (
  powerTarget?: PowerTarget,
  elapsedTimeInSegment: number = 0,
  segmentDuration: number = 1
): number => {
  if (!powerTarget) return 0;

  switch (powerTarget.type) {
    case 'constant':
      return Math.floor((powerTarget.value || 0) * 0.95); // Slightly below target
    case 'ramp':
      const progress = Math.min(elapsedTimeInSegment / segmentDuration, 1);
      const targetValue = (powerTarget.start || 0) + ((powerTarget.end || 0) - (powerTarget.start || 0)) * progress;
      return Math.floor(targetValue * 0.97);
    case 'step':
      return Math.floor((powerTarget.value || 0) * 0.95);
    default:
      return 0;
  }
};

/**
 * Calculate current cadence based on target
 */
export const calculateCurrentCadence = (cadenceTarget?: CadenceTarget): number => {
  if (!cadenceTarget) return 0;
  
  const midPoint = Math.floor((cadenceTarget.min + cadenceTarget.max) / 2);
  // Random value near midpoint for simulation
  return midPoint - 5 + Math.floor(Math.random() * 10);
};
