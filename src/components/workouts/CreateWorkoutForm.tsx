'use client';

import { InsertExercise } from "@/db/schema";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { createWorkoutAction } from "@/actions";
import { Plus, Trash2, Dumbbell, Save } from "lucide-react";

interface CreateWorkoutFormProps {
    userId: number;
}

export const CreateWorkoutForm: React.FC<CreateWorkoutFormProps> = ({userId}) => {
    const [workoutName, setWorkoutName] = useState('');
    const [workoutDescription, setWorkoutDescription] = useState('');
    const [exercises, setExercises] = useState<Omit<InsertExercise, 'workoutId'>[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!workoutName.trim()) return;
        
        setIsSubmitting(true);
        try {
            await createWorkoutAction({
                userId,
                workoutName,
                workoutDescription,
                exercises
            });
        } catch (error) {
            console.error('Error creating workout:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addExercise = () => {
        setExercises(prev => ([...prev, {
            name: '',
            description: '',
            reps: 6,
            sets: 3
        }]));
    };

    const removeExercise = (index: number) => {
        setExercises(prev => prev.filter((_, i) => i !== index));
    };

    const updateExercise = (index: number, field: keyof Omit<InsertExercise, 'workoutId'>, value: string | number) => {
        setExercises(prev => prev.map((exercise, i) => 
            i === index ? { ...exercise, [field]: value } : exercise
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                        Create New Workout
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Design your perfect workout routine
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Workout Details Card */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-900">Workout Details</CardTitle>
                            <CardDescription>
                                Give your workout a name and description
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label htmlFor="workoutName" className="block text-sm font-medium text-slate-700 mb-2">
                                    Workout Name *
                                </label>
                                <Input
                                    id="workoutName"
                                    placeholder="e.g., Upper Body Strength, Cardio Blast"
                                    value={workoutName}
                                    onChange={(e) => setWorkoutName(e.target.value)}
                                    className="w-full"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="workoutDescription" className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="workoutDescription"
                                    placeholder="Describe your workout routine..."
                                    value={workoutDescription}
                                    onChange={(e) => setWorkoutDescription(e.target.value)}
                                    className="w-full min-h-[100px] px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Exercises Card */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                                <Dumbbell className="w-5 h-5" />
                                Exercises
                            </CardTitle>
                            <CardDescription>
                                Add exercises to your workout routine
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {exercises.length === 0 ? (
                                <div className="text-center py-8">
                                    <Dumbbell className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                    <p className="text-slate-500 mb-4">No exercises added yet</p>
                                    <Button
                                        type="button"
                                        onClick={addExercise}
                                        variant="outline"
                                        className="border-slate-300 text-slate-700 hover:bg-slate-50"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add First Exercise
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {exercises.map((exercise, index) => (
                                        <div key={index} className="border border-slate-200 rounded-lg p-4 bg-white">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-medium text-slate-900">
                                                    Exercise {index + 1}
                                                </h4>
                                                <Button
                                                    type="button"
                                                    onClick={() => removeExercise(index)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                                        Exercise Name
                                                    </label>
                                                    <Input
                                                        placeholder="e.g., Push-ups"
                                                        value={exercise.name}
                                                        onChange={(e) => updateExercise(index, 'name', e.target.value)}
                                                        className="w-full"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                                        Sets
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="3"
                                                        value={exercise.sets}
                                                        onChange={(e) => updateExercise(index, 'sets', +e.target.value)}
                                                        className="w-full"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                                        Reps
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="10"
                                                        value={exercise.reps}
                                                        onChange={(e) => updateExercise(index, 'reps', +e.target.value)}
                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="mt-3">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Description (optional)
                                                </label>
                                                <Input
                                                    placeholder="e.g., Keep your core tight"
                                                    value={exercise.description || ''}
                                                    onChange={(e) => updateExercise(index, 'description', e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <Button
                                        type="button"
                                        onClick={addExercise}
                                        variant="outline"
                                        className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Another Exercise
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !workoutName.trim()}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </div>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Create Workout
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};