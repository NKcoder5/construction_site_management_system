import React, { useState, useEffect } from 'react';
import { Sun, Wind, Droplets, Cloud, CloudRain, CloudLightning, HelpCircle } from 'lucide-react';
import weatherService from '../../utils/weatherService';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            const data = await weatherService.getWeather('Mumbai');
            setWeather(data);
            setLoading(false);
        };
        fetchWeather();
    }, []);

    const getWeatherIcon = (condition) => {
        const cond = condition?.toLowerCase() || '';
        if (cond.includes('clear') || cond.includes('sunny')) return <Sun className="w-10 h-10 text-yellow-300 animate-spin-slow" />;
        if (cond.includes('rain')) return <CloudRain className="w-10 h-10 text-blue-200" />;
        if (cond.includes('storm')) return <CloudLightning className="w-10 h-10 text-yellow-500" />;
        if (cond.includes('cloud')) return <Cloud className="w-10 h-10 text-slate-100" />;
        return <HelpCircle className="w-10 h-10 text-slate-400" />;
    };

    if (loading) return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2.5rem] p-8 h-48 animate-pulse flex items-center justify-center">
            <p className="text-white/50 font-black uppercase text-[10px] tracking-[0.3em]">Synching Sat...</p>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
            {/* Gloss Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-[70px] opacity-20 -mr-10 -mt-10"></div>

            <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <h3 className="font-black uppercase italic tracking-[0.2em] text-blue-100/60 text-[10px]">Live Site Data</h3>
                    </div>
                    <p className="font-black text-white text-3xl uppercase italic tracking-tighter">
                        {weather.location || 'Mumbai'}
                        <span className="block text-[10px] font-bold not-italic opacity-60 tracking-widest mt-0.5">{weather.condition || 'Clear'}</span>
                    </p>
                </div>
                {getWeatherIcon(weather.condition)}
            </div>

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-end gap-1">
                    <span className="text-6xl font-black tracking-tighter leading-none">{weather.temperature || '32'}°</span>
                    <span className="text-2xl font-black mb-1 opacity-40">C</span>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/5 shadow-sm">
                        <Wind className="w-4 h-4 text-blue-100/70" />
                        <span className="text-xs font-black tracking-tighter">{weather.windSpeed || '12'} km/h</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/5 shadow-sm">
                        <Droplets className="w-4 h-4 text-blue-100/70" />
                        <span className="text-xs font-black tracking-tighter">{weather.humidity || '45'}%</span>
                    </div>
                </div>
            </div>

            {/* Bottom Refresh indicator */}
            <div className="mt-8 pt-4 border-t border-white/10 relative z-10 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-300/40"></div>
                <p className="text-[8px] font-bold uppercase tracking-[0.4em] opacity-40">Last Refreshed: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
        </div>
    );
};

export default WeatherWidget;
