import { getCurrentSession } from '@/lib/get-current-session';
import React from 'react';

const WorkoutsPage = async () => {
  const session = await getCurrentSession();
  return (
    <div>
      <h1>Workouts</h1>
    </div>
  );
};

export default WorkoutsPage;
