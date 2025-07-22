import { useEffect, useCallback } from "react";
import { useWorkout } from "@/context/WorkoutContext";
import { WorkoutSegment, CoachComment } from "@/types/workout";
import { playTextToSpeech } from "@/utils/ttsPlayer";
import {
  calculateCurrentPower,
  calculateCurrentCadence,
} from "@/utils/formatters";

const useWorkoutTimer = () => {
  const {
    currentWorkout,
    workoutState,
    progress,
    updateProgress,
    stopWorkout,
    setCurrentCoachComment,
    activeTimer,
    setActiveTimer,
    clearActiveTimer,
    resetElapseTimeSeg,
  } = useWorkout();

  //currentWorkout?.workoutPlan.segments

  // Calculate next coach comment time
  const getNextCoachComment = useCallback(
    (segment: WorkoutSegment, currentTime: number): CoachComment | null => {
      if (!segment.coachComments || segment.coachComments.length === 0) {
        return null;
      }

      const comments = segment.coachComments
        .filter((comment) => comment.triggerTimeSec === Math.floor(currentTime))
        .sort((a, b) => {
          const priorityMap: Record<string, number> = {
            high: 3,
            medium: 2,
            low: 1,
          };
          console.log(comments);
          const aPriority = priorityMap[a.priority || "medium"] || 2;
          const bPriority = priorityMap[b.priority || "medium"] || 2;

          return bPriority - aPriority;
        });

      return comments.length > 0 ? comments[0] : null;
    },
    [],
  );

  // Update workout parameters (power, cadence, resistance) WITHOUT changing time values
  const updateWorkoutParameters = useCallback(
    (segment: WorkoutSegment, elapsedTimeInSegment: number) => {
      //console.log(
      //   "[useWorkoutTimer] updateWorkoutParameters: Calculating parameters for segment",
      //   segment.type,
      // );

      const currentPower = calculateCurrentPower(
        segment.targetPower,
        elapsedTimeInSegment,
        segment.durationSec,
      );

      const currentCadence = calculateCurrentCadence(segment.targetCadence);
      const currentResistance = segment.resistance || 50;

      /*console.log(
        "[useWorkoutTimer] updateWorkoutParameters: Updating power/cadence/resistance only:",
        {
          currentPower,
          currentCadence,
          currentResistance,
        },
      ); */

      // Only update workout parameters, not time values
      updateProgress({
        currentPower,
        currentCadence,
        currentResistance,
      });
    },
    [updateProgress],
  );

  //  var DurationSec =     currentWorkout.workoutPlan.segments[prev.currentSegmentIndex] .durationSec;
  // Initialize first segment when workout starts
  useEffect(() => {
    if (currentWorkout) {
      //Logs an zalipuha :)
      progress.PrevelapsedTimeInSegment += 1;
      console.log(
        "progress.PrevelapsedTimeInSegment",
        progress.PrevelapsedTimeInSegment,
      );
      console.log(
        "progress.elapsedTimeInSegment",
        progress.elapsedTimeInSegment,
      );
    }

    if (
      workoutState === "active" &&
      currentWorkout &&
      progress.currentSegmentIndex === 0 &&
      progress.elapsedTimeInSegment === 0
    ) {
      progress.PrevelapsedTimeInSegment = 0;
      const firstSegment = currentWorkout.workoutPlan.segments[0];
      if (firstSegment) {
        updateWorkoutParameters(firstSegment, 0);

        // Trigger initial coach comment if there's one at time 0
        //Add info in Comment Couch
        const { targetCadence, resistance, positionSettings } = firstSegment;

        const AddComment =
          "Каденс от " +
          targetCadence?.min +
          " до " +
          targetCadence?.max +
          ", Нагрузка: " +
          resistance +
          " процентов, Положение рук: " +
          positionSettings?.handsPosition +
          ", Положение тела: " +
          positionSettings?.bodyPosition;

        const initialComment = getNextCoachComment(firstSegment, 0);

        if (initialComment) {
          setCurrentCoachComment(initialComment);
          playTextToSpeech(initialComment.message + AddComment, {
            onEnd: () => {
              setTimeout(
                () => {
                  setCurrentCoachComment(null);
                },
                (initialComment.durationSec || 5) * 1000,
              );
            },
          });
        }
      }
      console.log("[useWorkoutTimer.useEffect] First:", workoutState);
    } else if (workoutState === "active" && currentWorkout) {
      const elapsedTimeInSegment = progress.elapsedTimeInSegment + 1;
      const totalElapsedTime = progress.totalElapsedTime + 1;
      const currentSegmentIndex = progress.currentSegmentIndex;

      const segments = currentWorkout.workoutPlan.segments;
      const currentSegment = segments[currentSegmentIndex];

      console.log(
        `[useWorkoutTimer.useCallback.LOG] ${currentSegment.durationSec} : ${elapsedTimeInSegment}  `,
      );
      // START

      if (progress.PrevelapsedTimeInSegment >= currentSegment.durationSec) {
        // Move to next segment
        const nextSegmentIndex = currentSegmentIndex + 1;
        //currentSegment.durationSec = 0; //Reset !!!!
        // Check if workout is completed
        if (nextSegmentIndex >= segments.length) {
          clearActiveTimer();
          stopWorkout();
          return;
        }

        // Update parameters for the new segment
        const nextSegment = segments[nextSegmentIndex];
        updateWorkoutParameters(nextSegment, 1);

        //Add info in Comment Couch
        const { targetCadence, resistance, positionSettings } = nextSegment;

        const AddComment =
          "Каденс от " +
          targetCadence?.min +
          " до " +
          targetCadence?.max +
          ", Нагрузка: " +
          resistance +
          " процентов, Положение рук: " +
          positionSettings?.handsPosition +
          ", Положение тела: " +
          positionSettings?.bodyPosition;

        // Announce the new segment start
        const segmentTypeMessage = `Starting ${nextSegment.type} segment`;
        playTextToSpeech(segmentTypeMessage + ".    " + AddComment);
        // Trigger initial coach comment if there's one at time 0
        const initialComment = getNextCoachComment(nextSegment, 0);
        if (initialComment) {
          setCurrentCoachComment(initialComment);
          playTextToSpeech(initialComment.message, {
            onEnd: () => {
              setTimeout(
                () => {
                  setCurrentCoachComment(null);
                },
                (initialComment.durationSec || 5) * 1000,
              );
            },
          });
        }

        // Update progress with new segment
        updateProgress({
          currentSegmentIndex: nextSegmentIndex,
          elapsedTimeInSegment: 1,
          totalElapsedTime,
        });
        resetElapseTimeSeg();
        return;
      }

      // END
    }
  }, [
    workoutState,
    currentWorkout,
    progress.currentSegmentIndex,
    progress.elapsedTimeInSegment,
    updateWorkoutParameters,
    getNextCoachComment,
    setCurrentCoachComment,
    resetElapseTimeSeg,
  ]);

  /*
  // Simple timer implementation that updates every second
  const startTimer = useCallback(() => {
    if (!currentWorkout) {
      console.error("Cannot start timer: No current workout");
      return;
    }

    clearActiveTimer();

    console.log("Starting workout timer...");
    
    const timer = setInterval(() => {
      console.log("Timer tick");

      // Get current state values
      const elapsedTimeInSegment = progress.elapsedTimeInSegment + 1;
      const totalElapsedTime = progress.totalElapsedTime + 1;
      const currentSegmentIndex = progress.currentSegmentIndex;

      // Get current segment
      const segments = currentWorkout.workoutPlan.segments;
      if (currentSegmentIndex >= segments.length) {
        clearActiveTimer();
        stopWorkout();
        return;
      }

      const currentSegment = segments[currentSegmentIndex];
      console.log(
        `[WorkoutContext]***** timerTick: : ${elapsedTimeInSegment}, -> ${currentSegment.durationSec}`,
      );
      // Check if segment is completed
      if (elapsedTimeInSegment >= currentSegment.durationSec) {
        // Move to next segment
        const nextSegmentIndex = currentSegmentIndex + 1;
        progress.elapsedTimeInSegment = 0;
        //currentSegment.durationSec = 0; //Reset !!!!
        // Check if workout is completed
        if (nextSegmentIndex >= segments.length) {
          clearActiveTimer();
          stopWorkout();
          return;
        }

        // Update parameters for the new segment
        const nextSegment = segments[nextSegmentIndex];
        updateWorkoutParameters(nextSegment, 0);

        // Announce the new segment start
        const segmentTypeMessage = `Starting ${nextSegment.type} segment`;
        playTextToSpeech(segmentTypeMessage);

        // Update progress with new segment
        updateProgress({
          currentSegmentIndex: nextSegmentIndex,
          elapsedTimeInSegment: 0,
          totalElapsedTime,
        });

        return;
      }

      // Check for coach comments
      const comment = getNextCoachComment(currentSegment, elapsedTimeInSegment);
      if (comment) {
        setCurrentCoachComment(comment);
        playTextToSpeech(comment.message, {
          onEnd: () => {
            // Clear comment after duration or default 5 seconds
            setTimeout(
              () => {
                setCurrentCoachComment(null);
              },
              (comment.durationSec || 5) * 1000,
            );
          },
        });
      }

      // Update workout parameters
      updateWorkoutParameters(currentSegment, elapsedTimeInSegment);

      // Update progress with incremented times
      updateProgress({
        elapsedTimeInSegment,
        totalElapsedTime,
      });

      console.log(
        "[useWorkoutTimer] ------- LOGS:elapsedTimeInSegment/durarionSEC ",
        {
          elapsedTimeInSegment,
          totalElapsedTime,
        },
      );
    }, 1000); 

    setActiveTimer(timer); 
  }, [
    currentWorkout,
    clearActiveTimer,
    updateProgress,
    stopWorkout,
    getNextCoachComment,
    updateWorkoutParameters,
    setCurrentCoachComment,
    setActiveTimer,
    progress,
  ]); */

  const elapsedTimeInSegment = progress.elapsedTimeInSegment + 1;
  const totalElapsedTime = progress.totalElapsedTime + 1;
  const currentSegmentIndex = progress.currentSegmentIndex;

  //const segments = currentWorkout?.workoutPlan.segments[0];
  //const currentSegment = segments[currentSegmentIndex];

  //console.log( `[useWorkoutTimer.useCallback.LOG] ${segment.durationSec} : ${elapsedTimeInSegment}  `,);

  // Effect to manage timer based on workout state
  useEffect(() => {
    console.log("Workout state changed:", workoutState);

    if (workoutState === "active" && !activeTimer) {
      //startTimer();
    } else if (workoutState !== "active" && activeTimer) {
      clearActiveTimer();
    }

    return () => {
      clearActiveTimer();
    };
  }, [workoutState, activeTimer /*startTimer*/, , clearActiveTimer]);

  return {
    //startTimer,
    stopTimer: clearActiveTimer,
  };
};

export default useWorkoutTimer;
