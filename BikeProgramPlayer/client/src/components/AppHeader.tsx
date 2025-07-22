import { useWorkout } from "@/context/WorkoutContext";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const AppHeader = () => {
  const { workoutState, setCurrentView } = useWorkout();
  
  const getStateLabel = () => {
    switch (workoutState) {
      case 'inactive': return 'Ready';
      case 'active': return 'Active';
      case 'paused': return 'Paused';
      case 'completed': return 'Completed';
      default: return 'Ready';
    }
  };
  
  const handleQuickStart = () => {
    console.log("[AppHeader] Navigating to quick start view");
    setCurrentView('quickStart');
  };
  
  const handleBackToHome = () => {
    console.log("[AppHeader] Navigating back to file upload");
    setCurrentView('fileUpload');
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={handleBackToHome}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          <h1 className="text-xl font-semibold">BikeTrainer Pro</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {workoutState === 'inactive' && (
            <Button 
              variant="outline" 
              className="flex items-center space-x-1 text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={handleQuickStart}
            >
              <Zap className="h-4 w-4" />
              <span>Quick Start</span>
            </Button>
          )}
          
          <span id="appState" className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
            {getStateLabel()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
