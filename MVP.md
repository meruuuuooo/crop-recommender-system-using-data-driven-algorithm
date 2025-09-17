# CropTAP - Minimum Viable Product (MVP)

## Project Overview

**CropTAP** is an agricultural recommendation system built with Laravel 12 and React 19, designed to help farmers make informed decisions about crop selection, fertilizer usage, and pesticide management based on environmental conditions and soil analysis.

## Technology Stack

- **Backend**: PHP 8.2.12, Laravel 12.22.1
- **Frontend**: React 19.0.0, TypeScript
- **UI Framework**: Tailwind CSS 4.0.0, shadcn/ui, Radix UI
- **Data Exchange**: Inertia.js 2.0.4
- **Database**: MySQL
- **Testing**: Pest 3.8.2
- **Code Quality**: Laravel Pint 1.24.0

## Core Features

### 1. User Authentication & Authorization
- **User Registration/Login**: Secure authentication system
- **Profile Management**: Users can manage their personal information
- **Password Management**: Password reset and update functionality
- **Email Verification**: Email verification for new accounts

### 2. Farm Management
- **Farm Registration**: Farmers can register their farms with location details
- **Farm Information**: Track farm size, location (Province, Municipality, Barangay)
- **Farm Editing**: Update farm details and information
- **Farm Viewing**: Display comprehensive farm information

### 3. Farmer Management
- **Farmer Profiles**: Comprehensive farmer information management
- **Farmer Directory**: View and search farmer profiles
- **Contact Information**: Maintain farmer contact details
- **Farm Associations**: Link farmers to their respective farms

### 4. Crop Recommendation System
- **Smart Recommendations**: AI-driven crop recommendations based on:
  - Soil conditions and test results
  - Climate data and weather patterns
  - Location-specific factors
  - Historical success rates
- **Recommendation Confidence Scores**: Reliability metrics for each recommendation
- **Seasonal Calendar**: Crop planting and harvesting calendar
- **PDF Export**: Download recommendation reports

### 5. Fertilizer & Pesticide Management
- **Fertilizer Recommendations**: Tailored fertilizer suggestions for specific crops
- **Pesticide Guidance**: Appropriate pesticide recommendations
- **Chemical Safety Information**: Usage guidelines and safety measures
- **Application Timing**: Optimal timing for chemical applications

### 6. Environmental Data Integration
- **Soil Analysis**: Comprehensive soil testing and analysis tracking
- **Climate Monitoring**: Weather and climate condition tracking
- **Location-Based Data**: Geographic-specific environmental factors
- **Historical Data**: Track environmental changes over time

### 7. Reporting & Analytics
- **Soil Test History Reports**: Track soil test results over time
- **Climate-Based Crop Reports**: Recommendations based on climate conditions
- **High-Confidence Crop Lists**: Most reliable crop recommendations
- **Farm Portfolio Reports**: Complete farm information for specific farmers
- **Location-Specific Reports**: Area-based crop recommendations
- **Comprehensive Environmental Reports**: Soil and climate combined analysis
- **Performance Analytics**: Success rates and recommendation effectiveness

### 8. Dashboard & User Interface
- **Responsive Design**: Mobile-first, responsive user interface
- **Interactive Dashboard**: Overview of farms, recommendations, and key metrics
- **Data Visualization**: Charts and graphs for better data understanding
- **User-Friendly Navigation**: Intuitive menu system and navigation

## Data Models

### Core Entities
- **User**: System users (farmers, administrators)
- **Farmer**: Farmer profiles and information
- **Farm**: Individual farm properties
- **Location Hierarchy**: Province → Municipality → Barangay
- **Crop**: Available crop types and categories
- **Soil**: Soil analysis and test results
- **Climate**: Weather and climate data
- **Fertilizer**: Available fertilizers and their properties
- **Pesticide**: Pesticide catalog and usage guidelines
- **Recommendation**: Generated crop recommendations

### Relationships
- Farmers can own multiple Farms
- Farms belong to specific Locations (Province/Municipality/Barangay)
- Recommendations are generated for specific Farmers and Farms
- Crops can have multiple Fertilizer and Pesticide associations
- Soil and Climate data are linked to specific Locations and Farms

## Key User Journeys

### Farmer Onboarding
1. **Registration**: New farmer creates account
2. **Profile Setup**: Complete farmer profile information
3. **Farm Registration**: Add farm details and location
4. **Initial Assessment**: Input soil and environmental data

### Getting Crop Recommendations
1. **Farm Selection**: Choose farm for recommendation
2. **Data Input**: Provide current soil and climate conditions
3. **Recommendation Generation**: System analyzes data and provides suggestions
4. **Review Results**: View detailed recommendations with confidence scores
5. **Export/Save**: Download PDF reports for offline use

### Farm Management
1. **Farm Overview**: View all registered farms
2. **Farm Details**: Access comprehensive farm information
3. **Update Information**: Modify farm details as needed
4. **Performance Tracking**: Monitor recommendation success rates

## Success Metrics

### User Engagement
- Number of registered farmers
- Active monthly users
- Average session duration
- Recommendation requests per user

### System Performance
- Recommendation accuracy rates
- User satisfaction scores
- System response times
- Data accuracy and completeness

### Business Impact
- Crop yield improvements
- Farmer decision-making speed
- Reduction in crop failures
- User retention rates

## Technical Requirements

### Performance
- Page load times under 2 seconds
- Mobile-responsive design
- Offline capability for critical features
- Real-time data updates

### Security
- Secure user authentication
- Data encryption in transit and at rest
- Input validation and sanitization
- Protection against common web vulnerabilities

### Scalability
- Support for thousands of concurrent users
- Efficient database queries and indexing
- Caching strategies for frequently accessed data
- API rate limiting and throttling

## Future Enhancements (Post-MVP)

### Advanced Features
- **IoT Integration**: Connect with soil sensors and weather stations
- **Machine Learning**: Improved recommendation algorithms
- **Mobile App**: Native mobile applications
- **Marketplace Integration**: Connect farmers with suppliers
- **Community Features**: Farmer forums and knowledge sharing

### Analytics & Insights
- **Predictive Analytics**: Forecast crop yields and market prices
- **Market Intelligence**: Price trends and demand forecasting
- **Regional Analysis**: Area-wide agricultural insights
- **Government Integration**: Connect with agricultural extension services

## Development Phases

### Phase 1: Core MVP (Weeks 1-4)
- User authentication and basic profiles
- Farm and farmer management
- Basic recommendation engine
- Simple reporting

### Phase 2: Enhanced Features (Weeks 5-8)
- Advanced recommendation algorithms
- Comprehensive reporting system
- PDF export functionality
- Enhanced UI/UX

### Phase 3: Polish & Optimization (Weeks 9-12)
- Performance optimization
- Testing and bug fixes
- User feedback integration
- Documentation and deployment

## Conclusion

CropTAP MVP provides a solid foundation for agricultural decision-making support, focusing on essential features that deliver immediate value to farmers while establishing a platform for future enhancements. The system emphasizes data-driven recommendations, user-friendly interfaces, and comprehensive farm management capabilities.
