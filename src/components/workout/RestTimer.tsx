'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, X, Clock } from 'lucide-react';

interface RestTimerProps {
  isVisible: boolean;
  onClose: () => void;
  defaultDuration?: number; // in seconds
}

export function RestTimer({ isVisible, onClose, defaultDuration = 90 }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(defaultDuration);

  // Reset timer when it becomes visible
  useEffect(() => {
    if (isVisible && !isRunning) {
      setTimeLeft(defaultDuration);
      setInitialTime(defaultDuration);
      setIsRunning(true);
    }
  }, [isVisible, defaultDuration, isRunning]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Optional: Add notification sound or vibration here
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
  };

  const handleAddTime = (seconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev + seconds));
    setInitialTime((prev) => Math.max(0, prev + seconds));
  };

  const progressPercentage = ((initialTime - timeLeft) / initialTime) * 100;
  const isFinished = timeLeft === 0;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <Card className="w-full max-w-xs mx-auto shadow-2xl border-0 max-h-screen overflow-auto">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-base text-slate-900">Rest Timer</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Circular Progress Timer */}
          <div className="relative flex items-center justify-center mb-4">
            <svg className="w-28 h-28 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={isFinished ? "#10b981" : "#3b82f6"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            
            {/* Time display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl sm:text-3xl font-bold ${isFinished ? 'text-green-600' : 'text-slate-900'}`}>
                {formatTime(timeLeft)}
              </span>
              {isFinished && (
                <span className="text-xs sm:text-sm text-green-600 font-medium animate-pulse">
                  Complete!
                </span>
              )}
            </div>
          </div>

          {/* Quick Time Adjustments */}
          <div className="grid grid-cols-4 gap-1 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddTime(-15)}
              className="text-xs px-1 py-1 h-7"
              disabled={timeLeft === 0}
            >
              -15s
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddTime(-30)}
              className="text-xs px-1 py-1 h-7"
              disabled={timeLeft === 0}
            >
              -30s
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddTime(30)}
              className="text-xs px-1 py-1 h-7"
            >
              +30s
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddTime(60)}
              className="text-xs px-1 py-1 h-7"
            >
              +1m
            </Button>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col gap-2">
            {!isFinished ? (
              <>
                <Button
                  onClick={handlePlayPause}
                  className={`flex items-center justify-center gap-2 w-full h-10 ${
                    isRunning 
                      ? 'bg-orange-600 hover:bg-orange-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Start
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 w-full"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </>
            ) : (
              <Button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white w-full h-10"
              >
                Continue Workout
              </Button>
            )}
          </div>

          {/* Quick restart presets */}
          {isFinished && (
            <div className="mt-3 pt-3 border-t">
              <span className="text-xs text-slate-600 block text-center mb-2">Quick restart:</span>
              <div className="grid grid-cols-3 gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTimeLeft(60);
                    setInitialTime(60);
                    setIsRunning(true);
                  }}
                  className="text-xs px-2 py-1 h-7"
                >
                  1m
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTimeLeft(90);
                    setInitialTime(90);
                    setIsRunning(true);
                  }}
                  className="text-xs px-2 py-1 h-7"
                >
                  1.5m
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTimeLeft(120);
                    setInitialTime(120);
                    setIsRunning(true);
                  }}
                  className="text-xs px-2 py-1 h-7"
                >
                  2m
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}