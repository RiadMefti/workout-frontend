// Simple enums for exercise categorization
export enum ExerciseCategory {
  Strength = "strength",
  Cardio = "cardio",
}

export enum MuscleGroup {
  Chest = "chest",
  Back = "back",
  Shoulders = "shoulders",
  Arms = "arms",
  Legs = "legs",
  Core = "core",
  FullBody = "fullBody",
}

export enum Equipment {
  Barbell = "barbell",
  Dumbbell = "dumbbell",
  Machine = "machine",
  Cable = "cable",
  BodyWeight = "bodyWeight",
  Kettlebell = "kettlebell",
  Cardio = "cardio",
  Other = "other",
}

// Simple exercise interface
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
}

// Main database export
export const exerciseDatabase: Exercise[] = [
  // Chest - Strength
  {
    id: "bench-press",
    name: "Bench Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.Barbell,
  },
  {
    id: "push-up",
    name: "Push-Up",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "dumbbell-fly",
    name: "Dumbbell Fly",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "incline-bench-press",
    name: "Incline Bench Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.Barbell,
  },
  {
    id: "cable-crossover",
    name: "Cable Crossover",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.Cable,
  },
  {
    id: "chest-dip",
    name: "Chest Dip",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "decline-bench-press",
    name: "Decline Bench Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.Barbell,
  },
  {
    id: "dumbbell-bench-press",
    name: "Dumbbell Bench Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "pec-deck-fly",
    name: "Pec Deck Fly",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.Machine,
  },
  {
    id: "svend-press",
    name: "Svend Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.Other,
  },
  {
    id: "landmine-press",
    name: "Landmine Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.Barbell,
  },
  {
    id: "chest-press-machine",
    name: "Chest Press Machine",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Chest,
    equipment: Equipment.Machine,
  },

  // Back - Strength
  {
    id: "pull-up",
    name: "Pull-Up",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "deadlift",
    name: "Deadlift",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.Barbell,
  },
  {
    id: "barbell-row",
    name: "Barbell Row",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.Barbell,
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.Cable,
  },
  {
    id: "seated-row",
    name: "Seated Row",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.Cable,
  },
  {
    id: "dumbbell-row",
    name: "Single-Arm Dumbbell Row",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "chin-up",
    name: "Chin-Up",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "t-bar-row",
    name: "T-Bar Row",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.Machine,
  },
  {
    id: "inverted-row",
    name: "Inverted Row",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "rack-pull",
    name: "Rack Pull",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.Barbell,
  },
  {
    id: "straight-arm-pulldown",
    name: "Straight Arm Pulldown",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.Cable,
  },
  {
    id: "good-morning",
    name: "Good Morning",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.Barbell,
  },
  {
    id: "meadows-row",
    name: "Meadows Row",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.Barbell,
  },
  {
    id: "pendlay-row",
    name: "Pendlay Row",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Back,
    equipment: Equipment.Barbell,
  },

  // Shoulders - Strength
  {
    id: "overhead-press",
    name: "Overhead Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Barbell,
  },
  {
    id: "lateral-raise",
    name: "Lateral Raise",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "front-raise",
    name: "Front Raise",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "reverse-fly",
    name: "Reverse Fly",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "face-pull",
    name: "Face Pull",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Cable,
  },
  {
    id: "arnold-press",
    name: "Arnold Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "upright-row",
    name: "Upright Row",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Barbell,
  },
  {
    id: "shrug",
    name: "Shrug",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "push-press",
    name: "Push Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Barbell,
  },
  {
    id: "seated-overhead-press",
    name: "Seated Overhead Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "landmine-press-shoulder",
    name: "Landmine Shoulder Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Barbell,
  },
  {
    id: "cable-lateral-raise",
    name: "Cable Lateral Raise",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Cable,
  },
  {
    id: "behind-neck-press",
    name: "Behind the Neck Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Shoulders,
    equipment: Equipment.Barbell,
  },

  // Arms - Strength
  {
    id: "bicep-curl",
    name: "Bicep Curl",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "tricep-extension",
    name: "Tricep Extension",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Cable,
  },
  {
    id: "skull-crusher",
    name: "Skull Crusher",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Barbell,
  },
  {
    id: "hammer-curl",
    name: "Hammer Curl",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "tricep-dip",
    name: "Tricep Dip",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "preacher-curl",
    name: "Preacher Curl",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Barbell,
  },
  {
    id: "barbell-curl",
    name: "Barbell Curl",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Barbell,
  },
  {
    id: "cable-curl",
    name: "Cable Curl",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Cable,
  },
  {
    id: "concentration-curl",
    name: "Concentration Curl",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "close-grip-bench-press",
    name: "Close Grip Bench Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Barbell,
  },
  {
    id: "tricep-pushdown",
    name: "Tricep Pushdown",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Cable,
  },
  {
    id: "diamond-push-up",
    name: "Diamond Push-Up",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "ez-bar-curl",
    name: "EZ Bar Curl",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Barbell,
  },
  {
    id: "overhead-tricep-extension",
    name: "Overhead Tricep Extension",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "wrist-curl",
    name: "Wrist Curl",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "reverse-wrist-curl",
    name: "Reverse Wrist Curl",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Arms,
    equipment: Equipment.Dumbbell,
  },

  // Legs - Strength
  {
    id: "squat",
    name: "Squat",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Barbell,
  },
  {
    id: "leg-press",
    name: "Leg Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Machine,
  },
  {
    id: "hip-thrust",
    name: "Hip Thrust",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Machine,
  },
  {
    id: "lunge",
    name: "Lunge",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "leg-extension",
    name: "Leg Extension",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Machine,
  },
  {
    id: "leg-curl",
    name: "Leg Curl",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Machine,
  },
  {
    id: "calf-raise",
    name: "Calf Raise",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Machine,
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Barbell,
  },
  {
    id: "front-squat",
    name: "Front Squat",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Barbell,
  },
  {
    id: "hack-squat",
    name: "Hack Squat",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Machine,
  },
  {
    id: "bulgarian-split-squat",
    name: "Bulgarian Split Squat",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "sumo-deadlift",
    name: "Sumo Deadlift",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Barbell,
  },
  {
    id: "goblet-squat",
    name: "Goblet Squat",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "dumbbell-lunge",
    name: "Dumbbell Lunge",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "seated-calf-raise",
    name: "Seated Calf Raise",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Machine,
  },
  {
    id: "adductor-machine",
    name: "Adductor Machine",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Machine,
  },
  {
    id: "abductor-machine",
    name: "Abductor Machine",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Machine,
  },
  {
    id: "step-up",
    name: "Step Up",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Dumbbell,
  },
  {
    id: "box-jump",
    name: "Box Jump",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "donkey-calf-raise",
    name: "Donkey Calf Raise",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Machine,
  },

  // Core - Strength
  {
    id: "crunch",
    name: "Crunch",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "plank",
    name: "Plank",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "russian-twist",
    name: "Russian Twist",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "leg-raise",
    name: "Leg Raise",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "mountain-climber",
    name: "Mountain Climber",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "ab-rollout",
    name: "Ab Rollout",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.Other,
  },
  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "cable-crunch",
    name: "Cable Crunch",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.Cable,
  },
  {
    id: "situp",
    name: "Sit-Up",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "side-plank",
    name: "Side Plank",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "woodchop",
    name: "Woodchop",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.Cable,
  },
  {
    id: "pallof-press",
    name: "Pallof Press",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.Cable,
  },
  {
    id: "bicycle-crunch",
    name: "Bicycle Crunch",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "bird-dog",
    name: "Bird Dog",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "dragon-flag",
    name: "Dragon Flag",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "medicine-ball-slam",
    name: "Medicine Ball Slam",
    category: ExerciseCategory.Strength,
    muscleGroup: MuscleGroup.Core,
    equipment: Equipment.Other,
  },

  // Cardio Exercises
  {
    id: "running",
    name: "Running",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.Cardio,
  },
  {
    id: "cycling",
    name: "Cycling",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.Cardio,
  },
  {
    id: "rowing",
    name: "Rowing",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.Cardio,
  },
  {
    id: "jumping-rope",
    name: "Jumping Rope",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.Cardio,
  },
  {
    id: "elliptical",
    name: "Elliptical",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.Cardio,
  },
  {
    id: "stair-climber",
    name: "Stair Climber",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.Cardio,
  },
  {
    id: "burpee",
    name: "Burpee",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "high-knees",
    name: "High Knees",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "jumping-jack",
    name: "Jumping Jack",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "battle-ropes",
    name: "Battle Ropes",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.Other,
  },
  {
    id: "sprinting",
    name: "Sprinting",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "swimming",
    name: "Swimming",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.Other,
  },
  {
    id: "assault-bike",
    name: "Assault Bike",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.Cardio,
  },
  {
    id: "sled-push",
    name: "Sled Push",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.Other,
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "box-jumps",
    name: "Box Jumps",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "kettlebell-swing",
    name: "Kettlebell Swing",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.Kettlebell,
  },
  {
    id: "jumping-lunge",
    name: "Jumping Lunge",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.Legs,
    equipment: Equipment.BodyWeight,
  },
  {
    id: "ski-erg",
    name: "Ski Erg",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.Cardio,
  },
  {
    id: "bear-crawl",
    name: "Bear Crawl",
    category: ExerciseCategory.Cardio,
    muscleGroup: MuscleGroup.FullBody,
    equipment: Equipment.BodyWeight,
  },
];

// Helper function to get exercises by category
export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return exerciseDatabase.filter((exercise) => exercise.category === category);
}

// Helper function to get exercises by muscle group
export function getExercisesByMuscleGroup(
  muscleGroup: MuscleGroup
): Exercise[] {
  return exerciseDatabase.filter(
    (exercise) => exercise.muscleGroup === muscleGroup
  );
}

// Helper function to get exercises by equipment
export function getExercisesByEquipment(equipment: Equipment): Exercise[] {
  return exerciseDatabase.filter(
    (exercise) => exercise.equipment === equipment
  );
}

// Helper function to get exercises by both category and muscle group
export function getExercisesByCategoryAndMuscle(
  category: ExerciseCategory,
  muscleGroup: MuscleGroup
): Exercise[] {
  return exerciseDatabase.filter(
    (exercise) =>
      exercise.category === category && exercise.muscleGroup === muscleGroup
  );
}
