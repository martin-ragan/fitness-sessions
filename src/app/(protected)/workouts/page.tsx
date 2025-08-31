import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getWorkouts } from '@/db/workouts.service';
import { getCurrentSession } from '@/lib/get-current-session';
import Link from 'next/link';
import React from 'react';

const WorkoutsPage = async () => {
  const session = await getCurrentSession();
  if(!session) {
    return;
  }

  const workouts = await getWorkouts(session.userId);

  return (
    <div>
      <h1>Workouts</h1>
      {
        workouts.map(workout => (
          <Card key={workout.id} className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>{workout.name}</CardTitle>
              <CardDescription>
                <p>{workout.description}</p>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex-col gap-2">
              <Link href={''}>Start Workout</Link>
            </CardFooter>
        </Card> 
        ))
      }
    </div>
  );
};

export default WorkoutsPage;
