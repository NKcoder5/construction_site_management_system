import axios from 'axios';
import db from './localDb';

/**
 * Weather Service for Construction Site Management
 * Fetches weather data and caches it for offline use
 */
class WeatherService {
    constructor() {
        this.cacheLocation = '';
        this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
    }

    /**
     * Get weather for a location
     * Uses cached data if available and recent, otherwise fetches fresh data
     */
    async getWeather(location = 'Mumbai') {
        try {
            // Ensure db is open
            if (!db.isOpen()) {
                await db.open();
            }
            // Check cache first
            const cached = await db.weather_cache.get(location);

            if (cached && this.isCacheValid(cached.timestamp)) {
                console.log('Using cached weather data');
                return cached;
            }

            // Fetch fresh data if online
            if (navigator.onLine) {
                const freshData = await this.fetchWeatherData(location);
                if (freshData) {
                    await this.cacheWeather(location, freshData);
                    return freshData;
                }
            }

            // Return cached data even if expired, better than nothing
            if (cached) {
                console.log('Using expired cache (offline mode)');
                return { ...cached, isExpired: true };
            }

            // No cache and offline
            return this.getOfflineFallback(location);
        } catch (error) {
            console.error('Weather service error:', error);

            // Try to return cache on error, but wrap in try-catch to avoid secondary failures
            try {
                // Check if db is open before attempting access
                if (db.isOpen()) {
                    const cached = await db.weather_cache.get(location);
                    if (cached) {
                        return { ...cached, isError: true };
                    }
                }
            } catch (innerError) {
                console.error('Failed to retrieve cache after weather error:', innerError);
            }

            return this.getOfflineFallback(location);
        }
    }

    /**
     * Check if cached data is still valid
     */
    isCacheValid(timestamp) {
        const now = new Date().getTime();
        const cacheTime = new Date(timestamp).getTime();
        return (now - cacheTime) < this.cacheTimeout;
    }

    /**
     * Fetch weather data from API (mock implementation)
     * In production, use a real weather API like OpenWeatherMap
     */
    async fetchWeatherData(location) {
        try {
            // For demonstration, we'll use a mock API endpoint
            // In production, replace with: https://api.openweathermap.org/data/2.5/weather

            // Mock response based on location
            const mockWeather = {
                location,
                temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
                condition: this.getRandomCondition(),
                humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
                windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
                forecast: this.getWorkForecast(),
                timestamp: new Date().toISOString()
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            return mockWeather;
        } catch (error) {
            console.error('Failed to fetch weather:', error);
            return null;
        }
    }

    /**
     * Cache weather data in IndexedDB
     */
    async cacheWeather(location, data) {
        try {
            await db.weather_cache.put({
                location,
                ...data
            });
            console.log('Weather data cached');
        } catch (error) {
            console.error('Failed to cache weather:', error);
        }
    }

    /**
     * Get offline fallback data
     */
    getOfflineFallback(location) {
        return {
            location,
            temperature: null,
            condition: 'Unknown',
            humidity: null,
            windSpeed: null,
            forecast: 'Weather data unavailable. Check connection.',
            timestamp: new Date().toISOString(),
            isOffline: true
        };
    }

    /**
     * Get random weather condition (for mock data)
     */
    getRandomCondition() {
        const conditions = [
            'Clear Sky',
            'Partly Cloudy',
            'Cloudy',
            'Light Rain',
            'Heavy Rain',
            'Sunny',
            'Foggy'
        ];
        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    /**
     * Get work forecast based on conditions
     */
    getWorkForecast() {
        const forecasts = [
            'Excellent conditions for outdoor work',
            'Good conditions, monitor afternoon heat',
            'Fair conditions, ensure worker hydration',
            'Caution: High heat, schedule breaks',
            'Moderate conditions, proceed as planned',
            'Rain expected, plan indoor tasks',
            'Ideal weather for construction activities'
        ];
        return forecasts[Math.floor(Math.random() * forecasts.length)];
    }

    /**
     * Get work recommendations based on weather
     */
    getWorkRecommendations(weatherData) {
        const { temperature, condition, windSpeed } = weatherData;
        const recommendations = [];

        if (temperature > 35) {
            recommendations.push('⚠️ High temperature! Schedule frequent breaks and ensure adequate water supply');
        } else if (temperature < 15) {
            recommendations.push('❄️ Cold weather. Ensure workers have appropriate clothing');
        }

        if (condition.toLowerCase().includes('rain')) {
            recommendations.push('🌧️ Rain expected. Prioritize indoor work and secure materials');
        }

        if (windSpeed > 20) {
            recommendations.push('💨 High winds. Avoid working at heights, secure loose materials');
        }

        if (condition === 'Clear Sky' && temperature >= 20 && temperature <= 30) {
            recommendations.push('✅ Ideal conditions! Perfect for all construction activities');
        }

        if (recommendations.length === 0) {
            recommendations.push('✅ Standard conditions. Proceed with regular work schedule');
        }

        return recommendations;
    }

    /**
     * Clear old cache entries (older than 24 hours)
     */
    async clearOldCache() {
        try {
            const allCache = await db.weather_cache.toArray();
            const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000);

            for (const cache of allCache) {
                const cacheTime = new Date(cache.timestamp).getTime();
                if (cacheTime < oneDayAgo) {
                    await db.weather_cache.delete(cache.location);
                }
            }
        } catch (error) {
            console.error('Failed to clear old cache:', error);
        }
    }
}

// Export singleton instance
export const weatherService = new WeatherService();
export default weatherService;
