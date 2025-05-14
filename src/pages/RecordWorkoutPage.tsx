import { FC, useEffect, useState } from "react";
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
import { WorkoutDTO, WorkoutRecordDTO, WorkoutSplitDTO } from "@/type";
import { Dumbbell, Loader2, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { splitClient } from "@/api/WorkoutApi";
import { workoutManagerClient } from "@/api/WorkoutManagerApi";
import { useNavigate } from "react-router-dom";

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
                <Label>Weight (lbs)</Label>
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
                <Label>
                  Best Reps (try {exercise.reps} x {exercise.sets} sets)
                </Label>
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
                <Label>Duration (min) (try {exercise.duration})</Label>
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

//The RecordWorkoutPage component is a functional component that displays the current workout for the user to record.
//It fetches the active split and the next workout index from the server and displays the workout details.
// The user can record the workout by entering the details for each exercise.
// Once the user has entered all the details, they can submit the workout record, which will be saved to the server.
const RecordWorkoutPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSplit, setActiveSplit] = useState<WorkoutSplitDTO | null>(null);
  const [nextWorkoutIndex, setNextWorkoutIndex] = useState<number>(0);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutDTO | null>(null);
  const [currentRecord, setCurrentRecord] = useState<WorkoutRecordDTO | null>(
    null
  );
  const { toast } = useToast();
  const navigate = useNavigate();
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the user's next workout index
        const indexResponse = await splitClient.getUserNextWorkoutIndex();
        if (!indexResponse.success) {
          throw new Error(
            indexResponse.error || "Failed to fetch next workout index"
          );
        }
        const nextIndex = indexResponse.data;

        // Fetch active split
        const splitResponse = await splitClient.getActiveSplit();
        if (!splitResponse.success) {
          throw new Error(
            splitResponse.error || "Failed to fetch active split"
          );
        }
        const activeSplitId = splitResponse.data;

        // Fetch all splits to find the active one
        const splitsResponse = await splitClient.getSplits();
        if (!splitsResponse.success) {
          throw new Error(splitsResponse.error || "Failed to fetch splits");
        }

        const foundSplit = splitsResponse.data.find(
          (split) => split.id === activeSplitId
        );
        if (!foundSplit) {
          setError("No active split found. Please set an active split first.");
          return;
        }

        setActiveSplit(foundSplit);
        setNextWorkoutIndex(nextIndex);

        // Set current workout based on index
        if (nextIndex >= foundSplit.workouts.length) {
          // Reset to 0 if index is out of range
          await splitClient.incrementUserNextWorkoutIndex(0);
          setNextWorkoutIndex(0);
          setCurrentWorkout(foundSplit.workouts[0]);
        } else {
          setCurrentWorkout(foundSplit.workouts[nextIndex]);
        }

        // Initialize workout record
        if (foundSplit.workouts[nextIndex]) {
          const currentWorkout = foundSplit.workouts[nextIndex];
          setCurrentWorkout(currentWorkout);
          setCurrentRecord({
            id: foundSplit.id,
            workoutName: currentWorkout.name,
            date: new Date(),
            exercises: currentWorkout.exercises.map((exercise) => ({
              name: exercise.name,
              type: exercise.type,
              ...(exercise.type === "strength"
                ? { bestReps: undefined, bestWeight: undefined }
                : { duration: undefined, distance: undefined }),
            })),
          });
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An error occurred";
        setError(message);
        toast({
          variant: "destructive",
          title: "Error",
          description: message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleExerciseUpdate = (
    index: number,
    update: Partial<WorkoutRecordDTO["exercises"][0]>
  ) => {
    if (!currentRecord) return;

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

  const isSubmitDisabled = !currentRecord?.exercises.every((exercise) => {
    if (exercise.type === "strength") {
      return exercise.bestWeight && exercise.bestReps;
    }
    return exercise.duration && exercise.distance;
  });

  const handleSubmit = async () => {
    if (!activeSplit || !currentRecord || !currentWorkout) return;

    setLoading(true);

    try {
      // Save the workout record
      const recordResponse = await workoutManagerClient.postUserActiveWorkout(
        currentRecord
      );

      if (!recordResponse.success) {
        throw new Error(recordResponse.error);
      }

      // Update the next workout index
      const nextIndex = (nextWorkoutIndex + 1) % activeSplit.workouts.length;
      const indexResponse = await splitClient.incrementUserNextWorkoutIndex(
        nextIndex
      );

      if (!indexResponse.success) {
        throw new Error(indexResponse.error);
      }

      toast({
        title: "Success",
        description: "Workout recorded successfully!",
      });

      // Refresh the page to show the next workout
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to record workout",
      });
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (error || !currentWorkout || !currentRecord) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>No Workout Available</CardTitle>
            <CardDescription>
              {error || "Please set up an active workout split to continue."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {" "}
            <Button
              onClick={() => {
                navigate("/workouts");
              }}
            >
              Set active split
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>{currentWorkout.name}</CardTitle>
              <CardDescription>
                Workout {nextWorkoutIndex + 1} of {activeSplit?.workouts.length}
              </CardDescription>
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
              Complete Workout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {currentWorkout.exercises.map((exercise, index) => (
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
