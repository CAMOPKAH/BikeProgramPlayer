import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  WorkoutProgram,
  WorkoutView,
  WorkoutState,
  WorkoutSegment,
  WorkoutProgressState,
  CoachComment,
  RecentWorkout,
} from "@/types/workout";
import { playTextToSpeech, stopTextToSpeech } from "@/utils/ttsPlayer";

interface WorkoutContextType {
  currentWorkout: WorkoutProgram | null;
  setCurrentWorkout: (workout: WorkoutProgram | null) => void;
  workoutState: WorkoutState;
  setWorkoutState: (state: WorkoutState) => void;
  currentView: WorkoutView;
  setCurrentView: (view: WorkoutView) => void;
  progress: WorkoutProgressState;
  updateProgress: (updates: Partial<WorkoutProgressState>) => void;
  resetElapseTimeSeg:()=>void;
  resetProgress: () => void;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  stopWorkout: () => void;
  restartWorkout: () => void;
  backToUpload: () => void;
  recentWorkouts: RecentWorkout[];
  addRecentWorkout: (workout: WorkoutProgram) => void;
  currentCoachComment: CoachComment | null;
  setCurrentCoachComment: (comment: CoachComment | null) => void;
  activeTimer: NodeJS.Timeout | null;
  setActiveTimer: (timer: NodeJS.Timeout | null) => void;
  clearActiveTimer: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const defaultProgress: WorkoutProgressState = {
  currentSegmentIndex: 0,
  elapsedTimeInSegment: 0,
  totalElapsedTime: 0,
  currentPower: 0,
  currentCadence: 0,
  currentResistance: 0,
};

export const WorkoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutProgram | null>(
    null,
  );
  const [workoutState, setWorkoutState] = useState<WorkoutState>("inactive");
  const [currentView, setCurrentView] = useState<WorkoutView>("fileUpload");
  const [progress, setProgress] = useState<WorkoutProgressState>({
    ...defaultProgress,
  });
  const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkout[]>([]);
  const [currentCoachComment, setCurrentCoachComment] =
    useState<CoachComment | null>(null);
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | null>(null);

  const updateProgress = (updates: Partial<WorkoutProgressState>) => {
   /* console.log(
      "[WorkoutContext] updateProgress: Updating progress with:",
      JSON.stringify(updates),
    );
    console.log(
      "[WorkoutContext] updateProgress: Called from:",
      new Error().stack,
    ); */
    setProgress((prev) => {
      const newState = {
        ...prev,
        ...updates,
      };
     /*
      console.log(
        "[WorkoutContext] updateProgress: New progress state:",
        JSON.stringify(newState),
      ); */
      return newState;
    });
  };

  const resetProgress = () => {
    setProgress({ ...defaultProgress });
  };

  const resetElapseTimeSeg = () => {
    progress.elapsedTimeInSegment=1;
    progress.PrevelapsedTimeInSegment=1;
  };
  
  const clearActiveTimer = () => {
    if (activeTimer) {
      clearInterval(activeTimer);
      setActiveTimer(null);
    }
  };

  const startWorkout = () => {
    /*
    console.log(
      "[WorkoutContext] startWorkout: Initializing workout and timer",
    );
    console.log(
      "[WorkoutContext] startWorkout: Setting progress to default values:",
      JSON.stringify(defaultProgress),
    );
*/
    
    resetProgress();
    setCurrentView("activeWorkout");

    // Start a timer directly in the context
    if (currentWorkout) {
      /*
      // Clear any existing timer first
      console.log("[WorkoutContext] startWorkout: Clearing any existing timer");
      clearActiveTimer();

      console.log("[WorkoutContext] startWorkout: Creating new workout timer");
*/
      // Create a new timer that ticks every second
      const timer = setInterval(() => {
        //console.log("[WorkoutContext] timerTick: Timer tick occurred");

        // Log current values before update
        //console.log("[WorkoutContext] timerTick: Current progress before update:", JSON.stringify(progress));

        // Update the progress directly
        setProgress((prev) => {
          const newElapsedTimeInSegment = prev.elapsedTimeInSegment + 1;
          const newTotalElapsedTime = prev.totalElapsedTime + 1;

          var DurationSec =
            currentWorkout.workoutPlan.segments[prev.currentSegmentIndex]
              .durationSec;

       /*   console.log(
            `[WorkoutContext]***** timerTick: Updating times - Segment time: ${prev.elapsedTimeInSegment} -> ${newElapsedTimeInSegment}, Total time: ${prev.totalElapsedTime} -> ${newTotalElapsedTime} Duration: ${DurationSec}`,
          );*/

          return {
            ...prev,
            elapsedTimeInSegment: newElapsedTimeInSegment,
            totalElapsedTime: newTotalElapsedTime,
          };
        });
      }, 1000);

      // Store the timer
      console.log("[WorkoutContext] startWorkout: Storing new timer reference");
      setActiveTimer(timer);
    } else {
      console.log(
        "[WorkoutContext] startWorkout: ERROR - No current workout found",
      );
    }

    // Set state to active
    console.log(
      "[WorkoutContext] startWorkout: Setting workout state to active",
    );
    setWorkoutState("active");
  };

  const pauseWorkout = () => {
    setWorkoutState("paused");
    setCurrentView("pause");
    clearActiveTimer();
    stopTextToSpeech();
  };

  const resumeWorkout = () => {
    setWorkoutState("active");
    setCurrentView("activeWorkout");
  };

  const stopWorkout = () => {
    setWorkoutState("completed");
    setCurrentView("workoutCompleted");
    clearActiveTimer();
    stopTextToSpeech();
  };

  const restartWorkout = () => {
    clearActiveTimer();
    stopTextToSpeech();
    resetProgress();
    startWorkout();
  };

  const backToUpload = () => {
    setCurrentView("fileUpload");
    clearActiveTimer();
    stopTextToSpeech();
    setWorkoutState("inactive");
  };

  const addRecentWorkout = (workout: WorkoutProgram) => {
    const mainSegmentType = determineMainSegmentType(
      workout.workoutPlan.segments,
    );
    const newRecentWorkout: RecentWorkout = {
      id: workout.metadata.id,
      title: workout.metadata.title,
      duration: workout.workoutPlan.totalDurationSec,
      difficulty: workout.metadata.difficulty,
      type: mainSegmentType,
    };

    setRecentWorkouts((prev) => {
      // Add to the beginning, limit to 3 recent workouts
      const updated = [
        newRecentWorkout,
        ...prev.filter((rw) => rw.id !== newRecentWorkout.id),
      ];
      return updated.slice(0, 3);
    });
  };

  const determineMainSegmentType = (
    segments: WorkoutSegment[],
  ): "warmup" | "interval" | "recovery" | "cooldown" => {
    const typeCounts: Record<string, number> = {};
    segments.forEach((segment) => {
      typeCounts[segment.type] =
        (typeCounts[segment.type] || 0) + segment.durationSec;
    });

    let maxType: "warmup" | "interval" | "recovery" | "cooldown" = "interval"; // Default
    let maxCount = 0;

    for (const [type, count] of Object.entries(typeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxType = type as "warmup" | "interval" | "recovery" | "cooldown";
      }
    }

    return maxType;
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      clearActiveTimer();
      stopTextToSpeech();
    };
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        currentWorkout,
        setCurrentWorkout,
        workoutState,
        setWorkoutState,
        currentView,
        setCurrentView,
        progress,
        updateProgress,
        resetElapseTimeSeg,
        resetProgress,
        startWorkout,
        pauseWorkout,
        resumeWorkout,
        stopWorkout,
        restartWorkout,
        backToUpload,
        recentWorkouts,
        addRecentWorkout,
        currentCoachComment,
        setCurrentCoachComment,
        activeTimer,
        setActiveTimer,
        clearActiveTimer,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};
