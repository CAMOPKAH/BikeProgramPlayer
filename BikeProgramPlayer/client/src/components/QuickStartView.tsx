import { useState } from 'react';
import { Play, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkout } from '@/context/WorkoutContext';
import { v4 as uuidv4 } from 'uuid';
import { WorkoutProgram, WorkoutSegment } from '@/types/workout';

const QuickStartView = () => {
  const { currentView, setCurrentWorkout, startWorkout } = useWorkout();
  
  // Default workout duration and resistance settings
  const [workoutDuration, setWorkoutDuration] = useState(30); // minutes
  const [resistance, setResistance] = useState(50); // percentage
  const [cadenceMin, setCadenceMin] = useState(80);
  const [cadenceMax, setCadenceMax] = useState(90);
  
  // Only render when this view is active
  if (currentView !== 'quickStart') {
    return null;
  }
  
  // Increment and decrement functions
  const incrementDuration = () => setWorkoutDuration(prev => Math.min(prev + 5, 120)); // Max 2 hours
  const decrementDuration = () => setWorkoutDuration(prev => Math.max(prev - 5, 5)); // Min 5 minutes
  
  const incrementResistance = () => setResistance(prev => Math.min(prev + 5, 100));
  const decrementResistance = () => setResistance(prev => Math.max(prev - 5, 10));
  
  const incrementCadenceMin = () => setCadenceMin(prev => Math.min(prev + 5, cadenceMax - 5));
  const decrementCadenceMin = () => setCadenceMin(prev => Math.max(prev - 5, 40));
  
  const incrementCadenceMax = () => setCadenceMax(prev => Math.min(prev + 5, 120));
  const decrementCadenceMax = () => setCadenceMax(prev => Math.max(prev - 5, cadenceMin + 5));
  
  // Start a quick workout
  const handleStartQuickWorkout = () => {
    console.log("[QuickStartView] Creating quick workout");
    
    // Convert minutes to seconds
    const durationSec = workoutDuration * 60;
    
    // Create a simple segment for the quick workout
    const segment: WorkoutSegment = {
      type: 'interval',
      durationSec,
      resistance,
      targetCadence: {
        min: cadenceMin,
        max: cadenceMax
      },
      targetPower: {
        type: 'constant',
        value: 150 // Default power target
      },
      coachComments: [
        {
          triggerTimeSec: 0,
          message: "Quick workout started. Maintain a steady pace.",
          type: 'instruction'
        },
        {
          triggerTimeSec: Math.floor(durationSec / 2),
          message: "Halfway there! Keep it up!",
          type: 'motivation'
        },
        {
          triggerTimeSec: durationSec - 60,
          message: "One minute left! Give it your all!",
          type: 'motivation',
          priority: 'high'
        }
      ]
    };
    
    // Create a workout program
    const quickWorkout: WorkoutProgram = {
      formatVersion: "1.0",
      metadata: {
        id: uuidv4(),
        title: `Quick ${workoutDuration} Min Workout`,
        description: "A spontaneous workout session",
        creationDate: new Date().toISOString(),
        difficulty: 'medium',
        tags: ['quick', 'custom']
      },
      workoutPlan: {
        totalDurationSec: durationSec,
        segments: [segment]
      }
    };
    
    // Set as current workout and start
    setCurrentWorkout(quickWorkout);
    startWorkout();
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Quick Start Workout</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Workout Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Duration Setting */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Duration</h3>
                <p className="text-gray-500 text-sm">Set workout length</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementDuration}
                  disabled={workoutDuration <= 5}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-16 text-center font-mono font-bold">
                  {workoutDuration} min
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementDuration}
                  disabled={workoutDuration >= 120}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Resistance Setting */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Resistance</h3>
                <p className="text-gray-500 text-sm">Adjust difficulty level</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementResistance}
                  disabled={resistance <= 10}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-16 text-center font-mono font-bold">
                  {resistance}%
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementResistance}
                  disabled={resistance >= 100}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Cadence Range Setting */}
            <div>
              <h3 className="text-lg font-medium mb-2">Cadence Range</h3>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 text-sm">Minimum (rpm)</p>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={decrementCadenceMin}
                    disabled={cadenceMin <= 40}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-16 text-center font-mono font-bold">
                    {cadenceMin}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={incrementCadenceMin}
                    disabled={cadenceMin >= cadenceMax - 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">Maximum (rpm)</p>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={decrementCadenceMax}
                    disabled={cadenceMax <= cadenceMin + 5}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-16 text-center font-mono font-bold">
                    {cadenceMax}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={incrementCadenceMax}
                    disabled={cadenceMax >= 120}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="px-8 py-6 text-lg"
          onClick={handleStartQuickWorkout}
        >
          <Play className="mr-2 h-5 w-5" />
          Start Workout
        </Button>
      </div>
    </div>
  );
};

export default QuickStartView;