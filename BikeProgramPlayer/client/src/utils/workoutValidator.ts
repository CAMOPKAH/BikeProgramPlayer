import { WorkoutProgram } from '@/types/workout';

interface ValidationResult {
  valid: boolean;
  message: string;
}

export const validateWorkoutFile = (json: any): ValidationResult => {
  try {
    // Check format version
    if (json.formatVersion !== '1.2') {
      return { 
        valid: false, 
        message: 'Invalid format version. Expected 1.2' 
      };
    }
    
    // Check required fields
    if (!json.metadata || !json.metadata.id) {
      return { 
        valid: false, 
        message: 'Missing required metadata fields (id)' 
      };
    }
    
    if (!json.workoutPlan || !json.workoutPlan.segments || !Array.isArray(json.workoutPlan.segments)) {
      return { 
        valid: false, 
        message: 'Missing or invalid workoutPlan.segments' 
      };
    }
    
    // Check if segments are properly defined
    for (let i = 0; i < json.workoutPlan.segments.length; i++) {
      const segment = json.workoutPlan.segments[i];
      
      if (!segment.type || !segment.durationSec) {
        return {
          valid: false,
          message: `Invalid segment at index ${i}: missing type or durationSec`
        };
      }
      
      if (!['warmup', 'interval', 'recovery', 'cooldown'].includes(segment.type)) {
        return {
          valid: false,
          message: `Invalid segment type at index ${i}: ${segment.type}`
        };
      }
      
      // Validate power target if it exists
      if (segment.targetPower) {
        if (!segment.targetPower.type) {
          return {
            valid: false,
            message: `Invalid power target at segment ${i}: missing type`
          };
        }
        
        if (segment.targetPower.type === 'constant' && segment.targetPower.value === undefined) {
          return {
            valid: false,
            message: `Invalid constant power target at segment ${i}: missing value`
          };
        }
        
        if (segment.targetPower.type === 'ramp' && 
            (segment.targetPower.start === undefined || segment.targetPower.end === undefined)) {
          return {
            valid: false,
            message: `Invalid ramp power target at segment ${i}: missing start or end`
          };
        }
        
        if (segment.targetPower.type === 'step' && segment.targetPower.value === undefined) {
          return {
            valid: false,
            message: `Invalid step power target at segment ${i}: missing value`
          };
        }
      }
      
      // Validate coach comments if they exist
      if (segment.coachComments && Array.isArray(segment.coachComments)) {
        for (let j = 0; j < segment.coachComments.length; j++) {
          const comment = segment.coachComments[j];
          
          if (comment.triggerTimeSec === undefined || comment.message === undefined) {
            return {
              valid: false,
              message: `Invalid coach comment at segment ${i}, comment ${j}: missing triggerTimeSec or message`
            };
          }
          
          if (comment.triggerTimeSec >= segment.durationSec) {
            return {
              valid: false,
              message: `Invalid coach comment at segment ${i}, comment ${j}: triggerTimeSec exceeds segment duration`
            };
          }
        }
      }
    }
    
    // All checks passed
    return { valid: true, message: 'File validated successfully' };
    
  } catch (error) {
    return { 
      valid: false, 
      message: `Validation error: ${(error as Error).message}` 
    };
  }
};

export const parseWorkoutFile = (fileContent: string): ValidationResult & { workout?: WorkoutProgram } => {
  try {
    const json = JSON.parse(fileContent);
    const validationResult = validateWorkoutFile(json);
    
    if (!validationResult.valid) {
      return validationResult;
    }
    
    return {
      valid: true,
      message: 'Workout file parsed successfully',
      workout: json as WorkoutProgram
    };
  } catch (error) {
    return {
      valid: false,
      message: `Error parsing JSON: ${(error as Error).message}`
    };
  }
};
