import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Upload } from 'lucide-react';
import { useWorkout } from '@/context/WorkoutContext';
import { parseWorkoutFile } from '@/utils/workoutValidator';
import { formatTime } from '@/utils/formatters';

const FileUploadView = () => {
  const { 
    currentView,
    setCurrentWorkout, 
    setCurrentView, 
    recentWorkouts,
    addRecentWorkout
  } = useWorkout();
  
  // Only render when this view is active
  if (currentView !== 'fileUpload') {
    return null;
  }
  
  const [validationState, setValidationState] = useState<{
    status: 'idle' | 'valid' | 'invalid';
    message: string;
  }>({
    status: 'idle',
    message: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.json')) {
      setValidationState({
        status: 'invalid',
        message: 'Please upload a JSON file'
      });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseWorkoutFile(content);
      
      if (result.valid && result.workout) {
        setValidationState({
          status: 'valid',
          message: result.message
        });
        
        setCurrentWorkout(result.workout);
        addRecentWorkout(result.workout);
      } else {
        setValidationState({
          status: 'invalid',
          message: result.message
        });
        
        setCurrentWorkout(null);
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
    
    if (e.dataTransfer.files.length) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  const handleViewWorkout = () => {
    setCurrentView('programPreview');
  };
  
  const getSegmentTypeIcon = (type: string) => {
    switch(type) {
      case 'interval':
        return (
          <div className="bg-red-500 text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'warmup':
        return (
          <div className="bg-green-500 text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'recovery':
        return (
          <div className="bg-blue-500 text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'cooldown':
        return (
          <div className="bg-purple-500 text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-500 text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };
  
  const handleRecentWorkoutClick = (id: string) => {
    // This is a placeholder since we don't store the actual workout data
    // In a real app, you would fetch the workout from storage or API
    alert(`Loading workout ${id} is not implemented in this demo`);
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Workout Program</h2>
        
        {/* Drag and drop area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer transition-colors hover:border-blue-500 hover:bg-blue-50 mb-6"
          onClick={handleDropZoneClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-4 text-lg">Drag and drop workout file here</p>
          <p className="text-sm text-gray-500">or click to browse</p>
          <p className="text-xs text-gray-400 mt-2">Accepts PrgBikeCycle JSON files (v1.2)</p>
        </div>
        
        {/* File input (hidden) */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".json" 
          onChange={handleFileInputChange}
        />
        
        {/* Validation status */}
        {validationState.status !== 'idle' && (
          <div className={`rounded-lg p-4 my-4 ${
            validationState.status === 'valid' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            <div className="flex">
              {validationState.status === 'valid' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 mr-2" />
              )}
              <span>{validationState.message}</span>
            </div>
          </div>
        )}
        
        {/* Primary action button */}
        <div className="flex justify-center">
          <Button
            className={`bg-blue-500 text-white px-6 py-3 rounded-lg font-medium ${
              validationState.status !== 'valid' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleViewWorkout}
            disabled={validationState.status !== 'valid'}
          >
            View Workout Details
          </Button>
        </div>
        
        {/* Recent files section */}
        <div className="mt-12 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Recent Workouts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map((workout) => (
                <div 
                  key={workout.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors flex items-center space-x-3"
                  onClick={() => handleRecentWorkoutClick(workout.id)}
                >
                  {getSegmentTypeIcon(workout.type)}
                  <div>
                    <div className="font-medium">{workout.title}</div>
                    <div className="text-sm text-gray-500">
                      {formatTime(workout.duration)} • {workout.difficulty ? workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1) : 'Unknown'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-4">
                No recent workouts found
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadView;
