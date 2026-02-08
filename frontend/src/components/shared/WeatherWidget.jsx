import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Wind, Droplets, RefreshCw } from 'lucide-react';

const WeatherWidget = () => {
    const [weather, setWeather] = useState({
        location: 'ERODE',
        condition: 'SUNNY',
        temperature: 29,
        wind: 10,
        humidity: 39,
        lastRefreshed: new Date()
    });
    const [loading, setLoading] = useState(false);

    const refreshWeather = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setWeather(prev => ({
                ...prev,
                lastRefreshed: new Date()
            }));
            setLoading(false);
        }, 500);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toUpperCase();
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                        <Sun className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {weather.location}
                        </div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-0.5">
                            {weather.condition}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-4xl font-black text-slate-900 dark:text-white">
                        {weather.temperature}°C
                    </div>
                </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-slate-400" />
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Wind
                        </div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {weather.wind} km/h
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-slate-400" />
                    <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Humidity
                        </div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            {weather.humidity}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Last Refreshed */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    <RefreshCw className="w-3 h-3" />
                    Last refreshed: {formatTime(weather.lastRefreshed)}
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;
