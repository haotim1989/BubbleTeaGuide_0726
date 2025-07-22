export class Header {
    constructor(onViewChange) {
        this.onViewChange = onViewChange;
        this.activeView = 'recommendation';
    }

    render() {
        return `
            <header class="app-header">
                <div class="header-content">
                    <div class="logo">
                        <i class="fas fa-coffee"></i>
                        <span>手搖飲推薦</span>
                    </div>
                    <nav class="nav-tabs">
                        <button class="nav-tab ${this.activeView === 'recommendation' ? 'active' : ''}" 
                                data-view="recommendation">
                            <i class="fas fa-dice"></i>
                            <span>隨機推薦</span>
                        </button>
                        <button class="nav-tab ${this.activeView === 'encyclopedia' ? 'active' : ''}" 
                                data-view="encyclopedia">
                            <i class="fas fa-book"></i>
                            <span>熱量圖鑑</span>
                        </button>
                        <button class="nav-tab ${this.activeView === 'map' ? 'active' : ''}" 
                                data-view="map">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>附近店家</span>
                        </button>
                    </nav>
                </div>
            </header>
        `;
    }

    bindEvents() {
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const newView = e.currentTarget.getAttribute('data-view');
                this.activeView = newView;
                this.onViewChange(newView);
            });
        });
    }
}
