# 🎨 Dynamic Banner System

## 🚀 Overview

The Dynamic Banner System integrates with the Banner API to provide rotating banners on the explore page. The system supports multiple banner types, target audience filtering, priority-based ordering, and date-based activation.

## 🎯 Features

### ✅ Dynamic Banner Loading
- **API Integration**: Fetches banners from `/api/user/banners/` endpoint
- **Real-time Updates**: Banners update when user profile changes
- **Auto-rotation**: Banners rotate every 5 seconds automatically
- **Manual Navigation**: Users can navigate banners with arrow buttons and dots

### ✅ Smart Filtering
- **Active Banners**: Only shows banners that are currently active
- **Date Filtering**: Respects display start and end dates
- **Priority Ordering**: Banners sorted by priority (higher priority first)
- **Target Audience**: Filters banners based on user type and status

### ✅ User Experience
- **Clickable Banners**: Banners can link to external URLs
- **Responsive Design**: Works on both desktop and mobile
- **Loading States**: Shows loading indicators while fetching banners
- **Fallback Handling**: Graceful handling when no banners are available

## 📁 File Structure

```
src/
├── services/
│   └── bannerApi.ts              # Banner API service
├── explore.tsx                   # Updated explore page with banner integration
└── BANNER_SYSTEM_README.md       # This documentation
```

## 🔧 Components

### 1. BannerApi Service

**Location**: `src/services/bannerApi.ts`

**Features**:
- Complete CRUD operations for banners
- Smart filtering and sorting
- Target audience filtering
- Date-based activation checking
- Error handling and retry logic

**Key Methods**:
```typescript
// Get homepage banners
getHomepageBanners(limit: number): Promise<Banner[]>

// Get banners with filtering
getBanners(options: { type?: string; limit?: number }): Promise<Banner[]>

// Check if banner is active
isBannerActive(banner: Banner): boolean

// Filter active banners
filterActiveBanners(banners: Banner[]): Banner[]

// Sort by priority
sortBannersByPriority(banners: Banner[]): Banner[]

// Filter by target audience
filterBannersForUser(banners: Banner[], userType?: string, isNewUser?: boolean): Banner[]
```

### 2. Explore Page Integration

**Location**: `src/explore.tsx`

**Features**:
- Dynamic banner loading and display
- Auto-rotation with 5-second intervals
- Manual navigation controls
- Click handling for banner URLs
- Loading states and error handling

## 🛣️ API Integration

### Banner API Endpoints

#### Get Banners
```bash
GET /api/user/banners/?type=homepage&limit=5
```

**Query Parameters**:
- `type` (optional): Banner type filter
  - `homepage` - Homepage banners (default)
  - `promotional` - Promotional banners
  - `seasonal` - Seasonal banners
  - `vendor_spotlight` - Vendor spotlight banners
- `limit` (optional): Maximum number of banners (default: 5)

**Response**:
```json
{
  "success": true,
  "count": 3,
  "banner_type": "homepage",
  "banners": [
    {
      "id": 1,
      "title": "Summer Sale Banner",
      "description": "50% off on all food items",
      "banner_image": "https://res.cloudinary.com/your-cloud/image/upload/w_1180,h_192,c_fill,f_auto,q_auto/banners/summer_sale.jpg",
      "banner_type": "homepage",
      "click_url": "https://yoursite.com/summer-sale",
      "priority": 10,
      "target_audience": ["all_users"],
      "display_start_date": "2024-06-01T00:00:00Z",
      "display_end_date": "2024-08-31T23:59:59Z",
      "created_at": "2024-05-15T10:30:00Z"
    }
  ]
}
```

## 🎨 Banner Types

### 1. Homepage Banners
- **Purpose**: Main promotional banners for the homepage
- **Usage**: General promotions, sales, announcements
- **Target**: All users or specific user groups

### 2. Promotional Banners
- **Purpose**: Special promotions and offers
- **Usage**: Limited-time offers, discounts, special deals
- **Target**: All users or specific segments

### 3. Seasonal Banners
- **Purpose**: Seasonal campaigns and events
- **Usage**: Holiday promotions, seasonal menus, special events
- **Target**: All users during specific seasons

### 4. Vendor Spotlight Banners
- **Purpose**: Highlighting specific vendors or restaurants
- **Usage**: New vendor announcements, featured restaurants
- **Target**: All users or location-specific

## 🎯 Target Audience Filtering

### Audience Types
- **all_users**: Show to all users
- **new_users**: Show only to new users (registered within 30 days)
- **existing_users**: Show only to existing users
- **vendors**: Show only to vendor accounts
- **couriers**: Show only to courier accounts
- **customers**: Show only to customer accounts

### Filtering Logic
```typescript
// Example filtering logic
const filteredBanners = bannerApi.filterBannersForUser(
  sortedBanners, 
  userProfile?.user_type,  // 'user', 'vendor', 'courier'
  isNewUser                // true if registered within 30 days
);
```

## ⏰ Date-based Activation

### Activation Rules
1. **Status Check**: Banner must be `active`
2. **Start Date**: Current time must be after `display_start_date`
3. **End Date**: Current time must be before `display_end_date` (if set)
4. **Priority**: Higher priority banners appear first

### Date Format
- **Format**: ISO 8601 (`2024-06-01T00:00:00Z`)
- **Timezone**: UTC
- **Flexibility**: End date can be `null` for indefinite display

## 🔄 Banner Rotation

### Auto-rotation
- **Interval**: 5 seconds between banner changes
- **Direction**: Forward (0 → 1 → 2 → 0)
- **Trigger**: Only when multiple banners are available

### Manual Navigation
- **Arrow Buttons**: Previous/Next navigation
- **Dot Indicators**: Direct navigation to specific banner
- **Click Handling**: Banner click opens `click_url` in new tab

## 🎨 Styling and Design

### Banner Container
```css
.weekend-banner.full-image-banner {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer; /* When click_url is available */
}
```

### Banner Content
- **Title**: Large, prominent heading
- **Description**: Supporting text below title
- **Button**: "View Details" button (when click_url exists)
- **Overlay**: Semi-transparent overlay for text readability

### Navigation Controls
- **Arrow Buttons**: Previous/Next navigation
- **Dot Indicators**: Show current position and allow direct navigation
- **Responsive**: Adapts to mobile and desktop layouts

## 🔧 Configuration

### Environment Variables
```bash
# API Base URL
REACT_APP_API_URL=http://localhost:8000
```

### Banner Settings
```typescript
// Default banner loading settings
const DEFAULT_BANNER_LIMIT = 5;
const BANNER_ROTATION_INTERVAL = 5000; // 5 seconds
const NEW_USER_THRESHOLD = 30 * 24 * 60 * 60 * 1000; // 30 days
```

## 🚀 Usage Examples

### Basic Banner Loading
```typescript
// Load homepage banners
const banners = await bannerApi.getHomepageBanners(5);

// Filter and sort banners
const activeBanners = bannerApi.filterActiveBanners(banners);
const sortedBanners = bannerApi.sortBannersByPriority(activeBanners);
```

### User-specific Filtering
```typescript
// Filter banners for specific user
const userType = 'vendor';
const isNewUser = false;
const filteredBanners = bannerApi.filterBannersForUser(
  sortedBanners, 
  userType, 
  isNewUser
);
```

### Banner Click Handling
```typescript
// Handle banner click
const handleBannerClick = (banner: Banner) => {
  if (banner.click_url) {
    window.open(banner.click_url, '_blank');
  }
};
```

## 🧪 Testing

### Manual Testing
1. **Banner Loading**: Verify banners load from API
2. **Auto-rotation**: Test 5-second rotation interval
3. **Manual Navigation**: Test arrow buttons and dots
4. **Click Handling**: Test banner click opens URL
5. **Filtering**: Test target audience filtering
6. **Date Filtering**: Test start/end date activation
7. **Priority Ordering**: Test priority-based sorting
8. **Error Handling**: Test with no banners available

### Test Scenarios
- **No Banners**: Verify graceful handling when no banners exist
- **Single Banner**: Test behavior with only one banner
- **Multiple Banners**: Test rotation and navigation
- **Inactive Banners**: Test filtering of inactive banners
- **Date Expired**: Test filtering of expired banners
- **User Filtering**: Test different user types and new user status

## 🔍 Monitoring

### Key Metrics
- **Banner Load Time**: Time to fetch and display banners
- **Click-through Rate**: Percentage of banner clicks
- **Rotation Engagement**: User interaction with navigation controls
- **Error Rate**: Failed banner loading attempts

### Logging
```typescript
// Banner loading logs
console.log('Loading banners from API...');
console.log(`Loaded ${banners.length} banners`);
console.log(`Filtered to ${filteredBanners.length} active banners`);
```

## 🚨 Error Handling

### Common Issues

**Banners Not Loading**:
- Check API endpoint accessibility
- Verify network connectivity
- Check browser console for errors

**Banners Not Rotating**:
- Verify multiple banners are loaded
- Check auto-rotation interval
- Verify banner state updates

**Click URLs Not Working**:
- Check `click_url` field in banner data
- Verify URL format and accessibility
- Check popup blocker settings

**Filtering Issues**:
- Verify user profile data
- Check target audience configuration
- Verify date format and timezone

### Debug Mode
Enable debug logging:
```typescript
const DEBUG_BANNERS = process.env.NODE_ENV === 'development';
if (DEBUG_BANNERS) {
  console.log('Banner data:', banners);
  console.log('Filtered banners:', filteredBanners);
}
```

## 🔄 Future Enhancements

### Planned Features
- **Banner Analytics**: Track banner performance and engagement
- **A/B Testing**: Test different banner variations
- **Dynamic Content**: Personalized banner content
- **Banner Scheduling**: Advanced scheduling and automation
- **Image Optimization**: Automatic image optimization and lazy loading

### Integration Opportunities
- **CMS Integration**: Content management system for banners
- **Analytics Integration**: Google Analytics and custom analytics
- **Personalization**: AI-powered banner recommendations
- **Multi-language**: Support for multiple languages
- **Rich Media**: Support for video and interactive banners

## 📞 Support

For issues or questions about the banner system:
1. Check the browser console for errors
2. Verify API endpoints are accessible
3. Test banner data format and structure
4. Check user profile and filtering logic

The Dynamic Banner System provides a flexible, user-friendly solution for managing promotional content across the Bestyy platform! 🎉
