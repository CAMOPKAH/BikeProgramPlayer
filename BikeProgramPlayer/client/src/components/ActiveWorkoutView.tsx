import { useEffect, useState } from "react";
import { Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkout } from "@/context/WorkoutContext";
import {
  formatTime,
  formatPowerTarget,
  formatCadenceTarget,
  formatResistance,
  capitalizeFirstLetter,
} from "@/utils/formatters";
import useWorkoutTimer from "@/hooks/useWorkoutTimer";

const ActiveWorkoutView = () => {
  const {
    currentView,
    currentWorkout,
    progress,
    pauseWorkout,
    stopWorkout,
    currentCoachComment,
    updateProgress,
  } = useWorkout();

  // Local state for timer
  const [elapsedTime, setElapsedTime] = useState(0);
  //const [segmentTime, setSegmentTime] = useState(0);
  const segmentTime = progress.PrevelapsedTimeInSegment;

  // Use the workout timer
  useWorkoutTimer();

  // Direct timer implementation in the view itself
  useEffect(() => {
    console.log("[ActiveWorkoutView] Current view:", currentView);

    // Only run when we're in the active workout view
    if (currentView === "activeWorkout" && currentWorkout) {
      console.log(
        "[ActiveWorkoutView] Starting local timer for active workout",
      );

      // Create the start time reference
      const startTime = Date.now();
      const initialSegmentTime = progress.elapsedTimeInSegment;
      const initialTotalTime = progress.totalElapsedTime;

      console.log(
        "[ActiveWorkoutView] Initial times - Segment:",
        initialSegmentTime,
        "Total:",
        initialTotalTime,
      );

      // Initialize local state
      setElapsedTime(initialTotalTime);
      //setSegmentTime(initialSegmentTime);

      // Create a more reliable timer that updates every 1 second
      const timer = setInterval(() => {
        // Calculate actual elapsed time from start
        const elapsed = Math.floor((Date.now() - startTime) / 1000);

        // Update local state
        const newTotalTime = initialTotalTime + elapsed;
        const newSegmentTime = initialSegmentTime + elapsed;

        /*  console.log("[ActiveWorkoutView] Time update - Elapsed since start:", elapsed);
        console.log("[ActiveWorkoutView] New times - Segment:", newSegmentTime, "Total:", newTotalTime);
        */
        setElapsedTime(newTotalTime);
       // setSegmentTime(newSegmentTime);

        // Update the context with precise time values
        updateProgress({
          elapsedTimeInSegment: newSegmentTime,
          totalElapsedTime: newTotalTime,
        });
      }, 1000);

      // Clean up the timer when the component unmounts or when the view changes
      return () => {
        console.log("[ActiveWorkoutView] Cleaning up local timer");
        clearInterval(timer);
      };
    }
  }, [currentView, currentWorkout]);

  // Only render when this view is active
  if (currentView !== "activeWorkout") {
    return null;
  }

  if (!currentWorkout) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No active workout. Please go back and select a workout.
        </p>
      </div>
    );
  }

  const { workoutPlan, metadata } = currentWorkout;
  const currentSegment = workoutPlan.segments[progress.currentSegmentIndex];

  const getSegmentClassName = (type: string) => {
    switch (type) {
      case "warmup":
        return "bg-green-500";
      case "interval":
        return "bg-red-500";
      case "recovery":
        return "bg-blue-500";
      case "cooldown":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCommentClassName = (type?: string) => {
    switch (type) {
      case "warning":
        return "border-red-500";
      case "motivation":
        return "border-green-500";
      case "instruction":
      default:
        return "border-blue-500";
    }
  };

  const getCommentIconClassName = (type?: string) => {
    switch (type) {
      case "warning":
        return "bg-red-500";
      case "motivation":
        return "bg-green-500";
      case "instruction":
      default:
        return "bg-blue-500";
    }
  };

  const getCommentIcon = (type?: string) => {
    switch (type) {
      case "warning":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "motivation":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "instruction":
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  // Segment progress calculation
  const segmentProgressPercent = Math.min(
    (progress.PrevelapsedTimeInSegment / currentSegment.durationSec) * 100,
    100,
  );

  // Workout progress calculation
  const workoutProgressPercent = Math.min(
    (progress.totalElapsedTime / workoutPlan.totalDurationSec) * 100,
    100,
  );

  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col">
          {/* Header with segment info and time */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div
                className={`w-3 h-12 ${getSegmentClassName(currentSegment.type)} rounded-l-lg mr-3`}
              ></div>
              <div>
                <div className="text-xl font-bold">
                  {capitalizeFirstLetter(currentSegment.type)}
                </div>
                <div className="text-gray-500">{metadata.title}</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500">SEGMENT</div>
              <div className="flex items-center">
                <span className="text-3xl font-mono font-bold">
                  {formatTime(segmentTime)}
                </span>
                <span className="mx-1 text-gray-400">/</span>
                <span className="text-xl font-mono">
                  {formatTime(currentSegment.durationSec)}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500">WORKOUT</div>
              <div className="flex items-center">
                <span className="text-3xl font-mono font-bold">
                  {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bars */}
          <div className="mb-8">
            {/* Segment progress */}
            <div className="h-3 bg-gray-200 rounded-full mb-1 overflow-hidden">
              <div
                className={`h-full ${getSegmentClassName(currentSegment.type)}`}
                style={{ width: `${segmentProgressPercent}%` }}
              ></div>
            </div>

            {/* Overall workout progress */}
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${workoutProgressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Workout parameters display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Power */}
            <div className="bg-gray-100 rounded-xl p-6">
              <div className="text-gray-500 mb-1 text-center">POWER</div>
              <div className="flex justify-center items-baseline">
                <span className="text-5xl font-bold">
                  {progress.currentPower}
                </span>
                <span className="text-xl ml-1">W</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-gray-500">Target: </span>
                <span className="font-medium">
                  {formatPowerTarget(currentSegment.targetPower)}
                </span>
              </div>
              <div className="relative h-2 bg-gray-300 rounded-full mt-3">
                <div
                  className="absolute inset-0 bg-gray-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      (progress.currentPower /
                        (currentSegment.targetPower?.value || 100)) *
                        100,
                      100,
                    )}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Cadence */}
            <div className="bg-gray-100 rounded-xl p-6">
              <div className="text-gray-500 mb-1 text-center">CADENCE</div>
              <div className="flex justify-center items-baseline">
                <span className="text-5xl font-bold">
                  {progress.currentCadence}
                </span>
                <span className="text-xl ml-1">RPM</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-gray-500">Target: </span>
                <span className="font-medium">
                  {formatCadenceTarget(currentSegment.targetCadence)}
                </span>
              </div>
              <div className="relative h-2 bg-gray-300 rounded-full mt-3">
                <div
                  className="absolute inset-0 bg-yellow-500 rounded-full"
                  style={{
                    width: `${
                      currentSegment.targetCadence
                        ? Math.min(
                            ((progress.currentCadence -
                              currentSegment.targetCadence.min) /
                              (currentSegment.targetCadence.max -
                                currentSegment.targetCadence.min)) *
                              100,
                            100,
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Resistance */}
            <div className="bg-gray-100 rounded-xl p-6">
              <div className="text-gray-500 mb-1 text-center">RESISTANCE</div>
              <div className="flex justify-center items-baseline">
                <span className="text-5xl font-bold">
                  {progress.currentResistance}
                </span>
                <span className="text-xl ml-1">%</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-gray-500">Target: </span>
                <span className="font-medium">
                  {formatResistance(currentSegment.resistance)}
                </span>
              </div>
              <div className="relative h-2 bg-gray-300 rounded-full mt-3">
                <div
                  className="absolute inset-0 bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      (progress.currentResistance /
                        (currentSegment.resistance || 100)) *
                        100,
                      100,
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Position guidance */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {/* Hand position */}
            {currentSegment.positionSettings?.handsPosition && (
              <div className="bg-gray-100 rounded-lg px-5 py-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v5a7 7 0 11-14 0V9a1 1 0 012 0v2.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V3z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">HANDS</div>
                  <div className="font-medium">
                    {capitalizeFirstLetter(
                      currentSegment.positionSettings.handsPosition,
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Body position */}
            {currentSegment.positionSettings?.bodyPosition && (
              <div className="bg-gray-100 rounded-lg px-5 py-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <div className="text-xs text-gray-500">POSITION</div>
                  <div className="font-medium">
                    {capitalizeFirstLetter(
                      currentSegment.positionSettings.bodyPosition,
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Leg focus */}
            <div className="bg-gray-100 rounded-lg px-5 py-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="text-xs text-gray-500">LEG FOCUS</div>
                <div className="font-medium">
                  {currentSegment.positionSettings?.legFocus
                    ? capitalizeFirstLetter(
                        currentSegment.positionSettings.legFocus,
                      )
                    : "Both"}
                </div>
              </div>
            </div>
          </div>

          {/* Coach comment area */}
          <div
            className={`mb-8 rounded-lg border-2 p-4 ${
              currentCoachComment
                ? `${getCommentClassName(currentCoachComment.type)} animate-pulse`
                : "border-gray-200"
            }`}
          >
            <div className="flex">
              <div
                className={`mr-3 text-white p-2 rounded-full ${
                  currentCoachComment
                    ? getCommentIconClassName(currentCoachComment.type)
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentCoachComment ? (
                  getCommentIcon(currentCoachComment.type)
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500 uppercase">
                  Coach Comment
                </div>
                <div className="text-xl font-medium">
                  {currentCoachComment
                    ? currentCoachComment.message
                    : "No active comment"}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              onClick={pauseWorkout}
            >
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              onClick={stopWorkout}
            >
              <Square className="h-5 w-5 mr-2" />
              Stop
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveWorkoutView;
