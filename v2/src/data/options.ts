// Food options data

export const proteinOptions = [
  { id: 'chicken', label: 'Chicken' },
  { id: 'beef', label: 'Beef / Steak' },
  { id: 'ground_meat', label: 'Ground Beef/Turkey' },
  { id: 'turkey', label: 'Turkey' },
  { id: 'pork', label: 'Pork' },
  { id: 'white_fish', label: 'Fish (white - cod, tilapia)' },
  { id: 'salmon', label: 'Salmon' },
  { id: 'tuna', label: 'Tuna' },
  { id: 'shrimp', label: 'Shrimp/Prawns' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'egg_whites', label: 'Egg Whites' },
  { id: 'tofu', label: 'Tofu' },
  { id: 'tempeh', label: 'Tempeh' },
  { id: 'greek_yogurt', label: 'Greek Yogurt' },
  { id: 'cottage_cheese', label: 'Cottage Cheese' },
  { id: 'whey_protein', label: 'Protein Powder (whey)' },
  { id: 'plant_protein', label: 'Protein Powder (plant)' },
  { id: 'beans', label: 'Beans/Legumes' },
];

export const simpleProteinOptions = [
  { id: 'chicken', label: 'Chicken' },
  { id: 'beef', label: 'Beef' },
  { id: 'fish', label: 'Fish' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'greek_yogurt', label: 'Greek Yogurt' },
  { id: 'cottage_cheese', label: 'Cottage Cheese' },
  { id: 'tofu', label: 'Tofu' },
  { id: 'tempeh', label: 'Tempeh' },
  { id: 'beans', label: 'Beans/Legumes' },
  { id: 'protein_shake', label: 'Protein Shake' },
];

export const carbOptions = [
  { id: 'white_rice', label: 'White Rice' },
  { id: 'brown_rice', label: 'Brown Rice' },
  { id: 'oats', label: 'Oats / Oatmeal' },
  { id: 'potatoes', label: 'Potatoes' },
  { id: 'sweet_potatoes', label: 'Sweet Potatoes' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'bread', label: 'Whole Grain Bread' },
  { id: 'quinoa', label: 'Quinoa' },
  { id: 'couscous', label: 'Couscous' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'cream_of_rice', label: 'Cream of Rice' },
  { id: 'bagels', label: 'Bagels' },
  { id: 'wraps', label: 'Wraps/Tortillas' },
];

export const vegetableOptions = [
  { id: 'broccoli', label: 'Broccoli' },
  { id: 'spinach', label: 'Spinach' },
  { id: 'asparagus', label: 'Asparagus' },
  { id: 'green_beans', label: 'Green Beans' },
  { id: 'mixed_salad', label: 'Mixed Salad' },
  { id: 'peppers', label: 'Peppers' },
  { id: 'carrots', label: 'Carrots' },
  { id: 'zucchini', label: 'Zucchini' },
  { id: 'cauliflower', label: 'Cauliflower' },
  { id: 'brussels_sprouts', label: 'Brussels Sprouts' },
  { id: 'kale', label: 'Kale' },
  { id: 'cucumber', label: 'Cucumber' },
  { id: 'tomatoes', label: 'Tomatoes' },
  { id: 'mushrooms', label: 'Mushrooms' },
];

export const fatOptions = [
  { id: 'olive_oil', label: 'Olive Oil' },
  { id: 'avocado', label: 'Avocado' },
  { id: 'nuts', label: 'Nuts (almonds, cashews)' },
  { id: 'peanut_butter', label: 'Peanut Butter' },
  { id: 'almond_butter', label: 'Almond Butter' },
  { id: 'coconut_oil', label: 'Coconut Oil' },
  { id: 'cheese', label: 'Cheese' },
  { id: 'egg_yolks', label: 'Whole Eggs (yolks)' },
  { id: 'fatty_fish', label: 'Fatty Fish' },
];

export const dietaryRestrictions = [
  { id: 'none', label: 'None' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'keto', label: 'Keto / Low Carb' },
  { id: 'gluten_free', label: 'Gluten Free' },
  { id: 'dairy_free', label: 'Dairy Free' },
  { id: 'lactose_intolerant', label: 'Lactose Intolerant' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' },
  { id: 'nut_allergy', label: 'Nut Allergy' },
  { id: 'shellfish_allergy', label: 'Shellfish Allergy' },
];

export const trainingTypes = [
  { id: 'weight_training', label: 'Weight Training / Resistance' },
  { id: 'cardio', label: 'Cardio / Running' },
  { id: 'hiit', label: 'HIIT' },
  { id: 'crossfit', label: 'CrossFit' },
  { id: 'sports', label: 'Sports' },
  { id: 'swimming', label: 'Swimming' },
  { id: 'yoga', label: 'Yoga / Flexibility' },
  { id: 'martial_arts', label: 'Martial Arts' },
  { id: 'cycling', label: 'Cycling' },
  { id: 'calisthenics', label: 'Calisthenics' },
];

export const trainingSplits = [
  { id: 'full_body', label: 'Full Body' },
  { id: 'upper_lower', label: 'Upper/Lower' },
  { id: 'ppl', label: 'Push/Pull/Legs' },
  { id: 'bro_split', label: 'Bro Split (body part per day)' },
  { id: 'custom', label: 'Custom' },
];

export const struggles = [
  { id: 'late_night', label: 'Late night eating/cravings' },
  { id: 'sugar', label: 'Sugar cravings' },
  { id: 'skipping_meals', label: 'Skipping meals' },
  { id: 'overeating', label: 'Overeating / Portion control' },
  { id: 'eating_out', label: 'Eating out too much' },
  { id: 'low_protein', label: 'Not eating enough protein' },
  { id: 'inconsistency', label: 'Inconsistency / Falling off track' },
  { id: 'boredom', label: 'Boredom with food' },
  { id: 'emotional', label: 'Emotional eating' },
  { id: 'weekends', label: 'Weekend overeating' },
  { id: 'no_time', label: 'Not enough time to cook' },
  { id: 'dont_know', label: "Don't know what to eat" },
];

export const previousDiets = [
  { id: 'never', label: 'Never really dieted before' },
  { id: 'counting', label: 'Counting calories/macros' },
  { id: 'keto', label: 'Keto / Low carb' },
  { id: 'if', label: 'Intermittent fasting' },
  { id: 'shakes', label: 'Meal replacement shakes' },
  { id: 'ww', label: 'Weight Watchers / Points' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'clean', label: 'Clean eating' },
  { id: 'comp_prep', label: 'Competition prep' },
];

export const supplements = [
  { id: 'protein', label: 'Protein powder' },
  { id: 'creatine', label: 'Creatine' },
  { id: 'preworkout', label: 'Pre-workout' },
  { id: 'bcaa', label: 'BCAAs / EAAs' },
  { id: 'multivitamin', label: 'Multivitamin' },
  { id: 'fish_oil', label: 'Fish oil / Omega 3' },
  { id: 'vitamin_d', label: 'Vitamin D' },
  { id: 'caffeine', label: 'Caffeine pills' },
  { id: 'fat_burners', label: 'Fat burners' },
];

export const workSchedules = [
  { id: 'regular', label: 'Regular 9-5' },
  { id: 'shift', label: 'Shift work (rotating)' },
  { id: 'wfh', label: 'Work from home' },
  { id: 'irregular', label: 'Irregular / Freelance' },
  { id: 'night', label: 'Night shifts' },
];

export const fastingOptions = [
  { id: 'no', label: 'No' },
  { id: '16_8', label: 'Yes - 16:8 (8 hour eating window)' },
  { id: '18_6', label: 'Yes - 18:6 (6 hour eating window)' },
  { id: '20_4', label: 'Yes - 20:4 (4 hour eating window)' },
  { id: 'other', label: 'Yes - Other pattern' },
];
