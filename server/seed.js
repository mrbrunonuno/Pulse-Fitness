
import pool from "./db.js";

const fitnessClasses = [
  {
    id: 1,
    title: "High-Intensity Interval Training",
    category: "HIIT",
    intensity: "High",
    duration: "45 mins",
    trainer: "Alex Rivera",
    spotsLeft: 5,
    rating: 4.9,
    description: "Fast-paced cardio and strength blocks designed to maximize calorie burn."
  },
  {
    id: 2,
    title: "Power Vinyasa Flow",
    category: "Yoga",
    intensity: "Medium",
    duration: "60 mins",
    trainer: "Elena Rostova",
    spotsLeft: 8,
    rating: 4.8,
    description: "Dynamic fluid movements focusing on core alignment, flexibility, and breath."
  },
  {
    id: 3,
    title: "Heavy Barbell Strength",
    category: "Strength",
    intensity: "High",
    duration: "50 mins",
    trainer: "Marcus Vance",
    spotsLeft: 3,
    rating: 5.0,
    description: "Compound lifts and targeted muscle hyper-trophy work with expert form coaching."
  },
  {
    id: 4,
    title: "Endurance Cycling",
    category: "Cardio",
    intensity: "Medium",
    duration: "45 mins",
    trainer: "Sarah Jenkins",
    spotsLeft: 10,
    rating: 4.7,
    description: "Rhythm-based indoor cycling session with steep climb simulations and intervals."
  },
  {
    id: 5,
    title: "Restorative Mobility & Core",
    category: "Yoga",
    intensity: "Low",
    duration: "30 mins",
    trainer: "Elena Rostova",
    spotsLeft: 12,
    rating: 4.9,
    description: "Targeted joint mobility exercises paired with low-impact deep core activation."
  },
  {
    id: 6,
    title: "Metabolic Conditioning",
    category: "HIIT",
    intensity: "High",
    duration: "50 mins",
    trainer: "Alex Rivera",
    spotsLeft: 4,
    rating: 4.8,
    description: "Full-body functional movement circuits built for maximum endurance."
  }
];

try {
  for (const fitnessClass of fitnessClasses) {
    
await pool.query(
  `INSERT INTO fitness_classes
    (id, name, title, category, intensity, difficulty, duration, trainer,
 spots_left, rating, description, schedule)
   VALUES ($1, $2, $2, $3, $4, $4, $5, $6, $7, $8, $9, $10)
   ON CONFLICT (id) DO UPDATE SET
     name = EXCLUDED.name,
     title = EXCLUDED.title,
     category = EXCLUDED.category,
     intensity = EXCLUDED.intensity,
     duration = EXCLUDED.duration,
     trainer = EXCLUDED.trainer,
     spots_left = EXCLUDED.spots_left,
     rating = EXCLUDED.rating,
     description = EXCLUDED.description,
     difficulty = EXCLUDED.difficulty,
     schedule = EXCLUDED.schedule`,
  [
    fitnessClass.id,
    fitnessClass.title,
    fitnessClass.category,
    fitnessClass.intensity,
    fitnessClass.duration,
    fitnessClass.trainer,
    fitnessClass.spotsLeft,
    fitnessClass.rating,
    fitnessClass.description,
    "Schedule to be confirmed"
  ]
);

  }

  console.log("Successfully seeded 6 fitness classes!");
} catch (error) {
  console.error("Seeding failed:", error.message);
} finally {
  await pool.end();
}
