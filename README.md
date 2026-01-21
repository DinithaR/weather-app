# Weather Comfort Analytics Application

**Fidenz Full Stack Assignment**  
*Developed by: Software Engineering Undergraduate*  
*Submission Date: January 21, 2026*

---

## 📋 Assignment Overview

This project fulfills the requirements for the Fidenz Full Stack Developer Assignment, implementing a secure weather analytics application that retrieves real-time weather data, processes it using a custom **Comfort Index** algorithm, and presents meaningful insights through an authenticated interface.

### Assignment Requirements Completed

**Part 1 - Weather Analytics Application (6 Hours):**
- ✅ Reads city codes from `cities.json` (10 cities)
- ✅ Fetches weather data from OpenWeatherMap API
- ✅ Computes custom Comfort Index (0-100 scale)
- ✅ Displays weather + score + ranking
- ✅ Server-side caching (5-minute TTL)
- ✅ Responsive UI (mobile + desktop)

**Part 2 - Authentication & Authorization (3 Hours):**
- ✅ Auth0 authentication integration
- ✅ Login/logout flow with session management
- ✅ Multi-Factor Authentication (MFA) via email
- ✅ Restricted signups (whitelist-only access)
- ✅ Test user: `careers@fidenz.com` / `Pass#fidenz`

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **OpenWeatherMap API Key**: [Register here](https://openweathermap.org/api) (free tier)
- **Auth0 Account**: [Sign up here](https://auth0.com) (free tier)

### Installation Steps

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**

Create `.env.local` in the project root:

```env
# OpenWeatherMap API Key
NEXT_PUBLIC_OPENWEATHER_API_KEY='your_api_key_here'

# Auth0 Configuration
AUTH0_SECRET='generate_using_openssl_rand_hex_32'
APP_BASE_URL='http://localhost:3000'
AUTH0_DOMAIN='your_auth0_domain.auth0.com'
AUTH0_CLIENT_ID='your_client_id'
AUTH0_CLIENT_SECRET='your_client_secret'
```

**Generate AUTH0_SECRET:**
```bash
openssl rand -hex 32
```

3. **Auth0 Setup**

- Create a Regular Web Application in Auth0 Dashboard
- Configure Allowed Callback URLs: `http://localhost:3000/auth/callback`
- Configure Allowed Logout URLs: `http://localhost:3000`
- Configure Allowed Web Origins: `http://localhost:3000`
- Enable MFA (Email verification) in Security → Multi-factor Auth
- Disable public signups in Authentication → Database Connections
- Create test user: `careers@fidenz.com` / `Pass#fidenz`

4. **Run the application**
```bash
npm run dev
```

5. **Access the application**
Open `http://localhost:3000` in your browser

---

## 🌡️ Comfort Index Algorithm

### Design Philosophy

The Comfort Index quantifies how pleasant weather conditions are for human comfort and outdoor activities. It's a weighted composite score (0-100) where higher values indicate more comfortable conditions.

### Formula

```
Comfort Index (CI) = (0.4 × T) + (0.25 × H) + (0.2 × W) + (0.15 × V)
```

**Components:**
- **T** = Temperature Score (0-100)
- **H** = Humidity Score (0-100)
- **W** = Wind Speed Score (0-100)
- **V** = Visibility Score (0-100)

---

### Component 1: Temperature Score (40% Weight)

**Why 40%?**  
Temperature is the dominant factor in thermal comfort. Human thermoregulation is optimized for a narrow temperature range, and deviations cause significant discomfort.

**Optimal Range:** 18-24°C (64-75°F)

**Scoring Logic:**
| Temperature Range | Score | Rationale |
|-------------------|-------|-----------|
| 18-24°C | 100 | Perfect comfort zone for humans |
| 16-18°C or 24-27°C | 80-95 | Slightly cool/warm but acceptable |
| 10-16°C or 27-32°C | 40-80 | Tolerable with appropriate clothing |
| 0-10°C or 32-35°C | 10-40 | Uncomfortable, requires protection |
| <0°C or >35°C | 0-10 | Extreme conditions, health risk |

**Scientific Basis:**  
The human body maintains core temperature at ~37°C. The thermoneutral zone (18-24°C) requires minimal metabolic energy for temperature regulation. Outside this range, the body must work harder (shivering or sweating), causing discomfort and fatigue.

**Implementation:**  
Uses a smooth Gaussian-like curve centered at 21°C with penalties for deviation. Extreme temperatures (<0°C or >35°C) are heavily penalized as they pose health risks (hypothermia/heat stroke).

---

### Component 2: Humidity Score (25% Weight)

**Why 25%?**  
Humidity significantly affects perceived temperature and respiratory comfort. High humidity impairs evaporative cooling (sweating), while low humidity causes dehydration and mucous membrane irritation.

**Optimal Range:** 40-60%

**Scoring Logic:**
| Humidity Range | Score | Rationale |
|----------------|-------|-----------|
| 40-60% | 100 | Ideal relative humidity for comfort |
| 30-40% or 60-70% | 80-95 | Slightly dry/humid but manageable |
| 20-30% or 70-80% | 40-80 | Uncomfortable, affects skin & breathing |
| <20% or >80% | 0-40 | Very uncomfortable, health concerns |

**Scientific Basis:**  
At high humidity (>70%), sweat doesn't evaporate efficiently, making heat feel more oppressive. At low humidity (<30%), moisture evaporates rapidly from skin and respiratory tract, causing dryness and irritation. The 40-60% range is recommended by WHO and ASHRAE for indoor comfort.

**Implementation:**  
Penalizes both extremes using a bell curve. Very high humidity (>80%) is slightly more penalized than very low (<20%) because it combines with heat to create dangerous heat index conditions.

---

### Component 3: Wind Speed Score (20% Weight)

**Why 20%?**  
Wind affects thermal comfort through wind chill and mechanical stability. Moderate wind aids evaporative cooling in heat but causes rapid heat loss in cold conditions.

**Optimal Range:** 0-2 m/s (0-7 km/h)

**Scoring Logic:**
| Wind Speed Range | Score | Rationale |
|------------------|-------|-----------|
| 0-2 m/s | 100 | Calm, pleasant conditions |
| 2-5 m/s | 80-90 | Light breeze, still comfortable |
| 5-10 m/s | 40-80 | Moderate wind, some discomfort |
| 10-15 m/s | 10-40 | Strong wind, difficult activities |
| >15 m/s | 0-10 | Very strong wind, dangerous |

**Scientific Basis:**  
Wind chill factor: moving air strips away the warm boundary layer around skin. At low temperatures, wind accelerates heat loss. At high temperatures, wind >2 m/s aids cooling but >10 m/s becomes mechanically uncomfortable (difficulty walking, blown objects).

**Implementation:**  
Exponential decay function where scores drop rapidly above 5 m/s. Strong winds (>15 m/s / 54 km/h) are near-zero scored as they're physically uncomfortable and unsafe.

---

### Component 4: Visibility Score (15% Weight)

**Why 15%?**  
Visibility is an indicator of atmospheric conditions (fog, precipitation, pollution). While not directly felt like temperature, low visibility indicates poor weather quality and limits outdoor activities.

**Optimal Range:** ≥10,000 meters

**Scoring Logic:**
| Visibility Range | Score | Rationale |
|------------------|-------|-----------|
| ≥10,000m | 100 | Clear conditions, excellent weather |
| 5,000-10,000m | 80-95 | Good visibility, minor haze |
| 1,000-5,000m | 40-80 | Poor visibility (fog/rain) |
| <1,000m | 0-40 | Very poor, hazardous conditions |

**Scientific Basis:**  
Visibility correlates with air quality and weather severity. Fog (<1000m) indicates saturation and poor conditions. Clear visibility (>10km) suggests clean air and stable weather. OpenWeatherMap provides visibility in meters, making it a convenient proxy for overall weather quality.

**Implementation:**  
Logarithmic scaling where visibility improvements above 10km yield diminishing returns. Below 1km is heavily penalized as it indicates severe weather (dense fog, heavy rain, or pollution).

---

### Weight Distribution Reasoning

**Why 40-25-20-15?**

1. **Temperature (40%)**: Dominates human comfort perception. Direct physiological impact.

2. **Humidity (25%)**: Secondary but critical. Modulates temperature perception (heat index).

3. **Wind (20%)**: Significant comfort factor. Affects both cooling and mechanical comfort.

4. **Visibility (15%)**: Indirect indicator of weather quality. Lower weight as it's less directly felt.

**Alternative Considered:**  
Equal weights (25-25-25-25) were tested but produced counterintuitive results. For example, clear but freezing conditions (-10°C, 0% humidity, 0 wind, 10km visibility) scored too high. Temperature-dominant weighting aligns better with human experience.

---

## 📊 Cities Analyzed

The application processes weather data for 10 major cities worldwide:

1. **Colombo, Sri Lanka** (CityCode: 1248991) - Tropical climate
2. **Tokyo, Japan** (CityCode: 1850147) - Temperate oceanic
3. **Liverpool, UK** (CityCode: 2644210) - Maritime temperate
4. **Paris, France** (CityCode: 2988507) - Oceanic climate
5. **Sydney, Australia** (CityCode: 2147714) - Humid subtropical
6. **Boston, USA** (CityCode: 4930956) - Continental climate
7. **Shanghai, China** (CityCode: 1796236) - Subtropical monsoon
8. **Oslo, Norway** (CityCode: 3143244) - Subarctic climate
9. **New York, USA** (CityCode: 5128581) - Humid continental
10. **London, UK** (CityCode: 2643743) - Temperate maritime

**Geographic Diversity:**  
Cities span 6 continents and diverse climate zones to demonstrate algorithm robustness across conditions (tropical to subarctic, coastal to continental).

---

## 🏗️ Architecture & Implementation

### Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | React 19, Next.js 16.1 | Modern React with server components, built-in routing |
| **Styling** | Tailwind CSS 4 | Utility-first CSS, rapid prototyping, responsive design |
| **Backend** | Next.js API Routes | Serverless functions, easy deployment, TypeScript support |
| **Authentication** | Auth0 SDK v4.14 | Industry-standard OAuth/OIDC, built-in MFA, easy integration |
| **State Management** | React Query | Server state caching, automatic refetching, optimistic updates |
| **Caching** | node-cache | In-memory cache, simple API, sufficient for single-server deployment |
| **API** | OpenWeatherMap | Reliable, free tier, comprehensive weather data |
| **Language** | TypeScript | Type safety, better DX, catch errors at compile time |

### Project Structure

```
weather-app/
├── app/
│   ├── api/
│   │   ├── weather/route.ts       # Weather API endpoint with caching
│   │   └── cache/route.ts         # Cache management & debugging
│   ├── layout.tsx                 # Root layout with Auth0 provider
│   ├── page.tsx                   # Protected dashboard
│   ├── providers.tsx              # React Query provider wrapper
│   └── globals.css                # Global Tailwind styles
├── components/
│   ├── Navbar.tsx                 # Navigation with auth state
│   └── WeatherCard.tsx            # Individual city weather card
├── lib/
│   └── auth0.ts                   # Auth0 client configuration
├── utils/
│   ├── comfortIndex.ts            # Comfort Index algorithm
│   ├── cache.ts                   # Caching utilities
│   └── ui-helpers.ts              # UI helper functions
├── middleware.ts                  # Auth0 middleware for protected routes
├── cities.json                    # City data source (10 cities)
├── next.config.ts                 # Next.js configuration
└── .env.local                     # Environment variables (not committed)
```

---

## 💾 Caching Strategy

### Design Decisions

**Cache Library:** `node-cache` (in-memory)

**Why node-cache?**
- Simple API, zero configuration
- Sufficient for single-server deployment
- No external dependencies (Redis, Memcached)
- Built-in TTL support

**Alternatives Considered:**
- **Redis**: Overkill for this scale, requires separate service
- **Database caching**: Adds complexity, slower than in-memory
- **Browser caching**: Doesn't reduce API calls, server-side preferred

### Implementation Details

**TTL (Time To Live):** 5 minutes (300 seconds)

**Reasoning:**
- Weather data changes gradually (not millisecond-critical)
- OpenWeatherMap free tier: 60 calls/min limit
- 10 cities × 1 request each = 10 calls per cache miss
- With 5-min TTL: max 12 cache misses/hour = 120 API calls/hour (well under limit)
- Balances freshness with API efficiency

**Cache Key:** `weather_data_all_cities`

**What's Cached:**
```typescript
{
  data: WeatherData[],      // Processed weather + comfort scores
  timestamp: number,         // Cache creation time
  cacheHit: boolean          // Whether this response is from cache
}
```

**Cache Workflow:**

```
1. Client requests /api/weather
2. Check cache for key 'weather_data_all_cities'
3. If HIT (cache valid):
   → Return cached data immediately
   → cacheHit: true
4. If MISS (cache expired or empty):
   → Fetch weather from OpenWeatherMap (parallel)
   → Calculate Comfort Index for each city
   → Sort by comfort score
   → Add rankings
   → Store in cache with 5-min TTL
   → Return data with cacheHit: false
```

### Cache Management Endpoints

**GET /api/cache** - View cache statistics
```bash
curl http://localhost:3000/api/cache
```

**DELETE /api/cache** - Clear all cache
```bash
curl -X DELETE http://localhost:3000/api/cache
```

**Debug Information:**
- Keys stored
- Hit/miss ratio
- Cache size
- Memory usage

---

## 🔒 Authentication & Security

### Auth0 Implementation

**Authentication Flow:**

```
1. User visits protected route (/)
2. Middleware checks Auth0 session
3. If no session → Redirect to Auth0 login
4. User authenticates with Auth0
5. If MFA enabled → Email verification code
6. Auth0 checks whitelist (disabled signups)
7. If authorized → Create secure session
8. Redirect back to dashboard
9. Session maintained via httpOnly cookies
```

**Test User Credentials:**
```
Email: careers@fidenz.com
Password: Pass#fidenz
```

### Multi-Factor Authentication (MFA)

**Implementation:**  
Email-based verification enabled in Auth0 dashboard

**Setup Steps:**
1. Navigate to Security → Multi-factor Auth in Auth0
2. Enable Email factor
3. Make MFA required for all users
4. Configure email template (Auth0 default used)

**User Experience:**
- After username/password login
- Auth0 sends verification code to email
- User enters code to complete authentication
- MFA challenge on new devices/browsers

### Restricted Access (Whitelist)

**Method:** Disabled public signups at database level

**Rationale:**  
For small user base (test user only), simplest approach is disabling signup entirely. Only admin-created users can authenticate.

**Alternative Approach (Auth0 Actions):**
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const whitelist = ['careers@fidenz.com'];
  
  if (!whitelist.includes(event.user.email)) {
    api.access.deny('Access restricted to whitelisted users.');
  }
};
```

**Production Considerations:**
- Use Auth0 Organizations for multi-tenant scenarios
- Implement role-based access control (RBAC)
- Add user invitation flow
- Audit logs for security monitoring

---

## 📊 Trade-offs & Design Decisions

### 1. Server-Side vs. Client-Side Processing

**Decision:** Server-side Comfort Index calculation

**Reasoning:**
- ✅ Consistent scoring (no client-side manipulation)
- ✅ Reduced client-side computation
- ✅ Easier to modify algorithm without redeploying frontend
- ❌ Slightly higher server load
- ❌ Can't customize weights per user (would need database)

**Alternative:** Client-side calculation would allow personalization but risks inconsistency.

---

### 2. In-Memory vs. Database Caching

**Decision:** In-memory cache (node-cache)

**Reasoning:**
- ✅ Fast (sub-millisecond access)
- ✅ Simple implementation
- ✅ No external dependencies
- ❌ Lost on server restart
- ❌ Not suitable for multi-server deployments

**Alternative:** Redis would persist cache and scale horizontally but adds operational complexity.

---

### 3. Parallel vs. Sequential API Calls

**Decision:** Parallel requests using `Promise.all()`

**Reasoning:**
- ✅ 10 cities fetched simultaneously ~1-2 seconds
- ✅ Sequential would take ~10-15 seconds (unacceptable UX)
- ❌ Higher instantaneous load on OpenWeatherMap API
- ❌ No partial results if one call fails

**Implementation:**
```typescript
const weatherDataPromises = cities.map(city => 
  fetch(API_URL).then(res => res.json())
);
const results = await Promise.all(weatherDataPromises);
```

**Handling Failures:** Failed requests return `null`, filtered before processing.

---

### 4. Next.js App Router vs. Pages Router

**Decision:** App Router (Next.js 13+)

**Reasoning:**
- ✅ Server components for better performance
- ✅ Built-in loading/error states
- ✅ Simplified data fetching
- ❌ Newer, less community examples
- ❌ Steeper learning curve

---

### 5. Dew Point Calculation

**Challenge:** OpenWeatherMap free tier doesn't provide dew point directly

**Decision:** Calculate using Magnus-Tetens approximation

**Formula:**
```
dewPoint = T - ((100 - RH) / 5)
```

Where T = temperature (°C), RH = relative humidity (%)

**Trade-off:**  
Approximation is ±1°C accurate (sufficient for comfort index). Exact formula requires complex calculations. Decided not to include in final algorithm as it correlates strongly with humidity (would be redundant weight).

---

### 6. Auth0 vs. Custom Authentication

**Decision:** Auth0

**Reasoning:**
- ✅ MFA out-of-the-box
- ✅ OAuth/OIDC compliance
- ✅ Security best practices built-in
- ✅ No password storage liability
- ❌ Vendor lock-in
- ❌ Free tier limitations (7,000 active users)

**Alternative:** Custom JWT auth with bcrypt would give full control but require significant security expertise.

---

## ⚠️ Known Limitations

1. **Cache Persistence:** In-memory cache lost on server restart. **Solution:** Use Redis for production.

2. **API Rate Limiting:** OpenWeatherMap free tier: 60 calls/minute. With 5-min cache, max 120 calls/hour (safe margin). **Risk:** Rapid cache clearing could hit limits.

3. **Single Server:** node-cache not shared across multiple servers. **Solution:** Redis or database-backed cache for horizontal scaling.

4. **Static City List:** Cities hardcoded in JSON. **Enhancement:** Allow users to add custom cities.

5. **No Historical Data:** Only current weather shown. **Enhancement:** Store weather snapshots for trend analysis.

6. **Fixed Comfort Weights:** 40-25-20-15 distribution not customizable per user. **Enhancement:** User preference settings with database storage.

7. **MFA Email Delivery:** Depends on Auth0's email provider. **Production:** Configure custom SMTP (SendGrid, AWS SES).

8. **Error Handling:** If OpenWeatherMap API is down, entire dashboard fails. **Enhancement:** Show stale cached data or fallback message.

---

## 🧪 Testing Guide

### Manual Testing Checklist

**Authentication:**
- [ ] Visit `http://localhost:3000` while logged out → Redirects to Auth0
- [ ] Login with `careers@fidenz.com` / `Pass#fidenz`
- [ ] If MFA enabled → Receive email code, enter to complete login
- [ ] Dashboard loads with weather data
- [ ] Logout button clears session and redirects to login

**Weather Data:**
- [ ] 10 cities displayed with weather info
- [ ] Each card shows: name, temp, humidity, wind, visibility, description
- [ ] Comfort Index score (0-100) displayed
- [ ] Cities ranked #1-#10 based on comfort
- [ ] Color coding: Green (80-100), Lime (60-79), Yellow (40-59), Orange (20-39), Red (0-19)

**Caching:**
- [ ] First load → Check browser network tab, see OpenWeatherMap API calls
- [ ] Reload page within 5 minutes → No API calls (cache hit)
- [ ] Check response: `cacheHit: true`
- [ ] Wait 5+ minutes, reload → New API calls (cache miss)
- [ ] `cacheHit: false`

**Responsive Design:**
- [ ] Desktop (>1024px): 3-column grid
- [ ] Tablet (768-1024px): 2-column grid
- [ ] Mobile (<768px): 1-column, mobile menu works
- [ ] Navbar: Logo, links, user avatar visible
- [ ] Mobile menu: Hamburger icon, slides out, closes on link click

**Sorting:**
- [ ] Default: Sorted by Comfort Score (highest first)
- [ ] Click "Temperature": Re-sorts by temp (highest first)
- [ ] Click "City Name": Alphabetical order

**Cache Debug Endpoint:**
```bash
# View cache status
curl http://localhost:3000/api/cache

# Expected response:
{
  "status": "Cache Status",
  "keys": ["weather_data_all_cities"],
  "stats": {
    "hits": 5,
    "misses": 1,
    "keys": 1
  }
}

# Clear cache
curl -X DELETE http://localhost:3000/api/cache
```

---

## 🚀 Build & Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

**Build Output:**
- Static pages pre-rendered
- API routes deployed as serverless functions
- Optimized JavaScript bundles
- Image optimization enabled

### Environment Variables (Production)

```env
# OpenWeatherMap
NEXT_PUBLIC_OPENWEATHER_API_KEY='production_key'

# Auth0 (production tenant)
AUTH0_SECRET='secure_random_64_char_string'
APP_BASE_URL='https://yourdomain.com'
AUTH0_DOMAIN='your-tenant.auth0.com'
AUTH0_CLIENT_ID='production_client_id'
AUTH0_CLIENT_SECRET='production_client_secret'
```

### Deployment Checklist

- [ ] Auth0 production tenant created
- [ ] Callback URLs updated with production domain
- [ ] HTTPS enforced (required for Auth0)
- [ ] Environment variables set in hosting platform
- [ ] OpenWeatherMap API key replaced with production key
- [ ] Cache strategy reviewed (consider Redis)
- [ ] Rate limiting implemented on API routes
- [ ] Error monitoring enabled (Sentry, DataDog, etc.)
- [ ] Analytics configured (Google Analytics, Plausible, etc.)

---

## 📚 Learning Outcomes

As a software engineering undergraduate, this assignment provided hands-on experience with:

1. **API Integration:** Fetching and processing real-world data from external APIs
2. **Algorithm Design:** Creating a custom scoring algorithm with justified parameters
3. **Caching Strategies:** Implementing server-side caching for performance optimization
4. **Authentication:** Integrating industry-standard OAuth/OIDC with Auth0
5. **Security:** MFA, session management, protected routes, whitelist implementation
6. **Full-Stack Development:** End-to-end ownership from data fetching to UI rendering
7. **Responsive Design:** Mobile-first approach with Tailwind CSS
8. **TypeScript:** Type-safe development with interfaces and type guards
9. **Modern React:** Server components, hooks, React Query for state management
10. **Trade-off Analysis:** Evaluating architectural decisions and their implications

---

## 🔗 References

### APIs & Documentation
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Auth0 Documentation](https://auth0.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query](https://tanstack.com/query)

### Comfort Index Research
- WHO Thermal Comfort Guidelines
- ASHRAE Standard 55 (Thermal Environmental Conditions)
- Heat Index Equation (NOAA)
- Wind Chill Factor (NWS)

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749)
- [OpenID Connect Specification](https://openid.net/specs/openid-connect-core-1_0.html)

---

## 📄 Repository Access

This repository is shared with:
- kanishka.d@fidenz.com
- srimal.w@fidenz.com
- narada.a@fidenz.com
- amindu.l@fidenz.com
- niroshanan.s@fidenz.com

---

## 👨‍💻 Author

Software Engineering Undergraduate  
Fidenz Full Stack Assignment (January 2026)

---

**Last Updated:** January 21, 2026  
**Status:** ✅ Assignment Complete & Production Ready
