'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Clock } from 'lucide-react';
import { PreviousSetData } from '@/types/workout.types';
import { RestTimer } from './RestTimer';

interface SetRowProps {
  exerciseId: number;
  setNumber: number;
  previousData: PreviousSetData | null;
  targetReps: number;
}

export function SetRow({ exerciseId, setNumber, previousData, targetReps }: SetRowProps) {
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSetComplete = () => {
    setIsCompleted(true);
    setShowRestTimer(true);
  };

  return (
    <>
      <div 
        className={`p-3 rounded-lg transition-all duration-200 ${
          isCompleted 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-slate-50'
        }`}
      >
        {/* Mobile Layout */}
        <div className="space-y-3">
          {/* Set Number and Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Set {setNumber}
            </span>
            {!isCompleted ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleSetComplete}
                className="text-xs px-3 py-1 border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Timer className="w-3 h-3 mr-1" />
                Done
              </Button>
            ) : (
              <div className="flex items-center text-green-600 text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Completed
              </div>
            )}
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-2 gap-3">
            {/* Weight Input */}
            <div className="space-y-1">
              <label className="text-xs text-slate-600 block">Weight (kg)</label>
              <Input
                type="number"
                name={`weight_${exerciseId}_${setNumber}`}
                defaultValue={previousData?.weight || undefined}
                placeholder={previousData ? previousData.weight.toString() : "0"}
                className="w-full h-9 text-center"
                disabled={isCompleted}
              />
              {previousData && (
                <span className="text-xs text-slate-400 block text-center">
                  Last: {previousData.weight}kg
                </span>
              )}
            </div>

            {/* Reps Input */}
            <div className="space-y-1">
              <label className="text-xs text-slate-600 block">Reps</label>
              <Input
                type="number"
                name={`reps_${exerciseId}_${setNumber}`}
                defaultValue={previousData?.reps || targetReps}
                placeholder={previousData ? previousData.reps.toString() : targetReps.toString()}
                className="w-full h-9 text-center"
                disabled={isCompleted}
              />
              {previousData && (
                <span className="text-xs text-slate-400 block text-center">
                  Last: {previousData.reps}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rest Timer Modal */}
      <RestTimer
        isVisible={showRestTimer}
        onClose={() => setShowRestTimer(false)}
        defaultDuration={90}
      />
    </>
  );
}