# replit.md

## Overview

This is a Taiwanese bubble tea recommendation app called "台灣手搖飲推薦 - 熱量追蹤器" (Taiwan Hand-Shaken Drink Recommendation - Calorie Tracker). The application is a client-side web app built with vanilla JavaScript that helps users discover bubble tea drinks, track calories, and find nearby stores.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Vanilla JavaScript with ES6 modules
- **Architecture Pattern**: Component-based architecture with a main App class orchestrating view components
- **Styling**: Custom CSS with a milk tea and matcha color theme
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox

### Key Components
The application follows a modular component structure:

1. **App.js**: Main application controller that manages view switching and component initialization
2. **Header.js**: Navigation component with tab-based view switching
3. **RecommendationView.js**: Random drink recommendation feature with filtering
4. **EncyclopediaView.js**: Browse and filter all available drinks
5. **MapView.js**: Store locator using Google Maps API
6. **DrinkCard.js**: Reusable component for displaying drink information
7. **FilterPanel.js**: Advanced filtering controls for drinks

### Data Flow
1. App loads drinks data from JSON file on initialization
2. Data is passed down to view components through constructor injection
3. Filter changes trigger callbacks that update filtered datasets
4. Components re-render when data or filters change
5. View switching is handled through the main App class

## Key Components

### Data Management
- **Static JSON Data**: Drinks data stored in `data/drinks.json` with detailed calorie information
- **Data Utilities**: Helper functions in `utils/drinkData.js` for data manipulation
- **No Database**: Currently uses static JSON files, no backend database

### Filtering System
- **Multi-criteria Filtering**: Brand, drink type, caffeine content, calorie range, sweetness level
- **Real-time Updates**: Filters applied immediately without page refresh
- **Filter Persistence**: Filter state maintained during user session

### Recommendation Engine
- **Random Selection**: Basic random recommendation from filtered results
- **Weighted Recommendations**: Advanced algorithm considering user preferences
- **Sweetness Variation**: Randomly selects sweetness level for variety

### Map Integration
- **Google Maps API**: Store locator functionality
- **Geolocation**: User location detection for nearby store search
- **Place Search**: Integration with Google Places API for store discovery

## Data Structure

### Drink Data Schema
```javascript
{
  "brand_name": {
    "data_source": "url",
    "products": [
      {
        "name": "drink_name",
        "brand": "brand_name",
        "caffeine": boolean,
        "calories_large_cup": {
          "full_sugar_100": { "total_kcal": number, "sugar_grams": number },
          "less_sugar_80": { "total_kcal": number },
          "half_sugar_60": { "total_kcal": number },
          "low_sugar_40": { "total_kcal": number },
          "no_sugar_0": { "total_kcal": number }
        }
      }
    ]
  }
}
```

## External Dependencies

### Third-party Services
- **Google Maps JavaScript API**: For map functionality and store location
- **Font Awesome**: Icon library for UI elements

### API Keys
- Google Maps API key embedded in HTML (should be moved to environment variables in production)

### CDN Dependencies
- Font Awesome CSS from CDN
- Google Maps API loaded from Google's servers

## Deployment Strategy

### Current Setup
- **Static Hosting**: Designed for static web hosting (GitHub Pages, Netlify, Vercel)
- **No Build Process**: Direct deployment of source files
- **Client-side Only**: No server-side components required

### Architecture Decisions

1. **Vanilla JavaScript Choice**: 
   - **Problem**: Need for lightweight, fast-loading app
   - **Solution**: Vanilla JS with ES6 modules
   - **Rationale**: Avoid framework overhead, better performance, easier deployment

2. **Component-based Architecture**:
   - **Problem**: Code organization and reusability
   - **Solution**: Class-based components with clear separation
   - **Rationale**: Maintainable code structure without framework complexity

3. **Static JSON Data**:
   - **Problem**: Need for drink database
   - **Solution**: Static JSON files with comprehensive calorie data
   - **Rationale**: Simple deployment, no backend needed, easy data updates

4. **Client-side Filtering**:
   - **Problem**: Fast search and filter experience
   - **Solution**: All filtering logic in browser
   - **Rationale**: Instant response, no server requests needed

5. **Google Maps Integration**:
   - **Problem**: Store location functionality
   - **Solution**: Direct Google Maps API integration
   - **Rationale**: Reliable mapping service, rich features

### Future Considerations
- Database integration for dynamic data management
- Backend API for user preferences and history
- Progressive Web App (PWA) features
- User authentication for personalized recommendations