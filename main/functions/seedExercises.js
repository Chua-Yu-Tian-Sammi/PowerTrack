const admin = require('firebase-admin');

const db = admin.firestore();

const sampleExercises = [
  // Chest Exercises
  {
    exerciseId: 'pushup',
    name: 'Push-up',
    photoUrl: 'https://example.com/pushup.jpg',
    muscle: ['chest', 'shoulders', 'triceps'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 9,
    description: 'A classic bodyweight exercise that targets the chest, shoulders, and triceps.',
    instructions: [
      'Start in a plank position with hands slightly wider than shoulders',
      'Lower your body until your chest nearly touches the floor',
      'Push back up to the starting position',
      'Keep your core tight throughout the movement'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'bench_press',
    name: 'Bench Press',
    photoUrl: 'https://example.com/benchpress.jpg',
    muscle: ['chest', 'shoulders', 'triceps'],
    equipment: ['barbell', 'bench'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 10,
    description: 'The king of chest exercises, performed with a barbell on a bench.',
    instructions: [
      'Lie on a bench with feet flat on the floor',
      'Grip the barbell with hands slightly wider than shoulders',
      'Lower the bar to your chest with control',
      'Press the bar up explosively'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'dumbbell_flyes',
    name: 'Dumbbell Flyes',
    photoUrl: 'https://example.com/flyes.jpg',
    muscle: ['chest'],
    equipment: ['dumbbells', 'bench'],
    intensity: 'medium',
    timePerSetSec: 75,
    usefulnessScore: 7,
    description: 'Isolation exercise that targets the chest muscles with a wide range of motion.',
    instructions: [
      'Lie on a bench holding dumbbells above your chest',
      'Lower the weights in a wide arc until you feel a stretch',
      'Bring the weights back together above your chest',
      'Keep a slight bend in your elbows throughout'
    ],
    difficulty: 'intermediate'
  },

  // Back Exercises
  {
    exerciseId: 'pullup',
    name: 'Pull-up',
    photoUrl: 'https://example.com/pullup.jpg',
    muscle: ['back', 'biceps'],
    equipment: ['pullup_bar'],
    intensity: 'high',
    timePerSetSec: 60,
    usefulnessScore: 9,
    description: 'Bodyweight exercise that targets the back and biceps.',
    instructions: [
      'Hang from a pull-up bar with hands shoulder-width apart',
      'Pull your body up until your chin clears the bar',
      'Lower yourself with control',
      'Keep your core engaged throughout'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'bent_over_row',
    name: 'Bent-Over Row',
    photoUrl: 'https://example.com/row.jpg',
    muscle: ['back', 'biceps'],
    equipment: ['barbell'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 8,
    description: 'Compound exercise that targets the back muscles.',
    instructions: [
      'Stand with feet hip-width apart, holding a barbell',
      'Hinge at the hips and lean forward slightly',
      'Pull the bar to your lower chest',
      'Squeeze your shoulder blades together'
    ],
    difficulty: 'intermediate'
  },

  // Leg Exercises
  {
    exerciseId: 'squat',
    name: 'Squat',
    photoUrl: 'https://example.com/squat.jpg',
    muscle: ['legs', 'glutes', 'core'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 10,
    description: 'Fundamental movement that targets the entire lower body.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Go down until your thighs are parallel to the floor',
      'Drive through your heels to return to standing'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'deadlift',
    name: 'Deadlift',
    photoUrl: 'https://example.com/deadlift.jpg',
    muscle: ['legs', 'back', 'glutes', 'core'],
    equipment: ['barbell'],
    intensity: 'high',
    timePerSetSec: 120,
    usefulnessScore: 10,
    description: 'The king of all exercises, targeting the entire posterior chain.',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend down and grip the bar with hands just outside your legs',
      'Keep your back straight and chest up',
      'Drive through your heels and hips to stand up'
    ],
    difficulty: 'advanced'
  },
  {
    exerciseId: 'lunges',
    name: 'Lunges',
    photoUrl: 'https://example.com/lunges.jpg',
    muscle: ['legs', 'glutes'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 45,
    usefulnessScore: 8,
    description: 'Unilateral leg exercise that improves balance and strength.',
    instructions: [
      'Stand with feet hip-width apart',
      'Step forward with one leg and lower your body',
      'Both knees should be at 90-degree angles',
      'Push back to the starting position'
    ],
    difficulty: 'beginner'
  },

  // Shoulder Exercises
  {
    exerciseId: 'overhead_press',
    name: 'Overhead Press',
    photoUrl: 'https://example.com/ohp.jpg',
    muscle: ['shoulders', 'triceps', 'core'],
    equipment: ['barbell'],
    intensity: 'high',
    timePerSetSec: 90,
    usefulnessScore: 9,
    description: 'Compound exercise that targets the shoulders and triceps.',
    instructions: [
      'Stand with feet hip-width apart, holding a barbell at shoulder level',
      'Press the bar straight up overhead',
      'Lower the bar with control to shoulder level',
      'Keep your core tight throughout the movement'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'lateral_raises',
    name: 'Lateral Raises',
    photoUrl: 'https://example.com/lateral.jpg',
    muscle: ['shoulders'],
    equipment: ['dumbbells'],
    intensity: 'low',
    timePerSetSec: 45,
    usefulnessScore: 6,
    description: 'Isolation exercise for the shoulder muscles.',
    instructions: [
      'Stand holding dumbbells at your sides',
      'Raise your arms out to the sides until parallel to the floor',
      'Lower with control',
      'Keep a slight bend in your elbows'
    ],
    difficulty: 'beginner'
  },

  // Core Exercises
  {
    exerciseId: 'plank',
    name: 'Plank',
    photoUrl: 'https://example.com/plank.jpg',
    muscle: ['core', 'shoulders'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 60,
    usefulnessScore: 8,
    description: 'Isometric exercise that strengthens the entire core.',
    instructions: [
      'Start in a push-up position',
      'Lower to your forearms',
      'Keep your body in a straight line',
      'Hold the position while breathing normally'
    ],
    difficulty: 'beginner'
  },
  {
    exerciseId: 'russian_twists',
    name: 'Russian Twists',
    photoUrl: 'https://example.com/twists.jpg',
    muscle: ['core', 'obliques'],
    equipment: ['bodyweight'],
    intensity: 'medium',
    timePerSetSec: 45,
    usefulnessScore: 7,
    description: 'Dynamic core exercise that targets the obliques.',
    instructions: [
      'Sit on the floor with knees bent',
      'Lean back slightly and lift your feet off the ground',
      'Rotate your torso from side to side',
      'Keep your core engaged throughout'
    ],
    difficulty: 'beginner'
  },

  // Cardio Exercises
  {
    exerciseId: 'burpees',
    name: 'Burpees',
    photoUrl: 'https://example.com/burpees.jpg',
    muscle: ['full_body', 'cardio'],
    equipment: ['bodyweight'],
    intensity: 'high',
    timePerSetSec: 30,
    usefulnessScore: 9,
    description: 'High-intensity full-body exercise that combines strength and cardio.',
    instructions: [
      'Start in a standing position',
      'Drop into a squat and place hands on the floor',
      'Jump feet back into a plank position',
      'Do a push-up, then jump feet back to squat',
      'Jump up with arms overhead'
    ],
    difficulty: 'intermediate'
  },
  {
    exerciseId: 'mountain_climbers',
    name: 'Mountain Climbers',
    photoUrl: 'https://example.com/mountain.jpg',
    muscle: ['full_body', 'cardio'],
    equipment: ['bodyweight'],
    intensity: 'high',
    timePerSetSec: 30,
    usefulnessScore: 8,
    description: 'Dynamic cardio exercise that targets the core and legs.',
    instructions: [
      'Start in a plank position',
      'Bring one knee toward your chest',
      'Quickly switch legs',
      'Continue alternating at a fast pace',
      'Keep your core tight throughout'
    ],
    difficulty: 'beginner'
  }
];

async function seedExercises() {
  console.log('Seeding exercises...');
  
  const batch = db.batch();
  
  for (const exercise of sampleExercises) {
    const docRef = db.collection('exercises').doc(exercise.exerciseId);
    batch.set(docRef, exercise);
  }
  
  await batch.commit();
  console.log(`Seeded ${sampleExercises.length} exercises successfully!`);
}

module.exports = { sampleExercises, seedExercises };


