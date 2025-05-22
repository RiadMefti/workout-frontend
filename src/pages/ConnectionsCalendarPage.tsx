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
  UserPlus,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Types
import { WorkoutRecordDTO, UserDTO } from "@/type";

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

const createDate = (dateString: string | Date) =>
  startOfDay(
    typeof dateString === "string" ? parseISO(dateString) : dateString
  );

const ConnectionsCalendarPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedWorkout, setSelectedWorkout] =
    useState<WorkoutRecordDTO | null>(null);
  const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecordDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState<UserDTO[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string>("");
  const [addEmail, setAddEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  // Fetch connections list
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await workoutManagerClient.getConnections();
        if (res.success) setConnections(res.data);
        else throw new Error(res.error);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch connections",
        });
      }
    };
    fetchConnections();
  }, [toast, adding]);

  // Fetch selected connection's workouts
  useEffect(() => {
    if (!selectedConnection) return;
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const res = await workoutManagerClient.getConnectionWorkouts(
          selectedConnection
        );
        if (res.success) {
          setWorkoutRecords(
            res.data.map((record: WorkoutRecordDTO) => ({
              ...record,
              date: createDate(record.date),
            }))
          );
        } else throw new Error(res.error);
      } catch (error) {
        setWorkoutRecords([]);
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
    fetchWorkouts();
  }, [selectedConnection, toast]);

  // Add connection
  const handleAddConnection = async () => {
    if (!addEmail.trim()) return;
    setAdding(true);
    try {
      const res = await workoutManagerClient.addConnection(addEmail.trim());
      if (res.success) {
        toast({ title: "Connection added!" });
        setAddEmail("");
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add connection",
      });
    } finally {
      setAdding(false);
    }
  };

  // Color mapping by workoutName
  const workoutColors = useMemo(() => {
    const uniqueNames = Array.from(
      new Set(workoutRecords.map((r) => r.workoutName))
    ).sort();
    const mapping: Record<string, string> = {};
    uniqueNames.forEach((name, index) => {
      mapping[name] = COLOR_PALETTE[index % COLOR_PALETTE.length];
    });
    return mapping;
  }, [workoutRecords]);

  const getWorkoutsForDate = (date: Date) => {
    const normDate = startOfDay(date);
    return workoutRecords.filter((workout) =>
      isSameDay(createDate(workout.date), normDate)
    );
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startingDay = monthStart.getDay();
    const cells = [];
    for (let i = 0; i < startingDay; i++) {
      cells.push(
        <div
          key={`empty-${i}`}
          className={`border border-gray-200 p-1 ${
            isMobile ? "min-h-[3rem]" : "min-h-[4rem] md:h-24"
          }`}
        />
      );
    }
    daysInMonth.forEach((date) => {
      const normDate = startOfDay(date);
      const workouts = getWorkoutsForDate(normDate);
      const current = isToday(normDate);
      const selected = isSameDay(normDate, selectedDate);
      cells.push(
        <div
          key={date.toString()}
          onClick={() => setSelectedDate(normDate)}
          className={`border border-gray-200 p-1 cursor-pointer transition-colors relative \
            ${isMobile ? "min-h-[3rem]" : "min-h-[4rem] md:h-24"} \
            ${selected ? "bg-gray-100" : "hover:bg-gray-50"} \
            ${current ? "border-blue-500 border-2" : ""}`}
        >
          <div className="font-medium text-xs md:text-sm mb-1">
            {format(date, "d")}
          </div>
          <div className="flex flex-wrap gap-1">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedWorkout(workout);
                }}
                className={`${
                  workoutColors[workout.workoutName]
                } text-white text-xs p-0.5 rounded truncate`}
              >
                {workout.workoutName.split(" ")[0]}
              </div>
            ))}
          </div>
        </div>
      );
    });
    return cells;
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py-2 md:py-4">
      <Card className="p-0 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
            <span className="font-semibold text-base md:text-lg mr-2 mb-1 md:mb-0">
              Add Connection
            </span>
            <Input
              placeholder="Add connection by email"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              className="w-full md:w-56"
              disabled={adding}
            />
            <Button
              onClick={handleAddConnection}
              disabled={adding || !addEmail.trim()}
              className="w-full md:w-auto"
            >
              <UserPlus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
            <span className="font-semibold text-base md:text-lg">
              Connections
            </span>
            <div className="flex flex-nowrap gap-2 mt-1 md:mt-0 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 max-w-full md:max-w-[600px] pb-1">
              {connections.length === 0 && (
                <span className="text-muted-foreground text-xs">
                  No connections yet
                </span>
              )}
              {connections.map((user) => (
                <Button
                  key={user.email}
                  variant={
                    selectedConnection === user.email ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedConnection(user.email)}
                  className="truncate max-w-[160px]"
                >
                  {user.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-2 md:p-6">
        {/* Calendar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex gap-2">
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
          {/* Legend: each workout name gets its own color */}
          {workoutRecords.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {Object.entries(workoutColors).map(([name, color]) => (
                <div key={name} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-xs">{name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Calendar Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : selectedConnection ? (
          <div className="grid grid-cols-7 gap-0 w-full">
            {DAYS_FULL.map((day, index) => (
              <div
                key={`header-${index}`}
                className="h-8 md:h-12 flex items-center justify-center font-medium border border-gray-200"
              >
                <span className="md:hidden">{DAYS[index]}</span>
                <span className="hidden md:inline">{day}</span>
              </div>
            ))}
            {generateCalendarDays()}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Select a connection to view their calendar.
          </div>
        )}
        {/* Workouts for selected date */}
        {selectedConnection && getWorkoutsForDate(selectedDate).length > 0 && (
          <div className="mt-4 md:mt-6">
            <h3 className="text-base md:text-lg font-medium mb-2">{`Workouts for ${format(
              selectedDate,
              "MMMM d, yyyy"
            )}`}</h3>
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
                        className={`w-2 h-2 rounded-full ${
                          workoutColors[workout.workoutName] || "bg-gray-500"
                        }`}
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
                className={`w-2 h-2 rounded-full ${
                  selectedWorkout
                    ? workoutColors[selectedWorkout.workoutName] ||
                      "bg-gray-500"
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
                        {exercise.bestWeight}lbs × {exercise.bestReps} reps
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

export default ConnectionsCalendarPage;
