import { getCurrentSession } from '@/lib/get-current-session';
import { getWorkoutWithExercises, getWorkoutSessionHistory, getWorkoutStats } from '@/db/workoutSession.service';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';

interface WorkoutHistoryPageProps {
  params: {
    id: string;
  };
}

const WorkoutHistoryPage = async ({ params }: WorkoutHistoryPageProps) => {
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
    const [workout, sessionHistory, stats] = await Promise.all([
      getWorkoutWithExercises(workoutId, session.userId),
      getWorkoutSessionHistory(workoutId, session.userId),
      getWorkoutStats(workoutId, session.userId)
    ]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/workouts">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{workout.name}</h1>
              <p className="text-slate-600">Workout History & Progress</p>
            </div>
            <Link href={`/workouts/${workout.id}/session`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Start New Session
              </Button>
            </Link>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
                <div className="text-sm text-slate-600">Total Sessions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">Coming Soon</div>
                <div className="text-sm text-slate-600">Progress Tracking</div>
              </CardContent>
            </Card>
          </div>

          {/* Session History */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Sessions</h2>
            
            {sessionHistory.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    No sessions yet
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Start your first workout session to see your progress here
                  </p>
                  <Link href={`/workouts/${workout.id}/session`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Start First Session
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              sessionHistory.map((sessionData) => (
                <Card key={sessionData.id} className="border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="font-semibold">
                        {new Date(sessionData.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sessionData.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="bg-slate-50 rounded-lg p-3">
                          <h4 className="font-medium text-slate-900 mb-2">{exercise.name}</h4>
                          <div className="flex flex-wrap gap-2">
                            {exercise.sets.map((set, setIndex) => (
                              <span 
                                key={setIndex}
                                className="text-xs bg-white px-2 py-1 rounded border"
                              >
                                {set.weight > 0 ? `${set.weight}kg × ` : ''}{set.reps} reps
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading workout history:', error);
    redirect('/workouts');
  }
};

export default WorkoutHistoryPage;