import { FC, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkoutDTO } from "@/type";
import {
  ArrowRight,
  ChevronRight,
  Dumbbell,
  Loader2,
  Pencil,
  Plus,
  Timer,
  Trash,
  X,
} from "lucide-react";
import { workoutClient } from "@/api/WorkoutApi";
import { useToast } from "@/hooks/use-toast";

type ExerciseUpdateField = {
  name: string;
  type: "strength" | "cardio";
  sets: number;
  reps: number;
  duration: number;
  distance: number;
};

const WorkoutsListPage: FC = () => {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDTO | null>(
    null
  );
  const [editingWorkout, setEditingWorkout] = useState<WorkoutDTO | null>(null);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const activeWorkout = workouts.find((w) => w.id === activeWorkoutId);

  // Fetch workouts
  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await workoutClient.getWorkouts();
      if (response.success) {
        setWorkouts(response.data);
        if (!activeWorkoutId && response.data.length > 0) {
          setActiveWorkoutId(response.data[0].id);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to fetch workouts",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch workouts",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Handle edit workout
  const handleEditWorkout = (workout: WorkoutDTO) => {
    setEditingWorkout({ ...workout, exercises: [...workout.exercises] });
    setSelectedWorkout(null);
  };

  // Handle update workout
  const handleUpdateWorkout = async () => {
    if (!editingWorkout) return;

    try {
      const response = await workoutClient.editWorkout(
        editingWorkout.id,
        editingWorkout
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Workout updated successfully",
        });
        await fetchWorkouts();
        setEditingWorkout(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to update workout",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update workout",
      });
    }
  };

  // Handle delete workout
  const handleDeleteWorkout = async (id: string) => {
    try {
      const response = await workoutClient.deleteWorkout(id);

      if (response.success) {
        toast({
          title: "Success",
          description: "Workout deleted successfully",
        });
        await fetchWorkouts();
        setSelectedWorkout(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to delete workout",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete workout",
      });
    }
  };
  const addExercise = () => {
    if (!editingWorkout) return;
    setEditingWorkout({
      ...editingWorkout,
      exercises: [
        ...editingWorkout.exercises,
        { name: "", type: "strength", sets: 3, reps: 10 },
      ],
    });
  };
  const updateExercise = (
    index: number,
    field: keyof ExerciseUpdateField,
    value: ExerciseUpdateField[keyof ExerciseUpdateField]
  ) => {
    if (!editingWorkout) return;
    const updatedExercises = [...editingWorkout.exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: value,
    };
    setEditingWorkout({
      ...editingWorkout,
      exercises: updatedExercises,
    });
  };

  const removeExercise = (index: number) => {
    if (!editingWorkout) return;
    setEditingWorkout({
      ...editingWorkout,
      exercises: editingWorkout.exercises.filter((_, i) => i !== index),
    });
  };

  // Add loading state to UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading workouts...</p>
        </div>
      </div>
    );
  }

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
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Exercises</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workouts.map((workout) => (
                    <TableRow key={workout.id}>
                      <TableCell className="font-medium">
                        {workout.name}
                      </TableCell>
                      <TableCell>
                        <span className="line-clamp-1">
                          {workout.description || "—"}
                        </span>
                      </TableCell>
                      <TableCell>{workout.exercises.length}</TableCell>
                      <TableCell>
                        {workout.id === activeWorkoutId ? (
                          <Badge
                            variant="default"
                            className="bg-green-600 text-white"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => setActiveWorkoutId(workout.id)}
                            disabled={workout.id === activeWorkoutId}
                          >
                            Set Active
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedWorkout(workout)}
                          >
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout Details Dialog */}
      <Dialog
        open={!!selectedWorkout}
        onOpenChange={(open) => !open && setSelectedWorkout(null)}
      >
        <DialogContent className="h-screen sm:h-auto max-w-full sm:max-w-2xl p-4 ">
          <DialogHeader className="sm:p-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4  p-4 ">
              <div>
                <DialogTitle>{selectedWorkout?.name}</DialogTitle>
                <DialogDescription>
                  {selectedWorkout?.description || "No description"}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (selectedWorkout) handleEditWorkout(selectedWorkout);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    if (selectedWorkout) {
                      handleDeleteWorkout(selectedWorkout.id);
                    }
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <ScrollArea className="h-[60vh] sm:h-[50vh]">
            <div className="space-y-3 px-6 sm:px-0">
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
            <div className="flex justify-end border-t p-6 sm:p-0 sm:pt-4 mt-4">
              <Button
                className="w-full sm:w-auto"
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

      {/* Edit Workout Dialog */}
      <Dialog
        open={!!editingWorkout}
        onOpenChange={(open) => !open && setEditingWorkout(null)}
      >
        <DialogContent className="h-screen sm:h-auto max-w-full sm:max-w-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Edit Workout</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[75vh]">
            <ScrollArea className="flex-grow pr-4">
              <div className="space-y-4 pb-2">
                <div>
                  <Label htmlFor="name">Workout Name</Label>
                  <Input
                    id="name"
                    value={editingWorkout?.name || ""}
                    onChange={(e) =>
                      setEditingWorkout((prev) =>
                        prev
                          ? {
                              ...prev,
                              name: e.target.value,
                            }
                          : null
                      )
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editingWorkout?.description || ""}
                    onChange={(e) =>
                      setEditingWorkout((prev) =>
                        prev
                          ? {
                              ...prev,
                              description: e.target.value,
                            }
                          : null
                      )
                    }
                    className="mt-1.5"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Exercises</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addExercise}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Exercise
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {editingWorkout?.exercises.map((exercise, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6 relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4"
                            onClick={() => removeExercise(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="grid gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label>Exercise Name</Label>
                                <Input
                                  value={exercise.name}
                                  onChange={(e) =>
                                    updateExercise(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1.5"
                                />
                              </div>
                              <div>
                                <Label>Type</Label>
                                <Select
                                  value={exercise.type}
                                  onValueChange={(
                                    value: "strength" | "cardio"
                                  ) => updateExercise(index, "type", value)}
                                >
                                  <SelectTrigger className="mt-1.5">
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
                            </div>

                            {exercise.type === "strength" ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label>Sets</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={exercise.sets || ""}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
                                        "sets",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="mt-1.5"
                                  />
                                </div>
                                <div>
                                  <Label>Reps</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={exercise.reps || ""}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
                                        "reps",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="mt-1.5"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label>Duration (minutes)</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={exercise.duration || ""}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
                                        "duration",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="mt-1.5"
                                  />
                                </div>
                                <div>
                                  <Label>Distance (km)</Label>
                                  <Input
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={exercise.distance || ""}
                                    onChange={(e) =>
                                      updateExercise(
                                        index,
                                        "distance",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="mt-1.5"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 border-t pt-4 mt-4">
              <Button variant="outline" onClick={() => setEditingWorkout(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateWorkout}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutsListPage;
