import { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkoutDTO } from "@/type";
import { ArrowRight, ChevronRight, Dumbbell, Timer } from "lucide-react";

const MOCK_WORKOUTS: WorkoutDTO[] = [
  {
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
    ],
  },
  {
    id: "2",
    name: "HIIT Cardio",
    description: "High-intensity interval training for maximum calorie burn",
    exercises: [
      {
        name: "Sprint Intervals",
        type: "cardio",
        duration: 20,
        distance: 5,
      },
      {
        name: "Jump Rope",
        type: "cardio",
        duration: 10,
        distance: 0,
      },
      {
        name: "Mountain Climbers",
        type: "cardio",
        duration: 5,
        distance: 0,
      },
    ],
  },
  {
    id: "3",
    name: "Upper Body Power",
    description: "Focus on upper body strength and muscle building",
    exercises: [
      {
        name: "Shoulder Press",
        type: "strength",
        sets: 4,
        reps: 8,
      },
      {
        name: "Bicep Curls",
        type: "strength",
        sets: 3,
        reps: 12,
      },
      {
        name: "Tricep Extensions",
        type: "strength",
        sets: 3,
        reps: 12,
      },
    ],
  },
];

const WorkoutsListPage: FC = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDTO | null>(
    null
  );
  const [activeWorkoutId, setActiveWorkoutId] = useState<string>("1");

  const workouts = MOCK_WORKOUTS;
  const activeWorkout = workouts.find((w) => w.id === activeWorkoutId);

  // Mobile-friendly workout list item
  const WorkoutListItem = ({ workout }: { workout: WorkoutDTO }) => (
    <div className="block sm:hidden">
      <Card className="mb-4" onClick={() => setSelectedWorkout(workout)}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">{workout.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">
                {workout.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    workout.id === activeWorkoutId ? "default" : "outline"
                  }
                  className="mt-1"
                >
                  {workout.id === activeWorkoutId ? "Active" : "Inactive"}
                </Badge>
                <span className="text-sm text-gray-500">
                  {workout.exercises.length} exercises
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Active Workout Section */}
      <Card className="mb-8">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Workout</CardTitle>
              <CardDescription>
                Currently selected workout for tracking
              </CardDescription>
            </div>
            {activeWorkout && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {activeWorkout.exercises.length} exercises
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activeWorkout ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-lg font-semibold">
                    {activeWorkout.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {activeWorkout.description || "No description"}
                  </p>
                </div>
                <Badge variant="secondary" className="w-fit sm:hidden">
                  {activeWorkout.exercises.length} exercises
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeWorkout.exercises.map((exercise) => (
                  <Card
                    key={exercise.name}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {exercise.type === "strength" ? (
                            <Dumbbell className="h-4 w-4 shrink-0" />
                          ) : (
                            <Timer className="h-4 w-4 shrink-0" />
                          )}
                          <span className="font-medium line-clamp-1">
                            {exercise.name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {exercise.type === "strength" ? (
                            <span>
                              {exercise.sets} sets × {exercise.reps} reps
                            </span>
                          ) : (
                            <span>
                              {exercise.duration}min • {exercise.distance}km
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No active workout selected
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Workouts Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Workouts</CardTitle>
          <CardDescription>
            Select a workout to view details or set as active
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile View */}
          {workouts.map((workout) => (
            <WorkoutListItem key={workout.id} workout={workout} />
          ))}

          {/* Desktop View */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Exercises</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell className="font-medium">
                      {workout.name}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <span className="line-clamp-1">
                        {workout.description || "—"}
                      </span>
                    </TableCell>
                    <TableCell>{workout.exercises.length}</TableCell>
                    <TableCell>
                      {workout.id === activeWorkoutId ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedWorkout(workout)}
                        >
                          Details
                        </Button>
                        {workout.id !== activeWorkoutId && (
                          <Button
                            size="sm"
                            onClick={() => setActiveWorkoutId(workout.id)}
                          >
                            Set Active
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Workout Details Dialog */}
      <Dialog
        open={!!selectedWorkout}
        onOpenChange={(open) => !open && setSelectedWorkout(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedWorkout?.name}</DialogTitle>
            <DialogDescription>
              {selectedWorkout?.description || "No description"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3 p-1">
              {selectedWorkout?.exercises.map((exercise, index) => (
                <Card key={`${exercise.name}-${index}`}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {exercise.type === "strength" ? (
                            <Dumbbell className="h-4 w-4" />
                          ) : (
                            <Timer className="h-4 w-4" />
                          )}
                          <span className="font-medium">{exercise.name}</span>
                        </div>
                        <Badge variant="secondary">{exercise.type}</Badge>
                      </div>
                      {exercise.type === "strength" ? (
                        <div className="text-sm text-gray-500">
                          {exercise.sets} sets × {exercise.reps} reps
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {exercise.duration} minutes • {exercise.distance} km
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          {selectedWorkout?.id !== activeWorkoutId && (
            <div className="mt-2">
              <Button
                className="w-full"
                onClick={() => {
                  setActiveWorkoutId(selectedWorkout?.id || "");
                  setSelectedWorkout(null);
                }}
              >
                Set as Active Workout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutsListPage;
