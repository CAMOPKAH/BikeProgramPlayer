import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for workout file validation
  app.post('/api/workout/validate', (req, res) => {
    try {
      const workoutData = req.body;
      
      // Check format version
      if (workoutData.formatVersion !== '1.2') {
        return res.status(400).json({ 
          valid: false, 
          message: 'Invalid format version. Expected 1.2' 
        });
      }
      
      // Check required fields
      if (!workoutData.metadata || !workoutData.metadata.id) {
        return res.status(400).json({ 
          valid: false, 
          message: 'Missing required metadata fields (id)' 
        });
      }
      
      if (!workoutData.workoutPlan || !workoutData.workoutPlan.segments || !Array.isArray(workoutData.workoutPlan.segments)) {
        return res.status(400).json({ 
          valid: false, 
          message: 'Missing or invalid workoutPlan.segments' 
        });
      }
      
      // Check if segments are properly defined
      for (let i = 0; i < workoutData.workoutPlan.segments.length; i++) {
        const segment = workoutData.workoutPlan.segments[i];
        
        if (!segment.type || !segment.durationSec) {
          return res.status(400).json({
            valid: false,
            message: `Invalid segment at index ${i}: missing type or durationSec`
          });
        }
      }
      
      res.json({ valid: true, message: 'Workout file is valid' });
    } catch (error) {
      res.status(500).json({ 
        valid: false, 
        message: `Error validating workout: ${(error as Error).message}` 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
