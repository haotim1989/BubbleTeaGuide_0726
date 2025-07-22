export class MapView {
    constructor() {
        this.map = null;
        this.markers = [];
        this.userLocation = null;
        this.searchQuery = '';
    }

    render() {
        return `
            <div class="map-view">
                <div class="map-header">
                    <h2>
                        <i class="fas fa-map-marker-alt"></i>
                        附近店家
                    </h2>
                    <div class="search-controls">
                        <div class="search-input-group">
                            <input type="text" 
                                   class="store-search-input" 
                                   placeholder="搜尋品牌或店家..." 
                                   value="${this.searchQuery}">
                            <button class="search-btn">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                        <button class="locate-me-btn">
                            <i class="fas fa-crosshairs"></i>
                            找我位置
                        </button>
                    </div>
                </div>
                
                <div class="map-container">
                    <div id="google-map" class="google-map"></div>
                    <div class="map-loading" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p>載入地圖中...</p>
                    </div>
                </div>
                
                <div class="stores-list">
                    <div class="stores-header">
                        <h3>附近店家</h3>
                        <span class="stores-count">搜尋中...</span>
                    </div>
                    <div class="stores-results">
                        <div class="no-stores">
                            <i class="fas fa-store"></i>
                            <p>請使用上方搜尋功能尋找附近店家</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        setTimeout(() => {
            this.initMap();
            this.bindSearchEvents();
        }, 100);
    }

    initMap() {
        const mapElement = document.getElementById('google-map');
        if (!mapElement) return;

        // Default location (台北101)
        const defaultLocation = { lat: 25.0340, lng: 121.5645 };

        this.map = new google.maps.Map(mapElement, {
            zoom: 15,
            center: defaultLocation,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
        });

        // Get user location
        this.getCurrentLocation();
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            const loadingElement = document.querySelector('.map-loading');
            if (loadingElement) {
                loadingElement.style.display = 'flex';
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    this.map.setCenter(this.userLocation);
                    
                    // Add user location marker
                    new google.maps.Marker({
                        position: this.userLocation,
                        map: this.map,
                        title: '您的位置',
                        icon: {
                            url: 'data:image/svg+xml;base64,' + btoa(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#4285F4">
                                    <circle cx="12" cy="12" r="8"/>
                                    <circle cx="12" cy="12" r="3" fill="white"/>
                                </svg>
                            `),
                            scaledSize: new google.maps.Size(24, 24),
                            anchor: new google.maps.Point(12, 12)
                        }
                    });
                    
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                    }
                    this.showLocationError();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        } else {
            this.showLocationError();
        }
    }

    showLocationError() {
        const storesResults = document.querySelector('.stores-results');
        if (storesResults) {
            storesResults.innerHTML = `
                <div class="location-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>無法取得您的位置</p>
                    <small>請允許位置權限或手動搜尋店家</small>
                </div>
            `;
        }
    }

    bindSearchEvents() {
        const searchInput = document.querySelector('.store-search-input');
        const searchBtn = document.querySelector('.search-btn');
        const locateMeBtn = document.querySelector('.locate-me-btn');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput ? searchInput.value.trim() : '';
                if (query) {
                    this.searchStores(query);
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value.trim();
                    if (query) {
                        this.searchStores(query);
                    }
                }
            });
        }

        if (locateMeBtn) {
            locateMeBtn.addEventListener('click', () => {
                this.getCurrentLocation();
            });
        }
    }

    searchStores(query) {
        if (!this.map) return;

        const service = new google.maps.places.PlacesService(this.map);
        const center = this.userLocation || this.map.getCenter();

        // Clear existing markers
        this.clearMarkers();

        // Show loading
        const storesResults = document.querySelector('.stores-results');
        const storesCount = document.querySelector('.stores-count');
        
        if (storesResults) {
            storesResults.innerHTML = `
                <div class="searching-stores">
                    <div class="loading-spinner"></div>
                    <p>搜尋中...</p>
                </div>
            `;
        }

        const request = {
            location: center,
            radius: 2000, // 2km radius
            query: query + ' 手搖飲 飲料店',
            type: 'restaurant'
        };

        service.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesService.OK && results.length > 0) {
                this.displayStores(results);
                if (storesCount) {
                    storesCount.textContent = `找到 ${results.length} 家店`;
                }
            } else {
                this.showNoStoresFound(query);
                if (storesCount) {
                    storesCount.textContent = '沒有找到店家';
                }
            }
        });
    }

    displayStores(stores) {
        const storesResults = document.querySelector('.stores-results');
        if (!storesResults) return;

        // Add markers to map
        stores.forEach((store, index) => {
            const marker = new google.maps.Marker({
                position: store.geometry.location,
                map: this.map,
                title: store.name,
                icon: {
                    url: 'data:image/svg+xml;base64,' + btoa(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#8B4513">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 32)
                }
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div class="store-info-window">
                        <h4>${store.name}</h4>
                        <p>${store.formatted_address}</p>
                        ${store.rating ? `<div class="rating">★ ${store.rating}</div>` : ''}
                        ${store.opening_hours && store.opening_hours.open_now !== undefined ? 
                            `<div class="status ${store.opening_hours.open_now ? 'open' : 'closed'}">
                                ${store.opening_hours.open_now ? '營業中' : '已休息'}
                            </div>` : ''
                        }
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(this.map, marker);
            });

            this.markers.push(marker);
        });

        // Display stores list
        storesResults.innerHTML = `
            <div class="stores-grid">
                ${stores.map((store, index) => `
                    <div class="store-card" data-index="${index}">
                        <div class="store-header">
                            <h4>${store.name}</h4>
                            ${store.rating ? `
                                <div class="store-rating">
                                    <i class="fas fa-star"></i>
                                    <span>${store.rating}</span>
                                </div>
                            ` : ''}
                        </div>
                        <p class="store-address">${store.formatted_address}</p>
                        <div class="store-footer">
                            ${store.opening_hours && store.opening_hours.open_now !== undefined ? `
                                <span class="store-status ${store.opening_hours.open_now ? 'open' : 'closed'}">
                                    ${store.opening_hours.open_now ? '營業中' : '已休息'}
                                </span>
                            ` : ''}
                            <button class="directions-btn" data-lat="${store.geometry.location.lat()}" 
                                    data-lng="${store.geometry.location.lng()}">
                                <i class="fas fa-directions"></i>
                                導航
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.bindStoreEvents();

        // Adjust map to show all markers
        const bounds = new google.maps.LatLngBounds();
        stores.forEach(store => {
            bounds.extend(store.geometry.location);
        });
        if (this.userLocation) {
            bounds.extend(this.userLocation);
        }
        this.map.fitBounds(bounds);
    }

    showNoStoresFound(query) {
        const storesResults = document.querySelector('.stores-results');
        if (storesResults) {
            storesResults.innerHTML = `
                <div class="no-stores">
                    <i class="fas fa-store-slash"></i>
                    <h4>找不到相關店家</h4>
                    <p>搜尋「${query}」沒有找到附近的店家</p>
                    <small>請嘗試其他關鍵字或擴大搜尋範圍</small>
                </div>
            `;
        }
    }

    bindStoreEvents() {
        // Store card clicks - center map on store
        const storeCards = document.querySelectorAll('.store-card');
        storeCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (this.markers[index]) {
                    this.map.setCenter(this.markers[index].getPosition());
                    this.map.setZoom(17);
                    google.maps.event.trigger(this.markers[index], 'click');
                }
            });
        });

        // Directions buttons
        const directionsButtons = document.querySelectorAll('.directions-btn');
        directionsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lat = e.currentTarget.getAttribute('data-lat');
                const lng = e.currentTarget.getAttribute('data-lng');
                
                const destination = `${lat},${lng}`;
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                window.open(mapsUrl, '_blank');
            });
        });
    }

    clearMarkers() {
        this.markers.forEach(marker => {
            marker.setMap(null);
        });
        this.markers = [];
    }
}
