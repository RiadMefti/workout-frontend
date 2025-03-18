import { useEffect, useState, useMemo } from "react";
import { workoutManagerClient } from "@/api/WorkoutManagerApi";
import { WorkoutRecordDTO } from "@/type";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  format,
  parseISO,
  subMonths,
  startOfDay,
  differenceInDays,
  isBefore,
  startOfWeek,
  eachWeekOfInterval,
  addWeeks,
  isWithinInterval,
} from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  TrendingUp,
  Calendar,
  Dumbbell,
  Activity,
  Trophy,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define proper types for the charts and data
type TimeRangeOption = "1" | "3" | "6" | "12" | "0";

interface SummaryMetrics {
  totalWorkouts: number;
  totalExercises: number;
  avgExercisesPerWorkout: number;
  weeklyAverage: number;
  strengthExercises: number;
  cardioExercises: number;
  totalWeight: number;
}

interface WeeklyVolumeData {
  week: string;
  weekLabel: string;
  volume: number;
  workouts: number;
}

interface ExerciseTypeData {
  name: string;
  value: number;
  color: string;
}

interface WorkoutDistributionData {
  name: string;
  value: number;
}

interface PersonalRecord {
  name: string;
  weight: number;
  reps: number;
  date: Date;
  estimatedOneRepMax: number;
}

interface ExerciseProgressData {
  date: Date;
  weight: number;
  reps: number;
  estimated1RM: number;
}

// Chart color palette - enhanced with more distinct colors
const COLORS = [
  "#4f46e5", // indigo
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#14b8a6", // teal
  "#f97316", // orange
];

// Custom tooltip formatter for recharts
const customTooltipFormatter = (
  value: number,
  name: string,
  unit: string
): [string, string] => {
  if (name === "weight" || name === "estimated1RM" || name === "volume") {
    return [
      `${value.toLocaleString()} ${unit}`,
      name === "weight"
        ? "Weight"
        : name === "estimated1RM"
        ? "Est. 1RM"
        : "Volume",
    ];
  }
  return [value.toString(), name];
};

const StatsPage = () => {
  const [workouts, setWorkouts] = useState<WorkoutRecordDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<TimeRangeOption>("6"); // Default to 6 months
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const { toast } = useToast();

  // Normalize dates to start of day
  const normalizeDate = (date: Date | string): Date =>
    startOfDay(typeof date === "string" ? parseISO(date) : date);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await workoutManagerClient.getAllUserWorkouts();
        if (response.success) {
          // Sort workouts by date and normalize dates
          const sortedWorkouts = response.data
            .map((workout) => ({
              ...workout,
              date: normalizeDate(workout.date),
            }))
            .sort((a, b) => a.date.getTime() - b.date.getTime());
          setWorkouts(sortedWorkouts);
        } else {
          throw new Error(response.error || "Failed to fetch workout data");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading statistics",
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter workouts based on selected time range
  const filteredWorkouts = useMemo(() => {
    if (!timeRange || timeRange === "0") return workouts;

    const cutoffDate = subMonths(new Date(), parseInt(timeRange));
    return workouts.filter(
      (workout) =>
        workout.date instanceof Date && isBefore(cutoffDate, workout.date)
    );
  }, [workouts, timeRange]);

  // Calculate summary metrics
  const summaryMetrics = useMemo<SummaryMetrics>(() => {
    if (filteredWorkouts.length === 0)
      return {
        totalWorkouts: 0,
        totalExercises: 0,
        avgExercisesPerWorkout: 0,
        weeklyAverage: 0,
        strengthExercises: 0,
        cardioExercises: 0,
        totalWeight: 0,
      };

    // Calculate total exercises
    const totalExercises = filteredWorkouts.reduce(
      (sum, workout) => sum + workout.exercises.length,
      0
    );

    // Count exercise types
    let strengthCount = 0;
    let cardioCount = 0;
    let totalWeight = 0;

    filteredWorkouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        if (exercise.type === "strength") {
          strengthCount++;
          if (exercise.bestWeight && exercise.bestReps) {
            totalWeight += exercise.bestWeight * exercise.bestReps;
          }
        } else {
          cardioCount++;
        }
      });
    });

    // Calculate weekly workout average
    const firstWorkoutDate = filteredWorkouts[0]?.date;
    const lastWorkoutDate = filteredWorkouts[filteredWorkouts.length - 1]?.date;
    let weeklyAverage = 0;

    if (firstWorkoutDate && lastWorkoutDate) {
      const daysDiff = differenceInDays(lastWorkoutDate, firstWorkoutDate) || 1;
      const weeksDiff = Math.max(1, daysDiff / 7);
      weeklyAverage = +(filteredWorkouts.length / weeksDiff).toFixed(1);
    }

    return {
      totalWorkouts: filteredWorkouts.length,
      totalExercises,
      avgExercisesPerWorkout:
        +(totalExercises / filteredWorkouts.length).toFixed(1) || 0,
      weeklyAverage,
      strengthExercises: strengthCount,
      cardioExercises: cardioCount,
      totalWeight,
    };
  }, [filteredWorkouts]);

  // Extract all unique exercises
  const exercises = useMemo<string[]>(() => {
    const exerciseSet = new Set<string>();
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exerciseSet.add(exercise.name);
      });
    });
    return Array.from(exerciseSet).sort();
  }, [workouts]);

  // Calculate weekly volume data with improved week labeling
  const weeklyVolumeData = useMemo<WeeklyVolumeData[]>(() => {
    if (filteredWorkouts.length === 0) return [];

    // Find the date range
    const dates = filteredWorkouts.map((w) => w.date);
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Create all weeks in the range
    const weeks = eachWeekOfInterval({
      start: startOfWeek(minDate),
      end: addWeeks(startOfWeek(maxDate), 1),
    });

    // Initialize volume data for each week
    const volumeByWeek: Record<
      string,
      { volume: number; workouts: number; weekLabel: string }
    > = {};

    weeks.forEach((weekStart) => {
      const weekEnd = addWeeks(weekStart, 1);
      const weekKey = format(weekStart, "yyyy-ww");
      volumeByWeek[weekKey] = {
        volume: 0,
        workouts: 0,
        weekLabel: format(weekStart, "MMM d"),
      };

      // Find workouts in this week
      filteredWorkouts.forEach((workout) => {
        if (
          isWithinInterval(workout.date, { start: weekStart, end: weekEnd })
        ) {
          // Add workouts count
          volumeByWeek[weekKey].workouts += 1;

          // Calculate volume for strength exercises
          workout.exercises.forEach((exercise) => {
            if (
              exercise.type === "strength" &&
              exercise.bestWeight &&
              exercise.bestReps
            ) {
              // Convert kg to lbs
              volumeByWeek[weekKey].volume +=
                exercise.bestWeight * exercise.bestReps;
            }
          });
        }
      });
    });

    return Object.entries(volumeByWeek)
      .map(([week, data]) => ({
        week,
        weekLabel: data.weekLabel,
        volume: Math.round(data.volume),
        workouts: data.workouts,
      }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }, [filteredWorkouts]);

  // Exercise distribution data with colors
  const exerciseTypeData = useMemo<ExerciseTypeData[]>(
    () => [
      {
        name: "Strength",
        value: summaryMetrics.strengthExercises,
        color: COLORS[0],
      },
      {
        name: "Cardio",
        value: summaryMetrics.cardioExercises,
        color: COLORS[1],
      },
    ],
    [summaryMetrics]
  );

  // Workout distribution by type
  const workoutDistribution = useMemo<WorkoutDistributionData[]>(() => {
    const distribution: Record<string, number> = {};

    filteredWorkouts.forEach((workout) => {
      const name = workout.workoutName;
      distribution[name] = (distribution[name] || 0) + 1;
    });

    return Object.entries(distribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 workouts
  }, [filteredWorkouts]);

  // Calculate personal records with estimated 1RM
  const personalRecords = useMemo<PersonalRecord[]>(() => {
    const records: Record<
      string,
      { weight: number; reps: number; date: Date; estimatedOneRepMax: number }
    > = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        if (exercise.type === "strength" && exercise.bestWeight) {
          const oneRepMax =
            exercise.bestWeight * (1 + (exercise.bestReps || 0) / 30);
          const currentRecord = records[exercise.name];

          if (!currentRecord || oneRepMax > currentRecord.estimatedOneRepMax) {
            records[exercise.name] = {
              weight: exercise.bestWeight,
              reps: exercise.bestReps || 0,
              date: workout.date,
              estimatedOneRepMax: oneRepMax,
            };
          }
        }
      });
    });

    return Object.entries(records)
      .map(([name, record]) => ({ name, ...record }))
      .sort((a, b) => b.estimatedOneRepMax - a.estimatedOneRepMax);
  }, [workouts]);

  // Exercise progress data for selected exercise
  const exerciseProgressData = useMemo<ExerciseProgressData[]>(() => {
    if (!selectedExercise) return [];

    const progressData: ExerciseProgressData[] = [];
    const exerciseData = workouts
      .filter((workout) =>
        workout.exercises.some((e) => e.name === selectedExercise)
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    exerciseData.forEach((workout) => {
      const exercise = workout.exercises.find(
        (e) => e.name === selectedExercise
      );
      if (exercise && exercise.type === "strength" && exercise.bestWeight) {
        progressData.push({
          date: workout.date,
          weight: Math.round(exercise.bestWeight), // Convert to lbs
          reps: exercise.bestReps || 0,
          estimated1RM: Math.round(
            exercise.bestWeight * (1 + (exercise.bestReps || 0) / 30)
          ),
        });
      }
    });

    return progressData;
  }, [workouts, selectedExercise]);

  // Calculate statistics for the selected exercise
  const selectedExerciseStats = useMemo(() => {
    if (!selectedExercise || exerciseProgressData.length === 0) return null;

    const lastRecord = exerciseProgressData[exerciseProgressData.length - 1];
    const firstRecord = exerciseProgressData[0];

    const progress = {
      weight: lastRecord.weight - firstRecord.weight,
      estimated1RM: lastRecord.estimated1RM - firstRecord.estimated1RM,
      progressPercent: Math.round(
        ((lastRecord.estimated1RM - firstRecord.estimated1RM) /
          firstRecord.estimated1RM) *
          100
      ),
    };

    return {
      currentWeight: lastRecord.weight,
      currentReps: lastRecord.reps,
      current1RM: lastRecord.estimated1RM,
      progress,
    };
  }, [exerciseProgressData, selectedExercise]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p>Loading your workout statistics...</p>
        </div>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-muted/30 p-4 rounded-full mb-4">
          <Activity className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No workout data yet</h2>
        <p className="text-muted-foreground max-w-md">
          Complete your first workout to start seeing statistics and
          visualizations of your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 sm:space-y-8">
      {" "}
      {/* reduced vertical spacing on mobile */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Workout Statistics</h1>{" "}
        {/* smaller text on mobile */}
        <p className="text-sm sm:text-base text-muted-foreground">
          Track your progress and gain insights from your workout history
        </p>
      </div>
      {/* Time range filter */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-sm sm:text-base">Time period:</span>{" "}
        {/* smaller text on mobile */}
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRangeOption)}
        >
          <SelectTrigger className="w-[140px] sm:w-[180px] h-9 text-sm">
            {" "}
            {/* smaller on mobile */}
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last month</SelectItem>
            <SelectItem value="3">Last 3 months</SelectItem>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last year</SelectItem>
            <SelectItem value="0">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {" "}
        {/* 2 columns on mobile, more compact spacing */}
        <Card className="overflow-hidden">
          {" "}
          {/* prevent overflow */}
          <CardHeader className="p-3 sm:pb-2 sm:p-6">
            {" "}
            {/* smaller padding on mobile */}
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Total Workouts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            {" "}
            {/* smaller padding on mobile */}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2" />{" "}
              {/* smaller icon on mobile */}
              <span className="text-xl sm:text-2xl font-bold">
                {summaryMetrics.totalWorkouts}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="p-3 sm:pb-2 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Weekly Average
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="flex items-center">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2" />
              <span className="text-xl sm:text-2xl font-bold">
                {summaryMetrics.weeklyAverage}
              </span>
              <span className="ml-1 text-xs sm:text-sm text-muted-foreground truncate">
                workouts/week
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="p-3 sm:pb-2 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Volume Lifted
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="flex items-center">
              <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2" />
              <span className="text-xl sm:text-2xl font-bold">
                {Math.round(summaryMetrics.totalWeight).toLocaleString()}
              </span>
              <span className="ml-1 text-xs sm:text-sm text-muted-foreground">
                lbs
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="p-3 sm:pb-2 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Exercises/Workout
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2" />
              <span className="text-xl sm:text-2xl font-bold">
                {summaryMetrics.avgExercisesPerWorkout}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Tabs with various charts */}
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4 h-auto">
          <TabsTrigger value="progress" className="py-2 text-xs sm:text-sm">
            Progress
          </TabsTrigger>
          <TabsTrigger value="volume" className="py-2 text-xs sm:text-sm">
            Volume
          </TabsTrigger>
          <TabsTrigger value="distribution" className="py-2 text-xs sm:text-sm">
            Distribution
          </TabsTrigger>
          <TabsTrigger value="records" className="py-2 text-xs sm:text-sm">
            Records
          </TabsTrigger>
        </TabsList>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                Exercise Progress
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Track your progress on specific exercises over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <Select
                value={selectedExercise}
                onValueChange={setSelectedExercise}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select an exercise" />
                </SelectTrigger>
                <SelectContent>
                  {exercises.map((exercise) => (
                    <SelectItem key={exercise} value={exercise}>
                      {exercise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedExerciseStats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-3 sm:my-4">
                  <Card className="shadow-sm">
                    <CardContent className="p-3 sm:p-6 sm:pt-6">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Current Max
                        </span>
                        <div className="flex items-center mt-1">
                          <span className="text-lg sm:text-2xl font-bold">
                            {selectedExerciseStats.currentWeight} lbs
                          </span>
                          <span className="ml-1 text-xs text-muted-foreground">
                            × {selectedExerciseStats.currentReps} reps
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardContent className="p-3 sm:p-6 sm:pt-6">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Estimated 1RM
                        </span>
                        <div className="flex items-center mt-1">
                          <span className="text-lg sm:text-2xl font-bold">
                            {selectedExerciseStats.current1RM} lbs
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardContent className="p-3 sm:p-6 sm:pt-6">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Progress
                        </span>
                        <div className="flex items-center mt-1">
                          <span className="text-lg sm:text-2xl font-bold">
                            {selectedExerciseStats.progress.progressPercent > 0
                              ? "+"
                              : ""}
                            {selectedExerciseStats.progress.progressPercent}%
                          </span>
                          <ArrowUpRight
                            className={`ml-2 h-4 w-4 ${
                              selectedExerciseStats.progress.progressPercent > 0
                                ? "text-green-500"
                                : "text-red-500 transform rotate-90"
                            }`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedExercise && exerciseProgressData.length > 0 ? (
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={exerciseProgressData}
                      margin={{ top: 5, right: 15, left: 5, bottom: 5 }} // reduced margins on mobile
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date) => format(date, "MMM d")}
                        minTickGap={30}
                      />
                      <YAxis
                        yAxisId="left"
                        domain={["dataMin - 10", "dataMax + 10"]}
                        label={{
                          value: "Weight (lbs)",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, "dataMax + 2"]}
                        label={{
                          value: "Reps",
                          angle: 90,
                          position: "insideRight",
                        }}
                      />
                      <Tooltip
                        formatter={(value, name) =>
                          customTooltipFormatter(
                            Number(value),
                            String(name),
                            "lbs"
                          )
                        }
                        labelFormatter={(date) =>
                          format(date as Date, "MMMM d, yyyy")
                        }
                      />
                      <Legend wrapperStyle={{ fontSize: "10px" }} />{" "}
                      {/* smaller legend text */}
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weight"
                        name="Weight"
                        stroke={COLORS[0]}
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                        connectNulls
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="estimated1RM"
                        name="Estimated 1RM"
                        stroke={COLORS[1]}
                        strokeDasharray="3 3"
                        connectNulls
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="reps"
                        name="Reps"
                        stroke={COLORS[2]}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : selectedExercise ? (
                <div className="flex justify-center items-center h-40 sm:h-60 text-center px-4">
                  <p className="text-sm text-muted-foreground">
                    No strength data available for this exercise
                  </p>
                </div>
              ) : (
                <div className="flex justify-center items-center h-40 sm:h-60 text-center px-4">
                  <p className="text-sm text-muted-foreground">
                    Select an exercise to view progress
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volume Tab */}
        <TabsContent value="volume" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                Weekly Training Volume
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Track your total training volume and workout frequency by week
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyVolumeData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }} // reduced margins
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="weekLabel"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={Math.ceil(weeklyVolumeData.length / 10)}
                    />
                    <YAxis
                      yAxisId="left"
                      label={{
                        value: "Volume (lbs)",
                        angle: -90,
                        position: "insideLeft",
                        offset: -5,
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      label={{
                        value: "Workouts",
                        angle: 90,
                        position: "insideRight",
                        offset: 0,
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <Tooltip
                      formatter={(value, name) =>
                        name === "Volume (lbs)"
                          ? [`${Number(value).toLocaleString()} lbs`, "Volume"]
                          : [value, "Workouts "]
                      }
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      wrapperStyle={{ fontSize: "10px" }}
                    />
                    <Bar
                      yAxisId="left"
                      name="Volume (lbs)"
                      dataKey="volume"
                      fill={COLORS[0]}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      name="Workouts"
                      dataKey="workouts"
                      fill={COLORS[1]}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  Exercise Type Distribution
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Breakdown of strength vs cardio exercises
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={exerciseTypeData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {exerciseTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} exercises`, "Count"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  Most Frequent Workouts
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Your top 5 most performed workouts
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={workoutDistribution}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={true}
                        vertical={false}
                        opacity={0.2}
                      />
                      <XAxis type="number" />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        width={150}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} sessions`, "Count"]}
                      />
                      <Bar
                        dataKey="value"
                        name="Workouts"
                        fill={COLORS[3]}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Personal Records Tab */}
        <TabsContent value="records" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl">
                Personal Records
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Your best performances on strength exercises
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ScrollArea className="h-64 sm:h-80 pr-4">
                <div className="space-y-3 sm:space-y-4">
                  {personalRecords.length > 0 ? (
                    personalRecords.map((record, index) => (
                      <Card
                        key={index}
                        className="p-3 sm:p-4 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="flex flex-col justify-center items-center bg-primary/10 p-1.5 sm:p-2 rounded-md">
                              <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                              <span className="text-[10px] sm:text-xs font-semibold mt-1">
                                {index < 3
                                  ? ["1st", "2nd", "3rd"][index]
                                  : `${index + 1}th`}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-sm sm:text-base">
                                {record.name}
                              </div>
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                                <div className="flex items-center text-xs sm:text-sm">
                                  <Dumbbell className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-primary" />
                                  <span>
                                    {Math.round(record.weight)} lbs ×{" "}
                                    {record.reps} reps
                                  </span>
                                </div>
                                <div className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-primary/10 rounded-full">
                                  Est. 1RM:{" "}
                                  {Math.round(record.estimatedOneRepMax)} lbs
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex mt-1 sm:mt-0">
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 text-[10px] sm:text-xs h-6"
                            >
                              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              {format(record.date, "MMM d, yyyy")}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-sm text-muted-foreground">
                        No personal records found
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Recently Achieved Progress Section */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">
            Recent Achievements
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Celebrate your recent progress milestones
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {personalRecords
              .slice(0, 3)
              .filter((record) => {
                // Show only records from the last 30 days
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return record.date >= thirtyDaysAgo;
              })
              .map((record, index) => (
                <Card key={index} className="p-4 bg-primary/5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-amber-500">New PR</Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(record.date, "MMM d")}
                      </span>
                    </div>
                    <h3 className="font-semibold">{record.name}</h3>
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                      <span>
                        {Math.round(record.weight)} lbs × {record.reps} reps
                      </span>
                    </div>
                  </div>
                </Card>
              ))}

            {personalRecords.slice(0, 3).filter((record) => {
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return record.date >= thirtyDaysAgo;
            }).length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-6 text-center">
                <p className="text-muted-foreground">
                  No recent achievements in the last 30 days.
                </p>
                <p className="text-sm mt-1">
                  Keep pushing yourself to set new personal records!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;
