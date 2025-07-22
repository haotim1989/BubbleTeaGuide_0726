export function getRecommendation(drinks) {
    if (!drinks || drinks.length === 0) {
        return null;
    }
    
    // Get random drink
    const randomIndex = Math.floor(Math.random() * drinks.length);
    const selectedDrink = drinks[randomIndex];
    
    // Get random sweetness level from available options
    const sweetnessLevels = Object.keys(selectedDrink.calories_large_cup);
    const randomSweetnessIndex = Math.floor(Math.random() * sweetnessLevels.length);
    const selectedSweetness = sweetnessLevels[randomSweetnessIndex];
    
    return {
        drink: selectedDrink,
        sweetness: selectedSweetness,
        timestamp: Date.now()
    };
}

export function getWeightedRecommendation(drinks, preferences = {}) {
    if (!drinks || drinks.length === 0) {
        return null;
    }
    
    // Apply weights based on preferences
    const weightedDrinks = drinks.map(drink => {
        let weight = 1;
        
        // Prefer drinks with lower calories if health-conscious
        if (preferences.healthConscious) {
            const avgCalories = Object.values(drink.calories_large_cup)
                .reduce((sum, cal) => sum + cal.total_kcal, 0) / 
                Object.values(drink.calories_large_cup).length;
            
            if (avgCalories <= 200) weight *= 1.5;
            else if (avgCalories >= 400) weight *= 0.7;
        }
        
        // Prefer caffeinated drinks if user likes caffeine
        if (preferences.preferCaffeine !== undefined) {
            if (drink.caffeine === preferences.preferCaffeine) {
                weight *= 1.3;
            } else {
                weight *= 0.8;
            }
        }
        
        // Prefer certain brands if specified
        if (preferences.favoriteBrands && preferences.favoriteBrands.length > 0) {
            if (preferences.favoriteBrands.includes(drink.brand)) {
                weight *= 1.4;
            }
        }
        
        return { drink, weight };
    });
    
    // Select based on weights
    const totalWeight = weightedDrinks.reduce((sum, item) => sum + item.weight, 0);
    let randomValue = Math.random() * totalWeight;
    
    let selectedDrink = null;
    for (const item of weightedDrinks) {
        randomValue -= item.weight;
        if (randomValue <= 0) {
            selectedDrink = item.drink;
            break;
        }
    }
    
    // Fallback to last drink if selection failed
    if (!selectedDrink) {
        selectedDrink = weightedDrinks[weightedDrinks.length - 1].drink;
    }
    
    // Select sweetness level based on preferences
    const sweetnessLevels = Object.keys(selectedDrink.calories_large_cup);
    let selectedSweetness;
    
    if (preferences.preferredSweetness) {
        // Try to use preferred sweetness if available
        selectedSweetness = sweetnessLevels.includes(preferences.preferredSweetness) 
            ? preferences.preferredSweetness 
            : sweetnessLevels[Math.floor(Math.random() * sweetnessLevels.length)];
    } else if (preferences.healthConscious) {
        // Prefer lower sweetness levels
        const lowSweetness = ['no_sugar_0', 'low_sugar_40', 'half_sugar_60']
            .filter(level => sweetnessLevels.includes(level));
        
        if (lowSweetness.length > 0) {
            selectedSweetness = lowSweetness[Math.floor(Math.random() * lowSweetness.length)];
        } else {
            selectedSweetness = sweetnessLevels[Math.floor(Math.random() * sweetnessLevels.length)];
        }
    } else {
        selectedSweetness = sweetnessLevels[Math.floor(Math.random() * sweetnessLevels.length)];
    }
    
    return {
        drink: selectedDrink,
        sweetness: selectedSweetness,
        timestamp: Date.now(),
        recommendationReason: generateRecommendationReason(selectedDrink, selectedSweetness, preferences)
    };
}

function generateRecommendationReason(drink, sweetness, preferences) {
    const reasons = [];
    
    if (preferences.healthConscious) {
        const calories = drink.calories_large_cup[sweetness].total_kcal;
        if (calories <= 200) {
            reasons.push('低熱量選擇');
        }
        if (sweetness.includes('no_sugar') || sweetness.includes('low_sugar')) {
            reasons.push('較少糖分');
        }
    }
    
    if (preferences.preferCaffeine === drink.caffeine) {
        reasons.push(drink.caffeine ? '含有提神咖啡因' : '無咖啡因，適合晚上');
    }
    
    if (preferences.favoriteBrands && preferences.favoriteBrands.includes(drink.brand)) {
        reasons.push('您喜愛的品牌');
    }
    
    if (reasons.length === 0) {
        reasons.push('隨機為您挑選');
    }
    
    return reasons.join('，');
}

export function getDailyRecommendations(drinks, count = 3) {
    if (!drinks || drinks.length === 0) {
        return [];
    }
    
    const recommendations = [];
    const usedDrinks = new Set();
    
    while (recommendations.length < count && recommendations.length < drinks.length) {
        const recommendation = getRecommendation(drinks.filter(drink => 
            !usedDrinks.has(drink.name + drink.brand)
        ));
        
        if (recommendation) {
            recommendations.push(recommendation);
            usedDrinks.add(recommendation.drink.name + recommendation.drink.brand);
        } else {
            break;
        }
    }
    
    return recommendations;
}
