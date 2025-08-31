import { CreateWorkoutForm } from '@/components/workouts/CreateWorkoutForm';
import { getCurrentSession } from '@/lib/get-current-session';
import React from 'react';

const WorkoutsCreatePage = async () => {
  const session = await getCurrentSession();
  if(!session) {
    return;
  }

  return (
    <div>
      <h1>Create Workout</h1>
      <CreateWorkoutForm userId={session.userId}/>
    </div>
  );
};

export default WorkoutsCreatePage;
