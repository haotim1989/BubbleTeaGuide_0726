import { getAllDrinks, getCalorieRange } from './drinkData.js';

export function applyFilters(drinksData, filters) {
    let filteredDrinks = getAllDrinks(drinksData);
    
    // Apply brand filter
    if (filters.brand) {
        filteredDrinks = filteredDrinks.filter(drink => 
            drink.brand === filters.brand
        );
    }
    
    // Apply drink type filter
    if (filters.drinkType) {
        filteredDrinks = filteredDrinks.filter(drink => 
            drink.name === filters.drinkType
        );
    }
    
    // Apply caffeine filter
    if (filters.caffeine !== '') {
        const hasCaffeine = filters.caffeine === 'true';
        filteredDrinks = filteredDrinks.filter(drink => 
            drink.caffeine === hasCaffeine
        );
    }
    
    // Apply calorie range filter
    if (filters.calorieRange) {
        const sweetnessLevel = filters.sweetness || 'full_sugar_100';
        filteredDrinks = filteredDrinks.filter(drink => {
            const calorieRange = getCalorieRange(drink, sweetnessLevel);
            return calorieRange === filters.calorieRange;
        });
    }
    
    // Apply sweetness filter (ensure the drink has that sweetness option)
    if (filters.sweetness) {
        filteredDrinks = filteredDrinks.filter(drink => 
            drink.calories_large_cup.hasOwnProperty(filters.sweetness)
        );
    }
    
    return filteredDrinks;
}

export function getFilterOptions(drinksData) {
    const allDrinks = getAllDrinks(drinksData);
    
    return {
        brands: [...new Set(allDrinks.map(drink => drink.brand))].sort(),
        drinkTypes: [...new Set(allDrinks.map(drink => drink.name))].sort(),
        sweetnessLevels: [
            { key: 'no_sugar_0', label: '無糖' },
            { key: 'low_sugar_40', label: '少糖' },
            { key: 'half_sugar_60', label: '半糖' },
            { key: 'less_sugar_80', label: '微糖' },
            { key: 'full_sugar_100', label: '正常糖' }
        ],
        calorieRanges: [
            { key: 'low', label: '低 (0-200 卡)' },
            { key: 'medium', label: '中 (201-400 卡)' },
            { key: 'high', label: '高 (401+ 卡)' }
        ],
        caffeineOptions: [
            { key: 'true', label: '含咖啡因' },
            { key: 'false', label: '無咖啡因' }
        ]
    };
}

export function validateFilters(filters) {
    const validSweetnessLevels = [
        'no_sugar_0', 'low_sugar_40', 'half_sugar_60', 
        'less_sugar_80', 'full_sugar_100'
    ];
    const validCalorieRanges = ['low', 'medium', 'high'];
    const validCaffeineValues = ['true', 'false'];

    return {
        brand: typeof filters.brand === 'string' ? filters.brand : '',
        drinkType: typeof filters.drinkType === 'string' ? filters.drinkType : '',
        sweetness: validSweetnessLevels.includes(filters.sweetness) ? filters.sweetness : '',
        calorieRange: validCalorieRanges.includes(filters.calorieRange) ? filters.calorieRange : '',
        caffeine: validCaffeineValues.includes(filters.caffeine) ? filters.caffeine : ''
    };
}
