import { FC, useState, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Exercise } from "@/type";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface WorkoutCreationPageProps {}

type ExerciseField = keyof Exercise;

const WorkoutCreationPage: FC<WorkoutCreationPageProps> = () => {
  const [workoutName, setWorkoutName] = useState("");
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const handleAddExercise = () => {
    setExercises([...exercises, {
      name: "",
      type: "strength",
    }]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: ExerciseField, value: string | number | undefined) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value
    };
    setExercises(updatedExercises);
  };

  const handleSubmit = () => {
    const workout = {
      id: crypto.randomUUID(),
      name: workoutName,
      description,
      exercises
    };
    console.log('Created workout:', workout);
    // Here you would typically save the workout to your backend
  };

  const handleNumberInput = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    field: ExerciseField,
    isFloat = false
  ) => {
    const value = e.target.value;
    if (value === '') {
      updateExercise(index, field, undefined);
    } else {
      const parsedValue = isFloat ? parseFloat(value) : parseInt(value);
      if (!isNaN(parsedValue)) {
        updateExercise(index, field, parsedValue);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Workout</CardTitle>
          <CardDescription>Design your custom workout routine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="workoutName">Workout Name</Label>
              <Input
                id="workoutName"
                placeholder="Enter workout name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your workout"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Exercises</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddExercise}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add Exercise</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>

              {exercises.map((exercise, index) => (
                <Card key={index} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleRemoveExercise(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Exercise Name</Label>
                          <Input
                            placeholder="Enter exercise name"
                            value={exercise.name}
                            onChange={(e) => updateExercise(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={exercise.type}
                            onValueChange={(value: 'strength' | 'cardio') => 
                              updateExercise(index, 'type', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="strength">Strength</SelectItem>
                              <SelectItem value="cardio">Cardio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {exercise.type === 'strength' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Sets</Label>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Number of sets"
                              value={exercise.sets || ''}
                              onChange={(e) => handleNumberInput(e, index, 'sets')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Reps</Label>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Number of reps"
                              value={exercise.reps || ''}
                              onChange={(e) => handleNumberInput(e, index, 'reps')}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Duration (minutes)</Label>
                            <Input
                              type="number"
                              min="1"
                              placeholder="Duration"
                              value={exercise.duration || ''}
                              onChange={(e) => handleNumberInput(e, index, 'duration')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Distance (km)</Label>
                            <Input
                              type="number"
                              min="0.1"
                              step="0.1"
                              placeholder="Distance"
                              value={exercise.distance || ''}
                              onChange={(e) => handleNumberInput(e, index, 'distance', true)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Create Workout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutCreationPage;