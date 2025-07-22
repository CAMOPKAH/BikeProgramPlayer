import { RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWorkout } from '@/context/WorkoutContext';
import { formatTime } from '@/utils/formatters';

const WorkoutCompletedView = () => {
  const { 
    currentView,
    currentWorkout, 
    progress,
    restartWorkout, 
    backToUpload 
  } = useWorkout();
  
  // Only render when this view is active
  if (currentView !== 'workoutCompleted') {
    return null;
  }
  
  if (!currentWorkout) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No workout data available.</p>
      </div>
    );
  }
  
  // Calculate average and max power (simulated values)
  const averagePower = Math.floor(progress.currentPower * 0.9); // Just a simulated value
  const maxPower = Math.max(
    ...currentWorkout.workoutPlan.segments
      .filter(s => s.targetPower?.value || s.targetPower?.end)
      .map(s => s.targetPower?.value || s.targetPower?.end || 0)
  );
  
  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center">
          <div className="bg-green-100 text-green-700 rounded-full p-6 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold mb-2 text-center">Workout Completed!</h2>
          <p className="text-gray-600 mb-8 text-center">Great job finishing your workout</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
              <div className="text-sm text-gray-500">DURATION</div>
              <div className="text-2xl font-bold">
                {formatTime(currentWorkout.workoutPlan.totalDurationSec)}
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
              <div className="text-sm text-gray-500">AVG POWER</div>
              <div className="text-2xl font-bold">{averagePower}W</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
              <div className="text-sm text-gray-500">MAX POWER</div>
              <div className="text-2xl font-bold">{maxPower}W</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              onClick={restartWorkout}
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Repeat Workout
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              onClick={backToUpload}
            >
              <Plus className="h-5 w-5 mr-2" />
              New Workout
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutCompletedView;
