import { useState, useEffect } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWorkout } from '@/context/WorkoutContext';
import { formatTime, formatPowerTarget, formatCadenceTarget, formatResistance, capitalizeFirstLetter } from '@/utils/formatters';
import { WorkoutSegment } from '@/types/workout';

const ProgramPreviewView = () => {
  const { currentView, currentWorkout, backToUpload, startWorkout } = useWorkout();
  const [segmentWidths, setSegmentWidths] = useState<number[]>([]);
  
  // Effect to calculate segment widths
  useEffect(() => {
    if (currentWorkout) {
      const totalDuration = currentWorkout.workoutPlan.totalDurationSec;
      const widths = currentWorkout.workoutPlan.segments.map(segment => 
        (segment.durationSec / totalDuration) * 100
      );
      setSegmentWidths(widths);
    }
  }, [currentWorkout]);
  
  // Only render when this view is active
  if (currentView !== 'programPreview') {
    return null;
  }
  
  if (!currentWorkout) {
    return (
      <Card className="bg-white rounded-xl shadow-md overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">No workout loaded. Please go back and select a workout.</p>
            <Button 
              className="mt-4 bg-blue-500 text-white" 
              onClick={backToUpload}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Upload
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const metadata = currentWorkout.metadata;
  const workoutPlan = currentWorkout.workoutPlan;
  
  const getSegmentClassName = (type: string) => {
    switch(type) {
      case 'warmup': return 'bg-green-500';
      case 'interval': return 'bg-red-500';
      case 'recovery': return 'bg-blue-500';
      case 'cooldown': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getCommentTypeClassName = (type?: string) => {
    switch(type) {
      case 'warning': return 'bg-red-50 p-2 rounded text-sm flex items-start';
      case 'motivation': return 'bg-green-50 p-2 rounded text-sm flex items-start';
      case 'instruction':
      default: return 'bg-blue-50 p-2 rounded text-sm flex items-start';
    }
  };
  
  const getCommentTypeIcon = (type?: string) => {
    switch(type) {
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'motivation':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'instruction':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  const getSegmentIcon = (type: string) => {
    switch(type) {
      case 'warmup':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'interval':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
        );
      case 'recovery':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'cooldown':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            onClick={backToUpload}
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
          <div className="flex">
            <Button 
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium flex items-center hover:bg-green-600"
              onClick={startWorkout}
            >
              <Play className="h-5 w-5 mr-2" />
              Start Workout
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workout metadata */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-5 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">{metadata.title || 'Untitled Workout'}</h2>
              <p className="text-gray-600 mb-6">{metadata.description || 'No description'}</p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">Author</div>
                    <div className="font-medium">{metadata.author || 'Unknown'}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-medium">{formatTime(workoutPlan.totalDurationSec)}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">Difficulty</div>
                    <div className="font-medium">{capitalizeFirstLetter(metadata.difficulty || 'Unknown')}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">Tags</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {metadata.tags && metadata.tags.length > 0 ? (
                        metadata.tags.map((tag, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No tags</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-700">
                      {workoutPlan.segments.some(s => s.positionSettings?.bodyPosition === 'standing') ? 
                        "This workout includes standing positions and high resistance levels. Ensure your bike setup is secure." :
                        "Ensure your bike is properly secured before starting this workout."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Workout timeline and segments */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">Workout Segments</h3>
            
            {/* Timeline visualization */}
            <div className="relative mb-6">
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden flex">
                {workoutPlan.segments.map((segment, index) => (
                  <div 
                    key={index}
                    className={`h-full ${getSegmentClassName(segment.type)}`}
                    style={{ width: `${segmentWidths[index]}%` }}
                    title={`${capitalizeFirstLetter(segment.type)}: ${formatTime(segment.durationSec)}`}
                  />
                ))}
              </div>
              
              {/* Timeline markers */}
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0:00</span>
                <span>{formatTime(Math.floor(workoutPlan.totalDurationSec / 4))}</span>
                <span>{formatTime(Math.floor(workoutPlan.totalDurationSec / 2))}</span>
                <span>{formatTime(Math.floor(workoutPlan.totalDurationSec * 3 / 4))}</span>
                <span>{formatTime(workoutPlan.totalDurationSec)}</span>
              </div>
            </div>
            
            {/* Segment details cards */}
            <div className="space-y-4">
              {workoutPlan.segments.map((segment: WorkoutSegment, index: number) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className={`flex items-center ${getSegmentClassName(segment.type)} text-white px-4 py-2`}>
                    {getSegmentIcon(segment.type)}
                    <span className="font-medium">{capitalizeFirstLetter(segment.type)}</span>
                    <span className="ml-auto">{formatTime(segment.durationSec)}</span>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Power</div>
                        <div className="font-medium">{formatPowerTarget(segment.targetPower)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Cadence</div>
                        <div className="font-medium">{formatCadenceTarget(segment.targetCadence)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Resistance</div>
                        <div className="font-medium">{formatResistance(segment.resistance)}</div>
                      </div>
                    </div>
                    
                    {segment.positionSettings && (
                      <div className="mt-3 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Position:</span> {' '}
                          {segment.positionSettings.bodyPosition && capitalizeFirstLetter(segment.positionSettings.bodyPosition)}
                          {segment.positionSettings.handsPosition && `, hands on ${segment.positionSettings.handsPosition}`}
                          {segment.positionSettings.legFocus && `, focus on ${segment.positionSettings.legFocus} leg`}
                        </p>
                      </div>
                    )}
                    
                    {segment.coachComments && segment.coachComments.length > 0 && segment.coachComments.map((comment, cIndex) => (
                      <div key={cIndex} className={`mt-2 ${getCommentTypeClassName(comment.type)}`}>
                        {getCommentTypeIcon(comment.type)}
                        <span>{comment.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramPreviewView;
