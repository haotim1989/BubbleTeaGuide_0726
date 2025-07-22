import { Header } from './components/Header.js';
import { RecommendationView } from './components/RecommendationView.js';
import { EncyclopediaView } from './components/EncyclopediaView.js';
import { MapView } from './components/MapView.js';
import { loadDrinksData } from './utils/drinkData.js';

class App {
    constructor() {
        this.currentView = 'recommendation';
        this.drinksData = null;
        this.init();
    }

    async init() {
        try {
            // Load drinks data
            this.drinksData = await loadDrinksData();
            
            // Initialize components
            this.header = new Header(this.onViewChange.bind(this));
            this.recommendationView = new RecommendationView(this.drinksData);
            this.encyclopediaView = new EncyclopediaView(this.drinksData);
            this.mapView = new MapView();

            // Render initial view
            this.render();
            
            // Hide loading screen
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('應用程式載入失敗，請重新整理頁面。');
        }
    }

    onViewChange(newView) {
        this.currentView = newView;
        this.render();
    }

    render() {
        const app = document.getElementById('app');
        
        let currentViewComponent;
        switch (this.currentView) {
            case 'recommendation':
                currentViewComponent = this.recommendationView.render();
                break;
            case 'encyclopedia':
                currentViewComponent = this.encyclopediaView.render();
                break;
            case 'map':
                currentViewComponent = this.mapView.render();
                break;
            default:
                currentViewComponent = this.recommendationView.render();
        }

        app.innerHTML = `
            ${this.header.render()}
            ${currentViewComponent}
        `;

        // Bind events after rendering
        this.bindEvents();
    }

    bindEvents() {
        // Re-bind component events after DOM update
        this.header.bindEvents();
        
        switch (this.currentView) {
            case 'recommendation':
                this.recommendationView.bindEvents();
                break;
            case 'encyclopedia':
                this.encyclopediaView.bindEvents();
                break;
            case 'map':
                this.mapView.bindEvents();
                break;
        }
    }

    showError(message) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="error-screen">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>發生錯誤</h2>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-button">重試</button>
            </div>
        `;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
