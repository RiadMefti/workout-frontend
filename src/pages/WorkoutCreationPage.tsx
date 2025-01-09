import { FC, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, X, Loader2 } from "lucide-react";
import { Exercise, WorkoutDTO } from "@/type";
import { useToast } from "@/hooks/use-toast";
import { splitClient } from "@/api/WorkoutApi";

type ExerciseField = keyof Exercise;


//The SplitCreationPage component allows users to create a new workout split.
//It allows users to add multiple workouts, each with multiple exercises.
//It validates the form and sends a request to the API to create the split.
//If the split is created successfully, it redirects the user to the splits page.
const SplitCreationPage: FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [splitName, setSplitName] = useState("");
  const [description, setDescription] = useState("");
  const [workouts, setWorkouts] = useState<WorkoutDTO[]>([]); // Manages multiple workouts
  const [loading, setLoading] = useState(false);

  const handleAddWorkout = () => {
    setWorkouts([
      ...workouts,
      {
        name: "",
        exercises: [],
        id: "",
      },
    ]);
  };

  const handleRemoveWorkout = (index: number) => {
    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  const handleAddExercise = (workoutIndex: number) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[workoutIndex].exercises.push({
      name: "",
      type: "strength",
    });
    setWorkouts(updatedWorkouts);
  };

  const handleRemoveExercise = (
    workoutIndex: number,
    exerciseIndex: number
  ) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[workoutIndex].exercises = updatedWorkouts[
      workoutIndex
    ].exercises.filter((_, i) => i !== exerciseIndex);
    setWorkouts(updatedWorkouts);
  };

  const updateExercise = (
    workoutIndex: number,
    exerciseIndex: number,
    field: ExerciseField,
    value: string | number | undefined
  ) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[workoutIndex].exercises[exerciseIndex] = {
      ...updatedWorkouts[workoutIndex].exercises[exerciseIndex],
      [field]: value,
    };
    setWorkouts(updatedWorkouts);
  };

  const validateForm = (): boolean => {
    if (!splitName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Split name is required",
      });
      return false;
    }

    if (workouts.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Add at least one workout",
      });
      return false;
    }

    for (const workout of workouts) {
      if (!workout.name.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "All workouts must have a name",
        });
        return false;
      }

      if (workout.exercises.length === 0) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Each workout must have at least one exercise",
        });
        return false;
      }

      for (const exercise of workout.exercises) {
        if (!exercise.name.trim()) {
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: "All exercises must have a name",
          });
          return false;
        }

        if (
          exercise.type === "strength" &&
          (!exercise.sets || !exercise.reps)
        ) {
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Strength exercises must have sets and reps",
          });
          return false;
        }

        if (
          exercise.type === "cardio" &&
          (!exercise.duration || !exercise.distance)
        ) {
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Cardio exercises must have duration and distance",
          });
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await splitClient.createSplit({
        name: splitName,
        description: description,
        workouts,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Split created successfully",
        });
        navigate("/splits");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to create split",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create split",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormComplete = () => {
    if (!splitName.trim() || workouts.length === 0) return false;

    return workouts.every((workout) => {
      if (!workout.name.trim()) return false;

      return workout.exercises.every((exercise) => {
        if (!exercise.name.trim()) return false;

        if (exercise.type === "strength") {
          if (!exercise.sets || !exercise.reps) return false;
        }

        if (exercise.type === "cardio") {
          if (!exercise.duration || !exercise.distance) return false;
        }

        return true;
      });
    });
  };

  const handleNumberInput = (
    e: ChangeEvent<HTMLInputElement>,
    workoutIndex: number,
    exerciseIndex: number,
    field: ExerciseField,
    isFloat = false
  ) => {
    const value = e.target.value;
    if (value === "") {
      updateExercise(workoutIndex, exerciseIndex, field, undefined);
    } else {
      const parsedValue = isFloat ? parseFloat(value) : parseInt(value);
      if (!isNaN(parsedValue)) {
        updateExercise(workoutIndex, exerciseIndex, field, parsedValue);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Split</CardTitle>
          <CardDescription>Design your custom split routine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="splitName">Split Name</Label>
              <Input
                id="splitName"
                placeholder="Enter split name"
                value={splitName}
                onChange={(e) => setSplitName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your split"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Workouts</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddWorkout}
                  disabled={loading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add Workout</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>

              {workouts.map((workout, workoutIndex) => (
                <Card key={workoutIndex} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleRemoveWorkout(workoutIndex)}
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Workout Name</Label>
                        <Input
                          placeholder="Enter workout name"
                          value={workout.name}
                          onChange={(e) =>
                            setWorkouts((prevState) => {
                              const updatedWorkouts = [...prevState];
                              updatedWorkouts[workoutIndex].name =
                                e.target.value;
                              return updatedWorkouts;
                            })
                          }
                          disabled={loading}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Exercises</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddExercise(workoutIndex)}
                          disabled={loading}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Add Exercise</span>
                          <span className="sm:hidden">Add</span>
                        </Button>
                      </div>

                      {workout.exercises.map((exercise, exerciseIndex) => (
                        <Card key={exerciseIndex} className="mt-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() =>
                              handleRemoveExercise(workoutIndex, exerciseIndex)
                            }
                            disabled={loading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Exercise Name</Label>
                                <Input
                                  placeholder="Enter exercise name"
                                  value={exercise.name}
                                  onChange={(e) =>
                                    updateExercise(
                                      workoutIndex,
                                      exerciseIndex,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  disabled={loading}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Type</Label>
                                <Select
                                  value={exercise.type}
                                  onValueChange={(value) =>
                                    updateExercise(
                                      workoutIndex,
                                      exerciseIndex,
                                      "type",
                                      value
                                    )
                                  }
                                  disabled={loading}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="strength">
                                      Strength
                                    </SelectItem>
                                    <SelectItem value="cardio">
                                      Cardio
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {exercise.type === "strength" && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Sets</Label>
                                    <Input
                                      type="number"
                                      value={exercise.sets}
                                      onChange={(e) =>
                                        handleNumberInput(
                                          e,
                                          workoutIndex,
                                          exerciseIndex,
                                          "sets"
                                        )
                                      }
                                      disabled={loading}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Reps</Label>
                                    <Input
                                      type="number"
                                      value={exercise.reps}
                                      onChange={(e) =>
                                        handleNumberInput(
                                          e,
                                          workoutIndex,
                                          exerciseIndex,
                                          "reps"
                                        )
                                      }
                                      disabled={loading}
                                    />
                                  </div>
                                </div>
                              )}

                              {exercise.type === "cardio" && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Duration (mins)</Label>
                                    <Input
                                      type="number"
                                      value={exercise.duration}
                                      onChange={(e) =>
                                        handleNumberInput(
                                          e,
                                          workoutIndex,
                                          exerciseIndex,
                                          "duration",
                                          true
                                        )
                                      }
                                      disabled={loading}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Distance (km)</Label>
                                    <Input
                                      type="number"
                                      value={exercise.distance}
                                      onChange={(e) =>
                                        handleNumberInput(
                                          e,
                                          workoutIndex,
                                          exerciseIndex,
                                          "distance",
                                          true
                                        )
                                      }
                                      disabled={loading}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={loading || !isFormComplete()}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Create Split"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SplitCreationPage;
