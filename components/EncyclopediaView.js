import { FilterPanel } from './FilterPanel.js';
import { DrinkCard } from './DrinkCard.js';
import { applyFilters } from '../utils/filterUtils.js';

export class EncyclopediaView {
    constructor(drinksData) {
        this.drinksData = drinksData;
        this.filteredDrinks = [];
        this.sortBy = 'name';
        this.sortOrder = 'asc';
        this.filters = {};
        
        this.filterPanel = new FilterPanel(drinksData, this.onFilterChange.bind(this));
        this.updateFilteredDrinks();
    }

    onFilterChange(filters) {
        this.filters = filters;
        this.updateFilteredDrinks();
        this.renderDrinksList();
    }

    updateFilteredDrinks() {
        this.filteredDrinks = applyFilters(this.drinksData, this.filters);
        this.sortDrinks();
    }

    sortDrinks() {
        this.filteredDrinks.sort((a, b) => {
            let valueA, valueB;
            
            switch (this.sortBy) {
                case 'name':
                    valueA = a.name;
                    valueB = b.name;
                    break;
                case 'brand':
                    valueA = a.brand;
                    valueB = b.brand;
                    break;
                case 'calories':
                    valueA = a.calories_large_cup.full_sugar_100.total_kcal;
                    valueB = b.calories_large_cup.full_sugar_100.total_kcal;
                    break;
                case 'caffeine':
                    valueA = a.caffeine ? 1 : 0;
                    valueB = b.caffeine ? 1 : 0;
                    break;
                default:
                    valueA = a.name;
                    valueB = b.name;
            }

            if (this.sortOrder === 'asc') {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            } else {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            }
        });
    }

    renderDrinksList() {
        const drinksListContainer = document.querySelector('.drinks-list-container');
        if (!drinksListContainer) return;

        if (this.filteredDrinks.length === 0) {
            drinksListContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>沒有符合條件的飲品</h3>
                    <p>請調整篩選條件後再試一次</p>
                </div>
            `;
            return;
        }

        drinksListContainer.innerHTML = `
            <div class="list-header">
                <div class="results-count">
                    <span>共找到 ${this.filteredDrinks.length} 款飲品</span>
                </div>
                <div class="sort-controls">
                    <label>排序：</label>
                    <select class="sort-select" id="sortBy">
                        <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>名稱</option>
                        <option value="brand" ${this.sortBy === 'brand' ? 'selected' : ''}>品牌</option>
                        <option value="calories" ${this.sortBy === 'calories' ? 'selected' : ''}>熱量</option>
                        <option value="caffeine" ${this.sortBy === 'caffeine' ? 'selected' : ''}>咖啡因</option>
                    </select>
                    <button class="sort-order-btn ${this.sortOrder === 'desc' ? 'desc' : 'asc'}" id="sortOrder">
                        <i class="fas fa-sort-${this.sortOrder === 'asc' ? 'up' : 'down'}"></i>
                    </button>
                </div>
            </div>
            
            <div class="drinks-grid">
                ${this.filteredDrinks.map(drink => 
                    new DrinkCard(drink).render()
                ).join('')}
            </div>
        `;

        this.bindListEvents();
    }

    bindListEvents() {
        const sortSelect = document.getElementById('sortBy');
        const sortOrderBtn = document.getElementById('sortOrder');

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.updateFilteredDrinks();
                this.renderDrinksList();
            });
        }

        if (sortOrderBtn) {
            sortOrderBtn.addEventListener('click', () => {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
                this.updateFilteredDrinks();
                this.renderDrinksList();
            });
        }

        // Bind events for drink cards
        this.filteredDrinks.forEach((drink, index) => {
            const drinkCard = new DrinkCard(drink);
            drinkCard.bindEvents();
        });
    }

    render() {
        return `
            <div class="encyclopedia-view">
                ${this.filterPanel.render()}
                
                <div class="drinks-list-container">
                    <div class="list-header">
                        <div class="results-count">
                            <span>共找到 ${this.filteredDrinks.length} 款飲品</span>
                        </div>
                        <div class="sort-controls">
                            <label>排序：</label>
                            <select class="sort-select" id="sortBy">
                                <option value="name">名稱</option>
                                <option value="brand">品牌</option>
                                <option value="calories">熱量</option>
                                <option value="caffeine">咖啡因</option>
                            </select>
                            <button class="sort-order-btn asc" id="sortOrder">
                                <i class="fas fa-sort-up"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="drinks-grid">
                        ${this.filteredDrinks.map(drink => 
                            new DrinkCard(drink).render()
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.filterPanel.bindEvents();
        this.bindListEvents();
    }
}
