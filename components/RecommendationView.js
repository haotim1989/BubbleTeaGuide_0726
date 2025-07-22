import { FilterPanel } from './FilterPanel.js';
import { DrinkCard } from './DrinkCard.js';
import { getRecommendation } from '../utils/recommendationEngine.js';
import { applyFilters } from '../utils/filterUtils.js';

export class RecommendationView {
    constructor(drinksData) {
        this.drinksData = drinksData;
        this.filteredDrinks = [];
        this.currentRecommendation = null;
        this.filters = {};
        
        this.filterPanel = new FilterPanel(drinksData, this.onFilterChange.bind(this));
        this.updateFilteredDrinks();
    }

    onFilterChange(filters) {
        this.filters = filters;
        this.updateFilteredDrinks();
        this.renderRecommendationArea();
    }

    updateFilteredDrinks() {
        this.filteredDrinks = applyFilters(this.drinksData, this.filters);
    }

    getRandomRecommendation() {
        if (this.filteredDrinks.length === 0) {
            return null;
        }
        
        return getRecommendation(this.filteredDrinks);
    }

    renderRecommendationArea() {
        const recommendationArea = document.querySelector('.recommendation-area');
        if (!recommendationArea) return;

        if (this.filteredDrinks.length === 0) {
            recommendationArea.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>沒有符合條件的飲品</h3>
                    <p>請調整篩選條件後再試一次</p>
                </div>
            `;
            return;
        }

        const availableCount = this.filteredDrinks.length;
        
        recommendationArea.innerHTML = `
            <div class="recommendation-header">
                <h2>
                    <i class="fas fa-magic"></i>
                    為您推薦
                </h2>
                <p>找到 ${availableCount} 款符合條件的飲品</p>
            </div>
            
            <div class="recommendation-action">
                <button class="recommend-btn">
                    <i class="fas fa-dice"></i>
                    隨機推薦一款
                </button>
            </div>
            
            <div class="recommendation-result">
                ${this.currentRecommendation ? 
                    new DrinkCard(this.currentRecommendation.drink, this.currentRecommendation.sweetness).render() : 
                    `
                    <div class="empty-recommendation">
                        <div class="bubble-illustration">
                            <div class="bubble-cup">
                                <div class="bubble small"></div>
                                <div class="bubble medium"></div>
                                <div class="bubble large"></div>
                            </div>
                        </div>
                        <p>點擊上方按鈕獲得推薦</p>
                    </div>
                    `
                }
            </div>
            
            ${this.currentRecommendation ? `
                <div class="recommendation-actions">
                    <button class="find-store-btn">
                        <i class="fas fa-map-marker-alt"></i>
                        尋找附近店家
                    </button>
                    <button class="recommend-again-btn">
                        <i class="fas fa-redo"></i>
                        再推薦一款
                    </button>
                </div>
            ` : ''}
        `;

        this.bindRecommendationEvents();
    }

    bindRecommendationEvents() {
        const recommendBtn = document.querySelector('.recommend-btn');
        const recommendAgainBtn = document.querySelector('.recommend-again-btn');
        const findStoreBtn = document.querySelector('.find-store-btn');

        if (recommendBtn) {
            recommendBtn.addEventListener('click', () => {
                this.currentRecommendation = this.getRandomRecommendation();
                this.renderRecommendationArea();
            });
        }

        if (recommendAgainBtn) {
            recommendAgainBtn.addEventListener('click', () => {
                this.currentRecommendation = this.getRandomRecommendation();
                this.renderRecommendationArea();
            });
        }

        if (findStoreBtn && this.currentRecommendation) {
            findStoreBtn.addEventListener('click', () => {
                // Switch to map view and search for the brand
                const brand = this.currentRecommendation.drink.brand;
                this.onViewChange('map', { searchQuery: brand });
            });
        }
    }

    render() {
        return `
            <div class="recommendation-view">
                ${this.filterPanel.render()}
                
                <div class="recommendation-area">
                    <div class="recommendation-header">
                        <h2>
                            <i class="fas fa-magic"></i>
                            為您推薦
                        </h2>
                        <p>找到 ${this.filteredDrinks.length} 款符合條件的飲品</p>
                    </div>
                    
                    <div class="recommendation-action">
                        <button class="recommend-btn">
                            <i class="fas fa-dice"></i>
                            隨機推薦一款
                        </button>
                    </div>
                    
                    <div class="recommendation-result">
                        <div class="empty-recommendation">
                            <div class="bubble-illustration">
                                <div class="bubble-cup">
                                    <div class="bubble small"></div>
                                    <div class="bubble medium"></div>
                                    <div class="bubble large"></div>
                                </div>
                            </div>
                            <p>點擊上方按鈕獲得推薦</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.filterPanel.bindEvents();
        this.bindRecommendationEvents();
    }
}
