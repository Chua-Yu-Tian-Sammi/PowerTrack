import admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp({
  projectId: 'powertrack-50d1f'
});

const db = admin.firestore();

// Connect to Firestore emulator
db.settings({
  host: '127.0.0.1:8080',
  ssl: false
});

async function seedExercises() {
  try {
    console.log('Seeding exercises...');

    const exercises = [
      {
        exerciseId: 'push-ups',
        name: 'Push-ups',
        description: 'A classic bodyweight exercise for chest, shoulders, and triceps',
        primaryMuscle: 'chest',
        secondaryMuscles: ['shoulders', 'triceps'],
        equipment: ['bodyweight'],
        intensity: 'medium',
        avgTimeSeconds: 30,
        tags: ['compound', 'bodyweight', 'beginner']
      },
      {
        exerciseId: 'squats',
        name: 'Squats',
        description: 'A fundamental lower body exercise',
        primaryMuscle: 'quads',
        secondaryMuscles: ['glutes', 'hamstrings'],
        equipment: ['bodyweight'],
        intensity: 'medium',
        avgTimeSeconds: 45,
        tags: ['compound', 'bodyweight', 'beginner']
      },
      {
        exerciseId: 'pull-ups',
        name: 'Pull-ups',
        description: 'Upper body pulling exercise',
        primaryMuscle: 'back',
        secondaryMuscles: ['biceps'],
        equipment: ['pullup_bar'],
        intensity: 'high',
        avgTimeSeconds: 60,
        tags: ['compound', 'bodyweight', 'intermediate']
      },
      {
        exerciseId: 'plank',
        name: 'Plank',
        description: 'Core strengthening exercise',
        primaryMuscle: 'abs',
        secondaryMuscles: ['shoulders'],
        equipment: ['bodyweight'],
        intensity: 'low',
        avgTimeSeconds: 60,
        tags: ['isolation', 'bodyweight', 'beginner']
      },
      {
        exerciseId: 'lunges',
        name: 'Lunges',
        description: 'Single-leg lower body exercise',
        primaryMuscle: 'quads',
        secondaryMuscles: ['glutes', 'hamstrings'],
        equipment: ['bodyweight'],
        intensity: 'medium',
        avgTimeSeconds: 40,
        tags: ['compound', 'bodyweight', 'beginner']
      },
      {
        exerciseId: 'burpees',
        name: 'Burpees',
        description: 'Full-body high-intensity exercise',
        primaryMuscle: 'full_body',
        secondaryMuscles: ['chest', 'quads', 'glutes'],
        equipment: ['bodyweight'],
        intensity: 'high',
        avgTimeSeconds: 45,
        tags: ['compound', 'bodyweight', 'intermediate', 'hiit']
      },
      {
        exerciseId: 'mountain-climbers',
        name: 'Mountain Climbers',
        description: 'Cardio and core exercise',
        primaryMuscle: 'abs',
        secondaryMuscles: ['shoulders', 'quads'],
        equipment: ['bodyweight'],
        intensity: 'high',
        avgTimeSeconds: 30,
        tags: ['compound', 'bodyweight', 'intermediate', 'hiit']
      },
      {
        exerciseId: 'jumping-jacks',
        name: 'Jumping Jacks',
        description: 'Cardiovascular warm-up exercise',
        primaryMuscle: 'full_body',
        secondaryMuscles: ['shoulders', 'quads'],
        equipment: ['bodyweight'],
        intensity: 'low',
        avgTimeSeconds: 20,
        tags: ['compound', 'bodyweight', 'beginner', 'warmup']
      }
    ];

    for (const exercise of exercises) {
      await db.collection('exercises').doc(exercise.exerciseId).set(exercise);
      console.log(`✅ Added exercise: ${exercise.name}`);
    }

    console.log('🎉 All exercises seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding exercises:', error);
  }
}

seedExercises();
