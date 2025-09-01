import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Play, Calendar, Clock, BarChart3 } from 'lucide-react';
import { SelectWorkout } from '@/types/workout.types';

interface WorkoutCardProps {
  workout: SelectWorkout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-blue-300 overflow-hidden"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-2">
            {workout.name}
          </CardTitle>
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
        </div>
        <CardDescription className="text-slate-600 line-clamp-3">
          {workout.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="pt-0 flex-col items-stretch gap-3">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Created recently</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>~30 min</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/workouts/${workout.id}/session`} className="flex-1">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 transition-all duration-200 group-hover:bg-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Workout
            </Button>
          </Link>
          <Link href={`/workouts/${workout.id}/history`}>
            <Button
              variant="outline"
              className="px-3 py-2.5 border-slate-300 hover:bg-slate-50"
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}