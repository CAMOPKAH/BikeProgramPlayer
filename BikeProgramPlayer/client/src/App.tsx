import { useState } from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import FileUploadView from "@/components/FileUploadView";
import ProgramPreviewView from "@/components/ProgramPreviewView";
import ActiveWorkoutView from "@/components/ActiveWorkoutView";
import PauseMenuView from "@/components/PauseMenuView";
import WorkoutCompletedView from "@/components/WorkoutCompletedView";
import QuickStartView from "@/components/QuickStartView";
import AppHeader from "@/components/AppHeader";
import { WorkoutProvider } from "./context/WorkoutContext";

// Use a simpler structure to avoid context nesting issues
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WorkoutProvider>
        <TooltipProvider>
          <Toaster />
          <Layout />
        </TooltipProvider>
      </WorkoutProvider>
    </QueryClientProvider>
  );
}

// Layout component - separate to avoid direct context dependency in App
function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <AppHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ViewRouter />
      </main>
      
      <footer className="bg-white mt-8 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">BikeTrainer Pro &copy; {new Date().getFullYear()} - Workout Player v1.0</p>
        </div>
      </footer>
    </div>
  );
}

// Router component to handle view switching
function ViewRouter() {
  return (
    <>
      <FileUploadView />
      <ProgramPreviewView />
      <ActiveWorkoutView />
      <WorkoutCompletedView />
      <PauseMenuView />
      <QuickStartView />
    </>
  );
}

export default App;
