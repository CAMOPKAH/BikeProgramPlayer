import { Play, RefreshCw, Square, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkout } from '@/context/WorkoutContext';
import { formatTime, capitalizeFirstLetter } from '@/utils/formatters';

const PauseMenuView = () => {
  const { 
    currentView,
    currentWorkout, 
    progress, 
    resumeWorkout, 
    restartWorkout, 
    stopWorkout 
  } = useWorkout();
  
  // Only render when this view is active
  if (currentView !== 'pause') {
    return null;
  }
  
  if (!currentWorkout) {
    return null;
  }
  
  const currentSegment = currentWorkout.workoutPlan.segments[progress.currentSegmentIndex];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">Workout Paused</h2>
        
        <div className="mb-6 flex justify-center">
          <div className="text-center bg-gray-100 rounded-lg p-4 w-48">
            <div className="text-sm text-gray-500">CURRENT SEGMENT</div>
            <div className="font-medium text-lg">
              {capitalizeFirstLetter(currentSegment.type)}
            </div>
            <div className="text-xl font-mono font-bold mt-1">
              {formatTime(progress.elapsedTimeInSegment)} / {formatTime(currentSegment.durationSec)}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg font-medium flex items-center justify-center"
            onClick={resumeWorkout}
          >
            <Play className="h-5 w-5 mr-3" />
            Resume Workout
          </Button>
          
          <Button 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg font-medium flex items-center justify-center"
            onClick={restartWorkout}
          >
            <RefreshCw className="h-5 w-5 mr-3" />
            Restart Workout
          </Button>
          
          <Button 
            className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg font-medium flex items-center justify-center"
            onClick={stopWorkout}
          >
            <Square className="h-5 w-5 mr-3" />
            End Workout
          </Button>
          
          <Button 
            variant="link"
            className="w-full text-blue-500 p-2 flex items-center justify-center"
            onClick={() => {
              alert('Statistics functionality is not implemented in this demo');
            }}
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            View Statistics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PauseMenuView;
