import { CreateWorkoutForm } from '@/components/workouts/CreateWorkoutForm';
import { getCurrentSession } from '@/lib/get-current-session';
import React from 'react';

const WorkoutsCreatePage = async () => {
  const session = await getCurrentSession();
  if(!session) {
    return;
  }

  return <CreateWorkoutForm
    userId={session.userId}
  />;
};

export default WorkoutsCreatePage;
