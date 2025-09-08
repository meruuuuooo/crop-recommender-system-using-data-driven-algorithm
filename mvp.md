# CropTAP MVP Documentation

## Project Overview

**CropTAP** is an intelligent agricultural recommendation system built with Laravel 12 and React 19 that provides farmers with data-driven crop recommendations based on soil conditions, climate data, and farming parameters. The system combines traditional agricultural knowledge with modern web technologies to help farmers make informed decisions about crop selection.

## Technology Stack

### Backend
- **Laravel 12.22.1** - PHP framework with streamlined file structure
- **PHP 8.2.12** - Server-side language
- **MySQL** - Primary database engine
- **Inertia.js 2.0.4** - Server-side rendering with SPA-like experience

### Frontend
- **React 19.0.0** - Frontend JavaScript library
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS 4.0.0** - Utility-first CSS framework
- **shadcn/ui & Radix UI** - Modern component libraries

### Development Tools
- **Vite** - Frontend build tool and dev server
- **Pest 3.8.2** - PHP testing framework
- **Laravel Pint 1.24.0** - Code formatting
- **Ziggy 2.5.3** - Laravel route generation for JavaScript

## Core Features

### 1. Farmer Management System
- **Farmer Registration**: Register farmers with personal details, farming experience, and location
- **Profile Management**: Update farmer information and track farming history
- **Location Integration**: Province, Municipality, and Barangay geographic hierarchy

### 2. Farm Management
- **Farm Registration**: Add farms with details like total area, previous crops, and location
- **Multi-farm Support**: Farmers can manage multiple farms
- **Farm Analytics**: Track farm performance and historical data

### 3. Crop Database & Management
- **Comprehensive Crop Library**: 40+ crop varieties across 10 categories:
  - Corn varieties
  - Fruit Trees (Mango, Papaya, Pineapple, Banana)
  - Palm Trees (Coconut, Palm Oil)
  - Plantation Crops (Coffee, Cacao, Rubber, Sugarcane)
  - Rice varieties
  - Root Crops (Cassava, Sweet Potato, Taro, Yam)
  - Fruit Vegetables (Eggplant, Tomato, Pepper, Cucumber)
  - Non-tree Fruits (Cantaloupe, Muskmelon)
  - Leafy/Aquatic Vegetables
  - Spices & Legumes

- **Crop Information**: Each crop includes:
  - Soil type requirements
  - Planting seasons
  - Maturity periods
  - Category classification

### 4. Intelligent Crop Recommendation Engine
- **Soil Analysis Input**: 
  - Soil type selection (Sand, Sandy Loam, Loam, Silt Loam, Clay Loam, Clay)
  - NPK levels (Nitrogen, Phosphorus, Potassium) with color-coded ranges
  - pH level measurement (0-14 scale)

- **Climate Data Integration**:
  - Temperature input
  - Annual rainfall (0-1000mm)
  - Humidity percentage (0-100%)
  - Optional climate data fetching functionality

- **AI-Powered Recommendations**:
  - Machine learning model integration via HTTP API
  - Top 3 crop recommendations with confidence scores
  - Personalized recommendations based on farmer and farm data

### 5. Recommendation History & Analytics
- **Recent Recommendations**: Display of last 5 recommendations
- **Confidence Scoring**: Percentage-based recommendation confidence
- **Historical Tracking**: Store all recommendations with timestamps
- **Farm-specific Recommendations**: Link recommendations to specific farms

### 6. Agricultural Resource Database
- **Fertilizer Management**: Product database with company information, target crops, and registration numbers
- **Pesticide Database**: Comprehensive pesticide information with toxicity levels and target applications

## Database Architecture

### Core Models
1. **User** - System authentication and user management
2. **Farmer** - Farmer profiles with personal and farming details
3. **Farm** - Farm properties and characteristics
4. **Location** - Geographic hierarchy (Province → Municipality → Barangay)
5. **Crop** - Crop database with agricultural specifications
6. **Category** - Crop categorization system
7. **Recommendation** - AI-generated crop recommendations with confidence scores
8. **Soil** - Soil test data and characteristics
9. **Climate** - Climate and weather data
10. **Fertilizer** - Agricultural fertilizer products database
11. **Pesticide** - Pesticide and crop protection products

### Relationship Architecture
- Farmers can have multiple Farms
- Farms belong to specific Locations
- Recommendations link Farmers, Farms, and Crops
- Crops belong to Categories
- Soil and Climate data are associated with Farms
- Many-to-many relationships between Crops and Fertilizers/Pesticides

## User Interface & Experience

### Design System
- **Color Scheme**: Green-focused agricultural theme (#619154 primary)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Component Library**: shadcn/ui for consistent, modern UI components

### Key User Flows

#### 1. Farmer Registration Flow
1. Access registration page
2. Enter farmer details (name, contact, experience)
3. Select location (Province → Municipality → Barangay)
4. Submit and confirm registration

#### 2. Farm Setup Flow
1. Navigate to farm management
2. Add new farm with details
3. Specify total area and previous crops
4. Associate with registered farmer

#### 3. Crop Recommendation Flow
1. Select farmer from dropdown
2. Choose associated farm
3. Input soil test data (type, NPK levels, pH)
4. Enter climate information
5. Generate AI-powered recommendations
6. View top 3 crop suggestions with confidence scores
7. Access detailed crop information

### Interactive Features
- **Searchable Dropdowns**: Advanced search functionality for farmers and farms
- **Range Sliders**: pH level input with visual feedback
- **Color-coded Indicators**: NPK levels with intuitive color representations
- **Data Tables**: Sortable and filterable crop, fertilizer, and pesticide listings
- **Real-time Validation**: Form validation with immediate feedback

## Technical Implementation

### Backend Architecture
- **Controllers**: RESTful API design with dedicated controllers for each domain
- **Requests**: Form validation using Laravel Request classes
- **Models**: Eloquent ORM with proper relationships and type hints
- **Factories & Seeders**: Comprehensive test data generation
- **API Integration**: HTTP client for machine learning model communication

### Frontend Architecture
- **Component Structure**: Modular React components with TypeScript
- **State Management**: React hooks and Inertia.js for server state
- **Form Handling**: Inertia.js form utilities with validation
- **Routing**: Server-side routing with client-side navigation
- **Type Safety**: Full TypeScript implementation with proper interfaces

### Data Flow
1. **Input Validation**: Client-side and server-side validation
2. **API Processing**: Laravel processes and validates input data
3. **ML Integration**: Soil and climate data sent to machine learning API
4. **Response Handling**: AI recommendations processed and stored
5. **Real-time Updates**: Immediate UI updates with new recommendations

## Security & Performance

### Security Features
- **Authentication**: Laravel's built-in authentication system
- **Authorization**: Role-based access control
- **CSRF Protection**: Cross-site request forgery protection
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Prevention**: Eloquent ORM protection

### Performance Optimizations
- **Eager Loading**: Prevent N+1 queries with relationship loading
- **Pagination**: Efficient data handling for large datasets
- **Caching**: Strategic caching for static agricultural data
- **Asset Optimization**: Vite for optimized frontend builds

## Testing Strategy

### Backend Testing (Pest)
- **Unit Tests**: Model and business logic testing
- **Feature Tests**: End-to-end functionality testing
- **Database Testing**: Factory-based test data generation
- **API Testing**: Recommendation engine endpoint testing

### Test Coverage Areas
- Farmer and farm management
- Crop recommendation logic
- Data validation and sanitization
- Agricultural resource management

## Deployment & DevOps

### Environment Requirements
- PHP 8.2+ with required extensions
- MySQL 8.0+ database
- Node.js 18+ for frontend builds
- Web server (Apache/Nginx)

### Build Process
1. Composer dependency installation
2. NPM package installation and build
3. Environment configuration
4. Database migration and seeding
5. Asset compilation and optimization

## Future Enhancements

### Planned Features
1. **Weather API Integration**: Real-time weather data fetching
2. **Mobile Application**: React Native companion app
3. **Crop Calendar**: Seasonal planting and harvesting schedules
4. **Yield Prediction**: Historical yield analysis and forecasting
5. **Market Price Integration**: Real-time crop pricing information
6. **Multi-language Support**: Localization for different regions
7. **Advanced Analytics**: Dashboard with farming insights and trends
8. **Community Features**: Farmer forums and knowledge sharing

### Scalability Considerations
- **Microservices Architecture**: Separate recommendation engine
- **CDN Integration**: Global content delivery
- **Database Sharding**: Regional data distribution
- **Load Balancing**: High-availability deployment
- **Caching Layer**: Redis for session and data caching

## API Documentation

### Recommendation Endpoint
```http
POST /recommendation/crop
Content-Type: application/json

{
  "farmer_id": "integer",
  "farm_id": "integer", 
  "soilType": "string",
  "nitrogen_level": "string",
  "phosphorus_level": "string",
  "potassium_level": "string",
  "ph_level": "float",
  "temperature": "numeric",
  "rainfall": "numeric",
  "humidity": "numeric"
}
```

### Response Format
```json
{
  "status": "success",
  "top_3_recommendations": [
    {
      "crop": "Rice",
      "confidence_score": "85%"
    }
  ]
}
```

## Business Value Proposition

### For Farmers
- **Increased Crop Yields**: Data-driven crop selection
- **Risk Reduction**: Scientific approach to farming decisions
- **Cost Optimization**: Better resource allocation
- **Knowledge Access**: Agricultural best practices and information

### For Agricultural Organizations
- **Extension Services**: Digital tools for agricultural extension
- **Data Collection**: Comprehensive farming data for analysis
- **Resource Planning**: Better understanding of regional farming patterns
- **Technology Transfer**: Modern agricultural technology adoption

### For Researchers
- **Data Analytics**: Large-scale agricultural data collection
- **Pattern Recognition**: Regional farming trend analysis
- **Model Improvement**: Continuous ML model enhancement
- **Impact Assessment**: Agricultural intervention effectiveness

## Success Metrics

### Technical KPIs
- **System Uptime**: 99.9% availability target
- **Response Time**: <2 seconds for recommendations
- **Data Accuracy**: 95%+ recommendation confidence
- **User Adoption**: Monthly active users growth

### Agricultural Impact KPIs
- **Yield Improvement**: Average yield increase percentage
- **Farmer Satisfaction**: User feedback and ratings
- **Adoption Rate**: Number of recommendations implemented
- **Regional Coverage**: Geographic spread of users

## Getting Started

### For Developers
1. Clone the repository
2. Install dependencies (`composer install`, `npm install`)
3. Configure environment variables
4. Run migrations and seeders
5. Start development servers (`npm run dev`, `php artisan serve`)

### For Users
1. Register as a farmer
2. Add farm information
3. Input soil and climate data
4. Generate crop recommendations
5. Implement suggested crops

---

**CropTAP** represents a modern approach to agricultural decision-making, combining traditional farming knowledge with cutting-edge technology to empower farmers with data-driven insights for sustainable and profitable crop production.
