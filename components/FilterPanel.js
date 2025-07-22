export class FilterPanel {
    constructor(drinksData, onFilterChange) {
        this.drinksData = drinksData;
        this.onFilterChange = onFilterChange;
        this.filters = {
            brand: '',
            drinkType: '',
            sweetness: '',
            calorieRange: '',
            caffeine: ''
        };
    }

    getBrands() {
        return Object.keys(this.drinksData);
    }

    getDrinkTypes() {
        const types = new Set();
        Object.values(this.drinksData).forEach(brand => {
            brand.products.forEach(product => {
                types.add(product.name);
            });
        });
        return Array.from(types).sort();
    }

    render() {
        const brands = this.getBrands();
        const drinkTypes = this.getDrinkTypes();

        return `
            <div class="filter-panel">
                <div class="filter-header">
                    <h3><i class="fas fa-filter"></i> 篩選條件</h3>
                </div>
                
                <div class="filter-grid">
                    <div class="filter-group">
                        <label>品牌</label>
                        <select class="filter-select" data-filter="brand">
                            <option value="">全部品牌</option>
                            ${brands.map(brand => `
                                <option value="${brand}" ${this.filters.brand === brand ? 'selected' : ''}>
                                    ${brand}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>飲品類型</label>
                        <select class="filter-select" data-filter="drinkType">
                            <option value="">全部飲品</option>
                            ${drinkTypes.map(type => `
                                <option value="${type}" ${this.filters.drinkType === type ? 'selected' : ''}>
                                    ${type}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>甜度</label>
                        <select class="filter-select" data-filter="sweetness">
                            <option value="">全部甜度</option>
                            <option value="no_sugar_0" ${this.filters.sweetness === 'no_sugar_0' ? 'selected' : ''}>無糖</option>
                            <option value="low_sugar_40" ${this.filters.sweetness === 'low_sugar_40' ? 'selected' : ''}>少糖</option>
                            <option value="half_sugar_60" ${this.filters.sweetness === 'half_sugar_60' ? 'selected' : ''}>半糖</option>
                            <option value="less_sugar_80" ${this.filters.sweetness === 'less_sugar_80' ? 'selected' : ''}>微糖</option>
                            <option value="full_sugar_100" ${this.filters.sweetness === 'full_sugar_100' ? 'selected' : ''}>正常糖</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>熱量範圍</label>
                        <select class="filter-select" data-filter="calorieRange">
                            <option value="">全部熱量</option>
                            <option value="low" ${this.filters.calorieRange === 'low' ? 'selected' : ''}>低 (0-200 卡)</option>
                            <option value="medium" ${this.filters.calorieRange === 'medium' ? 'selected' : ''}>中 (201-400 卡)</option>
                            <option value="high" ${this.filters.calorieRange === 'high' ? 'selected' : ''}>高 (401+ 卡)</option>
                        </select>
                    </div>

                    <div class="filter-group">
                        <label>咖啡因</label>
                        <select class="filter-select" data-filter="caffeine">
                            <option value="">不限</option>
                            <option value="true" ${this.filters.caffeine === 'true' ? 'selected' : ''}>含咖啡因</option>
                            <option value="false" ${this.filters.caffeine === 'false' ? 'selected' : ''}>無咖啡因</option>
                        </select>
                    </div>
                </div>

                <div class="filter-actions">
                    <button class="reset-filters-btn">
                        <i class="fas fa-undo"></i>
                        重置篩選
                    </button>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Filter select changes
        const filterSelects = document.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                const filterType = e.target.getAttribute('data-filter');
                this.filters[filterType] = e.target.value;
                this.onFilterChange(this.filters);
            });
        });

        // Reset filters button
        const resetBtn = document.querySelector('.reset-filters-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.filters = {
                    brand: '',
                    drinkType: '',
                    sweetness: '',
                    calorieRange: '',
                    caffeine: ''
                };
                
                // Reset select values
                filterSelects.forEach(select => {
                    select.value = '';
                });
                
                this.onFilterChange(this.filters);
            });
        }
    }
}
