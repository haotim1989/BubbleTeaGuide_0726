export class DrinkCard {
    constructor(drink, sweetnessLevel = 'full_sugar_100') {
        this.drink = drink;
        this.sweetnessLevel = sweetnessLevel;
    }

    getCaloriesForSweetness() {
        const calorieData = this.drink.calories_large_cup[this.sweetnessLevel];
        return calorieData ? calorieData.total_kcal : 0;
    }

    getSugarGrams() {
        const calorieData = this.drink.calories_large_cup[this.sweetnessLevel];
        return calorieData ? calorieData.sugar_grams || 0 : 0;
    }

    getSweetnessLabel(level) {
        const labels = {
            'no_sugar_0': '無糖',
            'low_sugar_40': '少糖',
            'half_sugar_60': '半糖',
            'less_sugar_80': '微糖',
            'full_sugar_100': '正常糖'
        };
        return labels[level] || level;
    }

    getCalorieLevel() {
        const calories = this.getCaloriesForSweetness();
        if (calories <= 200) return 'low';
        if (calories <= 400) return 'medium';
        return 'high';
    }

    getDrinkIcon() {
        const name = this.drink.name.toLowerCase();
        if (name.includes('奶茶') || name.includes('拿鐵')) return '🧋';
        if (name.includes('珍珠')) return '🧋';
        if (name.includes('咖啡')) return '☕';
        if (name.includes('果汁') || name.includes('柳橙') || name.includes('檸檬')) return '🧃';
        if (name.includes('綠茶') || name.includes('抹茶')) return '🍵';
        return '🥤';
    }

    render() {
        const calories = this.getCaloriesForSweetness();
        const sugarGrams = this.getSugarGrams();
        const calorieLevel = this.getCalorieLevel();
        const sweetnessLabel = this.getSweetnessLabel(this.sweetnessLevel);

        return `
            <div class="drink-card ${calorieLevel}-calorie">
                <div class="drink-header">
                    <div class="drink-icon">${this.getDrinkIcon()}</div>
                    <div class="drink-info">
                        <h3 class="drink-name">${this.drink.name}</h3>
                        <p class="drink-brand">${this.drink.brand}</p>
                    </div>
                    <div class="caffeine-indicator ${this.drink.caffeine ? 'has-caffeine' : 'no-caffeine'}">
                        <i class="fas fa-bolt"></i>
                        <span>${this.drink.caffeine ? '含咖啡因' : '無咖啡因'}</span>
                    </div>
                </div>
                
                <div class="drink-details">
                    <div class="nutrition-info">
                        <div class="nutrition-item">
                            <span class="label">熱量</span>
                            <span class="value calorie-value">${calories} 卡</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="label">甜度</span>
                            <span class="value">${sweetnessLabel}</span>
                        </div>
                        ${sugarGrams > 0 ? `
                            <div class="nutrition-item">
                                <span class="label">糖分</span>
                                <span class="value">${sugarGrams}g</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="calorie-bar">
                        <div class="calorie-fill ${calorieLevel}" 
                             style="width: ${Math.min(calories / 600 * 100, 100)}%"></div>
                    </div>
                    
                    <div class="sweetness-options">
                        <label>其他甜度選擇：</label>
                        <div class="sweetness-buttons">
                            ${Object.keys(this.drink.calories_large_cup).map(level => {
                                const isActive = level === this.sweetnessLevel;
                                const levelCalories = this.drink.calories_large_cup[level].total_kcal;
                                return `
                                    <button class="sweetness-btn ${isActive ? 'active' : ''}" 
                                            data-sweetness="${level}">
                                        ${this.getSweetnessLabel(level)}
                                        <small>${levelCalories}卡</small>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const sweetnessButtons = document.querySelectorAll('.sweetness-btn');
        sweetnessButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const newSweetness = e.currentTarget.getAttribute('data-sweetness');
                this.sweetnessLevel = newSweetness;
                
                // Re-render the card with new sweetness
                const cardElement = e.currentTarget.closest('.drink-card');
                cardElement.outerHTML = this.render();
                
                // Re-bind events
                this.bindEvents();
            });
        });
    }
}
