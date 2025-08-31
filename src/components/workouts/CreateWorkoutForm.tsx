'use client';

import { InsertExercise } from "@/db/schema";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createWorkoutAction } from "@/app/(protected)/workouts/create/actions";

interface CreateWorkoutFormProps {
    userId: number;
}

export const CreateWorkoutForm: React.FC<CreateWorkoutFormProps> = ({userId}) => {
    const [workoutName, setWorkoutName] = useState('');
    const [workoutDescription, setWorkoutDescription] = useState('');
    const [exercises, setExercises] = useState<Omit<InsertExercise, 'workoutId'>[]>([]);
    return (
        <form>
            <Input
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
            />
            <Input
                value={workoutDescription}
                onChange={(e) => setWorkoutDescription(e.target.value)}
            />

            {
                exercises.map((e, index) => (
                    <div key={index}>
                        <Input
                            value={e.name}
                            onChange={(ev) => setExercises(prev => {
                                return prev.map((exercise, i) => {
                                    return i === index ? {...exercise, name: ev.target.value} : exercise
                                })
                            })}
                        />
                        <Input
                            type="number"
                            value={e.sets}
                            onChange={(ev) => setExercises(prev => {
                                return prev.map((exercise, i) => {
                                    return i === index ? {...exercise, sets: +ev.target.value} : exercise
                                })
                            })}
                        />
                        <Input
                            type="number"
                            value={e.reps}
                            onChange={(ev) => setExercises(prev => {
                                return prev.map((exercise, i) => {
                                    return i === index ? {...exercise, reps: +ev.target.value} : exercise
                                })
                            })}
                        />
                    </div>
                ))
            }

            <Button
                type="button"
                onClick={() => setExercises(prev => ([...prev, {
                    name: '',
                    description: '',
                    reps: 6,
                    sets: 3
                }]))}
            >
                Add new exercise
            </Button>
            <Button
                onClick={() => {
                    createWorkoutAction({
                        userId,
                        workoutName,
                        workoutDescription,
                        exercises
                    })
                }}
            >
                Create Workout
            </Button>
        </form>
    )
}