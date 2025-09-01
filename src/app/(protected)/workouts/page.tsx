import { Button } from '@/components/ui/button';
import { getWorkouts } from '@/db/workouts.service';
import { getCurrentSession } from '@/lib/get-current-session';
import { WorkoutCard } from '@/components/workout/WorkoutCard';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import React from 'react';

const WorkoutsPage = async () => {
  const session = await getCurrentSession();
  if(!session) {
    return;
  }

  const workouts = await getWorkouts(session.userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                My Workouts
              </h1>
              <p className="text-slate-600 text-lg">
                Track your fitness journey and stay motivated
              </p>
            </div>
            <Link href="/workouts/create">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
                <Plus className="w-5 h-5 mr-2" />
                Create Workout
              </Button>
            </Link>
          </div>
        </div>

        {/* Workouts Grid */}
        {workouts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No workouts yet
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Create your first workout to start tracking your fitness progress
              </p>
              <Link href="/workouts/create">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Workout
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {workouts.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutsPage;
