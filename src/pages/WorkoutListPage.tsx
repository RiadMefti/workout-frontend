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
import { Exercise, WorkoutSplitDTO } from "@/type";
import {
  ArrowRight,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Trash,
  X,
} from "lucide-react";
import { splitClient } from "@/api/WorkoutApi";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WorkoutSplitPage: FC = () => {
  const [selectedSplit, setSelectedSplit] = useState<WorkoutSplitDTO | null>(
    null
  );
  const [editingSplit, setEditingSplit] = useState<WorkoutSplitDTO | null>(
    null
  );
  const [activeSplitId, setActiveSplitId] = useState<string | null>(null);
  const [splits, setSplits] = useState<WorkoutSplitDTO[]>([]);
  const [activeSplit, setActiveSplit] = useState<WorkoutSplitDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setActiveSplit(
      splits.find((s: WorkoutSplitDTO) => s.id === activeSplitId) || null
    );
  }, [activeSplitId, splits]);

  // Fetch active split and splits
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch active split ID first
      const activeResponse = await splitClient.getActiveSplit();
      if (activeResponse.success) {
        setActiveSplitId(activeResponse.data);
      }

      // Then fetch all splits
      const splitsResponse = await splitClient.getSplits();
      if (splitsResponse.success) {
        setSplits(splitsResponse.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch data",
      });
    } finally {
      setLoading(false);
    }
  };
  // Fetch splits
  const fetchSplits = async () => {
    try {
      setLoading(true);
      const response = await splitClient.getSplits();
      if (response.success) {
        setSplits(response.data);
        if (!activeSplitId && response.data.length > 0) {
          setActiveSplitId(response.data[0].id);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to fetch splits",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch splits",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSplits();
    fetchData();
  }, []); // Handle edit split
  const handleEditSplit = (split: WorkoutSplitDTO) => {
    setEditingSplit({ ...split, workouts: [...split.workouts] });
    setSelectedSplit(null);
  };

  // Handle update split
  const handleUpdateSplit = async () => {
    if (!editingSplit) return;

    try {
      const response = await splitClient.editSplit(
        editingSplit.id,
        editingSplit
      );
      if (response.success) {
        toast({
          title: "Success",
          description: "Split updated successfully",
        });
        await fetchSplits();
        setEditingSplit(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to update split",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update split",
      });
    }
  };
  const addExercise = (workoutIndex: number) => {
    if (!editingSplit) return;
    const updatedWorkouts = [...editingSplit.workouts];

    const workout = updatedWorkouts[workoutIndex];
    workout.exercises = [
      ...workout.exercises,
      {
        name: "",
        type: "strength",
      },
    ];

    setEditingSplit({
      ...editingSplit,
      workouts: updatedWorkouts,
    });
  };

  const updateExercise = (
    workoutIndex: number,
    exerciseIndex: number,
    field: keyof Exercise,
    value: string | number | undefined
  ) => {
    if (!editingSplit) return;
    const updatedWorkouts = [...editingSplit.workouts];
    const workout = updatedWorkouts[workoutIndex];

    workout.exercises[exerciseIndex] = {
      ...workout.exercises[exerciseIndex],
      [field]: value,
    };

    setEditingSplit({
      ...editingSplit,
      workouts: updatedWorkouts,
    });
  };

  const removeExercise = (workoutIndex: number, exerciseIndex: number) => {
    if (!editingSplit) return;
    const updatedWorkouts = [...editingSplit.workouts];
    const workout = updatedWorkouts[workoutIndex];

    workout.exercises = workout.exercises.filter((_, i) => i !== exerciseIndex);

    setEditingSplit({
      ...editingSplit,
      workouts: updatedWorkouts,
    });
  };
  // Handle set active split
  const handleSetActiveSplit = async (splitName: string) => {
    try {
      const response = await splitClient.setActiveSplit(splitName);
      if (response.success) {
        setActiveSplitId(splitName);
        toast({
          title: "Success",
          description: "Active split updated successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to set active split",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to set active split",
      });
    }
  };

  // Handle delete split
  const handleDeleteSplit = async (id: string) => {
    try {
      const response = await splitClient.deleteSplit(id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Split deleted successfully",
        });
        await fetchSplits();
        setSelectedSplit(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to delete split",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete split",
      });
    }
  };

  // Workout management functions within split
  const addWorkout = () => {
    if (!editingSplit) return;
    setEditingSplit({
      ...editingSplit,
      workouts: [
        ...editingSplit.workouts,
        { id: crypto.randomUUID(), name: "", exercises: [] },
      ],
    });
  };

  const updateWorkout = (index: number, name: string) => {
    if (!editingSplit) return;
    const updatedWorkouts = [...editingSplit.workouts];
    updatedWorkouts[index] = {
      ...updatedWorkouts[index],
      name,
    };
    setEditingSplit({
      ...editingSplit,
      workouts: updatedWorkouts,
    });
  };

  const removeWorkout = (index: number) => {
    if (!editingSplit) return;
    setEditingSplit({
      ...editingSplit,
      workouts: editingSplit.workouts.filter((_, i) => i !== index),
    });
  }; // Mobile list item component
  const SplitListItem = ({ split }: { split: WorkoutSplitDTO }) => (
    <div className="block sm:hidden">
      <Card className="mb-4" onClick={() => setSelectedSplit(split)}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">{split.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1">
                {split.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge
                  variant={split.id === activeSplitId ? "default" : "outline"}
                  className="mt-1"
                >
                  {split.id === activeSplitId ? "Active" : "Inactive"}
                </Badge>
                <span className="text-sm text-gray-500">
                  {split.workouts.length} workouts
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading splits...</p>
        </div>
      </div>
    );
  }

  // Main return
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Active Split Section */}
      <Card className="mb-8">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Split</CardTitle>
              <CardDescription>
                Currently selected workout split
              </CardDescription>
            </div>
            {activeSplit && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {activeSplit.workouts.length} workouts
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activeSplit ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{activeSplit.name}</h3>
                  <p className="text-sm text-gray-500">
                    {activeSplit.description || "No description"}
                  </p>
                </div>
                <Badge variant="secondary" className="w-fit sm:hidden">
                  {activeSplit.workouts.length} workouts
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeSplit.workouts.map((workout) => (
                  <Card
                    key={workout.name + workout.exercises.length + workout.id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium line-clamp-1">
                            {workout.name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {workout.exercises.length} exercises
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No active split selected
            </div>
          )}
        </CardContent>
      </Card>
      {/* All Splits Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Splits</CardTitle>
          <CardDescription>
            Select a split to view details or set as active
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile View */}
          {splits.map((split) => (
            <SplitListItem key={split.id} split={split} />
          ))}

          {/* Desktop View */}
          <div className="hidden sm:block">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[300px]">Description</TableHead>
                    <TableHead className="w-[100px]">Workouts</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {splits.map((split) => (
                    <TableRow key={split.id}>
                      <TableCell className="font-medium">
                        {split.name}
                      </TableCell>
                      <TableCell>
                        <span className="line-clamp-1">
                          {split.description || "—"}
                        </span>
                      </TableCell>
                      <TableCell>{split.workouts.length}</TableCell>
                      <TableCell>
                        {split.name === activeSplitId ? (
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
                            onClick={() => handleSetActiveSplit(split.id)}
                            disabled={split.name === activeSplitId}
                          >
                            Set Active
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSplit(split)}
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

      {/* Split Details Dialog */}
      <Dialog
        open={!!selectedSplit}
        onOpenChange={(open) => !open && setSelectedSplit(null)}
      >
        <DialogContent className="h-screen sm:h-auto max-w-full sm:max-w-2xl p-4">
          <DialogHeader className="sm:p-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
              <div>
                <DialogTitle>{selectedSplit?.name}</DialogTitle>
                <DialogDescription>
                  {selectedSplit?.description || "No description"}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (selectedSplit) handleEditSplit(selectedSplit);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    if (selectedSplit) {
                      handleDeleteSplit(selectedSplit.id);
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
              {selectedSplit?.workouts.map((workout) => (
                <Card key={workout.id}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{workout.name}</span>
                        </div>
                        <Badge variant="secondary">
                          {workout.exercises.length} exercises
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          {selectedSplit?.id !== activeSplitId && (
            <div className="flex justify-end border-t p-6 sm:p-0 sm:pt-4 mt-4">
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  if (selectedSplit) {
                    handleSetActiveSplit(selectedSplit.id);
                    setSelectedSplit(null);
                  }
                }}
              >
                Set as Active Split
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Split Dialog */}
      <Dialog
        open={!!editingSplit}
        onOpenChange={(open) => !open && setEditingSplit(null)}
      >
        <DialogContent className="h-screen sm:h-auto max-w-full sm:max-w-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Edit Split</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[75vh]">
            <ScrollArea className="flex-grow pr-4">
              <div className="space-y-4 pb-2">
                <div>
                  <Label htmlFor="name">Split Name</Label>
                  <Input
                    id="name"
                    value={editingSplit?.name || ""}
                    onChange={(e) =>
                      setEditingSplit((prev) =>
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
                    value={editingSplit?.description || ""}
                    onChange={(e) =>
                      setEditingSplit((prev) =>
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
                    <Label>Workouts</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addWorkout}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Workout
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {editingSplit?.workouts.map((workout, workoutIndex) => (
                      <Card key={workoutIndex}>
                        <CardContent className="pt-6 relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4"
                            onClick={() => removeWorkout(workoutIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="space-y-6">
                            <div>
                              <Label>Workout Name</Label>
                              <Input
                                value={workout.name}
                                onChange={(e) =>
                                  updateWorkout(workoutIndex, e.target.value)
                                }
                                className="mt-1.5"
                              />
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label>Exercises</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addExercise(workoutIndex)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Exercise
                                </Button>
                              </div>

                              <div className="space-y-4">
                                {workout.exercises.map(
                                  (exercise, exerciseIndex) => (
                                    <Card
                                      key={exerciseIndex}
                                      className="border-dashed"
                                    >
                                      <CardContent className="pt-6 relative">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="absolute right-2 top-2"
                                          onClick={() =>
                                            removeExercise(
                                              workoutIndex,
                                              exerciseIndex
                                            )
                                          }
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>

                                        <div className="space-y-4">
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                              <Label>Exercise Name</Label>
                                              <Input
                                                value={exercise.name}
                                                onChange={(e) =>
                                                  updateExercise(
                                                    workoutIndex,
                                                    exerciseIndex,
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
                                                ) =>
                                                  updateExercise(
                                                    workoutIndex,
                                                    exerciseIndex,
                                                    "type",
                                                    value
                                                  )
                                                }
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
                                                      workoutIndex,
                                                      exerciseIndex,
                                                      "sets",
                                                      e.target.value === ""
                                                        ? undefined
                                                        : parseInt(
                                                            e.target.value
                                                          )
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
                                                      workoutIndex,
                                                      exerciseIndex,
                                                      "reps",
                                                      e.target.value === ""
                                                        ? undefined
                                                        : parseInt(
                                                            e.target.value
                                                          )
                                                    )
                                                  }
                                                  className="mt-1.5"
                                                />
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                              <div>
                                                <Label>
                                                  Duration (minutes)
                                                </Label>
                                                <Input
                                                  type="number"
                                                  min="1"
                                                  value={
                                                    exercise.duration || ""
                                                  }
                                                  onChange={(e) =>
                                                    updateExercise(
                                                      workoutIndex,
                                                      exerciseIndex,
                                                      "duration",
                                                      e.target.value === ""
                                                        ? undefined
                                                        : parseInt(
                                                            e.target.value
                                                          )
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
                                                  value={
                                                    exercise.distance || ""
                                                  }
                                                  onChange={(e) =>
                                                    updateExercise(
                                                      workoutIndex,
                                                      exerciseIndex,
                                                      "distance",
                                                      e.target.value === ""
                                                        ? undefined
                                                        : parseFloat(
                                                            e.target.value
                                                          )
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
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 border-t pt-4 mt-4">
              <Button variant="outline" onClick={() => setEditingSplit(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSplit}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default WorkoutSplitPage;
