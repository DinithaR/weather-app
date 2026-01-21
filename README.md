# Weather Comfort Analytics Application

## Overview

The Weather Comfort Analytics Application is a full-stack web application designed to provide users with real-time weather data and insights. Utilizing a custom Comfort Index algorithm, this application processes weather information to deliver meaningful analytics, helping users make informed decisions based on current weather conditions.

## Features
- **Real-time Weather Data**: Fetches and displays up-to-date weather information from the OpenWeatherMap API.
- **Comfort Index Calculation**: Implements a unique algorithm to compute a Comfort Index on a scale of 0 to 100, providing a quick reference for weather comfort levels.
- **User Authentication**: Ensures secure access to the application through user authentication mechanisms.
- **Server-side Caching**: Utilizes caching strategies to enhance performance, with a 5-minute time-to-live (TTL) for cached data.
- **Responsive Design**: Built with a mobile-first approach, ensuring usability across various devices.

## Installation
To set up the project locally, follow these steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
Once the application is running, navigate to `http://localhost:3000` in your web browser. You can search for weather data by entering city codes from the provided list.

## Technologies Used
- **Frontend**: React, TypeScript, Next.js
- **Backend**: Node.js, Express
- **Database**: In-memory caching
- **APIs**: OpenWeatherMap API

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*For more information, please refer to the project documentation.*
