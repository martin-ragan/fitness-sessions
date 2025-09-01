import { getCurrentSession } from '@/lib/get-current-session';
import { getWorkoutWithExercises, getPreviousSessionData } from '@/db/workoutSession.service';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { saveWorkoutSession } from '@/actions';
import { SetRow } from '@/components/workout/SetRow';

interface WorkoutSessionPageProps {
  params: {
    id: string;
  };
}

const WorkoutSessionPage = async ({ params }: WorkoutSessionPageProps) => {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  const workoutId = parseInt(id);
  if (isNaN(workoutId)) {
    redirect('/workouts');
  }

  try {
    const [workout, previousSessionData] = await Promise.all([
      getWorkoutWithExercises(workoutId, session.userId),
      getPreviousSessionData(workoutId, session.userId)
    ]);

    // Helper function to get previous data for a specific exercise and set
    const getPreviousSetData = (exerciseId: number, setNumber: number) => {
      if (!previousSessionData) return null;
      
      return previousSessionData.find(
        data => data.exerciseId === exerciseId && data.setNumber === setNumber
      );
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Link href="/workouts">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-slate-900 truncate">{workout.name}</h1>
              </div>
            </div>
            <p className="text-xs text-slate-600 pl-12">Track your sets and reps</p>
          </div>

          <form action={saveWorkoutSession.bind(null, workoutId)} className="p-4">
            {/* Exercises */}
            <div className="space-y-4">
              {workout.exercises.map((exercise) => (
                <Card key={exercise.id} className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{exercise.name}</CardTitle>
                    <p className="text-xs text-slate-600">
                      Target: {exercise.sets} sets × {exercise.reps} reps
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {Array.from({ length: exercise.sets }, (_, setIndex) => {
                        const setNumber = setIndex + 1;
                        const previousData = getPreviousSetData(exercise.id, setNumber);
                        
                        return (
                          <SetRow
                            key={setIndex}
                            exerciseId={exercise.id}
                            setNumber={setNumber}
                            previousData={previousData}
                            targetReps={exercise.reps}
                          />
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Finish Button */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 -mx-4 px-4 pt-4 pb-6 mt-6">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-medium">
                Finish Workout
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading workout session:', error);
    redirect('/workouts');
  }
};

export default WorkoutSessionPage;