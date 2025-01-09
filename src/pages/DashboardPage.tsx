import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Loader2,
  Timer,
} from "lucide-react";
import { WorkoutRecordDTO } from "@/type";
import { useToast } from "@/hooks/use-toast";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO,
  startOfDay,
} from "date-fns";
import { workoutManagerClient } from "@/api/WorkoutManagerApi";

// the constants DAYS, DAYS_FULL, and COLOR_PALETTE are used to generate the calendar days and colors for the workout types.
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const COLOR_PALETTE = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

//The createDate function is used to create a Date object from a string or Date object.
const createDate = (dateString: string | Date) => {
  return startOfDay(
    typeof dateString === "string" ? parseISO(dateString) : dateString
  );
};

//The WorkoutCalendar component displays a calendar of workout records.
//It fetches the workout records from the API and displays them in a calendar format.
//The calendar days are generated dynamically based on the current date and the workout records.
//The workout records are color-coded based on the workout type.
//The user can click on a day to view the workouts for that day.
//The user can click on a workout to view the details of the workout.

const WorkoutCalendar = () => {
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedWorkout, setSelectedWorkout] =
    useState<WorkoutRecordDTO | null>(null);
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecordDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch workout records
  useEffect(() => {
    const fetchWorkoutRecords = async () => {
      try {
        setLoading(true);
        const response = await workoutManagerClient.getAllUserWorkouts();
        if (response.success) {
          setWorkoutRecords(
            response.data.map((record) => ({
              ...record,
              date: createDate(record.date),
            }))
          );
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch workout records",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutRecords();
  }, [toast]);

  // Generate dynamic color mapping for workout types
  const workoutColors = useMemo(() => {
    const uniqueWorkoutIds = [
      ...new Set(workoutRecords.map((record) => record.id)),
    ];
    return uniqueWorkoutIds.reduce((acc, workoutId, index) => {
      acc[workoutId] = COLOR_PALETTE[index % COLOR_PALETTE.length];
      return acc;
    }, {} as Record<string, string>);
  }, [workoutRecords]);

  // Get workouts for a specific date
  const getWorkoutsForDate = (date: Date) => {
    const normalizedDate = startOfDay(date);
    return workoutRecords.filter((workout) =>
      isSameDay(createDate(workout.date), normalizedDate)
    );
  };

  // Navigation handlers
  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startingDayOfWeek = monthStart.getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="min-h-[4rem] md:h-24 border border-gray-200 p-1"
        />
      );
    }

    // Add cells for each day of the month
    daysInMonth.forEach((date) => {
      const normalizedDate = startOfDay(date);
      const workouts = getWorkoutsForDate(normalizedDate);
      const isCurrentDay = isToday(normalizedDate);
      const isSelected = isSameDay(selectedDate, normalizedDate);

      days.push(
        <div
          key={date.toString()}
          onClick={() => setSelectedDate(normalizedDate)}
          className={`min-h-[4rem] md:h-24 border border-gray-200 p-1 cursor-pointer transition-colors relative
            ${isSelected ? "bg-gray-100" : "hover:bg-gray-50"}
            ${isCurrentDay ? "border-blue-500 border-2" : ""}`}
        >
          <div className="font-medium text-xs md:text-sm mb-1">
            {format(date, "d")}
          </div>
          <div className="space-y-0.5 md:space-y-1">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWorkout(workout);
                }}
                className={`${workoutColors[workout.id] || "bg-gray-500"} 
    text-white text-xs p-0.5 md:p-1 rounded cursor-pointer truncate hover:opacity-90`}
              >
                <span className="hidden md:inline">{workout.workoutName}</span>
                <span className="md:hidden">
                  {workout.workoutName.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    });

    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading workout history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-4 py-2 md:py-4">
      <Card className="p-2 md:p-6">
        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 md:mb-6">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <h2 className="text-xl md:text-2xl font-bold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={previousMonth}
                className="p-1 md:p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 md:p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>

          {/* Only show legend if there are workouts */}
          {workoutRecords.length > 0 && (
            <ScrollArea className="w-full sm:w-auto">
              <div className="flex gap-3 px-1 pb-2 sm:pb-0">
                {Object.entries(workoutColors).map(([workoutId, color]) => {
                  // Find a workout record with this ID to get the name
                  const workoutRecord = workoutRecords.find(
                    (r) => r.id === workoutId
                  );
                  return workoutRecord ? (
                    <div
                      key={workoutId}
                      className="flex items-center gap-2 flex-shrink-0"
                    >
                      <div
                        className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${color}`}
                      />
                      <span className="text-xs md:text-sm whitespace-nowrap">
                        {workoutRecord.workoutName}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-0">
          {DAYS_FULL.map((day, index) => (
            <div
              key={`day-header-${index}`}
              className="h-8 md:h-12 flex items-center justify-center font-medium border border-gray-200"
            >
              <span className="md:hidden">{DAYS[index]}</span>
              <span className="hidden md:inline">{day}</span>
            </div>
          ))}
          {generateCalendarDays()}
        </div>

        {/* Selected date workouts */}
        {getWorkoutsForDate(selectedDate).length > 0 && (
          <div className="mt-4 md:mt-6">
            <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3">
              Workouts for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <div className="space-y-2">
              {getWorkoutsForDate(selectedDate).map((workout) => (
                <Card
                  key={workout.id}
                  className="p-3 md:p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedWorkout(workout)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full 
                          ${workoutColors[workout.id] || "bg-gray-500"}`}
                      />
                      <span className="font-medium text-sm md:text-base">
                        {workout.workoutName}
                      </span>
                    </div>
                    <Badge className="text-xs md:text-sm">
                      {workout.exercises.length} exercises
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Workout Details Dialog */}
      <Dialog
        open={!!selectedWorkout}
        onOpenChange={(open) => !open && setSelectedWorkout(null)}
      >
        <DialogContent className="max-w-2xl mx-2">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full 
                  ${
                    selectedWorkout
                      ? workoutColors[selectedWorkout.id] || "bg-gray-500"
                      : ""
                  }`}
              />
              <DialogTitle className="text-base md:text-lg">
                {selectedWorkout?.workoutName} on{" "}
                {selectedWorkout &&
                  format(createDate(selectedWorkout.date), "MMMM d, yyyy")}
              </DialogTitle>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3 md:space-y-4 pr-4">
              {selectedWorkout?.exercises.map((exercise, index) => (
                <Card key={`${exercise.name}-${index}`} className="p-3 md:p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {exercise.type === "strength" ? (
                          <Dumbbell className="h-4 w-4" />
                        ) : (
                          <Timer className="h-4 w-4" />
                        )}
                        <span className="font-medium text-sm md:text-base">
                          {exercise.name}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-xs md:text-sm">
                        {exercise.type}
                      </Badge>
                    </div>
                    {exercise.type === "strength" ? (
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {exercise.bestWeight}kg × {exercise.bestReps} reps
                      </div>
                    ) : (
                      <div className="text-xs md:text-sm text-muted-foreground">
                        {exercise.duration} minutes • {exercise.distance} km
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkoutCalendar;
