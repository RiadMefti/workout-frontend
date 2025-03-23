import { FC, useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  Plus,
  X,
  Loader2,
  Search,
  Dumbbell,
  ChevronDown,
  PersonStanding,
  Zap,
} from "lucide-react";
import { Exercise, WorkoutDTO } from "@/type";
import { useToast } from "@/hooks/use-toast";
import { splitClient } from "@/api/WorkoutApi";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import exercise database
import {
  exerciseDatabase,
  ExerciseCategory,
  MuscleGroup,
  Equipment,
} from "@/lib/exercices";

type ExerciseField = keyof Exercise;

interface DbExercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
}

// Day colors for variety in UI
const DAY_COLORS = [
  "blue", // blue-500
  "purple", // purple-500
  "green", // green-500
  "orange", // orange-500
  "red", // red-500
  "cyan", // cyan-500
  "amber", // amber-500
];

const SplitCreationPage: FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [splitName, setSplitName] = useState("");
  const [description, setDescription] = useState("");
  const [workouts, setWorkouts] = useState<WorkoutDTO[]>([]); // Manages multiple workouts
  const [loading, setLoading] = useState(false);

  // Exercise selection state
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState<
    number | null
  >(null);
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<
    number | null
  >(null);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ExerciseCategory | "all"
  >("all");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<
    MuscleGroup | "all"
  >("all");
  const [filteredExercises, setFilteredExercises] =
    useState<DbExercise[]>(exerciseDatabase);

  // Drawer state for mobile optimization
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filter exercises based on search and selections
  useEffect(() => {
    let results = [...exerciseDatabase];

    // Filter by search query
    if (exerciseSearchQuery) {
      const query = exerciseSearchQuery.toLowerCase();
      results = results.filter(
        (ex) =>
          ex.name.toLowerCase().includes(query) ||
          ex.muscleGroup.toLowerCase().includes(query) ||
          ex.equipment.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter((ex) => ex.category === selectedCategory);
    }

    // Filter by muscle group
    if (selectedMuscleGroup !== "all") {
      results = results.filter((ex) => ex.muscleGroup === selectedMuscleGroup);
    }

    setFilteredExercises(results);
  }, [exerciseSearchQuery, selectedCategory, selectedMuscleGroup]);

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

  const selectExerciseFromDb = (dbExercise: DbExercise) => {
    if (selectedWorkoutIndex === null || selectedExerciseIndex === null) return;

    const updatedWorkouts = [...workouts];
    const exerciseType = dbExercise.category.toLowerCase() as
      | "strength"
      | "cardio";

    updatedWorkouts[selectedWorkoutIndex].exercises[selectedExerciseIndex] = {
      ...updatedWorkouts[selectedWorkoutIndex].exercises[selectedExerciseIndex],
      name: dbExercise.name,
      type: exerciseType,
      // Reset fields that may no longer apply with the type change
      sets:
        exerciseType === "strength"
          ? updatedWorkouts[selectedWorkoutIndex].exercises[
              selectedExerciseIndex
            ].sets
          : undefined,
      reps:
        exerciseType === "strength"
          ? updatedWorkouts[selectedWorkoutIndex].exercises[
              selectedExerciseIndex
            ].reps
          : undefined,
      duration:
        exerciseType === "cardio"
          ? updatedWorkouts[selectedWorkoutIndex].exercises[
              selectedExerciseIndex
            ].duration
          : undefined,
      distance:
        exerciseType === "cardio"
          ? updatedWorkouts[selectedWorkoutIndex].exercises[
              selectedExerciseIndex
            ].distance
          : undefined,
    };

    setWorkouts(updatedWorkouts);

    // Reset search state and close drawer
    setExerciseSearchQuery("");
    setIsDrawerOpen(false);
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

  const isFormComplete = (): boolean => {
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

  const getEquipmentIcon = (equipment: Equipment): JSX.Element => {
    switch (equipment) {
      case Equipment.Barbell:
        return <Dumbbell className="h-4 w-4" />;
      case Equipment.Dumbbell:
        return <Dumbbell className="h-4 w-4" />;
      case Equipment.Kettlebell:
        return <Dumbbell className="h-4 w-4" />;
      case Equipment.BodyWeight:
        return <PersonStanding className="h-4 w-4" />;
      case Equipment.Cardio:
        return <Zap className="h-4 w-4" />;
      default:
        return <Dumbbell className="h-4 w-4" />;
    }
  };

  // Group exercises by muscle group for easier selection
  const exercisesByMuscleGroup = Object.values(MuscleGroup).reduce(
    (acc, muscleGroup) => {
      acc[muscleGroup] = filteredExercises.filter(
        (ex) => ex.muscleGroup === muscleGroup
      );
      return acc;
    },
    {} as Record<string, DbExercise[]>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/40 dark:to-gray-950/40 rounded-t-lg">
          <CardTitle className="text-2xl font-bold">Create New Split</CardTitle>
          <CardDescription>
            Design your custom workout split routine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="splitName" className="text-base font-medium">
                Split Name
              </Label>
              <Input
                id="splitName"
                placeholder="Enter split name (e.g., Push Pull Legs, Upper/Lower, etc.)"
                value={splitName}
                onChange={(e) => setSplitName(e.target.value)}
                disabled={loading}
                className="focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your split and goals (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="min-h-20 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Workouts</Label>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleAddWorkout}
                  disabled={loading}
                  size="sm"
                >
                  <Plus className="sm:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add Workout Day</span>
                </Button>
              </div>

              {workouts.length === 0 && (
                <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 p-8">
                  <div className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-3">
                      <Dumbbell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="font-medium">No workouts added yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Start building your split by adding workout days.
                    </p>
                    <Button
                      onClick={handleAddWorkout}
                      variant="outline"
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Workout
                    </Button>
                  </div>
                </Card>
              )}

              <Accordion type="multiple" className="space-y-4">
                {workouts.map((workout, workoutIndex) => (
                  <AccordionItem
                    key={workoutIndex}
                    value={workoutIndex.toString()}
                    className={`relative border-l-4 ${
                      DAY_COLORS[workoutIndex % DAY_COLORS.length] === "blue"
                        ? "border-l-blue-500"
                        : DAY_COLORS[workoutIndex % DAY_COLORS.length] ===
                          "purple"
                        ? "border-l-purple-500"
                        : DAY_COLORS[workoutIndex % DAY_COLORS.length] ===
                          "green"
                        ? "border-l-green-500"
                        : DAY_COLORS[workoutIndex % DAY_COLORS.length] ===
                          "orange"
                        ? "border-l-orange-500"
                        : DAY_COLORS[workoutIndex % DAY_COLORS.length] === "red"
                        ? "border-l-red-500"
                        : DAY_COLORS[workoutIndex % DAY_COLORS.length] ===
                          "cyan"
                        ? "border-l-cyan-500"
                        : "border-l-amber-500"
                    } shadow-md`}
                  >
                    <div className="flex items-center justify-between">
                      <AccordionTrigger className="flex-1 px-4 py-3">
                        <div className="flex-1 text-left font-medium">
                          {workout.name || "Workout Day"}
                        </div>
                      </AccordionTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveWorkout(workoutIndex);
                        }}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <AccordionContent>
                      <div className="px-4 pb-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-base font-medium">
                              Day Name
                            </Label>
                            <Input
                              placeholder="E.g., Push Day, Leg Day, Upper Body, etc."
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
                              className={`focus-visible:ring-${
                                DAY_COLORS[workoutIndex % DAY_COLORS.length]
                              }-500`}
                            />
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <Label className="text-base font-medium">
                              Exercises
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddExercise(workoutIndex)}
                              disabled={loading}
                              className={
                                DAY_COLORS[workoutIndex % DAY_COLORS.length] ===
                                "blue"
                                  ? "border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                                  : DAY_COLORS[
                                      workoutIndex % DAY_COLORS.length
                                    ] === "purple"
                                  ? "border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/30"
                                  : DAY_COLORS[
                                      workoutIndex % DAY_COLORS.length
                                    ] === "green"
                                  ? "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/30"
                                  : DAY_COLORS[
                                      workoutIndex % DAY_COLORS.length
                                    ] === "orange"
                                  ? "border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/30"
                                  : DAY_COLORS[
                                      workoutIndex % DAY_COLORS.length
                                    ] === "red"
                                  ? "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                                  : DAY_COLORS[
                                      workoutIndex % DAY_COLORS.length
                                    ] === "cyan"
                                  ? "border-cyan-300 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-800 dark:text-cyan-400 dark:hover:bg-cyan-950/30"
                                  : "border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
                              }
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              <span className="hidden sm:inline">
                                Add Exercise
                              </span>
                              <span className="sm:hidden">Add</span>
                            </Button>
                          </div>

                          {workout.exercises.length === 0 && (
                            <div className="rounded-md bg-gray-50 dark:bg-gray-900 p-4 text-center text-sm text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700">
                              No exercises added yet. Add your first exercise to
                              this workout.
                            </div>
                          )}

                          {workout.exercises.map((exercise, exerciseIndex) => (
                            <Card
                              key={exerciseIndex}
                              className="mt-4 overflow-hidden border-gray-200 dark:border-gray-800 shadow-sm"
                            >
                              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={
                                      exercise.type === "strength"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {exercise.type === "strength"
                                      ? "Strength"
                                      : "Cardio"}
                                  </Badge>
                                  <span className="text-sm font-medium">
                                    {exercise.name
                                      ? exercise.name
                                      : "New Exercise"}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                  onClick={() =>
                                    handleRemoveExercise(
                                      workoutIndex,
                                      exerciseIndex
                                    )
                                  }
                                  disabled={loading}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                              <CardContent className="pt-4 pb-4">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm">Exercise</Label>
                                    <div className="relative">
                                      <Drawer
                                        open={
                                          isDrawerOpen &&
                                          selectedWorkoutIndex ===
                                            workoutIndex &&
                                          selectedExerciseIndex ===
                                            exerciseIndex
                                        }
                                        onOpenChange={setIsDrawerOpen}
                                      >
                                        <DrawerTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="w-full justify-between font-normal"
                                            onClick={() => {
                                              setSelectedWorkoutIndex(
                                                workoutIndex
                                              );
                                              setSelectedExerciseIndex(
                                                exerciseIndex
                                              );
                                            }}
                                          >
                                            {exercise.name ||
                                              "Select an exercise"}
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                          </Button>
                                        </DrawerTrigger>
                                        <DrawerContent className="h-[85vh] sm:h-[80vh]">
                                          <DrawerHeader className="border-b">
                                            <DrawerTitle>
                                              Select Exercise
                                            </DrawerTitle>
                                            <DrawerDescription>
                                              Browse or search for exercises
                                            </DrawerDescription>
                                          </DrawerHeader>

                                          <div className="px-4 py-3 border-b sticky top-0 bg-white dark:bg-gray-950 z-10">
                                            <div className="relative">
                                              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                              <Input
                                                placeholder="Search exercises..."
                                                className="pl-10"
                                                value={exerciseSearchQuery}
                                                onChange={(e) =>
                                                  setExerciseSearchQuery(
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-4">
                                              <div className="space-y-1 pr-4">
                                                <Label className="text-xs">
                                                  Category
                                                </Label>
                                                <Select
                                                  value={selectedCategory}
                                                  onValueChange={(
                                                    value:
                                                      | "all"
                                                      | ExerciseCategory
                                                  ) =>
                                                    setSelectedCategory(value)
                                                  }
                                                >
                                                  <SelectTrigger className="w-[130px]">
                                                    <SelectValue placeholder="Category" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="all">
                                                      All Categories
                                                    </SelectItem>
                                                    <SelectItem
                                                      value={
                                                        ExerciseCategory.Strength
                                                      }
                                                    >
                                                      Strength
                                                    </SelectItem>
                                                    <SelectItem
                                                      value={
                                                        ExerciseCategory.Cardio
                                                      }
                                                    >
                                                      Cardio
                                                    </SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>

                                              <div className="space-y-1">
                                                <Label className="text-xs">
                                                  Muscle Group
                                                </Label>
                                                <Select
                                                  value={selectedMuscleGroup}
                                                  onValueChange={(
                                                    value: "all" | MuscleGroup
                                                  ) =>
                                                    setSelectedMuscleGroup(
                                                      value
                                                    )
                                                  }
                                                >
                                                  <SelectTrigger className="w-[150px]">
                                                    <SelectValue placeholder="Muscle Group" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="all">
                                                      All Muscle Groups
                                                    </SelectItem>
                                                    {Object.values(
                                                      MuscleGroup
                                                    ).map((group) => (
                                                      <SelectItem
                                                        key={group}
                                                        value={group}
                                                      >
                                                        {group}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="overflow-auto px-4 py-2 pb-safe-area-bottom">
                                            {filteredExercises.length === 0 ? (
                                              <div className="text-center py-8">
                                                <p className="text-gray-500">
                                                  No exercises found. Try
                                                  adjusting your search.
                                                </p>
                                              </div>
                                            ) : (
                                              <div className="space-y-2">
                                                <Accordion
                                                  type="single"
                                                  collapsible
                                                  className="w-full"
                                                  defaultValue={
                                                    selectedMuscleGroup !==
                                                    "all"
                                                      ? selectedMuscleGroup
                                                      : undefined
                                                  }
                                                >
                                                  {Object.entries(
                                                    exercisesByMuscleGroup
                                                  )
                                                    .filter(
                                                      ([exercises]) =>
                                                        exercises.length > 0
                                                    )
                                                    .map(
                                                      ([
                                                        muscleGroup,
                                                        exercises,
                                                      ]) => (
                                                        <AccordionItem
                                                          key={muscleGroup}
                                                          value={muscleGroup}
                                                        >
                                                          <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-900 px-3 py-2 rounded-md">
                                                            <div className="flex items-center space-x-2">
                                                              <span>
                                                                {muscleGroup}
                                                              </span>
                                                              <Badge
                                                                variant="outline"
                                                                className="ml-2"
                                                              >
                                                                {
                                                                  exercises.length
                                                                }
                                                              </Badge>
                                                            </div>
                                                          </AccordionTrigger>
                                                          <AccordionContent>
                                                            <div className="grid grid-cols-1 gap-2 pl-2">
                                                              {exercises.map(
                                                                (ex) => (
                                                                  <Button
                                                                    key={ex.id}
                                                                    variant="ghost"
                                                                    className="justify-start px-3 h-auto py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                                                                    onClick={() =>
                                                                      selectExerciseFromDb(
                                                                        ex
                                                                      )
                                                                    }
                                                                  >
                                                                    <div className="mr-3">
                                                                      {getEquipmentIcon(
                                                                        ex.equipment
                                                                      )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                      <p className="font-medium text-sm">
                                                                        {
                                                                          ex.name
                                                                        }
                                                                      </p>
                                                                      <div className="flex items-center mt-1">
                                                                        <Badge
                                                                          variant="outline"
                                                                          className="mr-2 text-xs"
                                                                        >
                                                                          {
                                                                            ex.equipment
                                                                          }
                                                                        </Badge>
                                                                        <Badge
                                                                          variant={
                                                                            ex.category ===
                                                                            ExerciseCategory.Strength
                                                                              ? "default"
                                                                              : "secondary"
                                                                          }
                                                                          className="text-xs"
                                                                        >
                                                                          {
                                                                            ex.category
                                                                          }
                                                                        </Badge>
                                                                      </div>
                                                                    </div>
                                                                  </Button>
                                                                )
                                                              )}
                                                            </div>
                                                          </AccordionContent>
                                                        </AccordionItem>
                                                      )
                                                    )}
                                                </Accordion>
                                              </div>
                                            )}
                                          </div>

                                          <DrawerFooter className="border-t">
                                            <DrawerClose asChild>
                                              <Button variant="outline">
                                                Cancel
                                              </Button>
                                            </DrawerClose>
                                          </DrawerFooter>
                                        </DrawerContent>
                                      </Drawer>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm">Type</Label>
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
                                        <Label className="text-sm">Sets</Label>
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
                                          min={1}
                                          placeholder="e.g., 3"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm">Reps</Label>
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
                                          min={1}
                                          placeholder="e.g., 10"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {exercise.type === "cardio" && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-sm">
                                          Duration (mins)
                                        </Label>
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
                                          min={1}
                                          step="0.1"
                                          placeholder="e.g., 30"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm">
                                          Distance (km)
                                        </Label>
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
                                          min={0.1}
                                          step="0.1"
                                          placeholder="e.g., 5"
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
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 py-4 border-t bg-gray-50 dark:bg-gray-900">
          <Button
            onClick={handleSubmit}
            className="w-full  text-base"
            disabled={loading || !isFormComplete()}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Creating Split...
              </>
            ) : (
              "Create Workout Split"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SplitCreationPage;
