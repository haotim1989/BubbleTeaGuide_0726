export async function loadDrinksData() {
    try {
        const response = await fetch('./data/drinks.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading drinks data:', error);
        throw new Error('無法載入飲品資料');
    }
}

export function getAllDrinks(drinksData) {
    const allDrinks = [];
    
    Object.entries(drinksData).forEach(([brandName, brandData]) => {
        brandData.products.forEach(product => {
            allDrinks.push({
                ...product,
                brand: brandName,
                dataSource: brandData.data_source
            });
        });
    });
    
    return allDrinks;
}

export function getBrandNames(drinksData) {
    return Object.keys(drinksData);
}

export function getDrinksByBrand(drinksData, brandName) {
    if (!drinksData[brandName]) {
        return [];
    }
    
    return drinksData[brandName].products.map(product => ({
        ...product,
        brand: brandName,
        dataSource: drinksData[brandName].data_source
    }));
}

export function getDrinkTypeNames(drinksData) {
    const types = new Set();
    
    Object.values(drinksData).forEach(brand => {
        brand.products.forEach(product => {
            types.add(product.name);
        });
    });
    
    return Array.from(types).sort();
}

export function getCalorieRange(drink, sweetnessLevel = 'full_sugar_100') {
    const calorieData = drink.calories_large_cup[sweetnessLevel];
    if (!calorieData) return 0;
    
    const calories = calorieData.total_kcal;
    if (calories <= 200) return 'low';
    if (calories <= 400) return 'medium';
    return 'high';
}
