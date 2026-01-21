# Weather Comfort Analytics Application

A full-stack weather analytics application that retrieves weather data, processes it using a custom **Comfort Index** algorithm, and presents meaningful insights with responsive UI and server-side caching.

## 🎯 Overview

This application analyzes real-time weather data from OpenWeatherMap API for 8 major cities worldwide and ranks them based on a custom comfort metric. The system features:

- ✅ Real-time weather data retrieval from OpenWeatherMap API
- ✅ Custom Comfort Index algorithm (0-100 scale)
- ✅ Server-side caching with 5-minute TTL
- ✅ Responsive design for desktop and mobile
- ✅ Interactive UI with sorting and filtering
- ✅ Debug endpoint for cache monitoring
- ✅ City rankings based on comfort scores

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenWeatherMap API key (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo>
cd weather-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=8560a50a1d99c4c36658440a2c124550
```

> **Note:** The API key is currently hardcoded as fallback. For production, use environment variables.

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🌡️ Comfort Index Algorithm

### Formula

```
Comfort Index (CI) = (0.4 × T_score) + (0.25 × H_score) + (0.2 × W_score) + (0.15 × V_score)
```

Where:
- **T_score** = Temperature comfort score
- **H_score** = Humidity comfort score  
- **W_score** = Wind speed comfort score
- **V_score** = Visibility comfort score

### Scoring Breakdown

#### Temperature Score (40% weight)
- **Optimal (100)**: 18-24°C
- **Acceptable (80-90)**: 16-27°C
- **Tolerable (10-80)**: 0-35°C
- **Extreme (<10)**: <0°C or >35°C

**Reasoning:** Human comfort is highly temperature-dependent. Research shows 18-24°C is the comfort zone for most people. We use a smooth curve that heavily penalizes extreme temperatures.

#### Humidity Score (25% weight)
- **Optimal (100)**: 40-60%
- **Acceptable (80-95)**: 30-70%
- **Tolerable (30-80)**: 20-80%

**Reasoning:** High humidity (>70%) increases perceived temperature and causes discomfort. Low humidity (<30%) causes dry skin and respiratory irritation. 40-60% is the ideal range.

#### Wind Speed Score (20% weight)
- **Optimal (100)**: 0-2 m/s
- **Acceptable (80-90)**: 2-5 m/s
- **Tolerable (40-80)**: 5-10 m/s
- **Bad (<40)**: >10 m/s

**Reasoning:** Calm weather is most comfortable. Wind causes cooling sensation and instability. Strong winds (>10 m/s) significantly impact comfort.

#### Visibility Score (15% weight)
- **Optimal (100)**: ≥10,000 m
- **Acceptable (80-95)**: 5,000-10,000 m
- **Tolerable (40-80)**: 1,000-5,000 m
- **Poor (<40)**: <1,000 m

**Reasoning:** Clear visibility indicates good weather conditions. Poor visibility (fog, heavy rain) is uncomfortable and unsafe. Lower weight than other factors as it's less directly felt.

### Why This Weighting?

1. **Temperature (40%)**: Most impactful on human comfort
2. **Humidity (25%)**: Second most important - affects perceived temperature
3. **Wind (20%)**: Significant physical discomfort factor
4. **Visibility (15%)**: Indirect indicator of weather severity

**Total: 100 points scale** for easy interpretation:
- 80-100: Excellent comfort
- 60-79: Good comfort
- 40-59: Fair comfort
- 20-39: Poor comfort
- 0-19: Very poor comfort

## 🏗️ Architecture

### Directory Structure

```
weather-app/
├── app/
│   ├── api/
│   │   ├── weather/
│   │   │   └── route.ts          # Weather data API endpoint
│   │   └── cache/
│   │       └── route.ts          # Cache status & management
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main dashboard
│   └── globals.css               # Global styles
├── components/
│   ├── Navbar.tsx                # Navigation bar
│   └── WeatherCard.tsx           # Weather card component
├── utils/
│   ├── comfortIndex.ts           # Comfort Index algorithm
│   ├── cache.ts                  # Caching utilities
│   ├── ui-helpers.ts             # UI helper functions
│   └── cn.ts                     # Class name utilities
├── cities.json                   # City data source
└── public/                       # Static assets
```

### Tech Stack

- **Frontend**: React 19.2, Next.js 16.1, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Caching**: node-cache (5-minute TTL)
- **API**: OpenWeatherMap API
- **Build Tools**: TypeScript, ESLint
- **Additional**: TanStack React Query (for potential future enhancements)

## 📊 Data Flow

```
cities.json 
    ↓
[GET /api/weather]
    ↓
Cache Check (HIT/MISS)
    ↓
[If MISS] OpenWeatherMap API Calls (parallel)
    ↓
Calculate Comfort Index (backend)
    ↓
Sort by Comfort Score (descending)
    ↓
Add Rankings
    ↓
Cache Results (5 min TTL)
    ↓
Return to Frontend [/api/weather]
    ↓
[Frontend] Render WeatherCard components
    ↓
Display Dashboard with sorting options
```

## 💾 Caching Strategy

### Implementation
- **Cache Library**: `node-cache` (in-memory cache)
- **TTL**: 300 seconds (5 minutes)
- **Cache Key**: `weather_data_all_cities`
- **Cached Data**: Complete processed response with timestamps

### Benefits
1. Reduces API calls to OpenWeatherMap (free tier: 60 calls/min)
2. Faster response times for users
3. Resilience during API rate limiting
4. Server-side processing results are cached

### Cache Endpoints
- **GET /api/cache** - View cache status
- **DELETE /api/cache** - Clear all cache

## 🎨 Features

### Dashboard
- **Real-time Data**: Fetches latest weather on page load
- **Sorting Options**:
  - By Comfort Score (default)
  - By Temperature
  - By City Name
- **Responsive Grid**: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- **Cache Indicator**: Shows if data is cached
- **Debug Panel**: Expandable section showing cache status

### Weather Card
- City name and weather description
- Temperature, humidity, wind speed, visibility
- Comfort Index score with color-coded background
- City rank (#1 most comfortable)
- Visual emoji indicator (😍😊😐😕😢)

### Comfort Score Display
- **Green (80-100)**: Excellent 😍
- **Lime (60-79)**: Good 😊
- **Yellow (40-59)**: Fair 😐
- **Orange (20-39)**: Poor 😕
- **Red (0-19)**: Very Poor 😢

## 📱 Responsive Design

The application is fully responsive:

- **Mobile** (< 768px): Single column layout, compact cards
- **Tablet** (768px - 1024px): Two column grid
- **Desktop** (> 1024px): Three column grid with optimized spacing

## 🔍 API Endpoints

### GET /api/weather
Fetches and returns weather data for all cities with comfort scores.

**Response:**
```json
{
  "data": [
    {
      "name": "Colombo",
      "temp": 33.0,
      "humidity": 73,
      "windSpeed": 2.57,
      "visibility": 10000,
      "description": "overcast clouds",
      "icon": "04n",
      "comfortIndex": 42,
      "rank": 1
    }
  ],
  "timestamp": 1705833600000,
  "cacheHit": true
}
```

### GET /api/cache
Returns cache statistics and keys.

**Response:**
```json
{
  "status": "Cache Status",
  "keys": ["weather_data_all_cities"],
  "stats": {
    "ksize": 1,
    "vsize": 1024,
    "msize": 1,
    "hits": 5,
    "misses": 1,
    "keys": 1
  }
}
```

### DELETE /api/cache
Clears all cached data.

## 📈 Trade-offs Considered

1. **In-Memory Cache vs. Database**
   - ✅ Chose: In-memory cache (node-cache)
   - Reason: Simpler, faster for 5-min TTL. Database overkill for non-persistent data.

2. **Parallel vs. Sequential API Calls**
   - ✅ Chose: Parallel requests using Promise.all()
   - Reason: 8 cities × parallel = ~1-2s vs. sequential = ~8-16s

3. **Client-side vs. Server-side Sorting**
   - ✅ Chose: Both (calculated on server, sorted on client for UX)
   - Reason: Server calculates Comfort Index, client allows instant sorting

4. **Frontend Framework**
   - ✅ Chose: Next.js with React 19
   - Reason: Built-in API routes, SSR capability, excellent DX

5. **Comfort Index Weights**
   - ✅ Chose: 40-25-20-15 distribution
   - Reason: Balances major comfort factors while keeping model interpretable

## ⚠️ Known Limitations

1. **Dew Point Not Available**: OpenWeatherMap free tier doesn't provide dew point; calculated from temp + humidity instead
2. **8 Cities Only**: Limited by reasonable API call frequency (free tier limits)
3. **No Historical Data**: Only current weather shown; no trends yet
4. **No Precipitation Data**: Rain/snow amount not included in comfort calculation
5. **In-Memory Cache**: Lost on server restart (acceptable for development)
6. **No User Preferences**: Comfort weights are fixed; no customization per user

## 🧪 Testing the Application

### Manual Testing Steps

1. **Load the Dashboard**
   ```bash
   npm run dev
   # Navigate to http://localhost:3000
   ```

2. **Check Cache Behavior**
   - First load → Cache MISS
   - Reload within 5 min → Cache HIT
   - Wait 5 min → Cache MISS (TTL expired)

3. **Test Sorting**
   - Click "Comfort Score" → Sorted by rank
   - Click "Temperature" → Sorted by temp
   - Click "City Name" → Alphabetical order

4. **Check Debug Endpoint**
   ```bash
   curl http://localhost:3000/api/cache
   ```

5. **Clear Cache**
   ```bash
   curl -X DELETE http://localhost:3000/api/cache
   ```

## 📚 Future Enhancements

- [ ] Multi-day forecast with comfort trends
- [ ] User favorites/bookmarks
- [ ] Dark mode toggle
- [ ] Unit tests for Comfort Index algorithm
- [ ] Redis cache for multi-server deployments
- [ ] Weather charts/graphs
- [ ] Custom comfort weight preferences per user
- [ ] Severe weather alerts
- [ ] Historical weather data analysis

## 🔐 Security Notes

- API key is exposed in client-side code (for demo purposes)
- For production, use server-side API proxying
- Implement rate limiting on API endpoints
- Add authentication for admin endpoints

## 📄 License

This project is part of the Fidenz Assignment (2026).

## 👥 Author

Created as part of the Fidenz Full Stack Assignment (Part 1).

---

**Last Updated**: January 21, 2026

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
