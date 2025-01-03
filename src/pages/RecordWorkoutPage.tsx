import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkoutDTO, WorkoutRecordDTO } from "@/type";
import { Dumbbell, Timer } from "lucide-react";

// Mock active workout data
const MOCK_ACTIVE_WORKOUT: WorkoutDTO = {
  id: "1",
  name: "Full Body Strength",
  description: "Complete full body workout focusing on major muscle groups",
  exercises: [
    {
      name: "Bench Press",
      type: "strength",
      sets: 3,
      reps: 10,
    },
    {
      name: "Squats",
      type: "strength",
      sets: 4,
      reps: 8,
    },
    {
      name: "Deadlifts",
      type: "strength",
      sets: 3,
      reps: 8,
    },
    {
      name: "Pull-ups",
      type: "strength",
      sets: 3,
      reps: 10,
    },
    {
        name: "Treadmill Run",
        type: "cardio",
        duration: 30,
        distance: 0,
    }
  ],
};

interface ExerciseRecordProps {
  exercise: WorkoutDTO["exercises"][0];
  previousRecord?: WorkoutRecordDTO["exercises"][0];
  onRecordUpdate: (record: Partial<WorkoutRecordDTO["exercises"][0]>) => void;
}

const ExerciseRecord: FC<ExerciseRecordProps> = ({
  exercise,
  onRecordUpdate,
}) => {
  const [weight, setWeight] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [distance, setDistance] = useState<string>("");

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onRecordUpdate({ bestWeight: numValue });
    }
  };

  const handleRepsChange = (value: string) => {
    setReps(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onRecordUpdate({ bestReps: numValue });
    }
  };

  const handleDurationChange = (value: string) => {
    setDuration(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onRecordUpdate({ duration: numValue });
    }
  };

  const handleDistanceChange = (value: string) => {
    setDistance(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onRecordUpdate({ distance: numValue });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {exercise.type === "strength" ? (
                  <Dumbbell className="h-4 w-4" />
                ) : (
                  <Timer className="h-4 w-4" />
                )}
                <span className="font-medium">{exercise.name}</span>
              </div>
            </div>
            <Badge variant="secondary">{exercise.type}</Badge>
          </div>

          {exercise.type === "strength" ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => handleWeightChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Best Reps</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Enter reps"
                  value={reps}
                  onChange={(e) => handleRepsChange(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Enter duration"
                  value={duration}
                  onChange={(e) => handleDurationChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Distance (km)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter distance"
                  value={distance}
                  onChange={(e) => handleDistanceChange(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const RecordWorkoutPage: FC = () => {
  const [currentRecord, setCurrentRecord] = useState<WorkoutRecordDTO>({
    id: crypto.randomUUID(),
    workoutId: MOCK_ACTIVE_WORKOUT.id,
    date: new Date(),
    exercises: MOCK_ACTIVE_WORKOUT.exercises.map((exercise) => ({
      name: exercise.name,
      type: exercise.type,
    })),
  });

  const handleExerciseUpdate = (
    index: number,
    update: Partial<WorkoutRecordDTO["exercises"][0]>
  ) => {
    const updatedExercises = [...currentRecord.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      ...update,
    };
    setCurrentRecord({
      ...currentRecord,
      exercises: updatedExercises,
    });
  };

  const isSubmitDisabled = currentRecord.exercises.some((exercise) => {
    if (exercise.type === "strength") {
      return !exercise.bestWeight || !exercise.bestReps;
    }
    return !exercise.duration || !exercise.distance;
  });

  const handleSubmit = () => {
    console.log("Submitting workout record:", currentRecord);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{MOCK_ACTIVE_WORKOUT.name}</CardTitle>
              <CardDescription>
                {MOCK_ACTIVE_WORKOUT.description}
              </CardDescription>
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
              Complete Workout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {MOCK_ACTIVE_WORKOUT.exercises.map((exercise, index) => (
              <ExerciseRecord
                key={exercise.name}
                exercise={exercise}
                onRecordUpdate={(update) => handleExerciseUpdate(index, update)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordWorkoutPage;
