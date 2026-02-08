import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Calculator from '../reports/Calculator';
import { X } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const [isCalcOpen, setIsCalcOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const handleOpenCalc = () => setIsCalcOpen(true);
        window.addEventListener('open-calculator', handleOpenCalc);
        return () => window.removeEventListener('open-calculator', handleOpenCalc);
    }, []);

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] transition-colors duration-300 selection:bg-orange-500/30">
            <Sidebar />
            <main className="flex-1 ml-80 p-0 overflow-x-hidden w-full relative">
                <div className="min-h-screen">
                    {children}
                </div>

                {/* Calculator Overlay */}
                {isCalcOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="relative animate-in zoom-in-95 duration-300">
                            <button
                                onClick={() => setIsCalcOpen(false)}
                                className="absolute -top-12 right-0 p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500 hover:text-orange-600 transition-colors shadow-xl"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <Calculator />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Layout;
